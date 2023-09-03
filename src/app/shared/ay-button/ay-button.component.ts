import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonType } from 'src/app/core/constant/constant';

@Component({
  selector: 'org-ay-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ay-button.component.html',
  styleUrls: ['./ay-button.component.scss'],
})
export class AyButtonComponent {
  @Input() type : ButtonType = 'button';
  @Input() loading=false;
  @Input() disabled=false;

  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() click = new EventEmitter<void>;
  onClick():void{
    this.click.emit()
  }

}

