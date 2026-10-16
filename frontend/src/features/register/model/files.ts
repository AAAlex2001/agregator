import type { LocalFile } from "@/shared/lib/local-file";

/** Владелец временных адресов файлов; одна регистрация освобождает их при закрытии. */
export interface RegistrationFiles {
  createFile: (file: File) => LocalFile;
  removeFile: (selected: LocalFile) => void;
}
