import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ContentHeaderComponent } from "src/app/shared/content-header/content-header.component";
import { ApiService } from "src/app/core/services/api.service";
import { AlertService } from "src/app/core/services/alert.service";
import { RouterModule, Router } from '@angular/router';

@Component({
    selector: "org-organisations",
    standalone: true,
    imports: [CommonModule, ContentHeaderComponent, RouterModule],
    templateUrl: "./organisations.component.html",
    styleUrls: ["./organisations.component.scss"],
})

export class OrganisationComponent {
    constructor(private apiService: ApiService, private alertService: AlertService, private router: Router) { }
    orgData = [] as any
    loading = false;

    breadcrumbs = [
        {
            path: '/admin',
            name: 'Admin'
        },
        {
            path: '',
            name: 'Organisation'
        },
    ];

    ngOnInit(): void {
        this.getAllOrganisations()
    }

    updateOrganization(orgId: string): void {
        this.router.navigate(['/admin/edit-organisation', orgId]);
    }

    getAllOrganisations() {
        this.loading = true;
        this.apiService
            .getOrganisations()
            .subscribe({
                next: (res) => {
                    console.log(res)
                    this.orgData = res.data;
                    console.log("redats", this.orgData)
                    this.loading = false
                },
                error: (err) => {
                    this.alertService.error(err.message)
                    this.loading = false
                }
            })

    }
}