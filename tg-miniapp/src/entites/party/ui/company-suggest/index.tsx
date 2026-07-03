import { useRef, useState } from "react";
import { suggestParties, type Party } from "../../model/api";
import s from "./style.module.scss";

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  onPick: (party: Party) => void;
}

export function CompanySuggest({ value, onChangeText, onPick }: Props) {
  const [results, setResults] = useState<Party[]>([]);
  const [open, setOpen] = useState(false);
  const timer = useRef<number | null>(null);

  const handleChange = (text: string) => {
    onChangeText(text);
    if (timer.current) window.clearTimeout(timer.current);
    if (text.trim().length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    timer.current = window.setTimeout(() => {
      suggestParties(text.trim())
        .then((items) => {
          setResults(items);
          setOpen(items.length > 0);
        })
        .catch(() => {});
    }, 300);
  };

  const pick = (party: Party) => {
    onPick(party);
    setResults([]);
    setOpen(false);
  };

  return (
    <div className={s.wrap}>
      <input
        className={s.input}
        value={value}
        placeholder="ИНН или название компании"
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => results.length > 0 && setOpen(true)}
        onBlur={() => window.setTimeout(() => setOpen(false), 150)}
      />
      {open && (
        <ul className={s.list}>
          {results.map((party, index) => (
            <li key={index}>
              <button type="button" className={s.item} onClick={() => pick(party)}>
                <span className={s.itemName}>{party.value}</span>
                {party.data.inn && <span className={s.itemInn}>ИНН {party.data.inn}</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
