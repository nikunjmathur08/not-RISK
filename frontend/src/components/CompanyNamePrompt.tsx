import { useState } from 'react';

type CompanyNamePromptProps = {
  onSubmit: (companyName: string) => Promise<void>;
  onClose: () => void;
};

function CompanyNamePrompt({ onSubmit, onClose }: CompanyNamePromptProps) {
  const [companyName, setCompanyName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    const trimmedCompanyName = companyName.trim();
    if (!trimmedCompanyName) {
      setError('Company name is required');
      return;
    }

    try {
      await onSubmit(trimmedCompanyName);
      setError(null);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update company details');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-4">add company details</h2>
        <p className="mb-4 text-gray-600">
          please add the company name for this product :D
        </p>
        <input
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="enter company name"
          className="w-full p-2 border rounded mb-4"
        />
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            skip for now
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-violet-700 text-white rounded hover:bg-violet-800"
          >
            save
          </button>
        </div>
      </div>
    </div>
  );
}

export default CompanyNamePrompt;