/**
 * A small decorative mark for the home hero: two bluebirds facing each
 * other on a flowering branch, inside an oval frame — echoing the
 * antique embroidery-style reference the site is named after, redrawn in
 * the site's own palette instead of reproducing a photo.
 */
function BluebirdEmblem() {
  return (
    <svg
      className="bluebird-emblem"
      viewBox="0 0 240 160"
      role="img"
      aria-label="Two bluebirds perched on a flowering branch"
    >
      <defs>
        <path id="bluebird-emblem-leaf" d="M0,0 Q7,-11 0,-22 Q-7,-11 0,0 Z" fill="var(--color-green-dark)" />
        <g id="bluebird-emblem-bud">
          <circle cx="0" cy="0" r="2.5" fill="var(--color-earth-dark)" fillOpacity="0.5" />
          <ellipse cx="0" cy="-7" rx="4" ry="8" fill="var(--color-wool)" stroke="var(--color-blue-accent-dark)" strokeOpacity="0.3" strokeWidth="0.4" transform="rotate(0)" />
          <ellipse cx="0" cy="-7" rx="4" ry="8" fill="var(--color-wool)" stroke="var(--color-blue-accent-dark)" strokeOpacity="0.3" strokeWidth="0.4" transform="rotate(60)" />
          <ellipse cx="0" cy="-7" rx="4" ry="8" fill="var(--color-wool)" stroke="var(--color-blue-accent-dark)" strokeOpacity="0.3" strokeWidth="0.4" transform="rotate(120)" />
          <ellipse cx="0" cy="-7" rx="4" ry="8" fill="var(--color-wool)" stroke="var(--color-blue-accent-dark)" strokeOpacity="0.3" strokeWidth="0.4" transform="rotate(180)" />
          <ellipse cx="0" cy="-7" rx="4" ry="8" fill="var(--color-wool)" stroke="var(--color-blue-accent-dark)" strokeOpacity="0.3" strokeWidth="0.4" transform="rotate(240)" />
          <ellipse cx="0" cy="-7" rx="4" ry="8" fill="var(--color-wool)" stroke="var(--color-blue-accent-dark)" strokeOpacity="0.3" strokeWidth="0.4" transform="rotate(300)" />
        </g>
        <g id="bluebird-emblem-bird">
          <line x1="10" y1="0" x2="10" y2="-9" stroke="var(--color-earth-dark)" strokeWidth="1.3" strokeLinecap="round" />
          <line x1="19" y1="0" x2="19" y2="-9" stroke="var(--color-earth-dark)" strokeWidth="1.3" strokeLinecap="round" />
          <path d="M3,-19 L-10,-27 L-7,-13 Z" fill="var(--color-blue-accent-dark)" />
          <ellipse cx="17" cy="-19" rx="13" ry="10" fill="var(--color-blue-accent)" />
          <path d="M6,-13 C6,-20 10,-25 15,-26 C13,-20 12,-13 11,-9 C9,-9 7,-11 6,-13 Z" fill="var(--color-earth)" />
          <path d="M5,-23 C11,-28 20,-26 23,-19 C17,-16 8,-17 4,-19 Z" fill="var(--color-blue-accent-dark)" />
          <circle cx="28" cy="-28" r="6.2" fill="var(--color-blue-accent)" />
          <polygon points="34,-28 41,-30 34,-25" fill="var(--color-earth-dark)" />
          <circle cx="30" cy="-30" r="1" fill="var(--color-ink)" />
        </g>
      </defs>

      <ellipse cx="120" cy="82" rx="112" ry="72" fill="var(--color-wool)" stroke="var(--color-earth)" strokeWidth="6" />
      <ellipse cx="120" cy="82" rx="104" ry="64" fill="none" stroke="var(--color-earth-dark)" strokeWidth="1.5" strokeOpacity="0.4" />

      <path d="M42,97 Q120,103 198,97" stroke="var(--color-green-dark)" strokeWidth="2.2" fill="none" strokeLinecap="round" />

      <use href="#bluebird-emblem-leaf" transform="translate(58,99) rotate(210) scale(0.9)" />
      <use href="#bluebird-emblem-leaf" transform="translate(90,101) rotate(195) scale(0.85)" />
      <use href="#bluebird-emblem-leaf" transform="translate(150,101) rotate(160) scale(0.85)" />
      <use href="#bluebird-emblem-leaf" transform="translate(182,99) rotate(150) scale(0.9)" />
      <use href="#bluebird-emblem-bud" transform="translate(48,98) scale(0.8)" />
      <use href="#bluebird-emblem-bud" transform="translate(192,98) scale(0.8)" />

      <use href="#bluebird-emblem-bird" transform="translate(70,99)" />
      <use href="#bluebird-emblem-bird" transform="translate(170,99) scale(-1,1)" />
    </svg>
  )
}

export default BluebirdEmblem
