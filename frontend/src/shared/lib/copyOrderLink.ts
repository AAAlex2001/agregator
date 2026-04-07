export function copyOrderLink(publicId: string, onSuccess: () => void) {
  const url = `${window.location.origin}/order/${publicId}`;
  const ta = document.createElement("textarea");
  ta.value = url;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  document.execCommand("copy");
  document.body.removeChild(ta);
  onSuccess();
}
