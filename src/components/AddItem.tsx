import React from 'react';

export function AddItem({
  click,
  title,
  className,
}: {
  click: () => void;
  title: string;
  className?: string;
}): JSX.Element {
  return (
    <div
      className={`flex items-center justify-center gap-4 hover:cursor-pointer hover:opacity-75 ${className}`}
      onClick={() => click()}
    >
      <div className="w-4 h-4 rounded-full bg-@MainGreen flex flex-col justify-center items-center">
        <span className="text-white text-center text-xs">+</span>
      </div>
      <span className="text-@MainGreen">{title}</span>
    </div>
  );
}
