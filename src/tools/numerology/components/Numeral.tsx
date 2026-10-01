interface Props {
  n: number;
  size: 'xl' | 'lg' | 'md' | 'sm';
}

/** Con số hiển thị lớn; số bậc thầy 22 và 33 kèm số rút gọn nhỏ bên cạnh. */
export function Numeral({ n, size }: Props) {
  const reduced = n === 22 ? 4 : n === 33 ? 6 : null;
  return (
    <span className={`nm-numeral nm-numeral--${size}`} aria-label={reduced ? `${n} trên ${reduced}` : String(n)}>
      {n}
      {reduced && <span className="nm-numeral-sub">/{reduced}</span>}
    </span>
  );
}
