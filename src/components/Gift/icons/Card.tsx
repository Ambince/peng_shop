import React from 'react';

export function Card(prop) {
  return (
    <div className="h-4 w-4 inline-flex" {...prop}>
      <svg
        fill="none"
        height="14"
        viewBox="0 0 14 14"
        width="14"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8.16659 3.49996V1.16663L2.33325 4.08329V12.25L5.83325 10.5"
          stroke="#626F86"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
        <path
          d="M5.83325 4.66667L11.6666 1.75V9.91667L5.83325 12.8333V4.66667Z"
          stroke="#626F86"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
}
