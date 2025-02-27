import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastComponent } from './toast.component';
import {By} from '@angular/platform-browser';

describe('ToastComponent', () => {
  let component: ToastComponent;
  let fixture: ComponentFixture<ToastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should be created', () => {
    expect(component).toBeTruthy();
  });

  test('should display the message', () => {
    component.message = 'Test message';
    fixture.detectChanges();
    const toastElement: HTMLElement = fixture.debugElement.query(By.css('.toast')).nativeElement;
    expect(toastElement.textContent).toContain('Test message');
  });

  test('should apply the correct toast class', () => {
    component.toastClass = 'success';
    fixture.detectChanges();
    const toastElement: HTMLElement = fixture.debugElement.query(By.css('.toast')).nativeElement;
    expect(toastElement.classList).toContain('success');
  });

});
