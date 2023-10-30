export interface TableHeader<T> {
  name: string;
  sorting: boolean;
  key: keyof T;
  sortBy: 'asc' | 'desc' | '';
}
