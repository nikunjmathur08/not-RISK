import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function AddReceipt() {
  const location = useLocation();
  const navigate = useNavigate();
  const [receiptName, setReceiptName] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const { productId, productName } = location.state || {};

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      setReceiptFile(file);
      setFileName(file.name);
    }
  };

  const [receiptType, setReceiptType] = useState("");

  const receiptTypes = [
    "Purchase Receipt",
    "Warranty Card",
    "Insurance Document",
    "Service Record",
    "Installation Document"
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append('name', receiptName);
    formData.append('type', receiptType);
    if (receiptFile) {
      formData.append('originalReceipt', receiptFile);
    }
  
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/api/v1/appliance/${productId}/receipt`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData,
      });
  
      if (response.ok) {
        navigate(`/appliances/${productId}`);
      } else {
        console.error('Failed to add receipt');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const title = location.state?.productName || "";

  return (
    <div>
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

        <div className="flex justify-center ml-10 mt-24">
          <p className="font-semibold text-3xl">{title}</p>
        </div>
        <div className="mt-16 max-w-5xl mx-auto">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Product Name */}
            <div>
              <label
                htmlFor="receiptName"
                className="block text-sm font-medium"
              >
                receipt name
              </label>
              <input
                type="text"
                id="receiptName"
                name="receiptName"
                placeholder="enter receipt name"
                value={receiptName}
                onChange={(e) => setReceiptName(e.target.value)}
                className="mt-3 w-full border-2 rounded bg-gray-100 p-2 focus:outline-none focus:ring-2 focus:ring-violet-700"
              />
            </div>

            {/* Receipt File */}
            <div>
              <label
                htmlFor="receiptFile"
                className="text-sm font-medium"
              >
                add receipts
              </label>
              <div className="mt-2">
                <label
                  htmlFor="receiptFile"
                  className="block w-full border-2 rounded bg-gray-100 p-2 cursor-pointer text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-700"
                >
                  {fileName || "choose file"}
                </label>
                <input
                  type="file"
                  id="receiptFile"
                  name="receiptFile"
                  accept=".jpg,.jpeg,.png,.pdf"
                  className="sr-only"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            {/* Receipt Type */}
            <div>
              <label
                htmlFor="receiptType"
                className="block text-sm font-medium"
              >
                receipt type
              </label>
              <select
                id="receiptType"
                value={receiptType}
                onChange={(e) => setReceiptType(e.target.value)}
                className="mt-3 w-full border-2 text-gray-400 rounded bg-gray-100 p-2 focus:outline-none focus:ring-2 focus:ring-violet-700"
                required
              >
                <option value="">select receipt type</option>
                {receiptTypes.map((type, index) => (
                  <option key={index} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="w-full bg-violet-700 text-white py-2 px-4 rounded-md text-lg font-semibold hover:bg-violet-800 focus:ring-2 focus:ring-offset-2 focus:ring-violet-700"
              >
                add receipt
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddReceipt