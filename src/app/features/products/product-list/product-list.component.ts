import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {Product} from '../../../models/products/product';
import {ProductService} from '../../../providers/products/product.service';
import {Subject, takeUntil} from 'rxjs';
import {Column, ColumnType, FinancialTableComponent} from '../../core/financial-table/financial-table.component';
import {ToastService} from '../../../providers/core/toast/toast.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    FinancialTableComponent
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit, OnDestroy {
  private readonly productService: ProductService = inject(ProductService);
  private readonly toastService: ToastService = inject(ToastService);
  public readonly displayedColumns: Column[] = [
    {name: 'logo', label: 'Logo', type: ColumnType.IMAGE, align: 'center'},
    {name: 'name', label: 'Nombre', type: ColumnType.TEXT},
    {name: 'description', label: 'Descripción', type: ColumnType.TEXT},
    {name: 'date_release', label: 'Fecha de Lanzamiento', type: ColumnType.DATE},
    {name: 'date_revision', label: 'Fecha de Revisión', type: ColumnType.DATE},
    {name: 'action', label: '', type: ColumnType.ACTION}
  ];
  private _unsubscribeAll: Subject<void> = new Subject<void>();
  public dataSource: Product[] = [];

  public ngOnInit(): void {
    this.productService.list()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response) => {
          this.dataSource = response;
        },
        error: (error) => {
          this.toastService.showError(error.message);
        }
      });
  }

  public ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
