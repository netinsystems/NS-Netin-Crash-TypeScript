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
import { Cause } from '..';
import { ValidationError } from '../JoiTypes';
import { Base, BaseOptions } from '../BaseError';
import { Crash } from '../Crash';
import { Multi } from '../Multi';
import { APIError } from './APIError';
import { APIResource } from './APISource';
import { CODES } from './httpCodes';

/**
 * Boom error configuration options
 * @category Boom
 * @public
 */
export interface BoomOptions extends BaseOptions {
  links?: {
    [x: string]: string;
  };
  source?: APIResource;
  cause?: Cause;
}
/**
 * Check if the cause are type safe and valid
 * @param uuid - unique identifier for this particular occurrence of the problem
 * @param cause - Crash error cause
 */
function _typeSafeCause(uuid: string, cause?: Error | Crash): Error | Crash | undefined {
  if (cause) {
    if (cause instanceof Crash || cause instanceof Error) {
      return cause;
    } else {
      throw new Crash('Parameter cause must be an Error/Crash', uuid);
    }
  } else {
    return undefined;
  }
}
/**
 * Check if links are type safe and valid
 * @param links - Information links for error
 */
function _typeSafeLinks(links?: { [x: string]: string }): boolean {
  if (typeof links === 'object') {
    let check = true;
    Object.keys(links).forEach(key => {
      if (typeof links[key] !== 'string') {
        check = false;
      }
    });
    return check;
  } else if (links === undefined) {
    return true;
  } else {
    return false;
  }
}
/**
 * Check if source are type safe and valid
 * @param source - Source of error
 */
function _typeSafeSource(source?: APIResource): boolean {
  if (source !== undefined) {
    return typeof source.pointer === 'string';
  } else {
    return true;
  }
}

/**
 * Improved error handling in REST-API interfaces
 *
 *
 * Boom helps us with error responses (HTTP Codes 3XX-5XX) within our REST-API interface by
 * providing us with some tools:
 * - Helpers for the rapid generation of standard responses.
 * - Association of errors and their causes in a hierarchical way.
 * - Adaptation of validation errors of the Joi library.
 *
 * In addition, in combination with the Multi error types, errors in validation processes, and
 * Crash, standard application errors, it allows a complete management of the different types of
 * errors in our backend.
 * @category Boom
 * @public
 */
export class Boom extends Base {
  /** Boom error cause */
  protected _cause?: Cause;
  /** Boom error code */
  private readonly _code: number;
  /** Links that leads to further details about this particular occurrence of the problem */
  private readonly _links?: {
    [x: string]: string;
  };
  /** An object containing references to the source of the error */
  private readonly _source?: APIResource;
  /** Boom error */
  private readonly _isBoom = true;
  /**
   * Create a new Boom error
   * @param message - human friendly error message
   * @param uuid - unique identifier for this particular occurrence of the problem
   * @param code - HTTP Standard error code
   * @param options - enhanced error options
   */
  constructor(message: string, uuid: string, code = 500, options?: BoomOptions) {
    super(message, uuid, {
      name: options?.cause?.name || 'HTTP',
      info: options?.info,
    });
    // *****************************************************************************************
    // #region code type safe
    if (typeof code !== 'number') {
      throw new Crash('Code must be a number', uuid);
    }
    this._code = code;
    // #endregion
    // *****************************************************************************************
    // #region options type safe
    this._cause = _typeSafeCause(uuid, options?.cause);
    // #endregion
    if (!_typeSafeLinks(options?.links) || !_typeSafeSource(options?.source)) {
      throw new Crash('Links and source must be strings', uuid);
    }
    this._links = options?.links;
    this._source = options?.source;
    if (this.name === 'BaseError') {
      this.name = 'HTTPError';
    }
  }
  /** Return APIError in JSON format */
  toJSON(): APIError {
    return {
      uuid: this._uuid,
      links: this._links,
      status: this._code,
      code: this.name,
      title: CODES.get(this._code) || 'Undefined error',
      detail: this.message,
      source: this._source,
      meta: this._info,
    };
  }
  /** Boom error code */
  get status(): number {
    return this._code;
  }
  /**
   * Links that leads to further details about this particular occurrence of the problem.
   * A link MUST be represented as either:
   *  - self: a string containing the link’s URL
   *  - related: an object (“link object”) which can contain the following members:
   *    - href: a string containing the link’s URL.
   *    - meta: a meta object containing non-standard meta-information about the link.
   */
  get links():
    | {
        [x: string]: string;
      }
    | undefined {
    return this._links;
  }
  /**
   * Object with the key information of the requested resource in the REST API context
   * @deprecated - `source` has been deprecated, use resource instead
   */
  get source(): APIResource | undefined {
    return this.resource;
  }
  /** Object with the key information of the requested resource in the REST API context */
  get resource(): APIResource | undefined {
    return this._source;
  }
  /** Boom error */
  get isBoom(): boolean {
    return this._isBoom;
  }
  /** Cause source of error */
  get cause(): Cause | undefined {
    return this._cause;
  }
  /**
   * Transform joi Validation error in a Boom error
   * @param error - `ValidationError` from a Joi validation process
   * @param uuid - unique identifier for this particular occurrence of the problem
   */
  Boomify(error: ValidationError): void {
    if (error.name === 'ValidationError') {
      if (error.details.length > 1) {
        this._cause = new Multi(error.message, this._uuid, { name: 'ValidationError' });
        (this._cause as Multi).Multify(error);
      } else {
        this._cause = new Crash(error.message, this._uuid, {
          name: 'ValidationError',
          info: error.details[0],
        });
      }
    }
  }
}
