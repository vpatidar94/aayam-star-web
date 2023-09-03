import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'org-auth-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './auth-header.component.html',
  styleUrls: ['./auth-header.component.scss'],
})
export class AuthHeaderComponent {
  @Input() path = ''
}
