import { useRef, useState } from "react";
import { geoSuggest, type GeoPoint } from "../../model/api";
import s from "./style.module.scss";

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  onPick: (point: GeoPoint) => void;
}

export function AddressSuggest({ value, onChangeText, onPick }: Props) {
  const [results, setResults] = useState<GeoPoint[]>([]);
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
      geoSuggest(text.trim())
        .then((items) => {
          setResults(items);
          setOpen(items.length > 0);
        })
        .catch(() => {});
    }, 300);
  };

  const pick = (point: GeoPoint) => {
    onPick(point);
    setResults([]);
    setOpen(false);
  };

  return (
    <div className={s.wrap}>
      <input
        className={s.input}
        value={value}
        placeholder="Город или адрес базирования"
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => results.length > 0 && setOpen(true)}
        onBlur={() => window.setTimeout(() => setOpen(false), 150)}
      />
      {open && (
        <ul className={s.list}>
          {results.map((point, index) => (
            <li key={index}>
              <button type="button" className={s.item} onClick={() => pick(point)}>
                {point.address}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
