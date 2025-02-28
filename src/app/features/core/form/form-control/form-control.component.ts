import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {getFormControlErrorMessage} from '../../../../utils/form.utils';
import {merge, Subscription} from 'rxjs';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-form-control',
  templateUrl: './form-control.component.html',
  imports: [
    ReactiveFormsModule,
    NgClass,
  ],
  styleUrls: ['./form-control.component.css'],
})
export class FormControlComponent implements OnInit, OnDestroy, OnChanges {
  @Input() control: FormControl;
  @Input() label: string;
  @Input() type: string = 'text';
  @Input() placeholder: string;
  @Input() readonly: boolean = false;

  public errorMessage: { message: string; params?: { [key: string]: string } } = null;
  public isInvalid: boolean = false;
  private subscription: Subscription;

  constructor() {
  }

  ngOnInit() {
    this.subscribeToControl();
    this.updateErrorMessage();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['control'] && !changes['control'].isFirstChange()) {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
      this.subscribeToControl();
      this.updateErrorMessage();
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public subscribeToControl(): void {
    if (this.control) {
      this.subscription = merge(this.control.valueChanges, this.control.statusChanges)
        .subscribe(() => this.updateErrorMessage());
    }
  }

  public updateErrorMessage(): void {
    if (this.control) {
      this.errorMessage = getFormControlErrorMessage(this.control);
      this.isInvalid = this.control.invalid && (this.control.touched || this.control.dirty);
    }
  }
}
