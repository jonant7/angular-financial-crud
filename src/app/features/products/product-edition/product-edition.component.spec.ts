import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ProductEditionComponent} from './product-edition.component';
import {ProductService} from '../../../providers/products/product.service';
import {ToastService} from '../../../providers/core/toast/toast.service';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {of, throwError} from 'rxjs';
import {createProduct} from '../../../models/products/product-factory';
import {RouterModule} from '@angular/router';
import {ProductListComponent} from '../product-list/product-list.component';

describe('ProductEditionComponent', () => {
  let component: ProductEditionComponent;
  let fixture: ComponentFixture<ProductEditionComponent>;
  let productService: ProductService;
  let toastService: ToastService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductEditionComponent, RouterModule.forRoot(
        [{path: '', component: ProductListComponent}]
      )],
      providers: [ProductService, ToastService, provideHttpClient(), provideHttpClientTesting()]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ProductEditionComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService);
    toastService = TestBed.inject(ToastService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form group correctly', () => {
    expect(component.formGroup.contains('id')).toBeTruthy();
    expect(component.formGroup.contains('name')).toBeTruthy();
    expect(component.formGroup.contains('description')).toBeTruthy();
    expect(component.formGroup.contains('logo')).toBeTruthy();
    expect(component.formGroup.contains('date_release')).toBeTruthy();
    expect(component.formGroup.contains('date_revision')).toBeTruthy();
  });

  it('should subscribe to date_release valueChanges and update date_revision', () => {
    const updateDateRevisionSpy = jest.spyOn(component, 'updateDateRevision').mockImplementation();
    component.dateReleaseFormCtrl.setValue('2025-02-01');
    expect(component.updateDateRevision).toHaveBeenCalledWith('2025-02-01');
    expect(updateDateRevisionSpy).toHaveBeenCalled();
  });

  it('should reset the form while preserving the id value', () => {
    component.formGroup.setValue({
      id: '123',
      name: 'Test Product',
      description: 'Test Description',
      logo: 'logo.png',
      date_release: '2025-02-01',
      date_revision: '2026-02-01'
    });

    component.resetForm();

    expect(component.formGroup.value).toEqual({
      id: '123',
      name: null,
      description: null,
      logo: null,
      date_release: null,
      date_revision: null
    });
  });

  it('should update date_revision when releaseDate changes', () => {
    const releaseDate = '2025-02-01';
    const expectedRevisionDate = '2026-02-01';

    component.updateDateRevision(releaseDate);

    expect(component.dateRevisionFormCtrl.value).toBe(expectedRevisionDate);
  });

  it('should mark all controls as touched', () => {
    const markAsTouchedSpy = jest.fn();
    component.formGroup.controls['id'].markAsTouched = markAsTouchedSpy;
    component.formGroup.controls['name'].markAsTouched = markAsTouchedSpy;
    component.formGroup.controls['description'].markAsTouched = markAsTouchedSpy;
    component.formGroup.controls['logo'].markAsTouched = markAsTouchedSpy;
    component.formGroup.controls['date_release'].markAsTouched = markAsTouchedSpy;
    component.formGroup.controls['date_revision'].markAsTouched = markAsTouchedSpy;

    component.markAllAsTouched();

    Object.keys(component.formGroup.controls).forEach(() => {
      expect(markAsTouchedSpy).toHaveBeenCalled();
    });
  });

  it('should call markAllAsTouched when form is invalid', () => {
    const markAllAsTouchedSpy = jest.spyOn(component, 'markAllAsTouched');
    component.formGroup.controls['id'].setValue('');

    component.onSubmitForm();

    expect(markAllAsTouchedSpy).toHaveBeenCalled();
  });

  it('should show error when product already exists', () => {
    const formValue = createProduct();

    jest.spyOn(component, 'validateProduct').mockReturnValue(of(true));
    const showErrorSpy = jest.spyOn(toastService, 'showError');

    component.formGroup.setValue(formValue);
    component.onSubmitForm();

    expect(showErrorSpy).toHaveBeenCalledWith(`El producto con el ID ${formValue.id} ya existe.`);
  });


  it('should create product and show success message', () => {
    const productPost = createProduct();
    const createdProduct = createProduct();

    jest.spyOn(component, 'validateProduct').mockReturnValue(of(false));
    const createProductSpy = jest.spyOn(productService, 'create').mockReturnValue(of(createdProduct));
    const showSuccessSpy = jest.spyOn(toastService, 'showSuccess');
    const resetFormSpy = jest.spyOn(component, 'resetForm');
    const navigateSpy = jest.spyOn(component.router, 'navigate');

    component.formGroup.setValue(productPost);
    component.onSubmitForm();

    expect(createProductSpy).toHaveBeenCalledWith(productPost);
    expect(showSuccessSpy).toHaveBeenCalledWith(`Producto ${createdProduct.name} agregado`);
    expect(resetFormSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/product-list']);
  });

  it('should not create product and show error message', () => {
    const productPost = createProduct();
    const productId = productPost.id;

    jest.spyOn(component, 'validateProduct').mockReturnValue(of(true));
    const showErrorSpy = jest.spyOn(toastService, 'showError');

    component.formGroup.setValue(productPost);
    component.onSubmitForm();

    expect(showErrorSpy).toHaveBeenCalledWith(`El producto con el ID ${productId} ya existe.`);
  });

  it('should call productService.validate and return correct value', () => {
    const productId = '123';
    const validateProductSpy = jest.spyOn(productService, 'validate');
    validateProductSpy.mockReturnValue(of(true));

    component.validateProduct(productId).subscribe(result => {
      expect(validateProductSpy).toHaveBeenCalledWith(productId);
      expect(result).toBe(true);
    });

    validateProductSpy.mockReturnValue(of(false));

    component.validateProduct('456').subscribe(result => {
      expect(validateProductSpy).toHaveBeenCalledWith('456');
      expect(result).toBe(false);
    });
  });

  it('should show error when product creation fails', () => {
    const productPost = createProduct();
    const errorMessage = 'Failed to create product';

    jest.spyOn(component, 'validateProduct').mockReturnValue(of(false));
    jest.spyOn(productService, 'create').mockReturnValue(throwError(() => new Error(errorMessage)));
    const showErrorSpy = jest.spyOn(toastService, 'showError');

    component.formGroup.setValue(productPost);
    component.onSubmitForm();

    expect(showErrorSpy).toHaveBeenCalledWith(errorMessage);
  });

  it('should format a valid ISO date string correctly', () => {
    const isoDate = '2025-02-01';
    expect(component.formatToDate(isoDate)).toBe('2025-02-01');
  });

  it('should format a dd/mm/yyyy date string correctly', () => {
    const dateStr = '01/02/2025'; // Formato día/mes/año
    expect(component.formatToDate(dateStr)).toBe('2025-02-01');
  });

  it('should format a Date object correctly', () => {
    const dateObj = new Date('2025-02-01');
    expect(component.formatToDate(dateObj)).toBe('2025-02-01');
  });

  it('should return empty string for invalid date input', () => {
    expect(component.formatToDate('invalid')).toBe('');
  });

  it('should update product and show success message in edition mode', () => {
    const productPut = createProduct();
    // Se establece el modo edición y se simula que el producto ya fue cargado.
    component.isEdition = true;
    component.product = { ...productPut };
    component.formGroup.setValue({
      id: productPut.id,
      name: productPut.name,
      description: productPut.description,
      logo: productPut.logo,
      date_release: productPut.date_release,
      date_revision: productPut.date_revision
    });

    const updatedProduct = { ...productPut, name: 'Updated Name' };
    jest.spyOn(productService, 'update').mockReturnValue(of(updatedProduct));
    const showSuccessSpy = jest.spyOn(toastService, 'showSuccess');
    const loadProductSpy = jest.spyOn<any, any>(component, 'loadProduct');

    component.onSubmitForm();

    expect(productService.update).toHaveBeenCalledWith(productPut.id, expect.any(Object));
    expect(showSuccessSpy).toHaveBeenCalledWith(`Producto ${updatedProduct.id} actualizado`);
    expect(loadProductSpy).toHaveBeenCalledWith(updatedProduct.id);
  });

  it('should load product and patch the form with product data', () => {
    const product = createProduct();
    const getProductSpy = jest.spyOn(productService, 'get').mockReturnValue(of(product));
    (component as any).loadProduct(product.id);
    expect(getProductSpy).toHaveBeenCalledWith(product.id);

    const patchedFormValue = {
      id: product.id,
      name: product.name,
      description: product.description,
      logo: product.logo,
      date_release: product.date_release.toISOString().split('T')[0],
      date_revision: product.date_revision.toISOString().split('T')[0]
    };

    expect(component.formGroup.value).toEqual(patchedFormValue);
  });


  it('should handle error response by showing error message', () => {
    const error = { message: 'Test error message' };
    jest.spyOn(toastService, 'showError');
    (component as any).handleErrorResponse(error);
    expect(toastService.showError).toHaveBeenCalledWith(error.message);
  });

  it('should unsubscribe on destroy', () => {
    const nextSpy = jest.spyOn((component as any)._unsubscribeAll, 'next');
    const completeSpy = jest.spyOn((component as any)._unsubscribeAll, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
