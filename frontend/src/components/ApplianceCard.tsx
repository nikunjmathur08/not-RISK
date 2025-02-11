import { useNavigate } from 'react-router-dom';
import { ApplianceCardProps } from '../types/Appliance'

function ApplianceCard({ id, companyName, applianceName, applianceImg }: ApplianceCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (id) {
      navigate(`/appliances/${id}`);
    }
  }
  return (
    <div onClick={handleClick} className='bg-slate-50 drop-shadow-xl rounded-lg flex flex-col h-full p-4 border border-slate-200 cursor-pointer'>
      <p className='text-violet-700 text-left sm:text-center'>{companyName ? companyName.toUpperCase() : ''}</p>
      <div className="flex-1 flex items-center justify-center py-4">
        <img 
          src={applianceImg || 'https://via.placeholder.com/150'} 
          alt={applianceName} 
          className='h-40 w-40 sm:h-44 sm:w-44 md:h-48 md:w-48 object-contain rounded-lg'
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
          }}
        />
      </div>
      <p className='text-center text-lg sm:text-xl'>{applianceName}</p>
    </div>
  );
}

export default ApplianceCard;