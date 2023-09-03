import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardHeaderComponent } from 'src/app/layout/dashboard-header/dashboard-header.component';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from 'src/app/core/services/api.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { CONSTANTS } from 'src/app/core/constant/constant';

@Component({
  selector: 'org-dashboard',
  standalone: true,
  imports: [CommonModule, DashboardHeaderComponent, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  constructor(private router: Router, private apiService: ApiService, private alertService: AlertService) { }
  data: any = [];
  loading = false as boolean;
  ngOnInit(): void {
    this.getDashboardDetails();
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

  redirectToInstruction(testId: string) {
    this.router.navigate(['/instructions/' + testId]);
  }

  redirectToScheduled() {
    this.router.navigate(['/test-schedule']);
  }
}
