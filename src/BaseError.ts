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
import { v4, validate } from 'uuid';
const MESSAGE_LENGTH = 240;
export interface BaseOptions {
  name?: string;
  info?: {
    [x: string]: any;
  };
}
/** Class Base, manages errors in Netin Systems */
export class Base extends Error {
  /** Crash error extra information */
  protected _info: any;
  /** uuid error identifier */
  protected _uuid: string;
  /** Error name (type) */
  public name = 'BaseError';
  /**
   * Create a new Base error
   * @param message - human friendly error message
   * @param uuid - unique identifier for this particular occurrence of the problem
   * @param options - enhanced error options
   */
  constructor(message: string, uuid?: string | BaseOptions, options?: BaseOptions) {
    super(message);
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
    // #region type safe
    if (typeof uuid === 'string' && validate(uuid)) {
      this._uuid = uuid;
    } else if (typeof uuid === 'object' && !Array.isArray(uuid)) {
      this._uuid = v4();
      options = uuid;
    } else if (typeof uuid === 'undefined') {
      this._uuid = v4();
    } else {
      throw new Base('uuid parameter must be an string and RFC 4122 based', v4());
    }
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
  /** Return the info object for this error */
  get info(): Record<string, unknown> | undefined {
    return this._info;
  }
  /** Return the unique identifier associated to this instance */
  get uuid(): string {
    return this._uuid;
  }
  /** Return a string formatted as `name:message` */
  public toString(): string {
    return `${this.name}: ${this.message}`;
  }
}
