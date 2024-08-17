/**
 * The status is a common object for passing more details back than standard boolean.
 */
export class Status {
  //# Properties
  public Code?: number;

  public Message?: string;
  //#
}

/**
 * Check to see if a status is successful (code 0).
 *
 * @param status The status to check for success.
 * @returns If the status is successful.
 */
export function isStatusSuccess(status: Status): boolean {
  return status && status.Code === 0;
}
