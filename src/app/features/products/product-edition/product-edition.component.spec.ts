import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ProductEditionComponent} from './product-edition.component';
import {ProductService} from '../../../providers/products/product.service';
import {ToastService} from '../../../providers/core/toast/toast.service';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {of, throwError} from 'rxjs';
import {createProduct, createProductPost} from '../../../models/products/product-factory';

describe('ProductEditionComponent', () => {
  let component: ProductEditionComponent;
  let fixture: ComponentFixture<ProductEditionComponent>;
  let productService: ProductService;
  let toastService: ToastService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductEditionComponent],
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

  it('should reset the form', () => {
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
      id: null,
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

    Object.keys(component.formGroup.controls).forEach(key => {
      expect(markAsTouchedSpy).toHaveBeenCalled();
    });
  });

  it('should call markAllAsTouched when form is invalid', () => {
    const markAllAsTouchedSpy = jest.spyOn(component, 'markAllAsTouched');
    component.formGroup.controls['id'].setValue('');

    component.onSubmitForm();

    expect(markAllAsTouchedSpy).toHaveBeenCalled();
  });

  it('should show error when product already exists', (done) => {
    const formValue = createProductPost();

    jest.spyOn(component, 'validateProduct').mockReturnValue(of(true));

    const showErrorSpy = jest.spyOn(toastService, 'showError');

    component.formGroup.setValue(formValue);

    component.onSubmitForm();

    setTimeout(() => {
      expect(showErrorSpy).toHaveBeenCalledWith(`El producto con el ID ${formValue.id} ya existe.`);
      done();
    }, 0);
  });

  it('should create product and show success message', () => {
    const productPost = createProductPost();
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
    const productPost = createProductPost();
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
    const productPost = createProductPost();
    const errorMessage = 'Failed to create product';

    jest.spyOn(component, 'validateProduct').mockReturnValue(of(false));
    jest.spyOn(productService, 'create').mockReturnValue(throwError(() => new Error(errorMessage)));
    const showErrorSpy = jest.spyOn(toastService, 'showError');

    component.formGroup.setValue(productPost);

    component.onSubmitForm();

    expect(showErrorSpy).toHaveBeenCalledWith(errorMessage);
  });



});
