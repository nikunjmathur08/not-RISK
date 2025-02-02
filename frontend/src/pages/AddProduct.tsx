import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addAppliance } from '../utils/api';

function AddProduct() {
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [productName, setProductName] = useState("");
  const [fileName, setFileName] = useState("choose file");
  const [modelNumber, setModelNumber] = useState("");
  const [productImage, setProductImage] = useState<File | null>(null);
  const [originalReceipt, setOriginalReceipt] = useState<File | null>(null);
  const [originalReceiptName, setOriginalReceiptName] = useState("choose file");
  const [insuranceReceipt, setInsuranceReceipt] = useState<File | null>(null);
  const [insuranceReceiptName, setInsuranceReceiptName] = useState("choose file");

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

  const years = Array.from({ length: 25 }, (_, i) => new Date().getFullYear() - i);
  const dates = Array.from({ length: 31 }, (_, i) => i + 1);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      setProductImage(file);
      setFileName(file.name);
    }
  };

  const handleReceiptChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      setOriginalReceipt(file);
      setOriginalReceiptName(file.name);
    }
  };

  const [originalReceiptType, setOriginalReceiptType] = useState("");
  const [insuranceReceiptType, setInsuranceReceiptType] = useState("");
  
  const receiptTypes = [
    "Purchase Receipt",
    "Warranty Card",
    "Insurance Document",
    "Service Record",
    "Installation Document"
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!productName || !modelNumber || !selectedYear || !selectedMonth || !selectedDate || !productImage || !originalReceipt || !originalReceiptType) {
      console.error('Validation failed:', { 
        productName: !productName,
        modelNumber: !modelNumber,
        date: !selectedYear || !selectedMonth || !selectedDate,
        productImage: !productImage,
        originalReceipt: !originalReceipt,
        originalReceiptType: !originalReceiptType
      });
      alert('Please fill in all required fields');
      return;
    }

    const formData = new FormData();
    formData.append('name', productName);
    formData.append('modelNumber', modelNumber);
    const monthIndex = months.indexOf(selectedMonth) + 1;
    const formattedDate = `${selectedYear}-${monthIndex.toString().padStart(2, '0')}-${selectedDate.toString().padStart(2, '0')}`;
    formData.append('purchaseDate', formattedDate);
    
    try {
      // Validate file types
      if (productImage && !['image/jpeg', 'image/png'].includes(productImage.type)) {
        console.error('Invalid product image type:', productImage.type);
        alert('Product image must be a JPEG or PNG file');
        return;
      }
      
      if (originalReceipt && !['image/jpeg', 'image/png', 'application/pdf'].includes(originalReceipt.type)) {
        console.error('Invalid original receipt type:', originalReceipt.type);
        alert('Original receipt must be a JPEG, PNG, or PDF file');
        return;
      }
      
      if (insuranceReceipt && !['image/jpeg', 'image/png', 'application/pdf'].includes(insuranceReceipt.type)) {
        console.error('Invalid insurance receipt type:', insuranceReceipt.type);
        alert('Insurance receipt must be a JPEG, PNG, or PDF file');
        return;
      }

      formData.append('productImage', productImage);
      formData.append('originalReceipt', originalReceipt);
      formData.append('originalReceiptType', originalReceiptType);
      
      if (insuranceReceipt && insuranceReceiptType) {
        formData.append('insuranceReceipt', insuranceReceipt);
        formData.append('insuranceReceiptType', insuranceReceiptType);
      }

      const { appliance } = await addAppliance(formData);
      navigate('/appliances');
    } catch (error) {
      console.error('Error details:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to add product';
      console.error('Error:', errorMessage);
      alert(errorMessage);
    }
  };

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
        <form className="space-y-6" onSubmit={handleSubmit}>
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
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="mt-3 w-full border-2 rounded bg-gray-100 p-2 focus:outline-none focus:ring-2 focus:ring-violet-700"
            />
          </div>

          {/* Purchase Date */}
          <div>
            <label
              htmlFor="purchaseDate"
              className="block text-sm font-medium"
            >
              purchase date
            </label>
            <div className='mt-2 flex space-x-4'>
              <select
                id='datePicker'
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className='mt-3 w-full border-2 text-gray-400 rounded bg-gray-100 p-2 focus:outline-none focus:ring-2 focus:ring-violet-700'
              >
                <option value="">select date</option>
                {dates.map((date, index) => (
                  <option key={index} value={date}>
                    {date}
                  </option>
                ))}
              </select>
              <select
                id='monthPicker'
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className='mt-3 w-full border-2 text-gray-400 rounded bg-gray-100 p-2 focus:outline-none focus:ring-2 focus:ring-violet-700'
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
                className="mt-3 w-full border-2 text-gray-400 rounded bg-gray-100 p-2 focus:outline-none focus:ring-2 focus:ring-violet-700"
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

          <div>
            <label
              htmlFor="modelNumber"
              className="block text-sm font-medium"
            >
              model number
            </label>
            <input
              type="text"
              id="modelNumber"
              name="modelNumber"
              placeholder="enter model number"
              value={modelNumber}
              onChange={(e) => setModelNumber(e.target.value)}
              className="mt-3 w-full border-2 rounded bg-gray-100 p-2 focus:outline-none focus:ring-2 focus:ring-violet-700"
            />
          </div>

          {/* Product Image */}
          <div>
            <label
              htmlFor="productImage"
              className="block text-sm font-medium"
            >
              product image
            </label>
            <div className="mt-2">
              <label
                htmlFor="productImage"
                className="block w-full cursor-pointer py-2 px-4 border border-gray-300 rounded-md bg-gray-100 text-gray-400 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-700"
              >
                {fileName}
              </label>
              <input
                type="file"
                id="productImage"
                name="productImage"
                accept="image/*"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files ? e.target.files[0] : null;
                  if (file) {
                    setProductImage(file);
                    setFileName(file.name);
                  }
                }}
              />
            </div>
          </div>

          {/* Original Receipt Upload */}
          <div>
            <label
              htmlFor="originalReceipt"
              className="block text-sm font-medium"
            >
              original receipt
            </label>
            <div className="mt-2 space-y-2">
              <select
                id="originalReceiptType"
                value={originalReceiptType}
                onChange={(e) => setOriginalReceiptType(e.target.value)}
                className="w-full border-2 text-gray-400 rounded bg-gray-100 p-2 focus:outline-none focus:ring-2 focus:ring-violet-700"
                required
              >
                <option value="">select receipt type</option>
                {receiptTypes.map((type, index) => (
                  <option key={index} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <label
                htmlFor="originalReceipt"
                className="block w-full cursor-pointer py-2 px-4 border border-gray-300 rounded-md bg-gray-100 text-gray-400 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-700"
              >
                {originalReceiptName}
              </label>
              <input
                type="file"
                id="originalReceipt"
                name="originalReceipt"
                accept="image/*,.pdf"
                className="sr-only"
                onChange={handleReceiptChange}
                required
              />
            </div>
          </div>

          {/* Insurance Receipt Upload */}
          <div>
            <label
              htmlFor="insuranceReceipt"
              className="block text-sm font-medium"
            >
              insurance receipt
            </label>
            <div className="mt-2 space-y-2">
              <select
                id="insuranceReceiptType"
                value={insuranceReceiptType}
                onChange={(e) => setInsuranceReceiptType(e.target.value)}
                className="w-full border-2 text-gray-400 rounded bg-gray-100 p-2 focus:outline-none focus:ring-2 focus:ring-violet-700"
              >
                <option value="">select receipt type</option>
                {receiptTypes.map((type, index) => (
                  <option key={index} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <label
                htmlFor="insuranceReceipt"
                className="block w-full cursor-pointer py-2 px-4 border border-gray-300 rounded-md bg-gray-100 text-gray-400 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-700"
              >
                {insuranceReceiptName}
              </label>
              <input
                type="file"
                id="insuranceReceipt"
                name="insuranceReceipt"
                accept="image/*,.pdf"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files ? e.target.files[0] : null;
                  if (file) {
                    setInsuranceReceipt(file);
                    setInsuranceReceiptName(file.name);
                  }
                }}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full bg-violet-700 text-white py-2 px-4 rounded-md text-lg font-semibold hover:bg-violet-800 focus:ring-2 focus:ring-offset-2 focus:ring-violet-700"
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
