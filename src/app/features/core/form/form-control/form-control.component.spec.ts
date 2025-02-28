import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControlComponent } from './form-control.component';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import {SimpleChanges} from '@angular/core';

describe('FormControlComponent', () => {
  let component: FormControlComponent;
  let fixture: ComponentFixture<FormControlComponent>;
  let control: FormControl;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormControlComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FormControlComponent);
    component = fixture.componentInstance;
    control = new FormControl('', Validators.required);
    component.control = control;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show error message when control is invalid and touched', () => {
    control.markAsTouched();
    control.setValue('');
    fixture.detectChanges();

    const errorMessage = fixture.debugElement.query(By.css('.error-message'));
    expect(errorMessage).toBeTruthy();
    expect(errorMessage.nativeElement.textContent).toContain('Este campo es obligatorio.');
    expect(component.isInvalid).toBeTruthy();
  });

  it('should not show error message when control is valid', () => {
    control.markAsTouched();
    control.setValue('valid');
    fixture.detectChanges();

    const errorMessage = fixture.debugElement.query(By.css('.error-message'));
    expect(errorMessage).toBeFalsy();
    expect(component.isInvalid).toBeFalsy();
  });

  it('should show input as readonly when readonly is true', () => {
    component.readonly = true;
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('input'));
    expect(input.nativeElement.readOnly).toBeTruthy();
  });

  it('should handle changes to the control input', () => {
    const newControl = new FormControl('');
    component.control = newControl;
    fixture.detectChanges();
    expect(component.control).toBe(newControl);
  });


  it('should call unsubscribe and subscribeToControl when control changes', () => {
      const unsubscribeSpy = jest.spyOn(component['subscription'], 'unsubscribe').mockImplementation();
      const subscribeToControlSpy = jest.spyOn(component, 'subscribeToControl').mockImplementation();
      const updateErrorMessageSpy = jest.spyOn(component, 'updateErrorMessage').mockImplementation();

      const changes: SimpleChanges = {
          control: {
              currentValue: 'newControlValue',
              previousValue: 'oldControlValue',
              firstChange: false,
              isFirstChange: jest.fn().mockReturnValue(false),
          },
      };
      component.ngOnChanges(changes);
      expect(unsubscribeSpy).toHaveBeenCalled();
      expect(subscribeToControlSpy).toHaveBeenCalled();
      expect(updateErrorMessageSpy).toHaveBeenCalled();
  });
});
