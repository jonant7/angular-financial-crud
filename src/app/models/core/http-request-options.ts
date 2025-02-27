import {HttpHeaders, HttpParams} from '@angular/common/http';

export interface HttpRequestOptions {
  parameters?: HttpParams;
  headers?: HttpHeaders;
}
