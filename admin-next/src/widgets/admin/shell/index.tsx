"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { useAdminSession } from "@/features/admin-auth";
import { ARTICLES_PATH } from "@/shared/lib/admin-paths";
import IconButton from "@/shared/ui/icon-button";
import { MenuIcon } from "@/shared/ui/icons";
import Loader from "@/shared/ui/loader";
import Modal from "@/shared/ui/modal";
import AdminNav from "./ui/nav";
import styles from "./style.module.scss";

type AdminShellProps = {
  children: ReactNode;
};

/** Оболочка админки: пускает после входа. Меню на широком экране стоит сбоку, на узком — за бургером. */
const AdminShell = ({ children }: AdminShellProps) => {
  const { state, exit } = useAdminSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  if (!state.ready) return <Loader size="lg" />;

  const brand = (
    <Link className={styles.brand} href={ARTICLES_PATH}>
      Ресурс-Плюс
      <span className={styles.caption}>панель управления</span>
    </Link>
  );

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        {brand}
        <AdminNav onExit={exit} />
      </aside>

      <header className={styles.bar}>
        {brand}
        <IconButton ariaLabel="Открыть меню" onClick={() => setMenuOpen(true)}>
          <MenuIcon />
        </IconButton>
      </header>

      <Modal open={menuOpen} title="Меню" onClose={closeMenu}>
        {menuOpen && <AdminNav onExit={exit} onNavigate={closeMenu} />}
      </Modal>

      <main className={styles.main}>{children}</main>
    </div>
  );
};

export default AdminShell;
