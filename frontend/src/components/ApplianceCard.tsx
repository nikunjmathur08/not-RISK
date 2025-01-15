import { ApplianceCardProps } from '../types/Appliance'

function ApplianceCard({ companyName, applianceName, applianceImg }: ApplianceCardProps) {
  return (
    <div className='bg-slate-50 drop-shadow-xl rounded-lg flex flex-col h-full p-4 border border-slate-200'>
      <p className='text-violet-700 text-left'>{companyName.toUpperCase()}</p>
      <div className="flex-1 flex items-center justify-center py-4">
        <img 
          src={applianceImg} 
          alt={applianceName} 
          className='h-32 w-32 sm:h-40 sm:w-40 md:h-48 md:w-48 object-cover rounded-lg'
        />
      </div>
      <p className='text-left'>{applianceName}</p>
    </div>
  );
}

export default ApplianceCard;