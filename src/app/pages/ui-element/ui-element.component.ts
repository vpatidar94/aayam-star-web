import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AyButtonComponent } from 'src/app/shared/ay-button/ay-button.component';

@Component({
  selector: 'org-ui-element',
  standalone: true,
  imports: [CommonModule, AyButtonComponent],
  templateUrl: './ui-element.component.html',
  styleUrls: ['./ui-element.component.scss'],
})
export class UiElementComponent {

  callClick(e:void){
    console.log('e', e)
  }
}
