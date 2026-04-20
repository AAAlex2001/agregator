"use client";

import { NotificationsWidget } from "@/source/widgets/notifications";
import { useNotificationsPopover } from "../model/useNotificationsPopover";

interface NotificationsPopoverProps {
  buttonClassName?: string;
  activeClassName?: string;
}

export function NotificationsPopover({ buttonClassName, activeClassName }: NotificationsPopoverProps) {
  const model = useNotificationsPopover();

  return (
    <NotificationsWidget
      rootRef={model.rootRef}
      isOpen={model.isOpen}
      items={model.items}
      unreadCount={model.unreadCount}
      isLoading={model.isLoading}
      error={model.error}
      pendingId={model.pendingId}
      pendingMode={model.pendingMode}
      isMarkingAll={model.isMarkingAll}
      buttonClassName={buttonClassName}
      activeClassName={activeClassName}
      onToggle={model.toggleOpen}
      onClose={model.close}
      onRetry={model.reload}
      onOpenItem={model.openItem}
      onDismissItem={model.dismissItem}
      onMarkAllRead={model.markAllRead}
    />
  );
}