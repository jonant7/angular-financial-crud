import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MainComponent} from './main.component';

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should be created', () => {
    expect(component).toBeTruthy();
  });

  test('should have "Banco" as the header title', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('main')).not.toBe(null);
    expect(compiled.querySelector('main > header')).not.toBe(null);
    const h1Element = compiled.querySelector('main > header > h1');
    expect(h1Element.textContent).toContain('Banco');
  });

  test('should have a router-outlet', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });

});

