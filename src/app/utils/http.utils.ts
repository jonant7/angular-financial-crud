import {HttpHeaders} from '@angular/common/http';
import {HttpRequestOptions} from '../models/core/http-request-options';
import {isNullOrEmpty, isNullOrUndefined} from './object.utils';

export function normalizeHttpRequestOptions(
  options?: HttpRequestOptions, baseHeaders?: HttpHeaders): HttpRequestOptions {
  let headers: HttpHeaders | undefined;
  if (options !== undefined) {
    headers = options.headers;
  } else {
    options = {};
  }
  if (isNullOrUndefined(headers)) {
    headers = new HttpHeaders();
  }
  if (baseHeaders != null) {
    baseHeaders.keys()
      .filter(key => !isNullOrEmpty(key))
      .forEach(key => {
        headers = headers?.append(key, baseHeaders?.get(key) as string);
      });
  }
  options.headers = headers;
  return options as HttpRequestOptions;
}
