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
'use strict';
import * as HTTP from './httpCodes';
import { Crash } from '../Crash';
import { Multi } from '../Multi';
import { Base, BaseOptions, ValidationError } from '../BaseError';
type Cause = Error | Multi | Crash;
export interface BoomOptions extends BaseOptions {
  links?: {
    [x: string]: string;
  };
  source?: HTTP.APISource;
  cause?: Cause;
}
/**
 * Check if the cause are type safe and valid
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
function _typeSafeSource(source?: HTTP.APISource): boolean {
  if (source !== undefined) {
    return typeof source.pointer === 'string';
  } else {
    return true;
  }
}
/** Class Boom, manages HTTP errors in Netin Systems */
export class Boom extends Base {
  /** Boom error cause */
  protected _cause?: Cause;
  /** Boom error code */
  #code: number;
  /** Links that leads to further details about this particular occurrence of the problem */
  private readonly _links?: {
    [x: string]: string;
  };
  /** An object containing references to the source of the error */
  private readonly _source?: HTTP.APISource;
  /** Boom error */
  private readonly _isBoom = true;
  /**
   * Create a new Boom error
   * @param uuid - UUID V4, unique identifier for this particular occurrence of the problem
   * @param code - HTTP Standard error code
   * @param detail - Human-readable explanation specific to this occurrence of the problem
   * @param options - Specific options for enhanced error management
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
    this.#code = code;
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
  /** Return a JSON object with the key information of the main error */
  toJSON(): HTTP.APIError {
    return {
      uuid: this._uuid,
      links: this._links,
      status: this.#code,
      code: this.name,
      title: HTTP.CODES.get(this.#code) || 'Undefined error',
      detail: this.message,
      source: this._source,
      meta: this._info,
    };
  }
  /** Boom error code */
  get status(): number {
    return this.#code;
  }
  /** Links that leads to further details about this particular occurrence of the problem */
  get links():
    | {
        [x: string]: string;
      }
    | undefined {
    return this._links;
  }
  get source(): HTTP.APISource | undefined {
    return this._source;
  }
  /** Boom error */
  get isBoom(): boolean {
    return this._isBoom;
  }
  /** Source error */
  get cause(): Cause | undefined {
    return this._cause;
  }
  /**
   * Transform \joi Validation error in a Boom error
   * @param error - \joi Validation error
   * @param uuid - UUID V4, unique identifier for this particular occurrence of the problem
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
