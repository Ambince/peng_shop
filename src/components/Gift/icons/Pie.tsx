import React from 'react';

export function Pie(prop) {
  return (
    <div className="h-4 w-4 inline-flex" {...prop}>
      <svg
        fill="none"
        height="16"
        viewBox="0 0 16 16"
        width="16"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_171_16829)">
          <path
            d="M5.44818 1.83936C4.63331 2.17724 3.90001 2.67208 3.28593 3.28615C2.07951 4.4926 1.33331 6.15926 1.33331 8.0002C1.33331 11.6821 4.31808 14.6669 7.99998 14.6669C9.84091 14.6669 11.5076 13.9207 12.714 12.7142C13.3281 12.1002 13.8229 11.3669 14.1608 10.552"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
          <path
            d="M8 8.00016H14.6667C14.6667 4.31826 11.6819 1.3335 8 1.3335V8.00016Z"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
        </g>
        <defs>
          <clipPath id="clip0_171_16829">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}
