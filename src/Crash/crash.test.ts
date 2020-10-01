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
import { Crash } from './CrashError';
const uuidTest = uuidV4();
describe('In #Crash class the ', () => {
  before(done => {
    done();
  });
  after(done => {
    done();
  });
  describe('#constructor ', () => {
    before(done => {
      done();
    });
    after(done => {
      done();
    });
    it('should create an instance with (message) parameter such that: name=Crash, cause=undefined, info=undefined, message=Example', () => {
      const errorTest = new Crash('Example', uuidTest);
      expect(errorTest.name).to.be.equal('CrashError');
      expect(errorTest.message).to.be.equal('Example');
      expect(errorTest.cause).to.be.an('undefined');
      expect(errorTest.info).to.be.an('undefined');
    });
    it('should create an instance with (message, name) parameter such that: name=ERROR_TYPE, cause=undefined, info=undefined, message=Example', () => {
      const errorTest = new Crash('Example', uuidTest, { name: 'ERROR_TYPE' });
      expect(errorTest.name).to.be.equal('ERROR_TYPE');
      expect(errorTest.message).to.be.equal('Example');
      expect(errorTest.cause).to.be.an('undefined');
      expect(errorTest.info).to.be.an('undefined');
    });
    it('should create an instance with (message, name, info) parameter such that: name=ERROR_TYPE, cause=undefined, info=objectTest, message=Example', () => {
      const objectTest = {
        par: 'info1',
        par: 'info2',
      };
      const errorTest = new Crash('Example', uuidTest, {
        name: 'ERROR_TYPE',
        info: objectTest,
      });
      expect(errorTest.name).to.be.equal('ERROR_TYPE');
      expect(errorTest.message).to.be.equal('Example');
      expect(errorTest.cause).to.be.a('undefined');
      expect(errorTest.info).to.be.deep.equal(objectTest);
    });
    it('should create an instance with (message, name, error) parameter such that: name=ERROR_TYPE, cause=Cause, info=undefined, message=Example', () => {
      const cause = new Error('Cause');
      const errorTest = new Crash('Example', uuidTest, { name: 'ERROR_TYPE', cause: cause });
      expect(errorTest.name).to.be.equal('ERROR_TYPE');
      expect(errorTest.message).to.be.equal('Example');
      expect(errorTest.cause).to.be.instanceof(Error);
      expect(errorTest.cause?.name).to.be.equal('Error');
      expect(errorTest.cause?.message).to.be.equal('Cause');
      expect(errorTest.info).to.be.an('undefined');
    });
    it('should create an instance with (message, name, error, info) parameter such that: name=ERROR_TYPE, cause=Cause, info=objectTest, message=Example', () => {
      const cause = new Error('Cause');
      const objectTest = {
        par: 'info1',
        par: 'info2',
      };
      const errorTest = new Crash('Example', uuidTest, {
        name: 'ERROR_TYPE',
        cause: cause,
        info: objectTest,
      });
      expect(errorTest.name).to.be.equal('ERROR_TYPE');
      expect(errorTest.message).to.be.equal('Example');
      expect(errorTest.cause).to.be.instanceof(Error);
      expect(errorTest.cause?.name).to.be.equal('Error');
      expect(errorTest.cause?.message).to.be.equal('Cause');
      expect(errorTest.info).to.be.deep.equal(objectTest);
    });
    it('should create an instance with (message, error) parameter such that: name=Crash, cause=Cause, info=undefined, message=Example', () => {
      const cause = new Crash('Cause', uuidTest);
      const errorTest = new Crash('Example', uuidTest, { cause });
      expect(errorTest.name).to.be.equal('CrashError');
      expect(errorTest.message).to.be.equal('Example');
      expect(errorTest.cause).to.be.instanceof(Error);
      expect(errorTest.cause?.name).to.be.equal('CrashError');
      expect(errorTest.cause?.message).to.be.equal('Cause');
      expect(errorTest.info).to.be.an('undefined');
    });
    it('should create an instance with (message, error, info) parameter such that: name=Crash, cause=Cause, info=objectTest, message=Example', () => {
      const cause = new Crash('Cause', uuidTest);
      const objectTest = {
        par: 'info1',
        par: 'info2',
      };
      const errorTest = new Crash('Example', uuidTest, { cause, info: objectTest });
      expect(errorTest.name).to.be.equal('CrashError');
      expect(errorTest.message).to.be.equal('Example');
      expect(errorTest.cause).to.be.instanceof(Error);
      expect(errorTest.cause?.name).to.be.equal('CrashError');
      expect(errorTest.cause?.message).to.be.equal('Cause');
      expect(errorTest.info).to.be.deep.equal(objectTest);
    });
    it('should throw a Crash error if message!=string', () => {
      const test = () => {
        new Crash(5, uuidTest);
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
        new Crash('Error', uuidTest, { name: 5 });
      };
      expect(test).to.throw('Parameter name must a string');
    });
    it('should throw a Crash error if cause!=Error | Crash', () => {
      const test = () => {
        new Crash('Error', uuidTest, { cause: 5 });
      };
      expect(test).to.throw('Parameter cause must be an Error/Crash');
    });
    it('should throw a Crash error if the UUID is not valid', () => {
      const test = () => {
        new Crash('Error', 5, new Error(), {}, 'tooMuch');
      };
      expect(test).to.throw('uuid parameter must be an string and RFC 4122 based');
    });
  });
  describe('#methods ', () => {
    const query = { query: 'fake' };
    const request = { request: 'fake' };
    const endpoint = { method: 'get' };
    const sourceError = new RangeError('Ranged');
    const modelCrashError = new Crash('Reading', uuidTest, {
      name: 'ModelError',
      cause: sourceError,
      info: query,
    });
    const serviceCrashError = new Crash('Requesting', uuidTest, {
      name: 'ServiceError',
      cause: modelCrashError,
      info: request,
    });
    const controllerCrashError = new Crash('Getting', uuidTest, {
      name: 'ControllerError',
      cause: serviceCrashError,
      info: endpoint,
    });
    before(done => {
      done();
    });
    after(done => {
      done();
    });
    it('isCrash return true', () => {
      const errorTest = new Crash('Example', uuidTest);
      expect(errorTest.isCrash).to.be.true;
    });
    it('uuid return the uuid', () => {
      const errorTest = new Crash('Example', uuidTest);
      expect(errorTest.uuid).to.be.equal(uuidTest);
    });
    it('cause return undefined if there is no cause', () => {
      const errorTest = new Crash('Example', uuidTest);
      expect(errorTest.cause).to.be.a('undefined');
    });
    it('cause return an Error if there is the cause is an error', () => {
      const errorCause = new Error('Cause');
      const errorTest = new Crash('Example', uuidTest, { cause: errorCause });
      expect(errorTest.cause).to.be.instanceof(Error);
      expect(errorTest.cause?.name).to.be.equal('Error');
      expect(errorTest.cause?.message).to.be.equal('Cause');
    });
    it('info return undefined if there is no info', () => {
      const errorCause = new Error('Cause');
      const errorTest = new Crash('Example', uuidTest, { cause: errorCause });
      expect(errorTest.info).to.be.a('undefined');
    });
    it('info return info if there is info', () => {
      const objectTest = {
        par: 'info1',
        par: 'info2',
      };
      const errorCause = new Error('Cause');
      const errorTest = new Crash('Example', uuidTest, {
        cause: errorCause,
        info: objectTest,
      });
      expect(errorTest.info).to.be.deep.equal(objectTest);
    });
    it('toString() return a string with "name: message"', () => {
      const errorTest = new Crash('Example', uuidTest);
      expect(errorTest.toString()).to.be.deep.equal('CrashError: Example');
    });
    it('trace() return a string with "name: message; caused by: name: message; caused by ..."', () => {
      const str = [
        'ControllerError: Getting',
        'caused by: ServiceError: Requesting',
        'caused by: ModelError: Reading',
        'caused by: RangeError: Ranged',
      ];
      expect(controllerCrashError.trace()).to.be.deep.equal(str);
    });
    it('findCauseByName() should find a cause when this cause exists', () => {
      const cause = controllerCrashError.findCauseByName('ModelError');
      expect(cause).to.be.instanceof(Crash);
      expect(cause?.name).to.be.equal('ModelError');
      expect(cause?.message).to.be.equal('Reading');
    });
    it('findCauseByName() should not find a cause when this cause no exists in a long nested chain', () => {
      const cause = controllerCrashError.findCauseByName('no');
      expect(cause).to.be.a('undefined');
    });
    it('findCauseByName() should not find a cause when this cause no exists in a single error', () => {
      const errorTest = new Crash('Error', uuidTest);
      const cause = errorTest.findCauseByName('no');
      expect(cause).to.be.a('undefined');
    });
    it('hasCauseWithName() should return a true when try to find a cause and this cause exists', () => {
      const cause = controllerCrashError.hasCauseWithName('ModelError');
      expect(cause).to.be.true;
    });
    it('hasCauseWithName() should return a false when try to find a cause and this cause exists', () => {
      const cause = controllerCrashError.hasCauseWithName('no');
      expect(cause).to.be.false;
    });
    it('fullStack() should return the complete trace of the error sequence in a long nested chain', () => {
      const stack = controllerCrashError.fullStack();
      expect(stack).to.include('ControllerError');
      expect(stack).to.include('ModelError');
      expect(stack).to.include('ServiceError');
      expect(stack).to.include('RangeError');
    });
    it('fullStack() should return the complete trace of the error sequence in a single error', () => {
      const errorTest = new Crash('Error', uuidTest);
      const stack = errorTest.fullStack();
      expect(stack).to.include('CrashError');
    });
  });
});
