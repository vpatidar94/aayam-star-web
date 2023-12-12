import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ApiService } from "src/app/core/services/api.service";
import { AlertService } from "src/app/core/services/alert.service";
import { ContentHeaderComponent } from "src/app/shared/content-header/content-header.component";
import { ActivatedRoute } from "@angular/router";
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { CONSTANTS } from "src/app/core/constant/constant";
import { HelperService } from "src/app/core/services/helper";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: "org-test-result",
  standalone: true,
  imports: [CommonModule, ContentHeaderComponent, AccordionModule],
  templateUrl: "./test-result.component.html",
  styleUrls: ["./test-result.component.scss"],
})
export class TestResultComponent {
  constructor(private route: ActivatedRoute, private apiService: ApiService, private alertService: AlertService, private helper: HelperService) {
    this.route.params.subscribe(params => {
      this.testId = params['testId'];
    });

    this.userType = this.helper.getUserType();
  }

  loading = false;
  data = [] as any;
  testId = '';
  isRankGenerated = false as boolean;
  testDetail = null as any;
  breadcrumbs = [
    {
      name: 'Tests',
      path: '/admin'
    }
  ];
  btnLoading = false as boolean;
  isAccordianOpen = true;
  userType: string = '';
  ngOnInit(): void {
    this.getTestDetail();
    this.getAllResults();
  }

  getTestDetail() {
    this.apiService
      .getTestDetails(this.testId)
      .subscribe({
        next: (res) => {
          this.testDetail = res;
          this.breadcrumbs.push({
            name: res.title,
            path: ''
          })
        },
        error: (err) => {
          this.alertService.error(err.message);
        }
      });
  }

  getAllResults() {
    this.loading = true;
    this.apiService
      .getResultByTest(this.testId)
      .subscribe({
        next: (res) => {
          this.data = res;
          this.loading = false;
        },
        error: (err) => {
          this.alertService.error(err.message);
          this.loading = false;
        }
      });
  }

  showTimeInMMSS(sec: number) {
    return new Date(sec * 1000).toISOString().slice(14, 19);
  }

  sendWpMessages() {
    this.btnLoading = true;
    const payload = {
      title: this.testDetail.title,
      testId: this.testId,
    }

    this.apiService
      .sendWpMessage(payload)
      .subscribe({
        next: (res) => {
          this.alertService.success("Message send succesfully.");
          this.btnLoading = false;
        },
        error: (err) => {
          this.alertService.error(err.message);
          this.btnLoading = false;
        }
      });
  }

  generateRank() {
    this.btnLoading = true;
    this.apiService
      .generateRank(this.testId)
      .subscribe({
        next: (res) => {
          this.alertService.success(CONSTANTS.MESSAGES.GENERATED_RANK_SUCCESS);
          this.btnLoading = false;
          this.isRankGenerated = true;
        },
        error: (err) => {
          this.alertService.error(err.message);
          this.btnLoading = false;
        }
      });
  }

  downloadAsPDF() {
    const doc = new jsPDF();
    const formattedDate = new Date(this.testDetail.testDate).toLocaleDateString('en-GB');
    // Add subjectName and testname as a separate table
    (doc as any).autoTable({
      head: [['AAYAM STAR' ]],
      styles: {halign: 'center'}
    });
    (doc as any).autoTable({
      body: [[
        { content: 'Subject:', styles: { fontStyle: 'bold' } },
        this.testDetail.subjectName,
        { content: 'Test Name:', styles: { fontStyle: 'bold' } },
        this.testDetail.title,
        { content: 'Date:', styles: { fontStyle: 'bold' } },
        formattedDate
      ]],  });

  // Add an empty space between the tables
  doc.text('', 10, 40);
    (doc as any).autoTable({
      head: [['User Name', 'Score','OverAll Rank','Org Rank', 'Points', 'Duration']],
      body: this.data.map((item:any, index:number) => [
        { content: item.userId.name, styles: { halign: 'left' } },
        // this.testDetail?.subjectName,
        // this.userType === 'admin' ? item.userId.mobileNo : '', // Display only if admin
        `${item.score!== null ? `${item.score}/${this.testDetail?.questions?.length}` : 'Absent'}`,
        item.rank,
        `${item.score!== null? index+1 : '' }` ,
        item.points,
        item.duration ? this.showTimeInMMSS(item.duration) : '-',
        // this.datePipe.transform(item.dateCreated, 'MMM d, y, h:mm a'), // Use Angular date pipe
        item.score !== null ? 'Present' : 'Absent'
      ]),
      styles:{
        valign: 'middle',
        halign: 'center',
      }
    });

    // Save the PDF
    doc.save('test_records.pdf');
  }
}
