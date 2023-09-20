import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HelperService } from "src/app/core/services/helper";
import { ApiService } from "src/app/core/services/api.service";
import { RouterModule } from "@angular/router";
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: "org-admin-header",
  standalone: true,
  imports: [CommonModule, RouterModule, CollapseModule,
    BsDropdownModule,
  ],
  templateUrl: "./admin-header.component.html",
  styleUrls: ["./admin-header.component.scss"],
})
export class AdminHeaderComponent {
  isCollapsed = false;
  userData = null;
  isLoggedIn = false;

  constructor(private helper: HelperService, private apiService: ApiService) {
    this.userData = this.helper.getUserDetails();
  }

  logout() {
    this.apiService.logout();
  }
}
