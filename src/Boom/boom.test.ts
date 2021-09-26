// @ts-nocheck
/**
 * Copyright 2021 Netin Systems S.L. All rights reserved.
 * Note: All information contained herein is, and remains the property of Netin Systems S.L. and its
 * suppliers, if any. The intellectual and technical concepts contained herein are property of
 * Netin Systems S.L. and its suppliers and may be covered by European and Foreign patents, patents
 * in process, and are protected by trade secret or copyright.
 *
 * Dissemination of this information or the reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Netin Systems S.L.
 */
import 'mocha';
import { expect, assert } from 'chai';
import { v4 as uuidV4 } from 'uuid';
import * as BoomHelpers from './httpHelpers';
import { Boom, BoomOptions } from './BoomError';
import Joi from 'joi';
const uuidTest = uuidV4();
const testError = new SyntaxError('Syntax');
const optionsTest: BoomOptions = {
  links: {
    self: '/link/test',
  },
  source: {
    pointer: '/this/point',
    parameter: 'test2',
  },
  cause: testError,
  info: {
    a: 2,
  },
};
const msg = 'Detailed error';
describe('In #Boom class the ', () => {
  before(done => {
    done();
  });
  after(done => {
    done();
  });
  describe('constructor ', () => {
    it('should throw an error if code is not a number', () => {
      const test = () => {
        new Boom('Boom', uuidTest, 'code');
      };
      expect(test).throw('Code must be a number');
    });
    it('should throw an error if option.links.self is not a string', () => {
      const test = () => {
        new Boom(msg, uuidTest, 500, { links: { self: 7 } });
      };
      expect(test).throw('Links and source must be strings');
    });
    it('should throw an error if option.links.related.href is not a string', () => {
      const test = () => {
        new Boom(msg, uuidTest, 500, { links: { related: { href: 7 } } });
      };
      expect(test).throw('Links and source must be strings');
    });
    it('should throw an error if option.source.parameter without pointer', () => {
      const test = () => {
        new Boom(msg, uuidTest, 500, { source: { parameter: 7 } });
      };
      expect(test).throw('Links and source must be strings');
    });
    it('should throw an error if option.source.pointer is not a string', () => {
      const test = () => {
        new Boom(msg, uuidTest, 500, { source: { pointer: 7 } });
      };
      expect(test).throw('Links and source must be strings');
    });
    it('should create an error with default value 500', () => {
      const error = new Boom(msg, uuidTest);
      expect(error.isBoom).to.be.equal(true);
      expect(error.toJSON()).to.have.property('uuid', uuidTest);
      expect(error.toJSON()).to.have.property('links', undefined);
      expect(error.toJSON()).to.have.property('status', 500);
      expect(error.toJSON()).to.have.property('code', 'HTTP');
      expect(error.toJSON()).to.have.property('title', 'Internal Server Error');
      expect(error.toJSON()).to.have.property('detail', msg);
      expect(error.toJSON()).to.have.property('source', undefined);
      expect(error.toJSON()).to.have.property('meta', undefined);
    });
    it('should create an error with not defined code', () => {
      const error = new Boom(msg, uuidTest, 625);
      expect(error.isBoom).to.be.equal(true);
      expect(error.toJSON()).to.have.property('uuid', uuidTest);
      expect(error.toJSON()).to.have.property('links', undefined);
      expect(error.toJSON()).to.have.property('status', 625);
      expect(error.toJSON()).to.have.property('code', 'HTTP');
      expect(error.toJSON()).to.have.property('title', 'Undefined error');
      expect(error.toJSON()).to.have.property('detail', msg);
      expect(error.toJSON()).to.have.property('source', undefined);
      expect(error.toJSON()).to.have.property('meta', undefined);
    });
  });
  describe('helpers ', () => {
    it('should create an error from helper badRequest()', () => {
      const error = BoomHelpers.badRequest('detail', uuidTest, optionsTest);
      expect(error.isBoom).to.be.equal(true);
      expect(error.toJSON()).to.have.property('uuid', uuidTest);
      expect(error.toJSON().links).to.be.deep.equal(optionsTest.links);
      expect(error.toJSON()).to.have.property('status', 400);
      expect(error.toJSON()).to.have.property('code', 'SyntaxError');
      expect(error.toJSON()).to.have.property('title', 'Bad Request');
      expect(error.toJSON()).to.have.property('detail', 'detail');
      expect(error.toJSON().source).to.be.deep.equal(optionsTest.source);
      expect(error.toJSON().meta).to.be.deep.equal(optionsTest.info);
    });
    it('should create an error from helper unauthorized()', () => {
      const error = BoomHelpers.unauthorized('detail', uuidTest, optionsTest);
      expect(error.isBoom).to.be.equal(true);
      expect(error.toJSON()).to.have.property('uuid', uuidTest);
      expect(error.toJSON().links).to.be.deep.equal(optionsTest.links);
      expect(error.toJSON()).to.have.property('status', 401);
      expect(error.toJSON()).to.have.property('code', 'SyntaxError');
      expect(error.toJSON()).to.have.property('title', 'Unauthorized');
      expect(error.toJSON()).to.have.property('detail', 'detail');
      expect(error.toJSON().source).to.be.deep.equal(optionsTest.source);
      expect(error.toJSON().meta).to.be.deep.equal(optionsTest.info);
    });
    it('should create an error from helper paymentRequired()', () => {
      const error = BoomHelpers.paymentRequired('detail', uuidTest, optionsTest);
      expect(error.isBoom).to.be.equal(true);
      expect(error.toJSON()).to.have.property('uuid', uuidTest);
      expect(error.toJSON().links).to.be.deep.equal(optionsTest.links);
      expect(error.toJSON()).to.have.property('status', 402);
      expect(error.toJSON()).to.have.property('code', 'SyntaxError');
      expect(error.toJSON()).to.have.property('title', 'Payment Required');
      expect(error.toJSON()).to.have.property('detail', 'detail');
      expect(error.toJSON().source).to.be.deep.equal(optionsTest.source);
      expect(error.toJSON().meta).to.be.deep.equal(optionsTest.info);
    });
    it('should create an error from helper forbidden()', () => {
      const error = BoomHelpers.forbidden('detail', uuidTest, optionsTest);
      expect(error.isBoom).to.be.equal(true);
      expect(error.toJSON()).to.have.property('uuid', uuidTest);
      expect(error.toJSON().links).to.be.deep.equal(optionsTest.links);
      expect(error.toJSON()).to.have.property('status', 403);
      expect(error.toJSON()).to.have.property('code', 'SyntaxError');
      expect(error.toJSON()).to.have.property('title', 'Forbidden');
      expect(error.toJSON()).to.have.property('detail', 'detail');
      expect(error.toJSON().source).to.be.deep.equal(optionsTest.source);
      expect(error.toJSON().meta).to.be.deep.equal(optionsTest.info);
    });
    it('should create an error from helper notFound()', () => {
      const error = BoomHelpers.notFound('detail', uuidTest, optionsTest);
      expect(error.isBoom).to.be.equal(true);
      expect(error.toJSON()).to.have.property('uuid', uuidTest);
      expect(error.toJSON().links).to.be.deep.equal(optionsTest.links);
      expect(error.toJSON()).to.have.property('status', 404);
      expect(error.toJSON()).to.have.property('code', 'SyntaxError');
      expect(error.toJSON()).to.have.property('title', 'Not Found');
      expect(error.toJSON()).to.have.property('detail', 'detail');
      expect(error.toJSON().source).to.be.deep.equal(optionsTest.source);
      expect(error.toJSON().meta).to.be.deep.equal(optionsTest.info);
    });
    it('should create an error from helper methodNotAllowed()', () => {
      const error = BoomHelpers.methodNotAllowed('detail', uuidTest, optionsTest);
      expect(error.isBoom).to.be.equal(true);
      expect(error.toJSON()).to.have.property('uuid', uuidTest);
      expect(error.toJSON().links).to.be.deep.equal(optionsTest.links);
      expect(error.toJSON()).to.have.property('status', 405);
      expect(error.toJSON()).to.have.property('code', 'SyntaxError');
      expect(error.toJSON()).to.have.property('title', 'Method Not Allowed');
      expect(error.toJSON()).to.have.property('detail', 'detail');
      expect(error.toJSON().source).to.be.deep.equal(optionsTest.source);
      expect(error.toJSON().meta).to.be.deep.equal(optionsTest.info);
    });
    it('should create an error from helper notAcceptable()', () => {
      const error = BoomHelpers.notAcceptable('detail', uuidTest, optionsTest);
      expect(error.isBoom).to.be.equal(true);
      expect(error.toJSON()).to.have.property('uuid', uuidTest);
      expect(error.toJSON().links).to.be.deep.equal(optionsTest.links);
      expect(error.toJSON()).to.have.property('status', 406);
      expect(error.toJSON()).to.have.property('code', 'SyntaxError');
      expect(error.toJSON()).to.have.property('title', 'Not Acceptable');
      expect(error.toJSON()).to.have.property('detail', 'detail');
      expect(error.toJSON().source).to.be.deep.equal(optionsTest.source);
      expect(error.toJSON().meta).to.be.deep.equal(optionsTest.info);
    });
    it('should create an error from helper proxyAuthRequired()', () => {
      const error = BoomHelpers.proxyAuthRequired('detail', uuidTest, optionsTest);
      expect(error.isBoom).to.be.equal(true);
      expect(error.toJSON()).to.have.property('uuid', uuidTest);
      expect(error.toJSON().links).to.be.deep.equal(optionsTest.links);
      expect(error.toJSON()).to.have.property('status', 407);
      expect(error.toJSON()).to.have.property('code', 'SyntaxError');
      expect(error.toJSON()).to.have.property('title', 'Proxy Authentication Required');
      expect(error.toJSON()).to.have.property('detail', 'detail');
      expect(error.toJSON().source).to.be.deep.equal(optionsTest.source);
      expect(error.toJSON().meta).to.be.deep.equal(optionsTest.info);
    });
    it('should create an error from helper requestTimeout()', () => {
      const error = BoomHelpers.requestTimeout('detail', uuidTest, optionsTest);
      expect(error.isBoom).to.be.equal(true);
      expect(error.toJSON()).to.have.property('uuid', uuidTest);
      expect(error.toJSON().links).to.be.deep.equal(optionsTest.links);
      expect(error.toJSON()).to.have.property('status', 408);
      expect(error.toJSON()).to.have.property('code', 'SyntaxError');
      expect(error.toJSON()).to.have.property('title', 'Request Time-out');
      expect(error.toJSON()).to.have.property('detail', 'detail');
      expect(error.toJSON().source).to.be.deep.equal(optionsTest.source);
      expect(error.toJSON().meta).to.be.deep.equal(optionsTest.info);
    });
    it('should create an error from helper conflict()', () => {
      const error = BoomHelpers.conflict('detail', uuidTest, optionsTest);
      expect(error.isBoom).to.be.equal(true);
      expect(error.toJSON()).to.have.property('uuid', uuidTest);
      expect(error.toJSON().links).to.be.deep.equal(optionsTest.links);
      expect(error.toJSON()).to.have.property('status', 409);
      expect(error.toJSON()).to.have.property('code', 'SyntaxError');
      expect(error.toJSON()).to.have.property('title', 'Conflict');
      expect(error.toJSON()).to.have.property('detail', 'detail');
      expect(error.toJSON().source).to.be.deep.equal(optionsTest.source);
      expect(error.toJSON().meta).to.be.deep.equal(optionsTest.info);
    });
    it('should create an error from helper gone()', () => {
      const error = BoomHelpers.gone('detail', uuidTest, optionsTest);
      expect(error.isBoom).to.be.equal(true);
      expect(error.toJSON()).to.have.property('uuid', uuidTest);
      expect(error.toJSON().links).to.be.deep.equal(optionsTest.links);
      expect(error.toJSON()).to.have.property('status', 410);
      expect(error.toJSON()).to.have.property('code', 'SyntaxError');
      expect(error.toJSON()).to.have.property('title', 'Gone');
      expect(error.toJSON()).to.have.property('detail', 'detail');
      expect(error.toJSON().source).to.be.deep.equal(optionsTest.source);
      expect(error.toJSON().meta).to.be.deep.equal(optionsTest.info);
    });
    it('should create an error from helper lengthRequired()', () => {
      const error = BoomHelpers.lengthRequired('detail', uuidTest, optionsTest);
      expect(error.isBoom).to.be.equal(true);
      expect(error.toJSON()).to.have.property('uuid', uuidTest);
      expect(error.toJSON().links).to.be.deep.equal(optionsTest.links);
      expect(error.toJSON()).to.have.property('status', 411);
      expect(error.toJSON()).to.have.property('code', 'SyntaxError');
      expect(error.toJSON()).to.have.property('title', 'Length Required');
      expect(error.toJSON()).to.have.property('detail', 'detail');
      expect(error.toJSON().source).to.be.deep.equal(optionsTest.source);
      expect(error.toJSON().meta).to.be.deep.equal(optionsTest.info);
    });
    it('should create an error from helper preconditionFailed()', () => {
      const error = BoomHelpers.preconditionFailed('detail', uuidTest, optionsTest);
      expect(error.isBoom).to.be.equal(true);
      expect(error.toJSON()).to.have.property('uuid', uuidTest);
      expect(error.toJSON().links).to.be.deep.equal(optionsTest.links);
      expect(error.toJSON()).to.have.property('status', 412);
      expect(error.toJSON()).to.have.property('code', 'SyntaxError');
      expect(error.toJSON()).to.have.property('title', 'Precondition Failed');
      expect(error.toJSON()).to.have.property('detail', 'detail');
      expect(error.toJSON().source).to.be.deep.equal(optionsTest.source);
      expect(error.toJSON().meta).to.be.deep.equal(optionsTest.info);
    });
    it('should create an error from helper payloadTooLarge()', () => {
      const error = BoomHelpers.payloadTooLarge('detail', uuidTest, optionsTest);
      expect(error.isBoom).to.be.equal(true);
      expect(error.toJSON()).to.have.property('uuid', uuidTest);
      expect(error.toJSON().links).to.be.deep.equal(optionsTest.links);
      expect(error.toJSON()).to.have.property('status', 413);
      expect(error.toJSON()).to.have.property('code', 'SyntaxError');
      expect(error.toJSON()).to.have.property('title', 'Request Entity Too Large');
      expect(error.toJSON()).to.have.property('detail', 'detail');
      expect(error.toJSON().source).to.be.deep.equal(optionsTest.source);
      expect(error.toJSON().meta).to.be.deep.equal(optionsTest.info);
    });
    it('should create an error from helper uriTooLong()', () => {
      const error = BoomHelpers.uriTooLong('detail', uuidTest, optionsTest);
      expect(error.isBoom).to.be.equal(true);
      expect(error.toJSON()).to.have.property('uuid', uuidTest);
      expect(error.toJSON().links).to.be.deep.equal(optionsTest.links);
      expect(error.toJSON()).to.have.property('status', 414);
      expect(error.toJSON()).to.have.property('code', 'SyntaxError');
      expect(error.toJSON()).to.have.property('title', 'Request-URI Too Large');
      expect(error.toJSON()).to.have.property('detail', 'detail');
      expect(error.toJSON().source).to.be.deep.equal(optionsTest.source);
      expect(error.toJSON().meta).to.be.deep.equal(optionsTest.info);
    });
    it('should create an error from helper unsupportedMediaType()', () => {
      const error = BoomHelpers.unsupportedMediaType('detail', uuidTest, optionsTest);
      expect(error.isBoom).to.be.equal(true);
      expect(error.toJSON()).to.have.property('uuid', uuidTest);
      expect(error.toJSON().links).to.be.deep.equal(optionsTest.links);
      expect(error.toJSON()).to.have.property('status', 415);
      expect(error.toJSON()).to.have.property('code', 'SyntaxError');
      expect(error.toJSON()).to.have.property('title', 'Unsupported Media Type');
      expect(error.toJSON()).to.have.property('detail', 'detail');
      expect(error.toJSON().source).to.be.deep.equal(optionsTest.source);
      expect(error.toJSON().meta).to.be.deep.equal(optionsTest.info);
    });
    it('should create an error from helper rangeNotSatisfiable()', () => {
      const error = BoomHelpers.rangeNotSatisfiable('detail', uuidTest, optionsTest);
      expect(error.isBoom).to.be.equal(true);
      expect(error.toJSON()).to.have.property('uuid', uuidTest);
      expect(error.toJSON().links).to.be.deep.equal(optionsTest.links);
      expect(error.toJSON()).to.have.property('status', 416);
      expect(error.toJSON()).to.have.property('code', 'SyntaxError');
      expect(error.toJSON()).to.have.property('title', 'Requested Range Not Satisfiable');
      expect(error.toJSON()).to.have.property('detail', 'detail');
      expect(error.toJSON().source).to.be.deep.equal(optionsTest.source);
      expect(error.toJSON().meta).to.be.deep.equal(optionsTest.info);
    });
    it('should create an error from helper expectationFailed()', () => {
      const error = BoomHelpers.expectationFailed('detail', uuidTest, optionsTest);
      expect(error.isBoom).to.be.equal(true);
      expect(error.toJSON()).to.have.property('uuid', uuidTest);
      expect(error.toJSON().links).to.be.deep.equal(optionsTest.links);
      expect(error.toJSON()).to.have.property('status', 417);
      expect(error.toJSON()).to.have.property('code', 'SyntaxError');
      expect(error.toJSON()).to.have.property('title', 'Expectation Failed');
      expect(error.toJSON()).to.have.property('detail', 'detail');
      expect(error.toJSON().source).to.be.deep.equal(optionsTest.source);
      expect(error.toJSON().meta).to.be.deep.equal(optionsTest.info);
    });
    it('should create an error from helper teapot()', () => {
      const error = BoomHelpers.teapot('detail', uuidTest, optionsTest);
      expect(error.isBoom).to.be.equal(true);
      expect(error.toJSON()).to.have.property('uuid', uuidTest);
      expect(error.toJSON().links).to.be.deep.equal(optionsTest.links);
      expect(error.toJSON()).to.have.property('status', 418);
      expect(error.toJSON()).to.have.property('code', 'SyntaxError');
      expect(error.toJSON()).to.have.property('title', "I'm a teapot");
      expect(error.toJSON()).to.have.property('detail', 'detail');
      expect(error.toJSON().source).to.be.deep.equal(optionsTest.source);
      expect(error.toJSON().meta).to.be.deep.equal(optionsTest.info);
    });
    it('should create an error from helper locked()', () => {
      const error = BoomHelpers.locked('detail', uuidTest, optionsTest);
      expect(error.isBoom).to.be.equal(true);
      expect(error.toJSON()).to.have.property('uuid', uuidTest);
      expect(error.toJSON().links).to.be.deep.equal(optionsTest.links);
      expect(error.toJSON()).to.have.property('status', 423);
      expect(error.toJSON()).to.have.property('code', 'SyntaxError');
      expect(error.toJSON()).to.have.property('title', 'Locked');
      expect(error.toJSON()).to.have.property('detail', 'detail');
      expect(error.toJSON().source).to.be.deep.equal(optionsTest.source);
      expect(error.toJSON().meta).to.be.deep.equal(optionsTest.info);
    });
    it('should create an error from helper failedDependency()', () => {
      const error = BoomHelpers.failedDependency('detail', uuidTest, optionsTest);
      expect(error.isBoom).to.be.equal(true);
      expect(error.toJSON()).to.have.property('uuid', uuidTest);
      expect(error.toJSON().links).to.be.deep.equal(optionsTest.links);
      expect(error.toJSON()).to.have.property('status', 424);
      expect(error.toJSON()).to.have.property('code', 'SyntaxError');
      expect(error.toJSON()).to.have.property('title', 'Failed Dependency');
      expect(error.toJSON()).to.have.property('detail', 'detail');
      expect(error.toJSON().source).to.be.deep.equal(optionsTest.source);
      expect(error.toJSON().meta).to.be.deep.equal(optionsTest.info);
    });
    it('should create an error from helper tooEarly()', () => {
      const error = BoomHelpers.tooEarly('detail', uuidTest, optionsTest);
      expect(error.isBoom).to.be.equal(true);
      expect(error.toJSON()).to.have.property('uuid', uuidTest);
      expect(error.toJSON().links).to.be.deep.equal(optionsTest.links);
      expect(error.toJSON()).to.have.property('status', 425);
      expect(error.toJSON()).to.have.property('code', 'SyntaxError');
      expect(error.toJSON()).to.have.property('title', 'Too Early');
      expect(error.toJSON()).to.have.property('detail', 'detail');
      expect(error.toJSON().source).to.be.deep.equal(optionsTest.source);
      expect(error.toJSON().meta).to.be.deep.equal(optionsTest.info);
    });
    it('should create an error from helper preconditionRequired()', () => {
      const error = BoomHelpers.preconditionRequired('detail', uuidTest, optionsTest);
      expect(error.isBoom).to.be.equal(true);
      expect(error.toJSON()).to.have.property('uuid', uuidTest);
      expect(error.toJSON().links).to.be.deep.equal(optionsTest.links);
      expect(error.toJSON()).to.have.property('status', 428);
      expect(error.toJSON()).to.have.property('code', 'SyntaxError');
      expect(error.toJSON()).to.have.property('title', 'Precondition Required');
      expect(error.toJSON()).to.have.property('detail', 'detail');
      expect(error.toJSON().source).to.be.deep.equal(optionsTest.source);
      expect(error.toJSON().meta).to.be.deep.equal(optionsTest.info);
    });
    it('should create an error from helper tooManyRequests()', () => {
      const error = BoomHelpers.tooManyRequests('detail', uuidTest, optionsTest);
      expect(error.isBoom).to.be.equal(true);
      expect(error.toJSON()).to.have.property('uuid', uuidTest);
      expect(error.toJSON().links).to.be.deep.equal(optionsTest.links);
      expect(error.toJSON()).to.have.property('status', 429);
      expect(error.toJSON()).to.have.property('code', 'SyntaxError');
      expect(error.toJSON()).to.have.property('title', 'Too Many Requests');
      expect(error.toJSON()).to.have.property('detail', 'detail');
      expect(error.toJSON().source).to.be.deep.equal(optionsTest.source);
      expect(error.toJSON().meta).to.be.deep.equal(optionsTest.info);
    });
    it('should create an error from helper illegal()', () => {
      const error = BoomHelpers.illegal('detail', uuidTest, optionsTest);
      expect(error.isBoom).to.be.equal(true);
      expect(error.toJSON()).to.have.property('uuid', uuidTest);
      expect(error.toJSON().links).to.be.deep.equal(optionsTest.links);
      expect(error.toJSON()).to.have.property('status', 451);
      expect(error.toJSON()).to.have.property('code', 'SyntaxError');
      expect(error.toJSON()).to.have.property('title', 'Unavailable For Legal Reasons');
      expect(error.toJSON()).to.have.property('detail', 'detail');
      expect(error.toJSON().source).to.be.deep.equal(optionsTest.source);
      expect(error.toJSON().meta).to.be.deep.equal(optionsTest.info);
    });
    it('should create an error from helper internalServerError()', () => {
      const error = BoomHelpers.internalServerError('detail', uuidTest, optionsTest);
      expect(error.isBoom).to.be.equal(true);
      expect(error.toJSON()).to.have.property('uuid', uuidTest);
      expect(error.toJSON().links).to.be.deep.equal(optionsTest.links);
      expect(error.toJSON()).to.have.property('status', 500);
      expect(error.toJSON()).to.have.property('code', 'SyntaxError');
      expect(error.toJSON()).to.have.property('title', 'Internal Server Error');
      expect(error.toJSON()).to.have.property('detail', 'detail');
      expect(error.toJSON().source).to.be.deep.equal(optionsTest.source);
      expect(error.toJSON().meta).to.be.deep.equal(optionsTest.info);
    });
    it('should create an error from helper notImplemented()', () => {
      const error = BoomHelpers.notImplemented('detail', uuidTest, optionsTest);
      expect(error.isBoom).to.be.equal(true);
      expect(error.toJSON()).to.have.property('uuid', uuidTest);
      expect(error.toJSON().links).to.be.deep.equal(optionsTest.links);
      expect(error.toJSON()).to.have.property('status', 501);
      expect(error.toJSON()).to.have.property('code', 'SyntaxError');
      expect(error.toJSON()).to.have.property('title', 'Not Implemented');
      expect(error.toJSON()).to.have.property('detail', 'detail');
      expect(error.toJSON().source).to.be.deep.equal(optionsTest.source);
      expect(error.toJSON().meta).to.be.deep.equal(optionsTest.info);
    });
    it('should create an error from helper badGateway()', () => {
      const error = BoomHelpers.badGateway('detail', uuidTest, optionsTest);
      expect(error.isBoom).to.be.equal(true);
      expect(error.toJSON()).to.have.property('uuid', uuidTest);
      expect(error.toJSON().links).to.be.deep.equal(optionsTest.links);
      expect(error.toJSON()).to.have.property('status', 502);
      expect(error.toJSON()).to.have.property('code', 'SyntaxError');
      expect(error.toJSON()).to.have.property('title', 'Bad Gateway');
      expect(error.toJSON()).to.have.property('detail', 'detail');
      expect(error.toJSON().source).to.be.deep.equal(optionsTest.source);
      expect(error.toJSON().meta).to.be.deep.equal(optionsTest.info);
    });
    it('should create an error from helper serverUnavailable()', () => {
      const error = BoomHelpers.serverUnavailable('detail', uuidTest, optionsTest);
      expect(error.isBoom).to.be.equal(true);
      expect(error.toJSON()).to.have.property('uuid', uuidTest);
      expect(error.toJSON().links).to.be.deep.equal(optionsTest.links);
      expect(error.toJSON()).to.have.property('status', 503);
      expect(error.toJSON()).to.have.property('code', 'SyntaxError');
      expect(error.toJSON()).to.have.property('title', 'Service Unavailable');
      expect(error.toJSON()).to.have.property('detail', 'detail');
      expect(error.toJSON().source).to.be.deep.equal(optionsTest.source);
      expect(error.toJSON().meta).to.be.deep.equal(optionsTest.info);
    });
    it('should create an error from helper gatewayTimeout()', () => {
      const error = BoomHelpers.gatewayTimeout('detail', uuidTest, optionsTest);
      expect(error.isBoom).to.be.equal(true);
      expect(error.toJSON()).to.have.property('uuid', uuidTest);
      expect(error.toJSON().links).to.be.deep.equal(optionsTest.links);
      expect(error.toJSON()).to.have.property('status', 504);
      expect(error.toJSON()).to.have.property('code', 'SyntaxError');
      expect(error.toJSON()).to.have.property('title', 'Gateway Time-out');
      expect(error.toJSON()).to.have.property('detail', 'detail');
      expect(error.toJSON().source).to.be.deep.equal(optionsTest.source);
      expect(error.toJSON().meta).to.be.deep.equal(optionsTest.info);
    });
  });
  describe('method ', () => {
    it('status should return the status', () => {
      const error = BoomHelpers.badRequest('detail', uuidTest, optionsTest);
      expect(error.status).to.be.equal(400);
    });
    it('links should return the links', () => {
      const error = BoomHelpers.badRequest('detail', uuidTest, optionsTest);
      expect(error.links).to.be.deep.equal(optionsTest.links);
    });
    it('source should return the source', () => {
      const error = BoomHelpers.badRequest('detail', uuidTest, optionsTest);
      expect(error.source).to.be.deep.equal(optionsTest.source);
    });
    it('isBoom should return true', () => {
      const error = BoomHelpers.badRequest('detail', uuidTest, optionsTest);
      expect(error.isBoom).to.be.equal(true);
    });
    it('cause return undefined if there is no cause', () => {
      const errorTest = new Boom('Example', uuidTest);
      expect(errorTest.cause).to.be.a('undefined');
    });
    it('cause return an Error if there is the cause is an error', () => {
      const errorCause = new Error('Cause');
      const errorTest = new Boom('Example', uuidTest, 500, { cause: errorCause });
      expect(errorTest.cause).to.be.instanceof(Error);
      expect(errorTest.cause?.name).to.be.equal('Error');
      expect(errorTest.cause?.message).to.be.equal('Cause');
    });
    it('Boomify should return a Boom error with Multi from a Joi validation Error', () => {
      const schema = Joi.object<Magic>({
        imagination: Joi.number().min(5).max(20).default(4).messages({
          'number.base': 'Imagination should be a number',
          'number.max': 'Imagination should be between 5 and 20',
          'number.min': 'Imagination should be between 5 and 20',
        }),
        magicWords: Joi.array()
          .items(
            Joi.string().min(5).messages({
              'string.base': 'Magic words should be strings',
              'string.min': 'Magic words should have at least 5 characters',
            })
          )
          .min(1)
          .max(5)
          .required()
          .messages({
            'any.required': 'Magic works are necessary to perform magic',
            'array.base': 'Magic works should be an array of words',
            'array.min': 'We need at least one magic word',
            'array.max': 'More than 5 magic words will invoque Voldemort',
          }),
      });
      const magicValidation = schema.validate(
        {
          imagination: 21,
          magicWords: ['a', 'b', 'c', 'h', 'i', 'ooo'],
        },
        { abortEarly: false }
      );
      if (magicValidation.error) {
        const error = new Boom(magicValidation.error.message, uuidTest, 400, {
          name: 'Validation Error',
        });
        error.Boomify(magicValidation.error);
        expect(error.status).to.be.equal(400);
        expect(error.cause.isMulti).to.be.true;
        expect(error.cause.causes[0].message).to.be.equal('Imagination should be between 5 and 20');
        expect(error.cause.causes[1].message).to.be.equal(
          'Magic words should have at least 5 characters'
        );
        expect(error.cause.causes[2].message).to.be.equal(
          'Magic words should have at least 5 characters'
        );
        expect(error.cause.causes[3].message).to.be.equal(
          'Magic words should have at least 5 characters'
        );
        expect(error.cause.causes[4].message).to.be.equal(
          'Magic words should have at least 5 characters'
        );
        expect(error.cause.causes[5].message).to.be.equal(
          'Magic words should have at least 5 characters'
        );
        expect(error.cause.causes[6].message).to.be.equal(
          'Magic words should have at least 5 characters'
        );
        expect(error.cause.causes[7].message).to.be.equal(
          'More than 5 magic words will invoque Voldemort'
        );
      } else {
        assert(false, 'Hapi/Joi should produce an error in the validation');
      }
    });
    it('Boomify should return a Boom error with Crash from a Joi validation Error', () => {
      const schema = Joi.object<Magic>({
        imagination: Joi.number().min(5).max(20).default(4).messages({
          'number.base': 'Imagination should be a number',
          'number.max': 'Imagination should be between 5 and 20',
          'number.min': 'Imagination should be between 5 and 20',
        }),
        magicWords: Joi.array()
          .items(
            Joi.string().min(5).messages({
              'string.base': 'Magic words should be strings',
              'string.min': 'Magic words should have at least 5 characters',
            })
          )
          .min(1)
          .max(5)
          .required()
          .messages({
            'any.required': 'Magic works are necessary to perform magic',
            'array.base': 'Magic works should be an array of words',
            'array.min': 'We need at least one magic word',
            'array.max': 'More than 5 magic words will invoque Voldemort',
          }),
      });
      const magicValidation = schema.validate(
        {
          imagination: 21,
          magicWords: ['abcde', 'abcde', 'abcde', 'abcde', 'abcde'],
        },
        { abortEarly: false }
      );
      if (magicValidation.error) {
        const error = new Boom(magicValidation.error.message, uuidTest, 400, {
          name: 'Validation Error',
        });
        error.Boomify(magicValidation.error);
        expect(error.status).to.be.equal(400);
        expect(error.cause.isCrash).to.be.true;
        expect(error.cause.message).to.be.equal('Imagination should be between 5 and 20');
      } else {
        assert(false, 'Hapi/Joi should produce an error in the validation');
      }
    });
  });
});
