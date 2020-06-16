import { TransferToS3Configuration } from '../interfaces/transfer-to-s3-configuration';
import { TransferToS3 } from '../transfer-to-s3';
import { describeRecording } from '../test/helpers';
import { DownloadError, UploadError } from '../errors';
import axios from 'axios';

const testConfig: TransferToS3Configuration = {
  download: {
    timeout: 60000,
    attempts: 0,
    backoffTime: 2000
  },
  s3: {
    accessKeyId: 'FAKEACCESSKEYID',
    secretAccessKey: 'FAKSESECRETACCESSKEY',
    region: 'us-east-1',
    bucket: 'test-bucket-name'
  }
};

describe('RemoteTransferer', () => {
  describeRecording('when everything is OK', () => {
    it('uploads a url to S3', async () => {
      const uploader = new TransferToS3(testConfig);
      await expect(uploader.transfer('http://example.org', 'test/example.html'))
        .resolves.toBeUndefined();
    });
  });

  describeRecording('when the download fails', () => {
    it('throws a request failed error', async () => {
      const uploader = new TransferToS3(testConfig);
      await expect(uploader.transfer('http://example.org', 'test/example.html'))
        .rejects.toThrow(DownloadError);
    });
  });

  describeRecording('when the download is json', () => {
    it('throws a request failed error', async () => {
      const validator = (contentType: string) => !contentType.startsWith('application/json');
      const uploader = new TransferToS3(testConfig, validator);
      await expect(uploader.transfer('http://example.org', 'test/example.html'))
        .rejects.toThrow(DownloadError);
    });
  });

  describeRecording('when the download doesnt have a content type', () => {
    it('works normally', async () => {
      const uploader = new TransferToS3(testConfig);
      await expect(uploader.transfer('http://example.org', 'test/example.html'))
        .resolves.toBeUndefined();
    });
  });
  describeRecording('when the upload fails', () => {
    it('uploads a url to S3', async () => {
      const uploader = new TransferToS3(testConfig);
      await expect(uploader.transfer('http://example.org', 'test/example.html'))
        .rejects.toThrow(UploadError);
    });
  });

  describeRecording('when headers are specified', () => {
    beforeEach(() => jest.spyOn(axios, 'get'));
    it('adds the specified headers to the request', async () => {
      const uploader = new TransferToS3(testConfig);
      const headers = { 'x-test-header': 'value' };
      uploader.setHeaders(headers);
      await expect(uploader.transfer('http://example.org', 'test/example.html'))
        .resolves.toBeUndefined();
      expect(axios.get).toHaveBeenCalledWith(
        'http://example.org',
        expect.objectContaining({ headers })
      );
    });
  });
});
