import { IDataProvider } from './IDataProvider.ts';

export class DataProvider<T> implements IDataProvider<T> {
  // Implement the CRUD operations and querying methods based on the chosen storage layer
  // For example, if using DenoKV, use its API to perform the operations

  create(data: T): Promise<T> {
    // Implementation goes here
  }

  read(id: string): Promise<T | null> {
    // Implementation goes here
  }

  update(id: string, data: Partial<T>): Promise<T | null> {
    // Implementation goes here
  }

  delete(id: string): Promise<boolean> {
    // Implementation goes here
  }

  query(query: any): Promise<T[]> {
    // Implementation goes here
  }
}