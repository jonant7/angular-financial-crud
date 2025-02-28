import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClientService} from '../core/http/http-client.service';
import {Product} from '../../models/products/product';
import {map} from 'rxjs/operators';
import {ProductPost} from '../../models/products/product-post';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private readonly httpClientService: HttpClientService = inject(HttpClientService);

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

}
