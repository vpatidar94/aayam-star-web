import {
    CanDeactivateFn,
} from '@angular/router';
import { QuestionComponent } from 'src/app/pages/dashboard/question/question.component';



export const canLeavePage: CanDeactivateFn<QuestionComponent> = (component: QuestionComponent)
    : boolean => {
    // const apiService: ApiService = inject(ApiService);
    // return apiService.canActivate();
    console.log('leave', component.isSubmit)
    if (!component.isSubmit) {

        return true;
        // return !!result;
    }
    return false;
};
