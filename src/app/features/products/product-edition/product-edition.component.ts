import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {FormControlComponent} from '../../core/form/form-control/form-control.component';
import {ProductPost} from '../../../models/products/product-post';
import {mergeMap, Observable, of, Subject, takeUntil} from 'rxjs';
import {ProductService} from '../../../providers/products/product.service';
import {ToastService} from '../../../providers/core/toast/toast.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Product} from '../../../models/products/product';
import {ProductPut} from '../../../models/products/product-put';
import {isNullOrUndefined} from '../../../utils/object.utils';

@Component({
  selector: 'app-product-edition',
  imports: [
    ReactiveFormsModule,
    FormControlComponent
  ],
  templateUrl: './product-edition.component.html',
  styleUrls: ['./product-edition.component.css']
})
export class ProductEditionComponent implements OnInit, OnDestroy {
  private readonly productService: ProductService = inject(ProductService);
  private readonly toastService: ToastService = inject(ToastService);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  public readonly formBuilder: FormBuilder = inject(FormBuilder);
  public readonly router: Router = inject(Router);
  public formGroup: FormGroup;
  private _unsubscribeAll: Subject<void> = new Subject<void>();
  public product: Product = null;
  public isEdition = false;

  ngOnInit(): void {
    this.activatedRoute.paramMap
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(params => {
        const id = params.get('id');
        if (!isNullOrUndefined(id)) {
          this.isEdition = true;
          this.loadProduct(id);
        } else {
          this.isEdition = false;
        }
      });

    this.initForm();

    this.dateReleaseFormCtrl.valueChanges
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(value => {
        if (value) {
          this.updateDateRevision(value);
        }
      });
  }

  private initForm(): void {
    this.formGroup = this.formBuilder.group({
      id: [{value: '', disabled: this.isEdition}, [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', [Validators.required]],
      date_release: ['', [Validators.required]],
      date_revision: ['', [Validators.required]]
    });
  }

  private loadProduct(id: string): void {
    this.productService.get(id)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(product => {
        this.product = product;
        this.formGroup.patchValue({
          id: product.id,
          name: product.name,
          description: product.description,
          logo: product.logo,
          date_release: this.formatToDate(product.date_release),
          date_revision: this.formatToDate(product.date_revision)
        });
      });
  }

  public onSubmitForm(): void {
    if (this.formGroup.invalid) {
      this.markAllAsTouched();
      return;
    }

    const formValue = {...this.formGroup.getRawValue()};
    const request$: Observable<any> = this.isEdition
      ? this.productService.update(this.product.id, formValue as ProductPut)
      : this.validateProduct(formValue.id).pipe(
        mergeMap(existProduct =>
          existProduct
            ? this.showProductExistsError(formValue.id)
            : this.productService.create(formValue as ProductPost)
        )
      );

    request$.pipe(takeUntil(this._unsubscribeAll)).subscribe({
      next: (response) => {
        const message = this.isEdition
          ? `Producto ${response.id} actualizado`
          : `Producto ${response.name} agregado`;

        this.toastService.showSuccess(message);

        if (this.isEdition) {
          this.loadProduct(response.id);
        } else {
          this.resetForm();
          this.router.navigate(['/product-list']);
        }
      },
      error: (error) => this.handleErrorResponse(error)
    });
  }

  private showProductExistsError(productId: string): Observable<null> {
    this.toastService.showError(`El producto con el ID ${productId} ya existe.`);
    return of(null);
  }

  private handleErrorResponse(error: any): void {
    this.toastService.showError(error.message);
  }

  public resetForm(): void {
    const idValue = this.idFormCtrl.value;
    this.formGroup.reset();
    this.idFormCtrl.setValue(idValue);
  }

  public updateDateRevision(releaseDate: string): void {
    const release = new Date(releaseDate);
    const revisionDate = new Date(release.setFullYear(release.getFullYear() + 1));
    this.dateRevisionFormCtrl.setValue(revisionDate.toISOString().split('T')[0]);
  }

  public markAllAsTouched(): void {
    Object.values(this.formGroup.controls).forEach(control => {
      control.markAsTouched();
      control.updateValueAndValidity({onlySelf: true, emitEvent: true});
    });
  }

  public validateProduct(productId: string): Observable<boolean> {
    return this.productService.validate(productId)
      .pipe(takeUntil(this._unsubscribeAll));
  }

  public formatToDate(input: string | Date): string {
    let date: Date;

    if (typeof input === 'string') {
      if (this.isValidDateFormat(input)) {
        date = new Date(input);
      } else {
        date = this.parseDateString(input);
      }
    } else if (input instanceof Date) {
      date = input;
    } else {
      return '';
    }

    if (isNaN(date.getTime())) {
      console.warn(`Fecha inválida: ${input}`);
      return '';
    }

    return date.toISOString().split('T')[0];
  }

  private isValidDateFormat(dateStr: string): boolean {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(dateStr);
  }

  private parseDateString(dateStr: string): Date {
    const dateParts = dateStr.split('/').map(Number);
    if (dateParts.length !== 3 || dateParts.some(isNaN)) {
      console.warn(`Formato de fecha inválido: ${dateStr}`);
      return new Date('Invalid Date');
    }
    return new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
  }

  public get idFormCtrl(): FormControl {
    return this.formGroup.get('id') as FormControl;
  }

  public get nameFormCtrl(): FormControl {
    return this.formGroup.get('name') as FormControl;
  }

  public get descriptionFormCtrl(): FormControl {
    return this.formGroup.get('description') as FormControl;
  }

  public get logoFormCtrl(): FormControl {
    return this.formGroup.get('logo') as FormControl;
  }

  public get dateReleaseFormCtrl(): FormControl {
    return this.formGroup.get('date_release') as FormControl;
  }

  public get dateRevisionFormCtrl(): FormControl {
    return this.formGroup.get('date_revision') as FormControl;
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
