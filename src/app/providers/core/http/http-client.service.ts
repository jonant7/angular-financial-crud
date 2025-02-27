import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {HttpRequestOptions} from '../../../models/core/http-request-options';
import {normalizeHttpRequestOptions} from '../../../utils/http.utils';
import {HttpResponseError} from '../../../models/core/http-response-error';
import {firstNonNull} from '../../../utils/object.utils';

export interface ApiResponse {
  [prop: string]: any;

  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {

  private readonly ngHttpClientService: HttpClient = inject(HttpClient);
  private readonly baseHeaders: HttpHeaders | undefined;

  private httpCall<T>(method: string, url: string, options?: HttpRequestOptions, body?: any): Observable<ApiResponse> {
    options = normalizeHttpRequestOptions(options, this.baseHeaders);
    return this.ngHttpClientService.request<ApiResponse>(method, url, {
      observe: 'response',
      params: options.parameters,
      headers: options.headers,
      body: body
    }).pipe(
      map((response: HttpResponse<ApiResponse>) => {
        if (response.status === 200) {
          return response.body as ApiResponse;
        }
        const error: HttpResponseError = response.body as any;
        throw new Error(firstNonNull(error.message, response.statusText));
      })
    );
  }

  public get<T>(url: string, options?: HttpRequestOptions): Observable<ApiResponse> {
    return this.httpCall('get', url, options);
  }

  public post<T>(url: string, body?: any, options?: HttpRequestOptions): Observable<ApiResponse> {
    return this.httpCall('post', url, options, body);
  }

  public put<T>(url: string, body?: any, options?: HttpRequestOptions): Observable<ApiResponse> {
    return this.httpCall('put', url, options, body);
  }

  public patch<T>(url: string, body?: any, options?: HttpRequestOptions): Observable<ApiResponse> {
    return this.httpCall('patch', url, options, body);
  }

  public delete<T>(url: string, options?: HttpRequestOptions): Observable<ApiResponse> {
    return this.httpCall('delete', url, options);
  }

}
