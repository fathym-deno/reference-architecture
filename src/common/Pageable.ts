/**
 * Basic structure for pageable results.
 */
export class Pageable<T> {
  /** The items for the current paged result. */
  public Items: T[];

  /** The total number of records across all pages. */
  public TotalRecords: number;

  constructor() {
    this.Items = [];
    this.TotalRecords = 0;
  }
}
