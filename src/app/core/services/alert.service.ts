import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';
import { AlertType } from '../constant/constant';

export interface Alert {
  message: string;
  type: AlertType;
}

@Injectable({
  providedIn: 'root'
})

export class AlertService {

  private alertSubject = new Subject<Alert>();

  getAlertObservable() {
    return this.alertSubject.asObservable();
  }

  success(message: string) {
    this.showAlert(message, 'success')
  }

  error(message: string) {
    this.showAlert(message, 'danger')
  }

  warning(message: string) {
    this.showAlert(message, 'warning')
  }

  info(message: string) {
    this.showAlert(message, 'info')
  }
  showAlert(message: string, type: AlertType = 'success') {
    const alert: Alert = { message, type };
    this.alertSubject.next(alert);
  }

  clearAlert() {
    const alert: Alert = { message: '', type: '' };
    this.alertSubject.next(alert);
  }
}

