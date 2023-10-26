import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthHeaderComponent } from 'src/app/layout/auth-header/auth-header.component';
import { ApiService } from 'src/app/core/services/api.service';
import { HelperService } from 'src/app/core/services/helper';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { FieldValidationMessageComponent } from 'src/app/shared/field-validation-message/field-validation-message.component';
import { ValidationService } from 'src/app/core/services/validation.service';
import { StreamType } from 'src/app/core/constant/constant';
import { AlertService } from 'src/app/core/services/alert.service';

@Component({
  selector: 'org-enter-admin-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AuthHeaderComponent, FieldValidationMessageComponent],
  templateUrl: './enter-admin-details.component.html',
  styleUrls: ['./enter-admin-details.component.scss'],
})
export class EnterAdminDetailsComponent implements OnInit {
  constructor(private apiService: ApiService, private alertService: AlertService, private validationService: ValidationService, private helperService: HelperService, private router: Router) { }

  tForm!: FormGroup;
  loading = false;
  streamOptions = ["NEET", "JEE"] as Array<StreamType>

  ngOnInit(): void {
    this.tForm = new FormGroup({
      name: new FormControl(null, [
        Validators.required,
        this.validationService.noWhiteSpaceValidator as ValidatorFn
      ]),
      stream: new FormControl(null, [
        Validators.required,
      ]),
    });
  }

  onSubmit() {
    console.log("XXXXXXXXXX",)
    // if (this.tForm.invalid) {
    //   this.tForm.markAllAsTouched();
    // } else {
    //   this.loading = true;

      this.apiService
        .updateOrgAdminDetails(
          { name: this.tForm.value.name, designation: 'teacher', orgCode:'542154' }
        ).subscribe({
          next: (res) => {
            if (res.status_code === 'success') {
              this.helperService.setUserDetails(this.tForm.value.name, this.tForm.value.name)
              this.router.navigate(['/admin']);
            }
            this.loading = false;
          },
          error: (err) => {
            this.alertService.error(err)
            this.loading = false;
          }
        })
    }
  }
// }
