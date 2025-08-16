import { ChangeEvent } from "react";
import css from "./SearchBox.module.css";

interface SeatchBoxProps {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export default function SearchBox({ onChange }: SeatchBoxProps) {
  return <input className={css.input} type="text" placeholder="Search posts" onChange={onChange} />;
}
