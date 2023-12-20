import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthHeaderComponent } from 'src/app/layout/auth-header/auth-header.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { VALIDATE } from 'src/app/core/constant/validate';
import { FieldValidationMessageComponent } from 'src/app/shared/field-validation-message/field-validation-message.component';
import { ApiService } from 'src/app/core/services/api.service';
import { HelperService } from 'src/app/core/services/helper';
import { CONSTANTS } from 'src/app/core/constant/constant';
import { AlertService } from 'src/app/core/services/alert.service';

@Component({
  selector: 'org-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FieldValidationMessageComponent, AuthHeaderComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(private alertService: AlertService, private apiService: ApiService, private helperService: HelperService, private router: Router, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.referredBy = params['referredBy'];
    });
  }
  tForm!: FormGroup;
  loading = false;
  referredBy = '' as string;
  ngOnInit(): void {
    this.tForm = new FormGroup({
      mobile_no: new FormControl(null, [
        Validators.required,
        Validators.minLength(VALIDATE.MOBILE_NO_MAX_LENGTH),
        Validators.pattern('[0-9]{10}')
      ]),
    });
  }

  onSubmit() {
    if (this.tForm.invalid) {
      this.tForm.markAllAsTouched();
    } else {
      this.loading = true;
      const newOtp = this.helperService.generateOtp();
      const mobileNo = '91' + this.tForm.value.mobile_no;
      this.apiService
        // .sendOtp( mobileNo, newOtp)  // uncomment if want to send otp by whatsapp
        .sendSmsOtp( mobileNo, newOtp)  // if want to send otp by text sms
        .subscribe({
          next: () => {
            this.helperService.setUserContactDetails(this.tForm.value.mobile_no);
            this.router.navigate(['/verify'], { queryParams: { referredBy: this.referredBy } });
            this.alertService.success(CONSTANTS.MESSAGES.SMS_OTP_SENT);
            this.loading = false;
          },
          error: () => {
            // this.helperService.setUserContactDetails(this.tForm.value.mobile_no);
            // this.router.navigate(['/verify']);
            this.alertService.error(CONSTANTS.MESSAGES.ERROR_SENDING_MESSAGE);
            this.loading = false;
          }
        });
    }
  }
}
