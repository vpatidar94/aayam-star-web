import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { AdminHeaderComponent } from "src/app/layout/admin-header/admin-header.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

@Component({
  selector: "org-admin",
  standalone: true,
  imports: [CommonModule, RouterModule, AdminHeaderComponent],
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.scss"],
})
export class AdminComponent { }
