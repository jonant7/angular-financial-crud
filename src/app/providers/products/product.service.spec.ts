import {TestBed} from '@angular/core/testing';
import {ProductService} from './product.service';
import {HttpClientService} from '../core/http/http-client.service';
import {Product} from '../../models/products/product';
import {of} from 'rxjs';

describe('ProductService', () => {
  let service: ProductService;
  let httpClientServiceMock: jest.Mocked<HttpClientService>;

  beforeEach(() => {
    const mockHttpClientService = {
      get: jest.fn()
    } as unknown as jest.Mocked<HttpClientService>;

    TestBed.configureTestingModule({
      providers: [
        ProductService,
        { provide: HttpClientService, useValue: mockHttpClientService } // Usa el mock
      ]
    });

    service = TestBed.inject(ProductService);
    httpClientServiceMock = TestBed.inject(HttpClientService) as jest.Mocked<HttpClientService>;
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  test('should return a list of products when GET request is successful', (done) => {
    const mockProducts: Product[] = [
      { id: 'id-1', name: 'Product 1', description: 'Description 1', logo: 'logo-1.jpg', dateRelease: new Date(), dateRevision: new Date() },
      { id: 'id-2', name: 'Product 2', description: 'Description 2', logo: 'logo-2.jpg', dateRelease: new Date(), dateRevision: new Date() },
    ];

    httpClientServiceMock.get.mockReturnValue(of({ data: mockProducts, message: 'Success' }));

    service.list().subscribe((products) => {
      expect(products).toEqual(mockProducts);
      expect(httpClientServiceMock.get).toHaveBeenCalledWith('/api/products');
      done();
    });
  });
});
