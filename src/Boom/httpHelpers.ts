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
import { Boom, BoomOptions } from './BoomError';
import { HTTP_CODE } from './httpCodes';

function regularError(message: string, uuid: string, code: number, options?: BoomOptions): Boom {
    return new Boom(message, uuid, code, options);
}
// *************************************************************************************************
// #region HTTP 4xx Errors
/** The HyperText Transfer Protocol (HTTP) 400 Bad Request response status code indicates that the
 * server cannot or will not process the request due to something that is perceived to be a client
 * error (e.g., malformed request syntax, invalid request message framing, or deceptive request
 * routing).
 * The client should not repeat this request without modification.
 * @param uuid - UUID V4, unique identifier for this particular occurrence of the problem
 * @param detail - Human-readable explanation specific to this occurrence of the problem
 * @param options - Specific options for enhanced error management
 */
export const badRequest = (message: string, uuid: string, options?: BoomOptions): Boom => {
    return regularError(message, uuid, HTTP_CODE.BAD_REQUEST, options);
};
/**
 * The HTTP 401 Unauthorized client error status response code indicates that the request has not
 * been applied because it lacks valid authentication credentials for the target resource.
 * This status is sent with a WWW-Authenticate header that contains information on how to authorize
 * correctly.
 * @param uuid - UUID V4, unique identifier for this particular occurrence of the problem
 * @param detail - Human-readable explanation specific to this occurrence of the problem
 * @param options - Specific options for enhanced error management
 */
export const unauthorized = (message: string, uuid: string, options?: BoomOptions): Boom => {
    return regularError(message, uuid, HTTP_CODE.UNAUTHORIZED, options);
};
/**
 * The HTTP 402 Payment Required is a nonstandard client error status response code that is reserved
 * for future use.
 * Sometimes, this code indicates that the request can not be processed until the client makes a
 * payment. Originally it was created to enable digital cash or (micro) payment systems and would
 * indicate that the requested content is not available until the client makes a payment. However,
 * no standard use convention exists and different entities use it in different contexts.
 * @param uuid - UUID V4, unique identifier for this particular occurrence of the problem
 * @param detail - Human-readable explanation specific to this occurrence of the problem
 * @param options - Specific options for enhanced error management
 */
export const paymentRequired = (message: string, uuid: string, options?: BoomOptions): Boom => {
    return regularError(message, uuid, HTTP_CODE.PAYMENT_REQUIRED, options);
};
/**
 * The HTTP 403 Forbidden client error status response code indicates that the server understood the
 * request but refuses to authorize it.
 * This status is similar to 401, but in this case, re-authenticating will make no difference. The
 * access is permanently forbidden and tied to the application logic, such as insufficient rights to
 * a resource.
 * @param uuid - UUID V4, unique identifier for this particular occurrence of the problem
 * @param detail - Human-readable explanation specific to this occurrence of the problem
 * @param options - Specific options for enhanced error management
 */
export const forbidden = (message: string, uuid: string, options?: BoomOptions): Boom => {
    return regularError(message, uuid, HTTP_CODE.FORBIDDEN, options);
};
/**
 * The HTTP 404 Not Found client error response code indicates that the server can't find the
 * requested resource. Links which lead to a 404 page are often called broken or dead links, and can
 * be subject to link rot.
 * A 404 status code does not indicate whether the resource is temporarily or permanently missing.
 * But if a resource is permanently removed, a 410 (Gone) should be used instead of a 404 status.
 * @param uuid - UUID V4, unique identifier for this particular occurrence of the problem
 * @param detail - Human-readable explanation specific to this occurrence of the problem
 * @param options - Specific options for enhanced error management
 */
export const notFound = (message: string, uuid: string, options?: BoomOptions): Boom => {
    return regularError(message, uuid, HTTP_CODE.NOT_FOUND, options);
};
/**
 * The HyperText Transfer Protocol (HTTP) 405 Method Not Allowed response status code indicates that
 * the request method is known by the server but is not supported by the target resource. The server
 * MUST generate an Allow header field in a 405 response containing a list of the target resource's
 * currently supported methods.
 * @param uuid - UUID V4, unique identifier for this particular occurrence of the problem
 * @param detail - Human-readable explanation specific to this occurrence of the problem
 * @param options - Specific options for enhanced error management
 */
export const methodNotAllowed = (message: string, uuid: string, options?: BoomOptions): Boom => {
    return regularError(message, uuid, HTTP_CODE.METHOD_NOT_ALLOWED, options);
};
/**
 * The HyperText Transfer Protocol (HTTP) 406 Not Acceptable client error response code indicates
 * that the server cannot produce a response matching the list of acceptable values defined in the
 * request's proactive content negotiation headers, and that the server is unwilling to supply a
 * default representation.
 * In practice, this error is very rarely used. Instead of responding using this error code, which
 * would be cryptic for the end user and difficult to fix, servers ignore the relevant header and
 * serve an actual page to the user. It is assumed that even if the user won't be completely happy,
 * they will prefer this to an error code.
 * If a server returns such an error status, the body of the message should contain the list of the
 * available representations of the resources, allowing the user to choose among them.
 * @param uuid - UUID V4, unique identifier for this particular occurrence of the problem
 * @param detail - Human-readable explanation specific to this occurrence of the problem
 * @param options - Specific options for enhanced error management
 */
