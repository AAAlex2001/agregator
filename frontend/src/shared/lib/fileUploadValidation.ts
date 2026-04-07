export const MAX_ATTACH_FILES_COUNT = 6;
export const MAX_ATTACH_TOTAL_SIZE_BYTES = 100 * 1024 * 1024;

interface MergeFilesResult {
  nextFiles: File[];
  errorMessage: string | null;
}

export function mergeFilesWithLimits(currentFiles: File[], addedFiles: File[]): MergeFilesResult {
  const mergedFiles = [...currentFiles, ...addedFiles];

  if (mergedFiles.length > MAX_ATTACH_FILES_COUNT) {
    return {
      nextFiles: currentFiles,
      errorMessage: `Можно прикрепить не более ${MAX_ATTACH_FILES_COUNT} файлов`,
    };
  }

  const totalSize = mergedFiles.reduce((sum, file) => sum + file.size, 0);

  if (totalSize > MAX_ATTACH_TOTAL_SIZE_BYTES) {
    return {
      nextFiles: currentFiles,
      errorMessage: "Суммарный размер файлов не должен превышать 100 МБ",
    };
  }

  return {
    nextFiles: mergedFiles,
    errorMessage: null,
  };
}
