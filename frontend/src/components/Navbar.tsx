import { useNavigate } from "react-router-dom";

function Navbar({ name } : { name: string }) {
  const navigate = useNavigate();
  const displayName = localStorage.getItem('userName') || name;

  return (
    <nav className="my-4 md:my-6 flex justify-between items-center px-3 md:px-4">
      <div className="font-bold text-2xl md:text-3xl">
        <p>!RISK</p>
      </div>
      <div onClick={() => navigate("/profile")} className="flex items-center">
        <button className="pr-2 md:pr-4 text-sm md:text-base">
          hi, {displayName}!
        </button>
        <button className="bg-violet-700 text-slate-50 py-1.5 md:py-2 px-2 md:px-3 rounded-full text-lg md:text-xl w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
          {displayName[0]}
        </button>
      </div>
    </nav>
  )
}

export default Navbar;