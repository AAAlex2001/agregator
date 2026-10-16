/** Скачивает файл по адресу отдельной ссылкой, сохраняя переданное имя. */
export function downloadFile(url: string, name: string) {
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  document.body.appendChild(link);
  link.click();
  link.remove();
}
