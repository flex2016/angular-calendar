import {
  Component,
  Signal,
  WritableSignal,
  computed,
  signal,
} from '@angular/core';
import { DateTime, Info, Interval } from 'luxon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  imports: [CommonModule],
  standalone: true,
})
export class CalendarComponent {
  today: Signal<DateTime> = signal(DateTime.local());
  firstDayOfActiveMonth: WritableSignal<DateTime> = signal(
    this.today().startOf('month')
  );
  activeDay: WritableSignal<DateTime> = signal(this.today());
  currentDay: WritableSignal<DateTime> = signal(this.today());
  weekDays: Signal<string[]> = signal(Info.weekdays('short'));
  daysOfMonth: Signal<DateTime[]> = computed(() => {
    return Interval.fromDateTimes(
      this.firstDayOfActiveMonth().startOf('week'),
      this.firstDayOfActiveMonth().endOf('month').endOf('week')
    )
      .splitBy({ day: 1 })
      .map((d) => {
        if (d.start === null) {
          throw new Error('Wrong dates');
        }
        return d.start;
      });
  });
  DATE_MED = DateTime.DATE_MED;

  goToPreviousMonth(): void {
    this.firstDayOfActiveMonth.set(
      this.firstDayOfActiveMonth().minus({ month: 1 })
    );
  }

  goToNextMonth(): void {
    this.firstDayOfActiveMonth.set(
      this.firstDayOfActiveMonth().plus({ month: 1 })
    );
  }

  setActiveDay(day: DateTime): void {
    if (
      !this.isPastDate(day) &&
      day.month === this.firstDayOfActiveMonth().month
    ) {
      this.activeDay.set(day);
    }
  }
  setCurrentDay(day: DateTime): void {
    if (day < this.today()) {
      return;
    }
    if (day.month === this.firstDayOfActiveMonth().month) {
      this.currentDay.set(day);
    }
  }
  isPastDate(day: DateTime): boolean {
    return day < this.today();
  }
}
