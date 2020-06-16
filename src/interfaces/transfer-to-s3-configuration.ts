export interface TransferToS3Configuration {
  download: {
    /**
     * Time in milliseconds to wait for the download to finish
     */
    timeout: number;
    /**
     * Number of times a download will be attempted in case of errors
     */
    attempts: number;
    /**
     * How much time to wait after an error in milliseconds (it increases exponentially each try)
     */
    backoffTime: number;
  };
  s3: {
    /**
     * The name of your bucket on S3
     */
    bucket: string;
    /**
     * The access key id for AWS that can write in that bucket
     */
    accessKeyId: string;
    /**
     * The secret access key for AWS that can write in that bucket
     */
    secretAccessKey: string;
    /**
     * The region to which you are connecting
     */
    region: string;
  };
}
