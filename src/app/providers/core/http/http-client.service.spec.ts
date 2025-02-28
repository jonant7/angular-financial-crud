import {TestBed} from '@angular/core/testing';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {ApiResponse, HttpClientService} from './http-client.service';
import {provideHttpClient} from '@angular/common/http';
import {HttpResponseError} from "../../../models/core/http-response-error";

describe('HttpClientService', () => {
  let service: HttpClientService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HttpClientService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    });

    service = TestBed.inject(HttpClientService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  test('should return data for GET request', () => {
    const testUrl = '/api/test';
    const mockResponse: ApiResponse = {message: 'Success'};

    service.get(testUrl).subscribe(response => {
      expect(response.message).toBe('Success');
    });

    const req = httpTesting.expectOne(testUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  test('should handle error for GET request', () => {
    const testUrl = '/api/test';
    const mockErrorResponse = {message: 'Error occurred'};

    service.get(testUrl).subscribe({
      next: () => fail('should have failed wtesth the error response'),
      error: (error) => {
        expect(error.message).toBe('Error occurred');
      }
    });

    const req = httpTesting.expectOne(testUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockErrorResponse, {status: 500, statusText: 'Server Error'});
  });

  test('should return data for POST request', () => {
    const testUrl = '/api/test';
    const mockResponse: ApiResponse = {message: 'Created'};
    const requestBody = {data: 'sample data'};

    service.post(testUrl, requestBody).subscribe(response => {
      expect(response.message).toBe('Created');
    });

    const req = httpTesting.expectOne(testUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(requestBody);
    req.flush(mockResponse);
  });

  test('should return data for PUT request', () => {
    const testUrl = '/api/test';
    const mockResponse: ApiResponse = {message: 'Updated'};
    const requestBody = {data: 'updated data'};

    service.put(testUrl, requestBody).subscribe(response => {
      expect(response.message).toBe('Updated');
    });

    const req = httpTesting.expectOne(testUrl);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(requestBody);
    req.flush(mockResponse);
  });

  test('should return data for PATCH request', () => {
    const testUrl = '/api/test';
    const mockResponse: ApiResponse = {message: 'Patched'};
    const requestBody = {data: 'patched data'};

    service.patch(testUrl, requestBody).subscribe(response => {
      expect(response.message).toBe('Patched');
    });

    const req = httpTesting.expectOne(testUrl);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(requestBody);
    req.flush(mockResponse);
  });

  test('should return data for DELETE request', () => {
    const testUrl = '/api/test';
    const mockResponse: ApiResponse = {message: 'Deleted'};

    service.delete(testUrl).subscribe(response => {
      expect(response.message).toBe('Deleted');
    });

    const req = httpTesting.expectOne(testUrl);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });

  it('should throw an error using error.message if available', (done) => {
    const testUrl = '/api/test';
    const mockErrorResponse: HttpResponseError = { message: 'Test error message', cause: 'Test cause' };

    service.get(testUrl).subscribe({
      next: () => done.fail('Expected error to be thrown'),
      error: (error: Error) => {
        expect(error.message).toBe('Test error message');
        done();
      }
    });

    const req = httpTesting.expectOne(testUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockErrorResponse, { status: 201, statusText: 'Server Error' });
  });

  it('should throw an error using response.statusText if error.message is null', (done) => {
    const testUrl = '/api/test';
    const mockErrorResponse: HttpResponseError = { message: null as any, cause: 'Test cause' };

    service.get(testUrl).subscribe({
      next: () => done.fail('Expected error to be thrown'),
      error: (error: Error) => {
        expect(error.message).toBe('Server Error');
        done();
      }
    });

    const req = httpTesting.expectOne(testUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockErrorResponse, { status: 201, statusText: 'Server Error' });
  });

});
