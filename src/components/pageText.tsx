import type { ReactNode } from 'react';

export const INK = '#000000';
export const MUTED = '#6F6F6F';

/** The data files still carry SCREAMING_SNAKE labels from the terminal UI. */
export const readable = (value: string) => value.replace(/_/g, ' ');

/** Highlights in the experience data use **bold** markers. */
export const withEmphasis = (text: string): ReactNode[] =>
  text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold" style={{ color: INK }}>
        {part}
      </strong>
    ) : (
      part
    ),
  );
