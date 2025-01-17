import React, { useState } from 'react';

function AddProduct() {
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const years = Array.from({ length: 20 }, (_, i) => new Date().getFullYear() - i);

  return (
    <div className="my-8 mx-4">
      {/* Outer container with flex and center alignment */}
      <div className="flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          className="pr-2"
        >
          <path
            d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 22V12H15V22"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <p className="flex-grow text-center font-semibold text-3xl">!RISK</p>
      </div>

      {/* 'add product' centered */}
      <div className="flex justify-center ml-10 mt-24">
        <p className="font-semibold text-2xl">add product</p>
      </div>

      {/* Form Container */}
      <div className="mt-16 max-w-5xl mx-auto">
        <form className="space-y-6">
          {/* Product Name */}
          <div>
            <label
              htmlFor="productName"
              className="block text-sm font-medium"
            >
              product name
            </label>
            <input
              type="text"
              id="productName"
              name="productName"
              placeholder="enter product name"
              className="mt-3 w-full border-2 rounded bg-gray-100 p-2 focus:outline-none focus:ring-2 focus:ring-violet-700"
            />
          </div>

          {/* Purchase Date */}
          <div>
            <label
              htmlFor="purchaseDate"
              className="block text-sm font-medium"
            >
              purchase month
            </label>
            <div className='mt-2 flex space-x-4'>
              <select
                id='monthPicker'
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className='mt-3 w-full border-2 text-gray-700 rounded bg-gray-100 p-2 focus:outline-none focus:ring-2 focus:ring-violet-700'
              >
                <option value="">select month</option>
                {months.map((month, index) => (
                  <option key={index} value={month}>
                    {month}
                  </option>
                ))}
              </select>
              <select
                id="yearPicker"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="mt-3 w-full border-2 text-gray-700 rounded bg-gray-100 p-2 focus:outline-none focus:ring-2 focus:ring-violet-700"
              >
                <option value="">select year</option>
                {years.map((year, index) => (
                  <option key={index} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Product Image */}
          <div>
              <label
                htmlFor="productImage"
                className="block text-sm font-medium text-gray-700"
              >
                product image
              </label>
              <div className="mt-2">
                <label
                  htmlFor="productImage"
                  className="block w-full cursor-pointer py-2 px-4 border border-gray-300 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  choose file
                </label>
                <input
                  type="file"
                  id="productImage"
                  name="productImage"
                  accept="image/*"
                  className="sr-only"
                />
              </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full bg-violet-700 text-white py-2 px-4 rounded-md text-lg font-semibold hover:bg-violet-800 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              add product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;
