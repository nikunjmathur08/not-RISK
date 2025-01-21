import { useNavigate } from 'react-router-dom';

function Error() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/home');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 33 43" fill="none">
          <path d="M7 1L2 15H10.5" stroke="black" strokeWidth="2" />
          <path d="M29 1L24 15H32.5" stroke="black" strokeWidth="2" />
          <path d="M18.95 15H15.05C14.4701 15 14 15.4701 14 16.05V30.95C14 31.5299 14.4701 32 15.05 32H18.95C19.5299 32 20 31.5299 20 30.95V16.05C20 15.4701 19.5299 15 18.95 15Z" stroke="black" strokeWidth="2" />
          <path d="M5 42C5 42 10 36.5 17 36.5C24 36.5 29 42 29 42" stroke="black" strokeWidth="2" />
          <path d="M8.5 15V20.5" stroke="black" strokeWidth="2" />
          <path d="M30.5 15V20.5" stroke="black" strokeWidth="2" />
        </svg>
        <div className="mt-16">
          <button 
            onClick={handleGoHome} 
            className="py-2 px-6 rounded-md ring-2 ring-violet-700 hover:bg-violet-700 hover:text-white focus:outline-none focus:ring-2 transition-all"
          >
            home
          </button>
        </div>
      </div>
    </div>
  );
}

export default Error;
