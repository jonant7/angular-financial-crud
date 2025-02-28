import {TestBed} from '@angular/core/testing';
import {ProductService} from './product.service';
import {Product} from '../../models/products/product';
import {createMockProducts, createProduct, createProductPost} from '../../models/products/product-factory';
import {ProductPost} from '../../models/products/product-post';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {provideHttpClient} from '@angular/common/http';

describe('ProductService', () => {
  let service: ProductService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    });

    service = TestBed.inject(ProductService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a list of products when GET request is successful', async () => {
    const mockProducts: Product[] = createMockProducts(3);
    const mockErrorResponse = {data: mockProducts, message: 'Success'}
    const testUrl = '/api/products';

    service.list().subscribe((products) => {
      expect(products).toEqual(mockProducts);
      expect(service.list()).toHaveBeenCalledWith(testUrl);
    });

    const req = httpTesting.expectOne(testUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockErrorResponse);
  });

  it('should return a boolean when GET request is successful', async () => {
    const mockErrorResponse = true
    const testUrl = '/api/products/verification/';

    service.validate('id').subscribe((result) => {
      expect(result).toEqual(true);
      expect(service.list()).toHaveBeenCalledWith(testUrl + 'id');
    });

    const req = httpTesting.expectOne(testUrl + 'id');
    expect(req.request.method).toBe('GET');
    req.flush(mockErrorResponse);
  });

  it('should return a product when POST request is successful', async () => {
    const mockProductPost: ProductPost = createProductPost();
    const mockProduct: Product = createProduct();
    const testUrl = '/api/products';

    service.create(mockProductPost).subscribe((result) => {
      expect(result).toEqual(true);
      expect(service.list()).toHaveBeenCalledWith(testUrl);
    });

    const req = httpTesting.expectOne(testUrl);
    expect(req.request.method).toBe('POST');
    req.flush(mockProduct);
  });

});
