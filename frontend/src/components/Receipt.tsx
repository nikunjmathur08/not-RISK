
type ReceiptProps = {
  name: string;
  receiptId: string;
  applianceId: string;
};

function Receipt({ name, receiptId, applianceId }: ReceiptProps) {
  const handleClick = () => {
    const token = localStorage.getItem('token');
    const apiUrl = import.meta.env.VITE_API_URL;
    window.open(`${apiUrl}/api/v1/appliance/${applianceId}/receipt/${receiptId}?token=${token}`, '_blank');
  };

  return (
    <div
      onClick={handleClick}
      className="flex items-center space-x-3 p-2 rounded-lg mb-2 cursor-pointer hover:bg-gray-200 transition-colors"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <line x1="10" y1="9" x2="8" y2="9" />
      </svg>
      <span className="text-lg">{name}</span>
    </div>
  );
}

export default Receipt;
