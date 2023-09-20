import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ApiService } from "src/app/core/services/api.service";
import { AlertService } from "src/app/core/services/alert.service";
import { ContentHeaderComponent } from "src/app/shared/content-header/content-header.component";
import { ActivatedRoute } from "@angular/router";
import { AccordionModule } from 'ngx-bootstrap/accordion';

@Component({
  selector: "org-test-result",
  standalone: true,
  imports: [CommonModule, ContentHeaderComponent, AccordionModule],
  templateUrl: "./test-result.component.html",
  styleUrls: ["./test-result.component.scss"],
})
export class TestResultComponent {
  constructor(private route: ActivatedRoute, private apiService: ApiService, private alertService: AlertService) {
    this.route.params.subscribe(params => {
      this.testId = params['testId'];
    });
  }

  loading = false;
  data = [] as any;
  testId = '';
  testDetail = null as any;
  breadcrumbs = [
    {
      name: 'Tests',
      path: '/admin'
    }
  ];
  isAccordianOpen = true;
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
}
