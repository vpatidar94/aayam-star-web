import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

export interface Breadcrumb {
  name: string;
  path: string;
}

@Component({
  selector: "org-content-header",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./content-header.component.html",
  styleUrls: ["./content-header.component.scss"],
})
export class ContentHeaderComponent {
  @Input() title = '' as string;
  @Input() breadcrumbs: Breadcrumb[] = [];
}
