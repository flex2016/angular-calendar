import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarComponent } from './calendar.component';
import { DateTime } from 'luxon';

describe('CalendarComponent', () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should initialize signals correctly', () => {
    expect(component.today()).toBeInstanceOf(DateTime);
    expect(component.firstDayOfActiveMonth()).toBeInstanceOf(DateTime);
    expect(component.activeDay()).toBeInstanceOf(DateTime);
    expect(component.currentDay()).toBeInstanceOf(DateTime);
  });
  it("should initialize with today's date", () => {
    const today = DateTime.local().startOf('day').toISODate();
    expect(component.today().toISODate()).toEqual(today);
  });

  it('should go to the previous month', () => {
    const initialMonth = component.firstDayOfActiveMonth().month;
    component.goToPreviousMonth();
    expect(component.firstDayOfActiveMonth().month).toBe(initialMonth - 1);
  });

  it('should go to the next month', () => {
    const initialMonth = component.firstDayOfActiveMonth().month;
    component.goToNextMonth();
    expect(component.firstDayOfActiveMonth().month).toBe(initialMonth + 1);
  });

  it("should set active day to today's date", () => {
    const today = DateTime.local();
    component.setActiveDay(today);
    expect(component.activeDay().toISODate()).toEqual(today.toISODate());
  });

  it('should set active day to a future date within the current month', () => {
    const futureDate = DateTime.local().plus({ days: 1 });
    component.setActiveDay(futureDate);
    expect(component.activeDay().toISODate()).toEqual(futureDate.toISODate());
  });

  it('should not allow selection of past dates', () => {
    const pastDate = DateTime.local().minus({ days: 1 });
    component.setCurrentDay(pastDate);
    expect(component.currentDay().toISODate()).not.toEqual(
      pastDate.toISODate()
    );
  });

  it("should allow selection of today's date", () => {
    const today = DateTime.local();
    component.setCurrentDay(today);
    expect(component.currentDay().toISODate()).toEqual(today.toISODate());
  });

  it('should allow selection of future dates within the current month', () => {
    const futureDate = DateTime.local().plus({ days: 1 });
    component.setCurrentDay(futureDate);
    expect(component.currentDay().toISODate()).toEqual(futureDate.toISODate());
  });

  it('should not allow selection of dates outside the current month', () => {
    const nextMonthDate = DateTime.local().plus({ months: 1 }).startOf('month');
    component.setCurrentDay(nextMonthDate);
    expect(component.currentDay().toISODate()).not.toEqual(
      nextMonthDate.toISODate()
    );
  });

  it('should mark past dates as past dates', () => {
    const pastDate = DateTime.local().minus({ days: 1 });
    expect(component.isPastDate(pastDate)).toBe(true);
  });

  it("should not mark today's date as past date", () => {
    const today = DateTime.local();
    expect(component.isPastDate(today)).toBe(false);
  });

  it('should not mark future dates as past dates', () => {
    const futureDate = DateTime.local().plus({ days: 1 });
    expect(component.isPastDate(futureDate)).toBe(false);
  });
});
