
import React from 'react';

type ReceiptProps = {
  name: string;
  file: string;
};

function Receipt({ name, file }: ReceiptProps) {
  return (
    <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg mb-4">
      <p className="text-lg">{name}</p>
      <a
        href={`http://localhost:3000/${file}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-neutral-950 px-4 py-2 text-white rounded-lg"
      >
        view
      </a>
    </div>
  );
}

export default Receipt;
