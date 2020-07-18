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
type Cause = Crash | Error;
export interface CrashOptions extends BaseOptions {
    cause?: Cause;
}
export interface CrashObject {
    name: string;
    message: string;
    uuid: string;
    trace: string[];
}
/** Class Crash, manages errors in Netin Systems */
export class Crash extends Base {
    /** Crash error cause */
    protected _cause?: Cause;
    /** Crash error */
    private readonly _isCrash = true;
    /**
     * Create a new Crash error
     * @param message - error text message
     * @param uuid - unique identifier for this particular occurrence of the problem
     * @param options - enhanced error options
     */
    constructor(message: string, uuid: string, options?: CrashOptions) {
        super(message, uuid, options);
        // *****************************************************************************************
        // #region options type safe
        if (options?.cause) {
            if (options.cause instanceof Crash || options.cause instanceof Error) {
                this._cause = options.cause;
            } else {
                throw new Crash('Parameter cause must be an Error/Crash', uuid);
            }
        }
        // #endregion
        if (this.name === 'BaseError') {
            this.name = 'CrashError';
        }
    }
    /** Crash error */
    get isCrash(): boolean {
        return this._isCrash;
    }
    /** Source error */
    get cause(): Cause | undefined {
        return this._cause;
    }
    /** Get a trace of this sequence of errors */
    public trace(): string[] {
        const trace: string[] = [];
        let cause = this._cause;
        while (cause) {
            if (cause instanceof Crash) {
                trace.push(`caused by: ${cause.toString()}`);
                cause = cause._cause;
            } else {
                trace.push(`caused by: ${cause.name}: ${cause.message}`);
                cause = undefined;
            }
        }
        trace.unshift(this.toString());
        return trace;
    }
    /** Look in the nested causes of the error and return the first occurrence */
    public findCauseByName(name: string): Cause | undefined {
        let cause = this._cause;
        while (cause) {
            if (cause.name === name) {
                return cause;
            } else if (cause instanceof Crash) {
                cause = cause.cause;
            } else {
                return undefined;
            }
        }
        return undefined;
    }
    /** Check if the cause is present in the nested chain of errors */
    public hasCauseWithName(name: string): boolean {
        return this.findCauseByName(name) !== undefined;
    }
    /** Return a complete full stack of the error */
    public fullStack(): string | undefined {
        if (this._cause instanceof Crash) {
            return `${this.stack}\ncaused by: ${this._cause.fullStack()}`;
        } else if (this._cause instanceof Error) {
            return `${this.stack}\ncaused by: ${this._cause.stack}`;
        }
        return this.stack;
    }
    /** Return a JSON object */
    public toJSON(): CrashObject {
        return {
            name: this.name,
            message: this.message,
            uuid: this._uuid,
            trace: this.trace(),
        };
    }
}
