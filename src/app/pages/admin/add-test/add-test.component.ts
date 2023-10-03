import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ContentHeaderComponent } from "src/app/shared/content-header/content-header.component";
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "src/app/core/services/api.service";
import { AlertService } from "src/app/core/services/alert.service";
import { FieldValidationMessageComponent } from "src/app/shared/field-validation-message/field-validation-message.component";
import { CONSTANTS, StreamType, SubjectNameType } from "src/app/core/constant/constant";
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@Component({
  selector: "org-add-test",
  standalone: true,
  imports: [
    CommonModule,
    ContentHeaderComponent,
    ReactiveFormsModule,
    FieldValidationMessageComponent,
    BsDatepickerModule,
  ],
  templateUrl: "./add-test.component.html",
  styleUrls: ["./add-test.component.scss"],
})
export class AddTestComponent implements OnInit {

  constructor(private route: ActivatedRoute, private apiService: ApiService, private alertService: AlertService, private fb: FormBuilder,
    private router: Router
  ) {
    this.route.params.subscribe(params => {
      this.testId = params['testId'];
    });
  }

  loading = false;
  data = [] as any;
  testId = '';
  breadcrumbs = [
    {
      name: 'Tests',
      path: '/admin'
    },
    {
      name: this.testId ? 'Edit Test' : 'Add Test',
      path: ''
    }
  ];
  tForm!: FormGroup;
  streamOptions = ["NEET", "JEE"] as Array<StreamType>;
  subjectOptions = ["Physics", "Chemistry", "Biology"] as Array<SubjectNameType>;
  questionOptions = CONSTANTS.QUESTION_OPTIONS;


  ngOnInit(): void {
    this.tForm = new FormGroup({
      id: new FormControl(null),
      title: new FormControl('', [
        Validators.required
      ]),
      subTitle: new FormControl('', [
      ]),
      stream: new FormControl('NEET', [
        Validators.required
      ]),
      subjectName: new FormControl('Physics', [
        Validators.required
      ]),
      testDate: new FormControl(null, [
        Validators.required
      ]),
      testDuration: new FormControl(600, [
        Validators.required
      ]),
      questions: this.fb.array([])
    });
    this.addDefaultQuestions();
    this.getTestDetails();
    this.changeStream();
  }

  changeStream() {
    const stream = this.tForm.get('stream')?.value;
    if (stream === 'NEET') {
      this.subjectOptions = ["Physics", "Chemistry", "Biology"]
    } else {
      this.subjectOptions = ["Physics", "Chemistry", "Maths"]
    }
  }

  get questions() {
    return this.tForm.get('questions') as FormArray;
  }

  addDefaultQuestions() {
    let number = 10
    for (var i = 0; i < number; i++) {
      this.addQuestion();
    }
  }

  addQuestion() {
    const formGroup = this.fb.group({
      id: null,
      image: '{test-id}/Q{i}.jpg',
      correctAnswer: new FormControl('A', [
        Validators.required,
      ]),
      type: "single-option"
    });
    this.questions.push(formGroup);
  }

  removeQuestion(index: number) {
    this.questions.removeAt(index);
  }

  getTestDetails() { }

  onSubmit() {
    if (this.tForm.invalid) {
      this.tForm.markAllAsTouched();
    } else {
      this.loading = true;
      const testDate = this.tForm.value.testDate.getDate() + '-' + (this.tForm.value.testDate.getMonth() + 1) + '-' + this.tForm.value.testDate.getFullYear();
      const folderName = this.tForm.value.id ?? (this.tForm.value.subjectName + '-' + testDate);

      this.tForm.value.questions.map((x: any, index: number) => {
        x.id = index + 1;
        x.image = x.image.replace('{test-id}', folderName);
        x.image = x.image.replace('{i}', index + 1);
      });

      const newTestDate = new Date(
        this.tForm.value.testDate.getUTCFullYear(),
        this.tForm.value.testDate.getUTCMonth(),
        this.tForm.value.testDate.getUTCDate(),
        5,
        30,
        0
      );

      const resultDate = new Date(newTestDate.toString());
      resultDate.setDate(resultDate.getDate() + 1).toLocaleString();

      const payload = {
        ...this.tForm.value,
        id: folderName,
        active: true,
        testDate: newTestDate.toString(),
        resultDate: resultDate.toString(),
        passingScore: this.tForm.value.questions.length / 2,
      }

      this.apiService
        .addTestDetails(payload).subscribe({
          next: () => {
            this.alertService.success('Questions added successfully.')
            this.router.navigate(['/admin']);
            this.loading = false;
          },
          error: (err) => {
            this.alertService.error(err)
            this.loading = false;
          }
        });
    }
  }
}
