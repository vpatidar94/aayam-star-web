import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AyAlertComponent } from './shared/ay-alert/ay-alert.component';

@Component({
  standalone: true,
  imports: [RouterModule, AyAlertComponent],
  selector: 'org-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'org';
}