export const notAcceptable = (message: string, uuid: string, options?: BoomOptions): Boom => {
    return regularError(message, uuid, HTTP_CODE.NOT_ACCEPTABLE, options);
};
export const proxyAuthRequired = (message: string, uuid: string, options?: BoomOptions): Boom => {
    return regularError(message, uuid, HTTP_CODE.PROXY_AUTHENTICATION_REQUIRED, options);
};
export const requestTimeout = (message: string, uuid: string, options?: BoomOptions): Boom => {
    return regularError(message, uuid, HTTP_CODE.REQUEST_TIMEOUT, options);
};
export const conflict = (message: string, uuid: string, options?: BoomOptions): Boom => {
    return regularError(message, uuid, HTTP_CODE.CONFLICT, options);
};
export const gone = (message: string, uuid: string, options?: BoomOptions): Boom => {
    return regularError(message, uuid, HTTP_CODE.GONE, options);
};
export const lengthRequired = (message: string, uuid: string, options?: BoomOptions): Boom => {
    return regularError(message, uuid, HTTP_CODE.LENGTH_REQUIRED, options);
};
export const preconditionFailed = (message: string, uuid: string, options?: BoomOptions): Boom => {
    return regularError(message, uuid, HTTP_CODE.PRECONDITION_FAILED, options);
};
export const payloadTooLarge = (message: string, uuid: string, options?: BoomOptions): Boom => {
    return regularError(message, uuid, HTTP_CODE.PAYLOAD_TOO_LARGE, options);
};
export const uriTooLong = (message: string, uuid: string, options?: BoomOptions): Boom => {
    return regularError(message, uuid, HTTP_CODE.URI_TOO_LONG, options);
};
export const unsupportedMediaType = (
    message: string,
    uuid: string,
    options?: BoomOptions
): Boom => {
    return regularError(message, uuid, HTTP_CODE.UNSUPPORTED_MEDIA_TYPE, options);
};
export const rangeNotSatisfiable = (message: string, uuid: string, options?: BoomOptions): Boom => {
    return regularError(message, uuid, HTTP_CODE.RANGE_NOT_SATISFIABLE, options);
};
export const expectationFailed = (message: string, uuid: string, options?: BoomOptions): Boom => {
    return regularError(message, uuid, HTTP_CODE.EXPECTATION_FAILED, options);
};
export const teapot = (message: string, uuid: string, options?: BoomOptions): Boom => {
    return regularError(message, uuid, HTTP_CODE.I_AM_A_TEAPOT, options);
};
export const locked = (message: string, uuid: string, options?: BoomOptions): Boom => {
    return regularError(message, uuid, HTTP_CODE.LOCKED, options);
};
export const failedDependency = (message: string, uuid: string, options?: BoomOptions): Boom => {
    return regularError(message, uuid, HTTP_CODE.FAILED_DEPENDENCY, options);
};
export const tooEarly = (message: string, uuid: string, options?: BoomOptions): Boom => {
    return regularError(message, uuid, HTTP_CODE.TOO_EARLY, options);
};
export const preconditionRequired = (
    message: string,
    uuid: string,
    options?: BoomOptions
): Boom => {
    return regularError(message, uuid, HTTP_CODE.PRECONDITION_REQUIRED, options);
};
export const tooManyRequests = (message: string, uuid: string, options?: BoomOptions): Boom => {
    return regularError(message, uuid, HTTP_CODE.TOO_MANY_REQUESTS, options);
};
export const illegal = (message: string, uuid: string, options?: BoomOptions): Boom => {
    return regularError(message, uuid, HTTP_CODE.UNAVAILABLE_FOR_LEGAL_REASONS, options);
};
// #endregion
// *************************************************************************************************
// #region HTTP 5xx Errors
export const internalServerError = (message: string, uuid: string, options?: BoomOptions): Boom => {
    return regularError(message, uuid, HTTP_CODE.INTERNAL_SERVER_ERROR, options);
};
export const notImplemented = (message: string, uuid: string, options?: BoomOptions): Boom => {
    return regularError(message, uuid, HTTP_CODE.NOT_IMPLEMENTED, options);
};
export const badGateway = (message: string, uuid: string, options?: BoomOptions): Boom => {
    return regularError(message, uuid, HTTP_CODE.BAD_GATEWAY, options);
};
export const serverUnavailable = (message: string, uuid: string, options?: BoomOptions): Boom => {
    return regularError(message, uuid, HTTP_CODE.SERVICE_UNAVAILABLE, options);
};
export const gatewayTimeout = (message: string, uuid: string, options?: BoomOptions): Boom => {
    return regularError(message, uuid, HTTP_CODE.GATEWAY_TIMEOUT, options);
};
// #endregion
