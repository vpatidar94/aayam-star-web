import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardHeaderComponent } from 'src/app/layout/dashboard-header/dashboard-header.component';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from 'src/app/core/services/api.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { CONSTANTS } from 'src/app/core/constant/constant';
import { HelperService } from 'src/app/core/services/helper';

@Component({
  selector: 'org-dashboard',
  standalone: true,
  imports: [CommonModule, DashboardHeaderComponent, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  constructor(private router: Router, private apiService: ApiService, private alertService: AlertService, private helperService: HelperService) { }
  data: any = [];
  scoreReferral = {
    testsPoints: 0,
    userReferralPoints: 0,
    tests: [] as any
  }
  loading = false as boolean;
  scoreLoading = false as boolean;

  isExpandedPoints = false as boolean;

  ngOnInit(): void {
    this.getDashboardDetails();
    this.getScorePoints();
  }

  getDashboardDetails() {
    this.loading = true;
    this.apiService
      .getDashboardDetails()
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

  getScorePoints() {
    this.scoreLoading = true;
    this.apiService
      .getAllScoreAndPoints()
      .subscribe({
        next: (res) => {
          if (res?.tests.length > 0) {
            this.scoreReferral.tests = res?.tests as any;
            const noOfTests = this.scoreReferral.tests.length;
            this.scoreReferral.testsPoints = res.tests.reduce((previousVal: any, currentVal: any) => {
              return (previousVal.points ?? 0) + (currentVal.points ?? 0);
            });
          }
          this.scoreReferral.userReferralPoints = res?.userReferralPoints;
          this.scoreLoading = false;
        },
        error: (err) => {
          this.alertService.error(err.message);
          this.scoreLoading = false;
        }
      });
  }

  redirectToInstruction(testId: string) {
    this.router.navigate(['/instructions/' + testId]);
  }

  redirectToScheduled() {
    this.router.navigate(['/test-schedule']);
  }

  copyToClipboard() {
    const user = this.helperService.getUserDetails();
    const text = `Register to Aayam Star, ${window.location.origin}/login?referredBy=${user._id}`
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        this.alertService.success('Referral link is copy to clipboard. Share with your friends.');
      }, (error) => {
        console.log(error)
      });
    } else {
      this.alertService.error('Browser do not support Clipboard API');
    }
  }

}
