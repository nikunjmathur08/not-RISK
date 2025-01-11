  import { ApplianceCardProps } from '../types/Appliance'

  function ApplianceCard({ companyName, applianceName, applianceImg }: ApplianceCardProps) {
    return (
      <>
        <div className='bg-slate-50 drop-shadow-xl rounded-lg flex flex-col w-80 px-4 py-4 border border-slate/10'>
          <p className='text-violet-700 text-left'>{companyName.toUpperCase()}</p>
          <img src={applianceImg} alt={applianceName} className='h-32 w-32 sm:h-40 sm:w-40 md:h-48 md:w-48 object-cover rounded-lg justify-center self-center'></img>
          <p className='text-left pt-4'>{applianceName}</p>
        </div>
      </>
    )
  }

  export default ApplianceCard