import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ContentHeaderComponent } from "src/app/shared/content-header/content-header.component";
import { ApiService } from "src/app/core/services/api.service";
import { AlertService } from "src/app/core/services/alert.service";
import { CONSTANTS, UserTypeEnum } from "src/app/core/constant/constant";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { HelperService } from "src/app/core/services/helper";
import { TableHeader } from "src/app/models/table.model";
import { AyDataTableComponent } from "src/app/shared/ay-data-table/ay-data-table.component";
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: "org-tests",
  standalone: true,
  imports: [CommonModule, ContentHeaderComponent, RouterModule, FormsModule, AyDataTableComponent],
  templateUrl: "./tests.component.html",
  styleUrls: ["./tests.component.scss"],
})
export class TestsComponent {
  constructor(private apiService: ApiService, private alertService: AlertService, private helper: HelperService, private route: ActivatedRoute) {
    this.userType = this.helper.getUserType();
    if (this.userType === UserTypeEnum.ORG_ADMIN) {
      this.searchPlaceHolder = "Search by name, stream, subject "
      this.thead = this.thead.filter((x) => x.key !== 'id');
    }

    this.route.queryParams.subscribe(params => {
      this.stream = params['stream'];
    });
  }
  stream = '' as string;
  loading = false;
  testId = '';
  btnLoading = false;
  data = [] as any;
  filteredData = [] as any;
  userData = [] as any;
  resultData = [] as any;
  userType: string = '';
  searchFilterKeys = ['id', 'name', 'stream', 'subjectName'];
  searchPlaceHolder = "Search by id, name, stream, subject ";
  selectedStream: string | null = null;
  breadcrumbs = [
    {
      path: '/admin',
      name: 'Admin'
    },
    {
      path: '',
      name: 'Tests'
    },
  ];
  thead = [
    {
      name: 'Test ID',
      sorting: true,
      key: 'id',
      sortBy: '',
    },
    {
      name: 'Name',
      sorting: true,
      key: 'title',
      sortBy: '',
    },
    {
      name: 'Stream',
      sorting: true,
      key: 'stream',
      sortBy: '',
    },
    {
      name: 'Subject',
      sorting: true,
      key: 'subjectName',
      sortBy: '',
    },
    {
      name: 'Date',
      sorting: true,
      key: 'testDate',
      sortBy: '',
    },
    {
      name: 'Action',
      sorting: true,
      key: 'totalTests',
      sortBy: '',
    },
  ] as TableHeader<any>[];

  ngOnInit(): void {
    this.getAllTestDetails('9');
  }

  changeData(e: any[]) {
    this.filteredData = e;
  }

  getAllTestDetails(stream: string | null) {
    const queryParams: any = stream;
    this.loading = true;
    this.apiService
      .getAllTests(queryParams)
      .subscribe({
        next: (res) => {
          this.data = res;
          this.filteredData = res;
          this.loading = false;
        },
        error: (err) => {
          this.alertService.error(err.message);
          this.loading = false;
        }
      });
  }

  deleteTest(testId: string) {
    const item = this.data.find((d: any) => d._id === testId);

    if (!item) {
      return;
    }

    if (confirm('Are you sure to Delete the Test?')) {
      item.btnLoading = true;
      this.apiService
        .deleteTest(testId)
        .subscribe({
          next: (res) => {
            // this.data = res;
            item.btnLoading = false;
            this.getAllTestDetails(null);
          },
          error: (err) => {
            this.alertService.error(err.message);
            item.btnLoading = false;
          }
        });
      return true;
    }
    else {
      return false;
    }
  }

  generateRank(testId: string) {
    this.btnLoading = true;
    this.apiService
      .generateRank(testId)
      .subscribe({
        next: (res) => {
          this.alertService.success(CONSTANTS.MESSAGES.GENERATED_RANK_SUCCESS);
          this.btnLoading = false;
        },
        error: (err) => {
          this.alertService.error(err.message);
          this.btnLoading = false;
        }
      });
  }



  filterByStream(stream: string | null) {
    this.selectedStream = stream;
    this.getAllTestDetails(stream)
  }
}