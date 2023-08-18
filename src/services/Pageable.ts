export class Pageable<T> {
  Items: T[];
  TotalRecords: number;

  constructor() {
    this.Items = [];
    this.TotalRecords = 0;
  }
}
