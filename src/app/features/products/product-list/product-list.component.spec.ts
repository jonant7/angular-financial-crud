import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ProductListComponent} from './product-list.component';
import {ProductService} from '../../../providers/products/product.service';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {of, throwError} from 'rxjs';
import {Product} from '../../../models/products/product';
import {ToastService} from '../../../providers/core/toast/toast.service';
import {provideHttpClient} from '@angular/common/http';
import {createMockProducts} from '../../../models/products/product-factory';
import {RouterModule} from '@angular/router';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productService: ProductService;
  let toastService: ToastService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductListComponent, RouterModule.forRoot(
        [{path: '', component: ProductListComponent}]
      )],
      providers: [ProductService, ToastService, provideHttpClient(), provideHttpClientTesting(),]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService);
    toastService = TestBed.inject(ToastService);
    fixture.detectChanges();
  });

  test('should be created', () => {
    expect(component).toBeTruthy();
  });

  test('should list products and assign dataSource', () => {
    const mockProducts: Product[] = createMockProducts();
    const spy = jest
      .spyOn(productService, 'list')
      .mockReturnValue(of(mockProducts));
    component.ngOnInit();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
    expect(component.dataSource).toEqual(mockProducts);
  });

  test('should clean subscription', () => {
    const unsubscribeSpy = jest.spyOn(component['_unsubscribeAll'], 'next');
    const completeSpy = jest.spyOn(component['_unsubscribeAll'], 'complete');
    component.ngOnDestroy();
    expect(unsubscribeSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  test('should show toast error', () => {
    const errorMessage = 'Some error message';
    const toastServiceSpy = jest.spyOn(toastService, 'showError').mockImplementation(jest.fn());
    const spy = jest
      .spyOn(productService, 'list')
      .mockReturnValue(throwError(() => new Error(errorMessage)));
    component.ngOnInit();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
    expect(component.dataSource).toEqual([]);
    expect(toastServiceSpy).toHaveBeenCalledWith(errorMessage);
    toastServiceSpy.mockRestore();
  });

});
