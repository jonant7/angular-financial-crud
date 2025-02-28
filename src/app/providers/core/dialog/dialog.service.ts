import {ApplicationRef, createComponent, EnvironmentInjector, Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {ConfirmDialogComponent} from '../../../features/core/dialogs/confirm-dialog/confirm-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {
  private dialogSubject = new Subject<boolean>();

  constructor(private appRef: ApplicationRef, private environmentInjector: EnvironmentInjector) {
  }

  openDialog(message: string): Subject<boolean> {
    const componentRef = createComponent(ConfirmDialogComponent, {
      environmentInjector: this.environmentInjector
    });

    componentRef.instance.message = message;
    componentRef.instance.onConfirm = () => {
      this.dialogSubject.next(true);
      this.closeDialog(componentRef);
    };
    componentRef.instance.onCancel = () => {
      this.dialogSubject.next(false);
      this.closeDialog(componentRef);
    };

    this.appRef.attachView(componentRef.hostView);
    document.body.appendChild((componentRef.hostView as any).rootNodes[0]);

    return this.dialogSubject;
  }

  private closeDialog(componentRef: any) {
    this.appRef.detachView(componentRef.hostView);
    componentRef.destroy();
  }
}
