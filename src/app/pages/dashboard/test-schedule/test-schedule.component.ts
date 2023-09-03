import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardHeaderComponent } from 'src/app/layout/dashboard-header/dashboard-header.component';
import { Router, RouterModule } from '@angular/router';
import { HelperService } from 'src/app/core/services/helper';

@Component({
  selector: 'org-test-schedule',
  standalone: true,
  imports: [CommonModule, DashboardHeaderComponent, RouterModule],
  templateUrl: './test-schedule.component.html',
  styleUrls: ['./test-schedule.component.scss'],
})
export class TestScheduleComponent {
  constructor(private router: Router, private helper: HelperService) {
    const userDetail = this.helper.getUserDetails();
    if (userDetail && userDetail.stream) {
      this.isStreamJee = userDetail?.stream === 'JEE' ?? false;
    }
  }

  isStreamJee = false as boolean;
  redirectToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
