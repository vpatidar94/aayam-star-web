import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ContentHeaderComponent } from "src/app/shared/content-header/content-header.component";
import { ApiService } from "src/app/core/services/api.service";
import { AlertService } from "src/app/core/services/alert.service";
import { CONSTANTS } from "src/app/core/constant/constant";
import { RouterModule } from "@angular/router";

@Component({
  selector: "org-tests",
  standalone: true,
  imports: [CommonModule, ContentHeaderComponent, RouterModule],
  templateUrl: "./tests.component.html",
  styleUrls: ["./tests.component.scss"],
})
export class TestsComponent {
  constructor(private apiService: ApiService, private alertService: AlertService) { }
  loading = false;
  btnLoading = false;
  data = [] as any;
  breadcrumbs = [
    // {
    //   name: 'Tests',
    //   path: '/tests'
    // }
  ];

  ngOnInit(): void {
    this.getAllTestDetails();
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
