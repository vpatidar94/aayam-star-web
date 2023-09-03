import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from 'src/app/core/services/api.service';

@Component({
  selector: 'org-dashboard-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-header.component.html',
  styleUrls: ['./dashboard-header.component.scss'],
})
export class DashboardHeaderComponent {
  constructor(private apiService: ApiService) { }
  @Input() path = ''
  // @Input() showPanel = false;
  @Input() showLogout = false;
  @Input() title = ''
  @Input() subTitle = ''


  @Output() togglePanel = new EventEmitter<boolean>();

  emitTogglePanel(value: boolean) {
    this.togglePanel.emit(value)
  }

  triggerLogout() {
    this.apiService.logout();
  }

}
