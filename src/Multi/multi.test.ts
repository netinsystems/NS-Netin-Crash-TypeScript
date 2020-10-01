// @ts-nocheck
/**
 * Copyright 2020 Netin Systems S.L. All rights reserved.
 * Note: All information contained herein is, and remains the property of Netin Systems S.L. and its
 * suppliers, if any. The intellectual and technical concepts contained herein are property of
 * Netin Systems S.L. and its suppliers and may be covered by European and Foreign patents, patents
 * in process, and are protected by trade secret or copyright.
 *
 * Dissemination of this information or the reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Netin Systems S.L.
 */
import 'mocha';
import { expect } from 'chai';
import { v4 as uuidV4 } from 'uuid';
import { Crash } from '../Crash/CrashError';
import { Multi } from './MultiError';
const uuidTest = uuidV4();
const causes: Array<Crash | Error> = [];
for (let i = 0; i < 5; i++) {
  causes.push(new Crash('Crash Error', uuidTest, { name: 'ValidationError' }));
}
describe('In #Multi class the ', () => {
  before(done => {
    done();
  });
  after(done => {
    done();
  });
  describe('constructor ', () => {
    before(done => {
      done();
    });
    after(done => {
      done();
    });
    it('should create an instance with (message) parameter such that: name=Multi, cause=undefined, info=undefined, message=Example', () => {
      const errorTest = new Multi('Example', uuidTest);
      expect(errorTest.name).to.be.equal('MultiError');
      expect(errorTest.message).to.be.equal('Example');
      expect(errorTest.causes).to.be.an('undefined');
      expect(errorTest.info).to.be.an('undefined');
    });
    it('should create an instance with (message, name) parameter such that: name=ERROR_TYPE, cause=undefined, info=undefined, message=Example', () => {
      const errorTest = new Multi('Example', uuidTest, {
        name: 'ERROR_TYPE',
      });
      expect(errorTest.name).to.be.equal('ERROR_TYPE');
      expect(errorTest.message).to.be.equal('Example');
      expect(errorTest.causes).to.be.an('undefined');
      expect(errorTest.info).to.be.an('undefined');
    });
    it('should create an instance with (message, name, info) parameter such that: name=ERROR_TYPE, cause=undefined, info=objectTest, message=Example', () => {
      const objectTest = {
        par: 'info1',
        par: 'info2',
      };
      const errorTest = new Multi('Example', uuidTest, {
        name: 'ERROR_TYPE',
        info: objectTest,
      });
      expect(errorTest.name).to.be.equal('ERROR_TYPE');
      expect(errorTest.message).to.be.equal('Example');
      expect(errorTest.causes).to.be.an('undefined');
      expect(errorTest.info).to.be.deep.equal(objectTest);
    });
    it('should create an instance with (message, name, error) parameter such that: name=ERROR_TYPE, cause=Cause, info=undefined, message=Example', () => {
      const cause = new Error('Cause');
      const errorTest = new Multi('Example', uuidTest, {
        name: 'ERROR_TYPE',
        causes: cause,
      });
      expect(errorTest.name).to.be.equal('ERROR_TYPE');
      expect(errorTest.message).to.be.equal('Example');
      expect(errorTest.causes?.length).to.be.equal(1);
      expect(errorTest.info).to.be.an('undefined');
    });
    it('should create an instance with (message, name, causes) parameter such that: name=ERROR_TYPE, cause=cause[0], causes= causes, info=undefined, message=Example', () => {
      const errorTest = new Multi('Example', uuidTest, {
        name: 'ERROR_TYPE',
        causes,
      });
      expect(errorTest.name).to.be.equal('ERROR_TYPE');
      expect(errorTest.message).to.be.equal('Example');
      expect(errorTest.causes?.length).to.be.equal(5);
      expect(errorTest.causes[0]).to.be.equal(causes[0]);
      expect(errorTest.info).to.be.an('undefined');
    });
    it('should create an instance with (message, name, error, info) parameter such that: name=ERROR_TYPE, cause=Cause, info=objectTest, message=Example', () => {
      const cause = new Error('Cause');
      const objectTest = {
        par: 'info1',
        par: 'info2',
      };
      const errorTest = new Multi('Example', uuidTest, {
        name: 'ERROR_TYPE',
        causes: cause,
        info: objectTest,
      });
      expect(errorTest.name).to.be.equal('ERROR_TYPE');
      expect(errorTest.message).to.be.equal('Example');
      expect(errorTest.causes[0]).to.be.equal(cause);
      expect(errorTest.info).to.be.deep.equal(objectTest);
    });
    it('should create an instance with (message, name, causes, info) parameter such that: name=ERROR_TYPE, cause=cause[0], causes=causes, info=objectTest, message=Example', () => {
      const cause = new Error('Cause');
      const objectTest = {
        par: 'info1',
        par: 'info2',
      };
      const errorTest = new Multi('Example', uuidTest, {
        name: 'ERROR_TYPE',
        causes,
        info: objectTest,
      });
      expect(errorTest.name).to.be.equal('ERROR_TYPE');
      expect(errorTest.causes?.length).to.be.equal(5);
      expect(errorTest.causes[0]).to.be.equal(causes[0]);
      expect(errorTest.info).to.be.deep.equal(objectTest);
    });
    it('should create an instance with (message, error) parameter such that: name=Crash, cause=Cause, info=undefined, message=Example', () => {
      const cause = new Crash('Cause', uuidTest);
      const errorTest = new Multi('Example', uuidTest, { causes: cause });
      expect(errorTest.name).to.be.equal('MultiError');
      expect(errorTest.message).to.be.equal('Example');
      expect(errorTest.causes[0]).to.be.equal(cause);
      expect(errorTest.info).to.be.an('undefined');
    });
    it('should create an instance with (message, causes) parameter such that: name=Crash, cause=cause[0], causes=causes, info=undefined, message=Example', () => {
      const errorTest = new Multi('Example', uuidTest, { causes });
      expect(errorTest.name).to.be.equal('MultiError');
      expect(errorTest.message).to.be.equal('Example');
      expect(errorTest.causes?.length).to.be.equal(5);
      expect(errorTest.causes[0]).to.be.equal(causes[0]);
      expect(errorTest.info).to.be.an('undefined');
    });
    it('should create an instance with (message, error, info) parameter such that: name=Crash, cause=Cause, info=objectTest, message=Example', () => {
      const cause = new Crash('Cause', uuidTest);
      const objectTest = {
        par: 'info1',
        par: 'info2',
      };
      const errorTest = new Multi('Example', uuidTest, {
        causes: cause,
        info: objectTest,
      });
      expect(errorTest.name).to.be.equal('MultiError');
      expect(errorTest.message).to.be.equal('Example');
      expect(errorTest.causes[0]).to.be.equal(cause);
      expect(errorTest.info).to.be.deep.equal(objectTest);
    });
    it('should create an instance with (message, causes, info) parameter such that: name=Crash, cause=cases[0], causes=causes, info=objectTest, message=Example', () => {
      const objectTest = {
        par: 'info1',
        par: 'info2',
      };
      const errorTest = new Multi('Example', uuidTest, {
        causes,
        info: objectTest,
      });
      expect(errorTest.name).to.be.equal('MultiError');
      expect(errorTest.message).to.be.equal('Example');
      expect(errorTest.causes?.length).to.be.equal(5);
      expect(errorTest.causes[0]).to.be.equal(causes[0]);
      expect(errorTest.info).to.be.deep.equal(objectTest);
    });
    it('should throw a Crash error if message!=string', () => {
      const test = () => {
        new Multi(5, uuidTest);
      };
      expect(test).to.throw('Message parameter must be an Error or string');
    });
    it('should truncate the message if message is to large (>240)', () => {
      const error = new Crash('o'.padEnd(241, 'o'), uuidTest);
      expect(error.message.length).to.be.equal(240);
      expect(error.message).to.contain('...too long error');
    });
    it('should throw a Crash error if name!=string', () => {
      const test = () => {
        new Multi('Error', uuidTest, { name: 5 });
      };
      expect(test).to.throw('Parameter name must a string');
    });
    it('should throw a Crash error if the UUID is not valid', () => {
      const test = () => {
        new Multi('Error', 5, new Error(), {}, 'tooMuch');
      };
      expect(test).to.throw('uuid parameter must be an string and RFC 4122 based');
    });
    it('should throw a Crash error if the causes is not an Array', () => {
      const test = () => {
        new Multi('Error', uuidTest, { causes: 0 });
      };
      expect(test).to.throw('Options[causes] must be an array of Error/Crash');
    });
    it('should throw a Crash error if the causes are not error or Crash', () => {
      causes.push(5);
      const test = () => {
        new Multi('Error', uuidTest, { causes });
      };
      expect(test).to.throw('Options[causes] must be an array of Error/Crash');
      causes.pop();
    });
  });
  describe('methods ', () => {
    const query = { query: 'fake' };
    const request = { request: 'fake' };
    const endpoint = { method: 'get' };
    const controllerCrashError = new Multi('Getting', uuidTest, {
      name: 'ControllerError',
      causes,
      info: endpoint,
    });
    before(done => {
      causes.push(new Error('Regular Error'));
      done();
    });
    after(done => {
      causes.pop();
      done();
    });
    it('isMulti return true', () => {
      const errorTest = new Multi('Example', uuidTest);
      expect(errorTest.isMulti).to.be.true;
    });
    it('uuid return the uuid', () => {
      const errorTest = new Multi('Example', uuidTest);
      expect(errorTest.uuid).to.be.equal(uuidTest);
    });
    it('causes return undefined if there is no cause', () => {
      const errorTest = new Multi('Example', uuidTest);
      expect(errorTest.causes).to.be.a('undefined');
    });
    it('causes return an Error if there is the cause is an error', () => {
      const errorCause = new Error('Cause');
      const errorTest = new Multi('Example', uuidTest, { causes: errorCause });
      expect(errorTest.causes[0]).to.be.instanceof(Error);
      expect(errorTest.causes[0].name).to.be.equal('Error');
      expect(errorTest.causes[0].message).to.be.equal('Cause');
    });
    it('causes return an Error if there is the cause is an error created by causes', () => {
      const errorTest = new Multi('Example', uuidTest, { causes });
      expect(errorTest.causes[0]).to.be.instanceof(Crash);
      expect(errorTest.causes[0].name).to.be.equal('ValidationError');
      expect(errorTest.causes[0].message).to.be.equal('Crash Error');
    });
    it('info return undefined if there is no info', () => {
      const errorCause = new Error('Cause');
      const errorTest = new Multi('Example', uuidTest, { cause: errorCause });
      expect(errorTest.info).to.be.a('undefined');
    });
    it('info return info if there is info', () => {
      const objectTest = {
        par: 'info1',
        par: 'info2',
      };
      const errorCause = new Error('Cause');
      const errorTest = new Multi('Example', uuidTest, {
        cause: errorCause,
        info: objectTest,
      });
      expect(errorTest.info).to.be.deep.equal(objectTest);
    });
    it('toString() return a string with "name: message"', () => {
      const errorTest = new Multi('Example', uuidTest);
      expect(errorTest.toString()).to.be.deep.equal('MultiError: Example');
    });
    it('trace() return a string with "name: message; caused by: name: message; caused by ..."', () => {
      const str = [
        'ValidationError: Crash Error',
        'ValidationError: Crash Error',
        'ValidationError: Crash Error',
        'ValidationError: Crash Error',
        'ValidationError: Crash Error',
        'Error: Regular Error',
      ];
      expect(controllerCrashError.trace()).to.be.deep.equal(str);
    });
    it('findCauseByName() should find a cause when this cause exists', () => {
      const cause = controllerCrashError.findCauseByName('ValidationError');
      expect(cause).to.be.instanceof(Crash);
      expect(cause?.name).to.be.equal('ValidationError');
      expect(cause?.message).to.be.equal('Crash Error');
    });
    it('findCauseByName() should not find a cause when this cause no exists in a long nested chain', () => {
      const cause = controllerCrashError.findCauseByName('no');
      expect(cause).to.be.a('undefined');
    });
    it('findCauseByName() should not find a cause when this cause no exists in a single error', () => {
      const errorTest = new Multi('Error', uuidTest);
      const cause = errorTest.findCauseByName('no');
      expect(cause).to.be.a('undefined');
    });
    it('hasCauseWithName() should return a true when try to find a cause and this cause exists', () => {
      const cause = controllerCrashError.hasCauseWithName('ValidationError');
      expect(cause).to.be.true;
    });
    it('hasCauseWithName() should return a false when try to find a cause and this cause exists', () => {
      const cause = controllerCrashError.hasCauseWithName('no');
      expect(cause).to.be.false;
    });
    it('fullStack() should return the complete trace of the error sequence in a long nested chain', () => {
      const stack = controllerCrashError.fullStack();
      expect(stack).to.include('ControllerError');
      expect(stack).to.include('ValidationError');
    });
    it('fullStack() should return the complete trace of the error sequence in a single error', () => {
      const errorTest = new Multi('Error', uuidTest);
      const stack = errorTest.fullStack();
      expect(stack).to.include('MultiError');
    });
    it('push() should add a new error to causes', () => {
      const errorTest = new Multi('Error', uuidTest, { causes });
      errorTest.push(new Error('Regular Error'));
      expect(errorTest.causes?.length).to.be.equal(7);
    });
    it('pop() should remove a error in causes', () => {
      const errorTest = new Multi('Error', uuidTest, { causes });
      const dropError = errorTest.pop();
      expect(errorTest.causes?.length).to.be.equal(6);
      expect(dropError).to.be.instanceof(Error);
    });
    it('toJSON() should return a JSON well formatted', () => {
      const errorTest = new Multi('Error', uuidTest, { causes });
      const erroObject = errorTest.toJSON();
      expect(erroObject).to.be.deep.equal({
        name: 'MultiError',
        message: 'Error',
        trace: [
          'ValidationError: Crash Error',
          'ValidationError: Crash Error',
          'ValidationError: Crash Error',
          'ValidationError: Crash Error',
          'ValidationError: Crash Error',
          'Error: Regular Error',
        ],
        uuid: uuidTest,
      });
    });
    it('size should return the size of a multi error', () => {
      const errorTestZero = new Multi('Error', uuidTest);
      const errorTestOne = new Multi('Error', uuidTest);
      errorTestOne.push(new Error());
      expect(errorTestOne.size).to.be.equal(1);
      expect(errorTestZero.size).to.be.equal(0);
    });
  });
});
