/**
 * The status is a common object for passing more details back than standard boolean.
 *
 * @example From common import
 * ```typescript
 * import { Status } from '@fathym/common';
 *
 * const status: Status = { Code: 0, Message: 'Success};
 * ```
 */
export type Status = {
  //# Properties
  /** The status code. 0 for success, any other number to represent other stati. */
  Code?: number;

  /** The message of the status. */
  Message?: string;
  //#
};

/**
 * Check to see if a status is successful (code 0).
 *
 * @param status The status to check for success.
 * @returns If the status is successful.
 */
export function isStatusSuccess(status: Status): boolean {
  return status && status.Code === 0;
}
