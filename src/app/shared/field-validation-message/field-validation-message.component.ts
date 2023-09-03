import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'org-field-validation-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './field-validation-message.component.html',
  styleUrls: ['./field-validation-message.component.scss'],
})
export class FieldValidationMessageComponent {
  @Input() control: any = null;

  getValidationMessages() {
    const errors = Object.keys(this.control.errors);
    if (!errors) return "";
    const error = errors[0];
    const validator = this.control.errors[error];
    switch (error) {
      case "required":
      case  "whitespace":
        return "This field is required";

      case "pattern":
        return "Enter valid input.";

      case "email":
        return "Enter the valid email";

      case "minlength":
        return `Minimum length is ${validator.requiredLength} characters.`;

      case "maxlength":
        return `Maximum length is ${validator.requiredLength} characters.`;

      default:
        return "";
    }
  }
}
