import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardHeaderComponent } from 'src/app/layout/dashboard-header/dashboard-header.component';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from 'src/app/core/services/api.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { CONSTANTS } from 'src/app/core/constant/constant';
import { HelperService } from 'src/app/core/services/helper';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'org-dashboard',
  standalone: true,
  imports: [CommonModule, DashboardHeaderComponent, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  constructor(private router: Router, private apiService: ApiService, private alertService: AlertService, private helperService: HelperService)
  {
    this.bucketUrl = environment.BUCKET_URL;
  }
  bucketUrl = '';
  data: any = [];
  scoreReferral = {
    testsPoints: 0,
    userReferralPoints: 0,
    tests: [] as any
  }
  loading = false as boolean;
  scoreLoading = false as boolean;
  totalPoints = 0 as number;
  trophyCount = 0 as number;
  isExpandedPoints = false as boolean;
  isUpdateProfile = false as boolean;

  ngOnInit(): void {
    this.getDashboardDetails();
    this.getScorePoints();
  }

  getDashboardDetails() {
    this.loading = true;
    this.apiService
      .getDashboardDetails()
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

  getScorePoints() {
    this.scoreLoading = true;
    this.apiService
      .getAllScoreAndPoints()
      .subscribe({
        next: (res) => {
          if (res?.tests.length > 0) {
            this.scoreReferral.tests = res?.tests.reverse() as any;
            this.scoreReferral.testsPoints = res.tests.reduce((previousVal: any, currentVal: any) => {
              return (isNaN(previousVal) ? (previousVal?.points ?? 0) : (previousVal ?? 0)) + (currentVal.points ?? 0);
            });
          }
          this.scoreReferral.userReferralPoints = res?.userReferralPoints;
          this.totalPoints = this.scoreReferral.userReferralPoints + this.scoreReferral.testsPoints;
          this.trophyCount = Math.floor(this.totalPoints / 2000);
          this.totalPoints = this.totalPoints - this.trophyCount * 2000;
          this.scoreLoading = false;
        },
        error: (err) => {
          this.alertService.error(err.message);
          this.scoreLoading = false;
        }
      });
  }

  generateTrophyArray(): number[] {
    return Array.from({ length: this.trophyCount }, (_, index) => index + 1);
  }

  updateProfile() {
    this.router.navigate(['/update-user-details'])
  }

  redirectToInstruction(testId: string) {
    this.router.navigate(['/instructions/' + testId]);
  }

  redirectToScheduled() {
    this.router.navigate(['/test-schedule']);
  }

  copyToClipboard() {
    const user = this.helperService.getUserDetails();
    const text = `Register to Aayam Star, ${window.location.origin}/login?referredBy=${user._id}`
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        this.alertService.success('Referral link is copy to clipboard. Share with your friends.');
      }, (error) => {
        console.log(error)
      });
    } else {
      this.alertService.error('Browser do not support Clipboard API');
    }
  }

  async share() {
    const shareText = 'Register to Aayam Star,';
    const referralLink = this.generateReferralLink();
    const shareUrl = window.location.href;
    const imageUrl = 'https://aayamcareerinstitute.com/images/aayam-star/aayam-star-main.webp';

    try {
      // const response = await fetch(imageUrl);
      // const imageBlob = await response.blob();
      if (navigator.share) {
        await navigator.share({
          title: 'AAYAM STAR',
          text: `${shareText}\n${referralLink}`,
          // url: shareUrl,
          //  files: [new File([imageBlob,], 'aayam-star-main.webp', { type: 'image/webp'})], // Replace with your actual image data
        });
      } else {
        console.error('Web Share API not supported');
        this.alertService.error('Browser do not support Clipboard API')
        // Share via WhatsApp
        window.open(`whatsapp://send?text=${encodeURIComponent(shareText + ' ' + referralLink)}`);
      }
    }
    catch (error) {
      console.error('Error sharing:', error);
    }
  }

  generateReferralLink(): string {
    const user = this.helperService.getUserDetails();
    return `${window.location.origin}/login?referredBy=${user._id}`;
  }

  OnReview(testId: any) {
    this.router.navigate(["/test/" + testId + "/review"]);
  }
}
