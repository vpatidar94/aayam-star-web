import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardHeaderComponent } from 'src/app/layout/dashboard-header/dashboard-header.component';
import { Observable, of } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CONSTANTS } from 'src/app/core/constant/constant';
import { AlertService } from 'src/app/core/services/alert.service';
import { TimerProgressComponent } from 'src/app/shared/timer-progress/timer-progress.component';

@Component({
  selector: 'org-question',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, DashboardHeaderComponent, TimerProgressComponent],
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],

})
export class QuestionComponent implements OnInit, OnDestroy {
  constructor(private router: Router, private alertService: AlertService, private route: ActivatedRoute, private apiService: ApiService) {
    document.addEventListener("visibilitychange", this.visibilityChange);
  }
  state$!: Observable<any>;
  questionDetails = { title: '', subTitle: '', testDuration: 0 } as any;
  options = CONSTANTS.QUESTION_OPTIONS;
  questionIndex = 0;
  questions: any = [];
  question: any = null;
  answer = ''
  result: any = {};
  loading = false;
  testId = '' as string | number;
  isSubmit = false;

  // show dialog on visibility change
  visibilityChange() {
    if (document.visibilityState === "hidden") {
      confirm('You have not submit the test paper. Are you sure you want to leave?')
    }
  }

  // page-unload and pagehide are not working
  @HostListener('window:pagehide', ['$event'])
  async canLeavePage($event: any) {
    if (!this.isSubmit) {
      if (confirm('You have not submit the test paper. Are you sure you want to leave?')) {
        $event.preventDefault();
        return true;
      } else {
        return false;
      }
    }
    return true;
  }

  // on page change
  async canDeactivate(): Promise<boolean> {
    console.log('is deactivate', this.isSubmit)
    if (!this.isSubmit) {
      if (confirm('You have not submit the test paper. Are you sure you want to leave?')) {
        await this.submitScore(this.questions)
        return true;
      }
      else {
        return false;
      }
    }
    return true;
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.testId = +params['testId'];
      this.question = this.questions[this.questionIndex] ?? null;
    });
    this.loading = true;
    this.state$ = this.apiService.getQuestions(this.testId)
    this.state$.subscribe((x) => {
      this.questionDetails = x;
      this.questions = x.questions
      this.question = x.questions[0] ?? null;
      this.loading = false;
    }, (err) => {
      this.alertService.error(err.error.error);
      this.loading = false;
    })
  }

  onSubmit() {
    if (this.answer) {
      this.question['studentAnswer'] = this.answer
      this.questions[this.questionIndex] = this.question
      if ((this.questions.length - 1) > this.questionIndex) {
        this.answer = '';
        this.questionIndex++;
      }
      else if (this.questions.length - 1 === this.questionIndex) {
        this.submitScore(this.questions);
      }
    }
  }

  async submitScore(questions: any) {
    console.log('is submit call')
    const data: { id: number, answer: string }[] = [];
    questions.forEach((element: any) => {
      data.push({
        id: element.id,
        answer: element.studentAnswer ?? ''
      })
    });
    const payload = {
      testId: this.testId,
      questions: data
    }
    this.loading = true;
    await this.apiService
      .submitResult(
        payload
      ).subscribe({
        next: (res) => {
          if (res.status_code === 'success') {
            console.log('is submit call success')

            this.result = res.data;
            this.isSubmit = true;
            this.router.navigate(['/dashboard']);
          }
          else {
            this.alertService.error('Error in submit response. Please try again!');
          }
          this.loading = false;
        },
        error: (err) => {
          this.alertService.error(err)
          this.loading = false;
        }
      })
  }

  onTimeout() {
    this.alertService.warning('Timeout!. Test will be submitted now.');
    this.submitScore(this.questions);
  }

  ngOnDestroy() {
    document.removeEventListener("visibilitychange", this.visibilityChange);
  }
}
