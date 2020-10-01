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
import { v4 as uuidV4 } from 'uuid';
const UUID_LENGTH = 36;
const MESSAGE_LENGTH = 240;
export interface BaseOptions {
  name?: string;
  info?: {
    [x: string]: any;
  };
}
// *************************************************************************************************
// #region @Hapi/Joi Validations error interfaces
export interface ValidationError extends Error {
  name: 'ValidationError';
  isJoi: boolean;
  details: ValidationErrorItem[];
  _object: any;
}
export interface ValidationErrorItem {
  message: string;
  path: Array<string | number>;
  type: string;
  context?: Context;
}
export interface Context {
  [key: string]: any;
  key?: string;
  label?: string;
  value?: any;
}
// #endregion
/** Class Base, manages errors in Netin Systems */
export class Base extends Error {
  /** Crash error extra information */
  protected _info: any;
  /** uuid error identifier */
  protected _uuid: string;
  /** Error name (type) */
  public name = 'BaseError';
  /**
   * Create a new Crash error
   * @param message - error text message
   * @param uuid - unique identifier for this particular occurrence of the problem
   * @param options - enhanced error options
   */
  constructor(message: string, uuid: string, options?: BaseOptions) {
    super(message);
    // *****************************************************************************************
    // #region uuid type safe
    if (typeof uuid !== 'string' || uuid.length !== UUID_LENGTH) {
      throw new Base('uuid parameter must be an string and RFC 4122 based', uuidV4());
    } else {
      this._uuid = uuid;
    }
    // #endregion
    // *****************************************************************************************
    // #region message type safe
    if (typeof message !== 'string') {
      throw new Base('Message parameter must be an Error or string', uuid);
    }
    if (message.length > MESSAGE_LENGTH) {
      message = `${message.substring(0, MESSAGE_LENGTH - 18)} ...too long error`;
    }
    this.message = message;
    // #endregion
    // *****************************************************************************************
    // #region options type safe
    if (options?.name) {
      if (typeof options.name !== 'string') {
        throw new Base('Option Parameter name must a string', uuid);
      } else {
        this.name = options.name;
      }
    }
    this._info = options?.info;
    // #endregion
    Error.captureStackTrace(this, this.constructor);
  }
  /** Extra info of this error */
  get info(): Record<string, unknown> | undefined {
    return this._info;
  }
  /** uuid error identifier */
  get uuid(): string | undefined {
    return this._uuid;
  }
  /** Error */
  public toString(): string {
    return `${this.name}: ${this.message}`;
  }
}
