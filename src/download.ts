import axios, { AxiosResponse } from 'axios';
import { DownloadError } from './errors';
import { throwError, Observable, of } from 'rxjs';
import { map, catchError, flatMap } from 'rxjs/operators';
import { DownloadResult } from './interfaces/download-results';
import { Headers } from './interfaces/headers';

const responseType: 'stream' = 'stream';

export const download =
  (url: string, timeout: number, headers?: Headers): Observable<DownloadResult> =>
    of({ url, args: { headers, timeout, responseType } }).pipe(
      flatMap(({ url, args }) => axios.get(url, args)),
      map((response: AxiosResponse) => ({
        stream: response.data,
        contentType: response.headers['content-type'] || ''
      })),
      catchError(e => throwError(new DownloadError(e)))
    );
