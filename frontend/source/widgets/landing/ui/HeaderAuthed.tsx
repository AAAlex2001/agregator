import { ExpertHelpPlates } from "@/source/widgets/expert-help";
import CabinetBurgerMenu from "./CabinetBurgerMenu";
import s from "./header-authed.module.scss";

const HeaderAuthed = () => (
  <header className={s.header}>
    <nav className={s.nav} aria-label="Основная навигация">
      <ExpertHelpPlates />
      <CabinetBurgerMenu />
    </nav>
  </header>
);

export default HeaderAuthed;
