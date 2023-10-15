import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ContentHeaderComponent } from "src/app/shared/content-header/content-header.component";
import { ApiService } from "src/app/core/services/api.service";
import { AlertService } from "src/app/core/services/alert.service";
import { CONSTANTS } from "src/app/core/constant/constant";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "org-tests",
  standalone: true,
  imports: [CommonModule, ContentHeaderComponent, RouterModule, FormsModule],
  templateUrl: "./tests.component.html",
  styleUrls: ["./tests.component.scss"],
})
export class TestsComponent {
  constructor(private apiService: ApiService, private alertService: AlertService) { }
  loading = false;
  testId = '';
  btnLoading = false;
  data = [] as any;
  userData = [] as any;
  resultData = [] as any;
  isAllTests = false as boolean;
  breadcrumbs = [
    // {
    //   name: 'Tests',
    //   path: '/tests'
    // }
  ];

  ngOnInit(): void {
    this.getAllTestDetails();
    this.getAllResultDetails();
  }

  getAllTestDetails() {
    this.loading = true;
    this.apiService
      .getAllTests()
      .subscribe({
        next: (res) => {
          this.data = res;
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
            this.data = res;
            item.btnLoading = false;
            this.getAllTestDetails();
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

  getAllResultDetails() {
    this.loading = true;
    this.apiService
      .getAllResults()
      .subscribe({
        next: (res) => {
          this.resultData = res.data;
          this.resultData.sort((a: any, b: any) => {
            const sumA = a.totalTestPoints + a.userDetails.referralPoints;
            const sumB = b.totalTestPoints + b.userDetails.referralPoints;
            // Sort in descending order
            return sumB - sumA;
          });
          this.loading = false;
        },
        error: (err) => {
          this.alertService.error(err.message);
          this.loading = false
        }
      });
  }

  getAllUsersDetails() {
    this.loading = true;
    this.apiService
      .getAllUsers()
      .subscribe({
        next: (res) => {
          this.userData = res;
          this.loading = false;
          console.log(this.data)
        },
        error: (err) => {
          this.alertService.error(err.message);
          this.loading = false;
        }
      });
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
}