import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ContentHeaderComponent } from "src/app/shared/content-header/content-header.component";
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "src/app/core/services/api.service";
import { AlertService } from "src/app/core/services/alert.service";
import { FieldValidationMessageComponent } from "src/app/shared/field-validation-message/field-validation-message.component";
import { ButtonType, CONSTANTS, ClassType, StreamType, SubjectNameType, ToggleType } from "src/app/core/constant/constant";
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
  // streamOptions = ["NEET", "JEE"] as Array<StreamType>;
  streamOptions = ["9", "10", "11", "12", "DROPPER"] as Array<ClassType>;
  toggleOptions = ['Yes', 'No'] as Array<ToggleType>;
  subjectOptions = ["PHYSICS", "CHEMISTRY", "BIOLOGY", "MATHS"] as Array<SubjectNameType>;
  questionOptions = CONSTANTS.QUESTION_OPTIONS;


  ngOnInit(): void {
    const initialCheckboxValues = {} as any;
    for (const option of this.streamOptions) {
      initialCheckboxValues[option] = false;
    }
    for (const option of this.toggleOptions) {
      initialCheckboxValues[option] = false;
    }
    this.tForm = new FormGroup({
      id: new FormControl(null),
      title: new FormControl('', [
        Validators.required
      ]),
      subTitle: new FormControl('', [
      ]),
      stream: new FormControl('11', [
        Validators.required
      ]),
      // stream: this.fb.array([]),
      // stream: new FormArray([
      //   new FormControl(true),
      //   new FormControl(false),
      //   new FormControl(false),
      //   new FormControl(false),
      //   new FormControl(false),
      // ]),
      subjectName: new FormControl('PHYSICS', [
        Validators.required
      ]),
      testDate: new FormControl(null, [
        Validators.required
      ]),
      testDuration: new FormControl(600, [
        Validators.required
      ]),
      is12DropperSame: new FormControl('No', [
        Validators.required
      ]),
      questions: this.fb.array([]),
    });
    this.addDefaultQuestions();
    this.getTestDetails();
    // this.changeStream();
  }
  changeToggle() {
    const is12DropperSame = this.tForm.get('is12DropperSame')?.value;
  }
  changeStream() {
    const stream = this.tForm.get('stream')?.value;
    this.tForm.patchValue({
      subjectName: null
    });
    if (stream === '11' || stream === '12' || stream === 'DROPPER') {
      this.subjectOptions = ["PHYSICS", "CHEMISTRY", "BIOLOGY", "MATHS"]
    } else {
      this.subjectOptions = ["MATHS", "SCIENCE", "SOCIAL-SCIENCE"];
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
      image: '{test-id}/Q{i}.webp',
      imageHindi: '{test-id}/Q{i}-h.webp',
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
      const fromVal = this.tForm.value;
      const testDate = fromVal.testDate.getDate() + '-' + (fromVal.testDate.getMonth() + 1) + '-' + fromVal.testDate.getFullYear();
      const folderName = fromVal.id ?? (fromVal.stream + '-' + fromVal.subjectName + '-' + testDate);

      fromVal.questions.map((x: any, index: number) => {
        x.id = index + 1;
        x.image = x.image.replace('{test-id}', folderName);
        x.image = x.image.replace('{i}', index + 1);
        x.imageHindi = x.imageHindi.replace('{test-id}', folderName);
        x.imageHindi = x.imageHindi.replace('{i}', index + 1);
      });

      const newTestDate = new Date(
        fromVal.testDate.getUTCFullYear(),
        fromVal.testDate.getUTCMonth(),
        fromVal.testDate.getUTCDate(),
        0,
        0,
        0
      );
      newTestDate.setMinutes(newTestDate.getMinutes() - newTestDate.getTimezoneOffset());

      const resultDate = new Date(newTestDate.toString());
      resultDate.setDate(resultDate.getDate() + 1).toLocaleString();

      // let streamDb = []
      // if (fromVal.stream === '9' || fromVal.stream === '10')
      //   streamDb = [fromVal.stream]
      // if (fromVal.subjectName === 'PHYSICS' || fromVal.subjectName === 'CHEMISTRY')
      //   streamDb = [fromVal.stream + "-PCB", fromVal.stream + "-PCM"];
      // else if (fromVal.subjectName === 'BIOLOGY')
      //   streamDb = [fromVal.stream + "-PCB"];
      // else if (fromVal.subjectName === 'MATHS')
      //   streamDb = [fromVal.stream + "-PCM"]
      // else
      //   streamDb = [fromVal.stream]

      let streamDb: string[] = [];
      if (fromVal.is12DropperSame === 'Yes') {
        // Include both 'DROPPER' and '12' in the streamDb array
        streamDb = ['DROPPER', '12'];
      } else {
        if (fromVal.stream === '9' || fromVal.stream === '10') {
          streamDb = [fromVal.stream];
        }
        else if (fromVal.stream === 'DROPPER' || fromVal.stream === '12' || fromVal.stream === '11') {
          // Include only the selected stream in the streamDb array
          streamDb = [fromVal.stream];
        }
      }
      if (!(fromVal.stream === '9' || fromVal.stream === '10')) {
        if (fromVal.subjectName === 'PHYSICS' || fromVal.subjectName === 'CHEMISTRY') {
          streamDb = streamDb.map(stream => [stream + '-PCB', stream + '-PCM']).flat();
        } else if (fromVal.subjectName === 'BIOLOGY') {
          streamDb = streamDb.map(stream => [stream + '-PCB']).flat();
        } else if (fromVal.subjectName === 'MATHS') {
          streamDb = streamDb.map(stream => [stream + '-PCM']).flat();
        }
      }

      const payload = {
        ...this.tForm.value,
        id: folderName,
        active: true,
        testDate: newTestDate.toString(),
        resultDate: resultDate.toString(),
        passingScore: this.tForm.value.questions.length / 2,
        stream: streamDb
      }
      this.loading = false;
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
