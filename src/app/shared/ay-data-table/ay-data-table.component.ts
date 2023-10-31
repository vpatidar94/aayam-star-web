import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TableHeader } from 'src/app/models/table.model';


@Component({
  selector: "org-ay-data-table",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PaginationModule,
  ],
  templateUrl: "./ay-data-table.component.html",
  styleUrls: ["./ay-data-table.component.scss"],
})
export class AyDataTableComponent<T> implements OnInit, OnChanges {
  @Input() list: T[] = [];
  @Input() tableHeader: TableHeader<T>[] = [];
  @Input() searchFilterKeys: Array<keyof T> = [];
  @Input() searchPlaceHolder = 'Search' as string;
  @Output() updateData: EventEmitter<T[]> = new EventEmitter();

  listLoading = false as boolean;
  filteredList: T[] = [];
  searchTerm = '' as string;
  searchSubject = new Subject<string>();
  itemsPerPageOptions = [10, 20, 30, 50, 100, 10000];

  paginate = {
    itemsPerPage: 100 as number,
    currentPage: 1 as number,
    data: [] as T[],
  };

  ngOnInit() {
    this.subscribeSearch();
    this.resetFilter();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['list']?.currentValue) {
      this.resetFilter();
    }
  }

  subscribeSearch() {
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((searchTerm) => {
        this.filterListRecords(searchTerm.trim());
      });
  }

  onSearchInputChange() {
    this.searchSubject.next(this.searchTerm);
  }

  filterListRecords(searchTerm: string) {
    if (!searchTerm) {
      this.resetFilter();
    } else {
      if (this.searchFilterKeys.length > 0)
        this.filteredList = this.list.filter((record) => {
          const a = this.searchFilterKeys.some((key) => {
            return (record[key] + '')
              .toLowerCase()
              .includes(searchTerm.toLowerCase());
          });
          return a;
        });
    }
    this.resetSort();
    this.resetPaginate();
  }

  resetSort() {
    this.tableHeader.forEach((x) => {
      x.sortBy = '';
      return x;
    });
  }

  resetFilter() {
    this.searchTerm = '';
    this.filteredList = JSON.parse(JSON.stringify(this.list));
    this.resetSort();
    this.resetPaginate();
  }

  sortBy(key: keyof T, index: number) {
    if (typeof this.filteredList[0][key] === 'string') {
      if (this.tableHeader[index].sortBy === 'desc')
        this.filteredList.sort((a, b) =>
          (a[key] + '').localeCompare(b[key] + '', 'en-u-kn-true'),
        );
      else
        this.filteredList.sort((a, b) =>
          (b[key] + '').localeCompare(a[key] + '', 'en-u-kn-true'),
        );
    } else if (typeof this.filteredList[0][key] === 'number') {
      if (this.tableHeader[index].sortBy === 'desc')
        this.filteredList.sort((a, b) => +b[key] - +a[key]);
      else this.filteredList.sort((a, b) => +a[key] - +b[key]);
    }

    this.tableHeader.forEach((x, i) => {
      x.sortBy = index === i ? (x.sortBy === 'desc' ? 'asc' : 'desc') : '';
      return x;
    });
    this.filterPaginateData(this.paginate.currentPage);
  }

  /* eslint-disable  @typescript-eslint/no-explicit-any */
  pageChanged(e: any) {
    this.filterPaginateData(e.page);
  }

  filterPaginateData(pageNumber: number) {
    this.paginate.data = this.filteredList.slice(
      this.paginate.itemsPerPage * pageNumber - this.paginate.itemsPerPage,
      this.paginate.itemsPerPage * pageNumber - 1,
    );
    this.updateData.emit(this.paginate.data);
  }

  resetPaginate() {
    this.paginate.currentPage = 1;
    this.filterPaginateData(this.paginate.currentPage);
  }

  onItemsPerPageChange() {
    this.resetPaginate();
  }
}
