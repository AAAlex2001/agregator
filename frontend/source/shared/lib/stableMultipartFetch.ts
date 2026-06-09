import { createStableUploadFiles } from "@/source/shared/lib/stableUploadFiles";

function isRetryableUploadError(error: unknown): boolean {
  if (!(error instanceof TypeError)) {
    return false;
  }

  const message = String(error.message);
  return message.includes("ERR_UPLOAD_FILE_CHANGED") || message.includes("Failed to fetch");
}

interface StableMultipartFetchOptions {
  input: string;
  method?: string;
  headers?: HeadersInit;
  files?: File[];
  buildBody: (files: File[]) => FormData;
}

export async function stableMultipartFetch(options: StableMultipartFetchOptions): Promise<Response> {
  const {
    input,
    method = "POST",
    headers,
    files = [],
    buildBody,
  } = options;

  try {
    return await fetch(input, {
      method,
      headers,
      credentials: "include",
      body: buildBody(files),
    });
  } catch (error) {
    if (!isRetryableUploadError(error) || files.length === 0) {
      throw error;
    }

    const stableFiles = await createStableUploadFiles(files);

    return await fetch(input, {
      method,
      headers,
      credentials: "include",
      body: buildBody(stableFiles),
    });
  }
}
