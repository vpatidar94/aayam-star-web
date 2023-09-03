import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertModule } from 'ngx-bootstrap/alert';
import { Subscription } from 'rxjs';
import { Alert, AlertService } from 'src/app/core/services/alert.service';

@Component({
  selector: 'org-ay-alert',
  standalone: true,
  imports: [CommonModule, AlertModule],
  templateUrl: './ay-alert.component.html'
})

export class AyAlertComponent implements OnDestroy {
  showAlert = false;
  message = '';
  type = '';
  alertTimeout = 4000;
  private subscription!: Subscription;


  constructor(private alertService: AlertService) {
    this.subscription = this.alertService.getAlertObservable().subscribe((alert: Alert) => {
      if (alert) {
        this.showAlert = true;
        this.message = alert.message;
        this.type = alert.type;
      } else {
        this.showAlert = false;
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  closeAlert() {
    this.alertService.clearAlert();
  }

  onClosed(): void {
    this.showAlert = false;
    this.message = '';
  }
}
