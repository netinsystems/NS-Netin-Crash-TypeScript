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
import { Base, BaseOptions } from '../BaseError';
import { Crash, Cause } from '../Crash';

export interface MultiOptions extends BaseOptions {
    causes?: Array<Error | Crash> | Error | Crash;
}
export interface MultiObject {
    name: string;
    message: string;
    uuid: string;
    trace: string[];
}
export class Multi extends Base {
    /** Multi error causes */
    private _causes?: Array<Cause>;
    /** Multi error */
    private readonly _isMulti = true;
    /**
     * Create a new Multi error
     * @param message - error text message
     * @param uuid - unique identifier for this particular occurrence of the problem
     * @param options - enhanced error options
     */
    constructor(message: string, uuid: string, options?: MultiOptions) {
        super(message, uuid, options);
        // *****************************************************************************************
        // #region causes type safe
        if (options?.causes !== undefined) {
            if (options.causes instanceof Crash || options.causes instanceof Error) {
                this._causes = [options.causes];
            } else if (!Array.isArray(options.causes)) {
                throw new Crash('Options[causes] must be an array of Error/Crash', uuid);
            } else {
                options.causes.forEach(cause => {
                    if (!(cause instanceof Crash || cause instanceof Error)) {
                        throw new Crash('Options[causes] must be an array of Error/Crash', uuid);
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
    /** Multi error */
    get isMulti(): boolean {
        return this._isMulti;
    }
    /** Source errors */
    get causes(): Array<Cause> | undefined {
        return this._causes;
    }
    /** Get a trace of this sequence of errors */
    public trace(): string[] {
        const trace: string[] = [];
        this.causes?.forEach(cause => {
            if (cause instanceof Crash) {
                trace.push(...cause.trace());
            } else {
                trace.push(`${cause.name}: ${cause.message}`);
            }
        });
        return trace;
    }
    /** Look in the nested causes of the error and return the first occurrence */
    public findCauseByName(name: string): Cause | undefined {
        let foundCause: Crash | Error | undefined;
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
    /** Check if the cause is present in the nested chain of errors */
    public hasCauseWithName(name: string): boolean {
        return this.findCauseByName(name) !== undefined;
    }
    /** Return a complete full stack of the error */
    public fullStack(): string | undefined {
        let arrayStack = '';
        if (this._causes !== undefined && this._causes.length > 0) {
            arrayStack += '\ncaused by: ';
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
    /** Add a new error on the array of causes */
    public push(error: Error | Crash): void {
        if (this._causes !== undefined) {
            this._causes.push(error);
        } else {
            this._causes = [error];
        }
    }
    /** Remove a error from the array of causes */
    public pop(): Error | Crash | undefined {
        if (this._causes !== undefined) {
            return this._causes.pop();
        } else {
            return undefined;
        }
    }
    /** Return a JSON object */
    public toJSON(): MultiObject {
        return {
            name: this.name,
            message: this.message,
            uuid: this._uuid,
            trace: this.trace(),
        };
    }
}
