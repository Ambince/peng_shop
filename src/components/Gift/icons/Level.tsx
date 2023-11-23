import React from 'react';

export function Level(prop) {
  return (
    <div className="h-4 w-4 inline-flex" {...prop}>
      <svg
        fill="none"
        height="16"
        viewBox="0 0 16 16"
        width="16"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7.99998 14L1.33331 6.16667L3.23161 2H12.7683L14.6666 6.16667L7.99998 14Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.66667"
        />
        <path
          d="M10.6666 6L7.99998 9L5.33331 6"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.66667"
        />
      </svg>
    </div>
  );
}
