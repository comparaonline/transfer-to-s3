# Transfer to S3

Transfer a file on a URL to an S3 bucket.
Usage:

```ts
import { TransferToS3 } from '@comparaonline/transfer-to-s3';

const transferToS3 = new TransferToS3({
  download: {
    timeout: 10000,
    attempts: 5,
    backoffTime: 2000,
  },
  s3: {
    bucket: 'my-bucket',
    accessKeyId: 'my-key-id',
    secretAccessKey: 'my-access-key',
    region: 'us-east-1'
  }
});

// optional:
transferToS3.setHeaders({ Authorization: 'Bearer THISSHOULDBEATOKEN'});

await transferToS3.transfer(
    'http://example.org/', 
    'directory/example-org-index.html'
);
```

