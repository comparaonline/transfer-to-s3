import { S3, Config } from 'aws-sdk';
import { UploadError, DownloadError } from './errors';
import { download } from './download';
import { tap } from 'rxjs/operators';
import { backoff } from '@comparaonline/backoff';
import { ContentTypeFilter } from './interfaces/content-type-filter';
import { DownloadResult } from './interfaces/download-results';
import { TransferToS3Configuration } from './interfaces/transfer-to-s3-configuration';
import { Headers } from './interfaces/headers';

export class TransferToS3 {
  private headers?: Headers = undefined;
  private s3 = new S3(new Config({
    accessKeyId: this.config.s3.accessKeyId,
    secretAccessKey: this.config.s3.secretAccessKey,
    region: this.config.s3.region
  }));

  constructor(
    private config: TransferToS3Configuration,
    private filterContentType?: ContentTypeFilter
  ) {}

  /**
   * Downloads a file and uploads it to the configured s3 bucket
   * @param url The URL to download the file from
   * @param name The name to give the uploaded file (can contain folders)
   * @throws DownloadError if there was an error downloading the file
   * @throw UploadError if there was an error uploading the file to S3
   */
  async transfer(url: string, name: string): Promise<void> {
    const result = await this.download(url);
    await this.uploadToS3(result, name);
  }

  /**
   * Set headers that are needed for the download (e.g. authentication)
   * @param headers
   */
  setHeaders(headers?: Headers): void {
    this.headers = headers;
  }

  private download(url: string): Promise<DownloadResult> {
    const tries = this.config.download.attempts;
    const backoffTime = this.config.download.backoffTime;
    const timeout = this.config.download.timeout;
    return download(url, timeout, this.headers).pipe(
      tap((res) => {
        if (this.filterContentType && !this.filterContentType(res.contentType)) {
          throw new DownloadError(new Error('invalid voucher'));
        }
      }),
      backoff(tries, backoffTime)
    ).toPromise();
  }

  private async uploadToS3(download: DownloadResult, key: string) {
    try {
      return await this.s3.upload({
        Bucket: this.config.s3.bucket,
        Key: key,
        Body: download.stream,
        ContentType: download.contentType,
        ACL: 'public-read'
      }).promise();
    } catch (e) {
      throw new UploadError(e);
    }
  }
}
