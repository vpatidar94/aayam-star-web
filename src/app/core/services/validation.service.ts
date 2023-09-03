import { Injectable } from "@angular/core";
import { FormControl } from "@angular/forms";

@Injectable({
  providedIn: "root",
})
export class ValidationService {
  // Custom validator to avoid empty spaces.
  noWhiteSpaceValidator(control: FormControl) {
    const isWhitespace = !(control.value === null || control.value === '') && (control.value).trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }
}
