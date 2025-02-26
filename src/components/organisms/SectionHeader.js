// src/components/organisms/SectionHeader.js
import { Spinner } from 'flowbite-react';
import React from 'react';

const SectionHeader = ({ title, onSearchChange, children, isLoading }) => {
  return (
    <header className="flex flex-col md:flex-row items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white ml-4">
        {title} {isLoading && <span className="italic text-gray-500 ml-2 text-sm">Fetching data... </span>}
      </h1>

      <div className="mt-4 md:mt-0 flex items-center space-x-2">
        {children}
        <div className="relative w-full md:w-auto">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              aria-hidden="true"
              className="w-5 h-5 text-gray-500 dark:text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <input
            type="text"
            id="simple-search"
            className="placeholder:italic placeholder:text-gray-400 block bg-gray-50 w-full border border-gray-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-500 dark:text-white mr-4"
            placeholder="Search..."
            onChange={onSearchChange}
          />
        </div>
      </div>
    </header>
  );
};

export default SectionHeader;