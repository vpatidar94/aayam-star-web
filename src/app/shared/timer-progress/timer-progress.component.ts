import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'org-timer-progress',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timer-progress.component.html',
  styleUrls: ['./timer-progress.component.scss'],
})
export class TimerProgressComponent implements OnDestroy, OnChanges {
  @Input() totalDuration = 0 as number;

  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() endTimer = new EventEmitter<void>();

  duration = 0;
  c1StrokeDashArray = [100, 0] as any;
  c2StrokeDashArray = [0, 100] as any;
  c1StrokeDashoffset = '100' as any;
  displayTimer = '';

  timeout = null as any;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['totalDuration'].currentValue) {
      this.duration = this.totalDuration;
      if (this.duration) {
        this.startTimer(this.duration);
      }
    }
  }
  mmhhFormat() {
    this.displayTimer = new Date(this.duration * 1000).toISOString().substring(14, 19)
  }

  startTimer(duration: number) {
    this.timeout = setTimeout(() => {
      const time = duration;
      let i = 1;
      let k = ((i / duration) * 100);
      let l = 100 - k;
      i++;
      this.c1StrokeDashArray = [l, k];
      this.c2StrokeDashArray = [k, l];
      this.c1StrokeDashoffset = l;
      this.duration = duration;
      this.mmhhFormat();
      const interval = setInterval(() => {
        if (i > time) {
          clearInterval(interval);
          clearTimeout(this.timeout);
          return;
        }
        k = ((i / duration) * 100);
        l = 100 - k;

        this.c1StrokeDashArray = [l, k];
        this.c2StrokeDashArray = [k, l];
        this.c1StrokeDashoffset = l;
        this.duration = (duration + 1) - i;
        this.mmhhFormat();
        if (this.duration <= 1) {
          this.endTimer.emit();
        }
        i++;
      }, 1000);
    }, 0);
  }

  ngOnDestroy() {
    clearTimeout(this.timeout);
  }

}
