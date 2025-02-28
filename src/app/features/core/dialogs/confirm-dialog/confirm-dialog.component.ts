import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  imports: [],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.css'
})
export class ConfirmDialogComponent {
  @Input() message: string = '';
  @Input() onConfirm: () => void = () => {};
  @Input() onCancel: () => void = () => {};

  public closeDialog(event: Event) {
    if ((event.target as HTMLElement).classList.contains('overlay')) {
      this.onCancel();
    }
  }

}
