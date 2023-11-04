import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthHeaderComponent } from 'src/app/layout/auth-header/auth-header.component';
import { ApiService } from 'src/app/core/services/api.service';
import { HelperService } from 'src/app/core/services/helper';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { FieldValidationMessageComponent } from 'src/app/shared/field-validation-message/field-validation-message.component';
import { ValidationService } from 'src/app/core/services/validation.service';
import { ClassType, StreamType, SubjectGroupType } from 'src/app/core/constant/constant';
import { AlertService } from 'src/app/core/services/alert.service';
import { DashboardHeaderComponent } from 'src/app/layout/dashboard-header/dashboard-header.component';

@Component({
  selector: 'org-enter-name',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AuthHeaderComponent, FieldValidationMessageComponent, DashboardHeaderComponent],
  templateUrl: './enter-name.component.html',
  styleUrls: ['./enter-name.component.scss'],
})
export class EnterNameComponent implements OnInit {
  constructor(private apiService: ApiService, private alertService: AlertService, private validationService: ValidationService, private helperService: HelperService, private router: Router, private route: ActivatedRoute) { }

  tForm!: FormGroup;
  loading = false;
  streamOptions = ["9", "10", "11", "12", "DROPPER"] as Array<ClassType>;
  subjectOptions = ["PCB", "PCM"] as Array<SubjectGroupType>;
  isUpdateProfile = false;

  ngOnInit(): void {
    this.tForm = new FormGroup({
      name: new FormControl(null, [
        Validators.required,
        this.validationService.noWhiteSpaceValidator as ValidatorFn
      ]),
      stream: new FormControl(null, [
        Validators.required,
      ]),
      subject: new FormControl(null),
      orgCode: new FormControl(null, [
        // Validators.required,
        // this.validationService.noWhiteSpaceValidator as ValidatorFn
      ]),
    });

    this.isUpdateProfile = window.location.pathname.match('update-user-details') ? true : false;
    console.log('dddd', this.isUpdateProfile, window.location.pathname);
    if (this.isUpdateProfile) {
      this.getUserDetails();
    }
    // Check if in edit mode
    // this.route.params.subscribe(params => {
    //   const userId = params['userId'];
    //   if (userId) {
    //     this.isUpdateProfile = true;
    //     // Fetch user details for editing
    //     this.getUserDetails(userId);
    //   }
    // });
  }

  changeStream() {
    const stream = this.tForm.get('stream')?.value;
    if (stream === '11' || stream === '12' || stream === 'DROPPER') {
      this.tForm.get('subject')?.addValidators(Validators.required);
    } else {
      this.tForm.get('subject')?.clearValidators();
    }
    this.tForm.get('subject')?.updateValueAndValidity();
  }

  getUserDetails() {
    this.apiService.getUserById().subscribe(
      (user) => {
        if (user.code === 409) {
          this.router.navigate(['/dashboard']);
          this.alertService.error(
            'user details already updated'
          );
        }
        else {
          this.tForm.patchValue({
            name: user.data.name,
            orgCode: user.data.orgCode,
          });
          const streamFromDatabase = user.data.stream;
          if (streamFromDatabase) {
            const [classType, subjectGroup] = streamFromDatabase.split('-');
            this.tForm.patchValue({
              stream: classType,
              subject: subjectGroup,
            });
          }
          if (!!user.data.orgCode) {
            this.tForm.controls['orgCode'].disable();
          }
        }
      },
      (error) => {
        console.error("Error fetching user details", error);
      }
    );
  }

  onSubmit() {
    if (this.tForm.invalid) {
      this.tForm.markAllAsTouched();
    } else {
      this.loading = true;
      const tVal = this.tForm.value;
      let streamVal = tVal.stream;
      if (tVal.stream === '11' || tVal.stream === '12' || tVal.stream === 'DROPPER')
        streamVal = tVal.stream + '-' + tVal.subject;
      this.apiService
        .updateName(
          { name: this.tForm.value.name, stream: streamVal, orgCode: this.tForm.value.orgCode }
        ).subscribe({
          next: (res) => {
            if (res.status_code === 'success') {
              this.helperService.setUserDetails(this.tForm.value.name, this.tForm.value.stream)
              this.router.navigate(['/dashboard']);
            }
            this.loading = false;
          },
          error: (err) => {
            this.alertService.error(
              'Organisation Not Found'
            );

            this.loading = false;
          }
        })
    }
  }
}
