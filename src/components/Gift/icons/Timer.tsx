import React from 'react';

export function Timer(prop) {
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
          d="M7.99999 14.6667C10.9455 14.6667 13.3333 12.2789 13.3333 9.33333C13.3333 6.38781 10.9455 4 7.99999 4C5.05447 4 2.66666 6.38781 2.66666 9.33333C2.66666 12.2789 5.05447 14.6667 7.99999 14.6667Z"
          stroke="currentColor"
          strokeWidth="1.66667"
        />
        <path
          d="M9.33332 1.3335H6.66666"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.66667"
        />
        <path
          d="M8 1.3335V4.00016"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.66667"
        />
        <path
          d="M11.6667 5.3335L12.6667 4.3335"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.66667"
        />
        <path
          d="M8 9.3335V7.3335"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.66667"
        />
        <path
          d="M8 9.3335H6"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.66667"
        />
      </svg>
    </div>
  );
}
