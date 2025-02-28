import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClientService} from '../core/http/http-client.service';
import {Product} from '../../models/products/product';
import {map} from 'rxjs/operators';
import {ProductPost} from '../../models/products/product-post';
import {Router} from '@angular/router';
import {ProductPut} from '../../models/products/product-put';
import {ConfirmDialogService} from '../core/dialog/dialog.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private readonly httpClientService: HttpClientService = inject(HttpClientService);
  private readonly dialogService: ConfirmDialogService = inject(ConfirmDialogService);
  private readonly router: Router = inject(Router);

  public list(): Observable<Product[]> {
    return this.httpClientService.get(`/api/products`)
      .pipe(map(response => {
        return response['data'];
      }));
  }

  public validate(id: String): Observable<boolean> {
    return this.httpClientService.get(`/api/products/verification/${id}`)
      .pipe(
        map(response => {
          return response as unknown as boolean;
        })
      );
  }

  public create(product: ProductPost): Observable<Product> {
    return this.httpClientService.post('/api/products', product)
      .pipe(
        map(response => {
          return response['data'];
        })
      );
  }

  public update(id: string, product: ProductPut): Observable<Product> {
    return this.httpClientService.put(`/api/products/${id}`, product)
      .pipe(
        map(response => {
          return response['data'];
        })
      );
  }

  public get(id: string): Observable<Product> {
    return this.httpClientService.get(`/api/products/${id}`)
      .pipe(
        map(response => {
          return response as unknown as Product;
        })
      );
  }

  public delete(id: string): Observable<string> {
    return this.httpClientService.delete(`/api/products/${id}`)
      .pipe(
        map(response => {
          return response.message;
        })
      );
  }

  public onEdit(product: Product): void {
    this.router.navigate([`/edit/${product.id}`]);
  }

  public openConfirmationDialog(product: Product): Observable<boolean> {
    return this.dialogService.openDialog(`¿Estás seguro de eliminar el producto ${product.name}?`);
  }

}
