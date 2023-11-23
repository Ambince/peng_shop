import React from 'react';

export function Bill(prop) {
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
          d="M3.33334 2.00016C3.33334 1.63197 3.63181 1.3335 4.00001 1.3335H12C12.3682 1.3335 12.6667 1.63197 12.6667 2.00016V14.6668L10.3333 13.0002L8.00001 14.6668L5.66668 13.0002L3.33334 14.6668V2.00016Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.66667"
        />
        <path
          d="M6 7.3335H10"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.66667"
        />
        <path
          d="M6 10H10"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.66667"
        />
        <path
          d="M6 4.6665H10"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.66667"
        />
      </svg>
    </div>
  );
}
