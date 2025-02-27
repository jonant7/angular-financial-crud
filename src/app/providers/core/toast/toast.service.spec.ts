import {ToastService} from './toast.service';
import {TestBed} from '@angular/core/testing';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {ApplicationRef} from '@angular/core';

describe('ToastService', () => {
  let service: ToastService;
  let appRef: ApplicationRef;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ToastService,
        provideHttpClient(),
        provideHttpClientTesting(),
        ApplicationRef
      ]
    });

    service = TestBed.inject(ToastService);
    appRef = TestBed.inject(ApplicationRef);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  test('should show success toast', () => {
    const message = 'Operation was successful';
    const spy = jest.spyOn(document.body, 'appendChild');
    service.messageSubject.subscribe();
    service.showSuccess(message);
    expect(spy).toHaveBeenCalled();
    expect(service.messageSubject.observers.length).toBeGreaterThan(0);
  });

  test('should show error toast', () => {
    const message = 'Operation failed';
    const spy = jest.spyOn(document.body, 'appendChild');
    service.messageSubject.subscribe();
    service.showError(message);
    expect(spy).toHaveBeenCalled();
    expect(service.messageSubject.observers.length).toBeGreaterThan(0); // Ahora debe ser > 0
  });

  test('should detach and destroy toast after timeout', (done) => {
    const message = 'Temporary message';
    jest.useFakeTimers();
    service.messageSubject.subscribe();
    const detachViewSpy = jest.spyOn(appRef, 'detachView');
    service.showSuccess(message);
    expect(detachViewSpy).not.toHaveBeenCalled();
    jest.advanceTimersByTime(2000);
    expect(detachViewSpy).toHaveBeenCalled();
    done();
  });

});
