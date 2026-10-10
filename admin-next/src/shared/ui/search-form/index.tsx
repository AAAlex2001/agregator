import Button from "@/shared/ui/button";
import { SearchIcon } from "@/shared/ui/icons";
import Input from "@/shared/ui/input";
import styles from "./style.module.scss";

type SearchFormProps = {
  value: string;
  placeholder: string;
  ariaLabel: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

/** Поле поиска с кнопкой «Найти»: запрос уходит по Enter или по кнопке. */
const SearchForm = ({ value, placeholder, ariaLabel, onChange, onSubmit }: SearchFormProps) => (
  <form
    className={styles.form}
    onSubmit={(event) => {
      event.preventDefault();
      onSubmit();
    }}
  >
    <Input type="search" ariaLabel={ariaLabel} placeholder={placeholder} icon={<SearchIcon />} value={value} onChange={onChange} />
    <Button type="submit" variant="outline">
      Найти
    </Button>
  </form>
);

export default SearchForm;
