export class Status {
  //# Properties
  public Code?: number;

  public Message?: string;
  //#
}

export function isStatusSuccess(status: Status): boolean {
  return status && status.Code === 0;
}
