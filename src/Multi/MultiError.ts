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
import type { ValidationError } from '../JoiTypes';
import { Base, BaseOptions } from '../BaseError';
import { Crash } from '../Crash';
import { Cause } from '..';

/**
 * Multi error configuration options
 * @category Multi
 * @public
 */
export interface MultiOptions extends BaseOptions {
  /** Errors that caused the creation of this instance */
  causes?: Array<Error | Crash> | Error | Crash;
}
/**
 * Multi error object output
 * @category Multi
 * @public
 */
export interface MultiObject {
  name: string;
  message: string;
  uuid: string;
  trace: string[];
}

/**
 * Improved handling of validation errors.
 *
 * Multi helps us to manage validation or information transformation errors, in other words, it
 * helps us manage any process that may generate multiple non-hierarchical errors (an error is not a
 * direct consequence of the previous one) by providing us with some tools:
 * - Management of the error stack.
 * - Simple search for root causes within the error stack.
 * - Stack management, both of the current instance of the error, and of the causes.
 * - Facilitate error logging.
 *
 * Furthermore, in combination with the types of error Boom, errors for the REST-API interfaces, and
 * Crash, standard application errors, it allows a complete management of the different types of
 * errors in our backend.
 * @category Multi
 * @public
 */
export class Multi extends Base {
  /** Multi error causes */
  private _causes?: Cause[];
  /** Multi error */
  private readonly _isMulti = true;
  /**
   * Create a new Multi error
   * @param message - human friendly error message
   */
  constructor(message: string);
  /**
   * Create a new Multi error
   * @param message - human friendly error message
   * @param options - enhanced error options
   */
  constructor(message: string, options: MultiOptions);
  /**
   * Create a new Multi error
   * @param message - human friendly error message
   * @param uuid - unique identifier for this particular occurrence of the problem
   */
  constructor(message: string, uuid: string);
  /**
   * Create a new Multi error
   * @param message - human friendly error message
   * @param uuid - unique identifier for this particular occurrence of the problem
   * @param options - enhanced error options
   */
  constructor(message: string, uuid: string, options: MultiOptions);
  constructor(message: string, uuid?: string | MultiOptions, options?: MultiOptions) {
    super(message, uuid, options);
    // *****************************************************************************************
    // #region causes type safe
    if (options?.causes !== undefined) {
      if (options.causes instanceof Crash || options.causes instanceof Error) {
        this._causes = [options.causes];
      } else if (!Array.isArray(options.causes)) {
        throw new Base('Options[causes] must be an array of Error/Crash', uuid);
      } else {
        options.causes.forEach(cause => {
          if (!(cause instanceof Crash || cause instanceof Error)) {
            throw new Base('Options[causes] must be an array of Error/Crash', uuid);
          }
        });
        this._causes = options.causes;
      }
    }
    // #endregion
    if (this.name === 'BaseError') {
      this.name = 'MultiError';
    }
  }
  /** Determine if this instance is a Multi error */
  get isMulti(): boolean {
    return this._isMulti;
  }
  /** Causes source of error */
  get causes(): Array<Cause> | undefined {
    return this._causes;
  }
  /** Return the number of causes of this error */
  get size(): number {
    if (this._causes) {
      return this._causes.length;
    } else {
      return 0;
    }
  }
  /** Get the trace of this hierarchy of errors */
  public trace(): string[] {
    const trace: string[] = [];
    if (this.causes) {
      this.causes.forEach(cause => {
        if (cause instanceof Crash) {
          trace.push(...cause.trace());
        } else {
          trace.push(`${cause.name}: ${cause.message}`);
        }
      });
    }
    return trace;
  }
  /**
   * Look in the nested causes of the error and return the first occurrence of a cause with the
   * indicated name
   * @param name - name of the error to search for
   * @returns the cause, if there is any present with that name
   */
  public findCauseByName(name: string): Cause | undefined {
    let foundCause: Cause | undefined;
    if (this._causes !== undefined) {
      this._causes.forEach(cause => {
        if (cause.name === name && foundCause === undefined) {
          foundCause = cause;
        }
        if (cause instanceof Crash && foundCause === undefined) {
          foundCause = cause.findCauseByName(name);
        }
      });
    }
    return foundCause;
  }
  /**
   * Check if there is any cause in the stack with the indicated name
   * @param name - name of the error to search for
   * @returns Boolean value as the result of the search
   */
  public hasCauseWithName(name: string): boolean {
    return this.findCauseByName(name) !== undefined;
  }
  /**
   * Returns a full stack of the error and causes hierarchically. The string contains the
   * description of the point in the code at which the Error/Crash/Multi was instantiated
   */
  public fullStack(): string | undefined {
    let arrayStack = '';
    if (this._causes !== undefined && this._causes.length > 0) {
      arrayStack += '\ncaused by ';
      this._causes.forEach(cause => {
        if (cause instanceof Crash) {
          arrayStack += `\n[${cause.fullStack()}]`;
        } else if (cause instanceof Error) {
          arrayStack += `\n[${cause.stack}]`;
        }
      });
    }
    return this.stack + arrayStack;
  }
  /**
   * Add a new error on the array of causes
   * @param error - Cause to be added to the array of causes
   */
  public push(error: Cause): void {
    if (this._causes !== undefined) {
      this._causes.push(error);
    } else {
      this._causes = [error];
    }
  }
  /**
   * Remove a error from the array of causes
   * @returns the cause that have been removed
   */
  public pop(): Cause | undefined {
    if (this._causes !== undefined) {
      return this._causes.pop();
    } else {
      return undefined;
    }
  }
  /** Return Multi error in JSON format */
  public toJSON(): MultiObject {
    return {
      name: this.name,
      message: this.message,
      uuid: this._uuid,
      trace: this.trace(),
    };
  }
  /**
   * Process the errors thrown by Joi into the cause array
   * @param error - `ValidationError` from a Joi validation process
   * @returns number or error that have been introduced
   */
  public Multify(error: ValidationError): number {
    if (error.name === 'ValidationError') {
      error.details.forEach(detail => {
        this.push(
          new Crash(detail.message, this._uuid, {
            name: 'ValidationError',
            info: detail,
          })
        );
      });
      return error.details.length;
    } else {
      return 0;
    }
  }
}
