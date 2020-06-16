export interface ContentTypeFilter {
  /**
   * Should return true if the content type is valid or false to cancel the upload.
   * A DownloadError will be thrown if this returns false.
   * @param contentType The content type value on the download headers
   */
  (contentType: string): boolean;
}
