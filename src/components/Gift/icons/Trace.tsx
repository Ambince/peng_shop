import React from 'react';

export function Trace(prop) {
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
          d="M8 2C4.6863 2 2 4.6863 2 8C2 11.3137 4.6863 14 8 14C11.3137 14 14 11.3137 14 8"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.66667"
        />
        <path
          d="M8 5C6.34313 5 5 6.34313 5 8C5 9.65687 6.34313 11 8 11C9.65687 11 11 9.65687 11 8"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.66667"
        />
        <path
          d="M8 7.99988L10.1 5.89795"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.66667"
        />
        <path
          d="M10.0999 3.8088V5.9H12.2083L13.9999 4.10007H11.901V2L10.0999 3.8088Z"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="1.66667"
        />
      </svg>
    </div>
  );
}
