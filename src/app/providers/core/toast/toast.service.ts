import {ApplicationRef, createComponent, EnvironmentInjector, Injectable, Injector} from '@angular/core';
import {ToastComponent} from '../../../features/core/toast/toast.component';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  messageSubject = new Subject<{ type: 'success' | 'error', message: string }>();

  constructor(private appRef: ApplicationRef, private environmentInjector: EnvironmentInjector) {
  }

  showSuccess(message: string) {
    this.messageSubject.next({type: 'success', message});
    this.createToast(message, 'toast-success');
  }

  showError(message: string) {
    this.messageSubject.next({type: 'error', message});
    this.createToast(message, 'toast-error');
  }

  private createToast(message: string, toastClass: string) {
    const componentRef = createComponent(ToastComponent, {
      environmentInjector: this.environmentInjector
    });

    componentRef.instance.message = message;
    componentRef.instance.toastClass = toastClass;

    this.appRef.attachView(componentRef.hostView);
    document.body.appendChild((componentRef.hostView as any).rootNodes[0]);

    setTimeout(() => {
      this.appRef.detachView(componentRef.hostView);
      componentRef.destroy();
    }, 2000);
  }
}
