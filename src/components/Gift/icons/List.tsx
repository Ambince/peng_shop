import React from 'react';

export function List(prop) {
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
          d="M6.66669 8H14.6667"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.66667"
        />
        <path
          d="M6.66669 12.6665H14.6667"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.66667"
        />
        <path
          d="M6.66669 3.3335H14.6667"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.66667"
        />
        <path
          d="M3.99998 11.3335H1.33331V14.0002H3.99998V11.3335Z"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="1.66667"
        />
        <path
          d="M3.99998 6.6665H1.33331V9.33317H3.99998V6.6665Z"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="1.66667"
        />
        <path
          d="M3.99998 2H1.33331V4.66667H3.99998V2Z"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="1.66667"
        />
      </svg>
    </div>
  );
}
