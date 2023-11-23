import React from 'react';

export function Gift(prop) {
  return (
    <div className="h-4 w-4 inline-flex" {...prop}>
      <svg
        fill="none"
        height="16"
        viewBox="0 0 16 16"
        width="16"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_313_44676)">
          <path
            d="M13.6666 14.6665V6.6665H2.33331V14.6665H13.6666Z"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
          <path
            d="M8 14.6665V6.6665"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
          <path
            d="M13.6666 14.6665H2.33331"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
          <path
            d="M14.6666 4H1.33331V6.66667H14.6666V4Z"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
          <path
            d="M5.33331 1.3335L7.99998 4.00016L10.6666 1.3335"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
        </g>
        <defs>
          <clipPath id="clip0_313_44676">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}
