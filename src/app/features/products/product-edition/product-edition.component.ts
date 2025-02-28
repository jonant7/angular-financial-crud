import {Component, inject, OnDestroy} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {FormControlComponent} from '../../core/form/form-control/form-control.component';
import {ProductPost} from '../../../models/products/product-post';
import {Observable, of, Subject, switchMap, takeUntil} from 'rxjs';
import {ProductService} from '../../../providers/products/product.service';
import {ToastService} from '../../../providers/core/toast/toast.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-product-edition',
  imports: [
    ReactiveFormsModule,
    FormControlComponent
  ],
  templateUrl: './product-edition.component.html',
  styleUrl: './product-edition.component.css'
})
export class ProductEditionComponent implements OnDestroy {
  private readonly productService: ProductService = inject(ProductService);
  private readonly toastService: ToastService = inject(ToastService);
  public readonly formGroup: FormGroup;
  private _unsubscribeAll: Subject<void> = new Subject<void>();

  constructor(private formBuilder: FormBuilder, public router: Router) {
    this.formGroup = this.formBuilder.group({
      id: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', [Validators.required]],
      date_release: ['', [Validators.required]],
      date_revision: ['', [Validators.required]],
    });
    this.dateReleaseFormCtrl.valueChanges.subscribe(value => {
      if (value) {
        this.updateDateRevision(value);
      }
    });
  }

  public ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  public onSubmitForm(): void {
    if (this.formGroup.invalid) {
      this.markAllAsTouched();
      return;
    }

    const formValue: ProductPost = {...this.formGroup.value};
    this.validateProduct(formValue.id).pipe(
      takeUntil(this._unsubscribeAll),
      switchMap(existProduct => {
        if (existProduct) {
          this.toastService.showError(`El producto con el ID ${formValue.id} ya existe.`);
          return of(null);
        }
        return this.productService.create(formValue as ProductPost);
      })
    ).subscribe({
      next: (product) => {
        if (product) {
          this.toastService.showSuccess(`Producto ${product.name} agregado`);
          this.resetForm();
          this.router.navigate(['/product-list']);
        }
      },
      error: (error) => {
        this.toastService.showError(error.message);
      }
    });
  }

  public resetForm(): void {
    this.formGroup.reset();
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
    return this.productService.validate(productId).pipe(
      takeUntil(this._unsubscribeAll)
    );
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

}
