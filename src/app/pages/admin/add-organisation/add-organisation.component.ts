import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ContentHeaderComponent } from "src/app/shared/content-header/content-header.component";
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "src/app/core/services/api.service";
import { AlertService } from "src/app/core/services/alert.service";
import { FieldValidationMessageComponent } from "src/app/shared/field-validation-message/field-validation-message.component";
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';


@Component({
    selector: "org-add-organisation",
    standalone: true,
    imports: [
        CommonModule,
        ContentHeaderComponent,
        ReactiveFormsModule,
        FieldValidationMessageComponent,
        BsDatepickerModule,
    ],
    templateUrl: "./add-organisation.component.html",
    styleUrls: ["./add-organisation.component.scss"]
})

export class AddOrganisation implements OnInit {
    constructor(
        private apiService: ApiService,
        private alertService: AlertService,
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    tForm!: FormGroup;
    isEditMode = false;
    orgId: string | null = null;
    breadcrumbs = [
        {
            path: '/admin',
            name: 'Admin'
        },
        {
            path: '/admin/organisations',
            name: 'Organisation'
        },
        {
            path: '',
            name: 'Add Organisation'
        },
    ];

    ngOnInit(): void {
        this.tForm = this.fb.group({
            id: new FormControl(null),
            orgName: new FormControl('', [
                Validators.required
            ]),
            orgAddress: new FormControl('', [
                Validators.required
            ]),
            orgCode: new FormControl('', [
                Validators.required
            ]),
            orgAdmins: this.fb.array([]),
        })

        this.addOrgAdmin();

        // Check if in edit mode
        this.route.params.subscribe(params => {
            this.orgId = params['orgId'];
            if (this.orgId) {
                this.isEditMode = true;
                // Fetch organization details for editing
                this.getOrgDetail(this.orgId);
            }
        });

    }

    getOrgDetail(orgId: string) {
        this.apiService.getOrganisationById(orgId).subscribe(
            (org) => {
                this.tForm.patchValue({
                    orgName: org.data.orgName,
                    orgAddress: org.data.orgAddress,
                    orgCode: org.data.orgCode,
                });
                this.setOrgAdmins(org.data.orgAdmins);
                this.tForm.controls['orgCode'].disable();
            },
            (error) => {
                console.error("Error fetching organisation details", error);
            }
        );
    }

    setOrgAdmins(admins: string[]) {
        const adminsArray = admins.map(admin => this.fb.control(admin));
        this.tForm.setControl('orgAdmins', this.fb.array(adminsArray));
    }

    // Getter for orgAdmins form array
    get orgAdmins() {
        return this.tForm.get('orgAdmins') as FormArray;
    }

    // Function to add orgAdmins dynamically
    addOrgAdmin() {
        this.orgAdmins.push(this.fb.control(''));
    }

    // Function to remove orgAdmins dynamically
    removeOrgAdmin(index: number) {
        this.orgAdmins.removeAt(index);
    }

    enableEditing() {
        this.tForm.controls['orgCode'].enable();
    }

    generateCode() {
        const orgName = this.tForm.get('orgName')?.value || '';
        const orgAddress = this.tForm.get('orgAddress')?.value || '';
        const firstAdmin = this.tForm.get('orgAdmins')?.value[0] || '';

        //hash function
        const hashCode = (s: string) => s.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0);

        let code = (hashCode(orgName) + hashCode(orgAddress) + hashCode(firstAdmin)) % 1000000;
        code = Math.abs(code);
        // Update the orgCode form control
        const generatedCode = code.toString().padStart(6, '0');
        this.tForm.get('orgCode')?.setValue(generatedCode);
    }

    onSubmit() {
        if (this.tForm.valid) {
            const formData = this.tForm.value;
            console.log(formData);
            if (this.isEditMode && this.orgId !== null) {
                // If in edit mode, call update API
                this.apiService.updateOrganisation(this.orgId, formData).subscribe(
                    (response) => {
                        this.alertService.success("Organisation updated successfully");
                        this.router.navigate(['/admin/organisations']);
                    },
                    (error) => {
                        this.alertService.error("Failed to update organisation. Please try again.");
                    }
                );
            } else {
                //add ordanisation api
                this.apiService
                    .addOrganisation(formData).subscribe(
                        (response) => {
                            this.alertService.success("Organisation added successfully");
                            this.router.navigate(['/admin/organisations']);
                        },
                        (error) => {
                            this.alertService.error("Failed to add organisation. Please try again.");
                        }
                    )
            }
        } else {
            this.alertService.error("Please fix the errors in the form.");
        }
    }
}