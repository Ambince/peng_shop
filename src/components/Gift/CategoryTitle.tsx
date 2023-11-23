import React from 'react';

export function CategoryTitle({ title, color = '@MainGreen' }): JSX.Element {
  return (
    <div
      className={`text-${color} border-${color} pl-3 border-l-4  font-semibold flex items-center`}
    >
      {title}
    </div>
  );
}
