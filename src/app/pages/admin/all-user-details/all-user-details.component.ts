import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ContentHeaderComponent } from "src/app/shared/content-header/content-header.component";
import { ApiService } from "src/app/core/services/api.service";
import { AlertService } from "src/app/core/services/alert.service";
import { HelperService } from "src/app/core/services/helper";

@Component({
    selector: "org-all-user-details",
    standalone: true,
    imports: [CommonModule, ContentHeaderComponent],
    templateUrl: "./all-user-details.component.html",
    styleUrls: ["./all-user-details.component.scss"],
})

export class AllUserDetailsComponent {
    constructor(private apiService: ApiService, private alertService: AlertService, private helper: HelperService) {
        this.userType = this.helper.getUserType();
    }
    userResultData = [] as any;
    loading = false;
    userType: string = '';
    ngOnInit(): void {
        this.getAllResultsDetails()
    }

    getAllResultsDetails() {
        this.loading = true;
        this.apiService
            .getAllResults()
            .subscribe({
                next: (res) => {
                    this.userResultData = res.data;
                    this.loading = false
                },
                error: (err) => {
                    this.alertService.error(err.message)
                    this.loading = false
                }
            })

    }
}