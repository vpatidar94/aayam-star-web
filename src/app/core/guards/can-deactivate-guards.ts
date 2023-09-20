import {
    CanDeactivateFn,
} from '@angular/router';
import { QuestionComponent } from 'src/app/pages/dashboard/question/question.component';



export const canLeavePage: CanDeactivateFn<QuestionComponent> = (component: QuestionComponent)
    : boolean => {
    if (!component.isSubmit) {
        return true;
    }
    return false;
};
