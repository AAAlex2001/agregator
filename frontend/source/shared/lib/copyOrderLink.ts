export function copyOrderLink(publicId: string, onSuccess: () => void) {
  const url = `${window.location.origin}/order/${publicId}`;
  const textarea = document.createElement("textarea");
  textarea.value = url;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
  onSuccess();
}