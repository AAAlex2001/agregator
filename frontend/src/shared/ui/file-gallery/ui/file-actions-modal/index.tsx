import { Button } from "@/shared/ui/button";
import { Modal } from "@/shared/ui/modal";
import styles from "./style.module.scss";

/** Выбранный файл и отдельные действия просмотра, скачивания и закрытия. */
interface FileActionsModalProps {
  open: boolean;
  fileName: string;
  onView: () => void;
  onDownload: () => void;
  onClose: () => void;
}

/** Предлагает просмотр или скачивание выбранного файла. */
export function FileActionsModal({
  open,
  fileName,
  onView,
  onDownload,
  onClose,
}: FileActionsModalProps) {
  /** Открывает просмотр и закрывает диалог. */
  function view() {
    onView();
    onClose();
  }

  /** Скачивает файл и закрывает диалог. */
  function download() {
    onDownload();
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="sm"
      ariaLabel="Действия с файлом"
    >
      <div className={styles.body}>
        <p
          className={styles.name}
          title={fileName}
        >
          {fileName}
        </p>

        <div className={styles.actions}>
          <Button
            variant="primary"
            fullWidth
            onClick={view}
          >
            Посмотреть
          </Button>

          <Button
            variant="secondary"
            fullWidth
            onClick={download}
          >
            Скачать файл
          </Button>
        </div>
      </div>
    </Modal>
  );
}
