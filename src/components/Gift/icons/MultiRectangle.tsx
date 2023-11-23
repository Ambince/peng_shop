import React from 'react';

export function MultiRectangle(prop) {
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
          d="M4 13.0002H14.6667V2.3335H4V5.00016"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="1.66667"
        />
        <path
          d="M2.66666 13H10.6667V5H2.66666V7.66667"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="1.66667"
        />
        <path
          d="M6.66668 7.6665H1.33334V12.9998H6.66668V7.6665Z"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="1.66667"
        />
      </svg>
    </div>
  );
}
