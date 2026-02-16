export async function createStableUploadFiles(files: File[] | undefined): Promise<File[]> {
  if (!files || files.length === 0) {
    return [];
  }

  const result: File[] = [];

  for (const file of files) {
    const bytes = await file.arrayBuffer();
    result.push(
      new File([bytes], file.name, {
        type: file.type,
        lastModified: file.lastModified,
      })
    );
  }

  return result;
}
