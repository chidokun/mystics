import { ELEMENTS } from '../data/elements';
import { BRANCHES, STEMS } from '../data/ganzhi';

/** Một chữ can hoặc chi, tô màu theo ngũ hành */
export function StemText({ stem, className }: { stem: number; className?: string }) {
  const s = STEMS[stem];
  return (
    <span className={`bt-el bt-el--${s.element}${className ? ` ${className}` : ''}`} title={`${s.yang ? 'Dương' : 'Âm'} ${ELEMENTS[s.element].name}`}>
      {s.name}
    </span>
  );
}

export function BranchText({ branch, className }: { branch: number; className?: string }) {
  const b = BRANCHES[branch];
  return (
    <span className={`bt-el bt-el--${b.element}${className ? ` ${className}` : ''}`} title={`${b.yang ? 'Dương' : 'Âm'} ${ELEMENTS[b.element].name}`}>
      {b.name}
    </span>
  );
}

/** Cặp can chi viết liền, ví dụ "Giáp Thìn" */
export function Ganzhi({ ganzhi }: { ganzhi: number }) {
  return (
    <span className="bt-ganzhi">
      <StemText stem={ganzhi % 10} /> <BranchText branch={ganzhi % 12} />
    </span>
  );
}
