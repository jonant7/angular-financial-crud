import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClientService} from '../core/http/http-client.service';
import {Product} from '../../models/products/product';
import {map} from 'rxjs/operators';

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

}
