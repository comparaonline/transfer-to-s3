export class DownloadError extends Error {
  constructor(error: Error) { super(`Download error: ${error.message}`); }
}

export class UploadError extends Error {
  constructor(error: Error) { super(`Upload error: ${error.message}`); }
}
