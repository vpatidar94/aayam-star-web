import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ApiService } from "src/app/core/services/api.service";
import { AlertService } from "src/app/core/services/alert.service";
import { ContentHeaderComponent } from "src/app/shared/content-header/content-header.component";
import { ActivatedRoute } from "@angular/router";
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { CONSTANTS } from "src/app/core/constant/constant";
import { HelperService } from "src/app/core/services/helper";

@Component({
  selector: "org-test-result",
  standalone: true,
  imports: [CommonModule, ContentHeaderComponent, AccordionModule],
  templateUrl: "./test-result.component.html",
  styleUrls: ["./test-result.component.scss"],
})
export class TestResultComponent {
  constructor(private route: ActivatedRoute, private apiService: ApiService, private alertService: AlertService, private helper: HelperService) {
    this.route.params.subscribe(params => {
      this.testId = params['testId'];
    });

    this.userType = this.helper.getUserType();
  }

  loading = false;
  data = [] as any;
  testId = '';
  isRankGenerated = false as boolean;
  testDetail = null as any;
  breadcrumbs = [
    {
      name: 'Tests',
      path: '/admin'
    }
  ];
  btnLoading = false as boolean;
  isAccordianOpen = true;
  userType: string = '';
  ngOnInit(): void {
    this.getTestDetail();
    this.getAllResults();
  }

  getTestDetail() {
    this.apiService
      .getTestDetails(this.testId)
      .subscribe({
        next: (res) => {
          this.testDetail = res;
          this.breadcrumbs.push({
            name: res.title,
            path: ''
          })
        },
        error: (err) => {
          this.alertService.error(err.message);
        }
      });
  }

  getAllResults() {
    this.loading = true;
    this.apiService
      .getResultByTest(this.testId)
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

  showTimeInMMSS(sec: number) {
    return new Date(sec * 1000).toISOString().slice(14, 19);
  }

  sendWpMessages() {
    this.btnLoading = true;
    const payload = {
      title: this.testDetail.title,
      testId: this.testId,
    }

    this.apiService
      .sendWpMessage(payload)
      .subscribe({
        next: (res) => {
          this.alertService.success("Message send succesfully.");
          this.btnLoading = false;
        },
        error: (err) => {
          this.alertService.error(err.message);
          this.btnLoading = false;
        }
      });
  }

  generateRank() {
    this.btnLoading = true;
    this.apiService
      .generateRank(this.testId)
      .subscribe({
        next: (res) => {
          this.alertService.success(CONSTANTS.MESSAGES.GENERATED_RANK_SUCCESS);
          this.btnLoading = false;
          this.isRankGenerated = true;
        },
        error: (err) => {
          this.alertService.error(err.message);
          this.btnLoading = false;
        }
      });
  }
}
