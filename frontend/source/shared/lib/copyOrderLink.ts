export function copyOrderLink(publicId: string): Promise<void> {
  return navigator.clipboard.writeText(`${window.location.origin}/order/${publicId}`);
}
