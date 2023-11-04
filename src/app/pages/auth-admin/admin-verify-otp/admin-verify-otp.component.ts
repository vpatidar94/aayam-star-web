// NEWLY ADDED BY JITENDRA
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthHeaderComponent } from 'src/app/layout/auth-header/auth-header.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HelperService } from 'src/app/core/services/helper';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CONSTANTS } from 'src/app/core/constant/constant';
import { ApiService } from 'src/app/core/services/api.service';
import { AlertService } from 'src/app/core/services/alert.service';

@Component({
  selector: 'org-admin-verify-otp',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, AuthHeaderComponent],
  templateUrl: './admin-verify-otp.component.html',
  styleUrls: ['./admin-verify-otp.component.scss'],
})
export class AdminVerifyOtpComponent implements OnInit {

  constructor(private alertService: AlertService, private helperService: HelperService, private apiService: ApiService, private router: Router, private route: ActivatedRoute) {
    // this.helperService.isOtpAvailable(),
    this.route.params.subscribe(params => {
      this.mobileNo = params['mobileNo'];
      this.orgCode = params['orgCode']
    });

    this.route.queryParams.subscribe(params => {
      const otp = params['validate'];
      if(otp && decodeURI(otp))
        this.helperService.setOtp(decodeURI(otp));
      else {
        this.alertService.error('Incorrect url. Please check the url again.')
      }
    });
  }
  tForm!: FormGroup;
  errorMessage = "";
  loading = false;
  mobileNo = '' as string;
  orgCode = '' as string;
  ngOnInit(): void {
    this.tForm = new FormGroup({
      otp_1: new FormControl(null, [
        Validators.required,
        Validators.pattern('[0-9]{1}'),
      ]),
      otp_2: new FormControl(null, [
        Validators.required,
        Validators.pattern('[0-9]{1}'),
      ]),
      otp_3: new FormControl(null, [
        Validators.required,
        Validators.pattern('[0-9]{1}'),
      ]),
      otp_4: new FormControl(null, [
        Validators.required,
        Validators.pattern('[0-9]{1}'),
      ]),
    });

    // if (!sessionStorage.getItem('otp')) {
    //   this.resendOtp();
    // }
  }

  onDigitInput(event: any) {
    let element;
    if (event.code !== 'Backspace')
      element = event.srcElement.nextElementSibling;

    if (event.code === 'Backspace')
      element = event.srcElement.previousElementSibling;

    if (element == null)
      return;
    else
      element.focus();
  }

  onSubmit() {
    if (this.tForm.invalid) {
      this.tForm.markAllAsTouched();
    }
    else {
      const otpObj = this.tForm.value
      const newOtpVal = otpObj.otp_1 + otpObj.otp_2 + otpObj.otp_3 + otpObj.otp_4
      this.loading = true
      const user = this.helperService.getUserDetails();
      if (user && this.helperService.matchOtp(newOtpVal)) {
        // otp verified, now send perform login/signup api call
        this.apiService
          .addOrgAdminUser(
            this.mobileNo, this.orgCode
          ).subscribe({
            next: (res) => {
              this.helperService.updateUserDetails(res.user);
              this.router.navigate(['/admin-details']);
              this.alertService.success(CONSTANTS.MESSAGES.SIGNUP_SUCCESS);
            },
            error: (err) => {
              this.alertService.error(err.error.error)
              this.loading = false;
              if (err.error.code === 403)
                this.router.navigate(['/login']);
            }
          })
      }
      else {
        this.errorMessage = CONSTANTS.MESSAGES.INVALID_OTP;
        this.alertService.error(CONSTANTS.MESSAGES.INVALID_OTP);
      }
      this.loading = false;
    }
  }

  //Resend OTP
  resendOtp() {
    const newOtp = this.helperService.generateOtp();

    if (this.mobileNo) {
      this.apiService.sendOtp('91' + this.mobileNo, newOtp)
        .subscribe(() => {
          this.helperService.setUserContactDetails(this.mobileNo)
          this.alertService.success(CONSTANTS.MESSAGES.OTP_SENT)
          this.loading = false;
        }, err => {
          this.helperService.setUserContactDetails(this.mobileNo)
          this.alertService.success(CONSTANTS.MESSAGES.OTP_SENT)
          this.loading = false;
        })
    }
  }
}
