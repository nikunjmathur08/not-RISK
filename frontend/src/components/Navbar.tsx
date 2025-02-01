import { useNavigate } from "react-router-dom";

function Navbar({ name } : { name: string }) {
  const navigate = useNavigate();
  const displayName = localStorage.getItem('userName') || name;

  return (
    <nav className="my-6 flex justify-between">
      <div className="font-bold text-xl pl-4">
        <p>!RISK</p>
      </div>
      <div onClick={() => navigate("/profile")} className="pr-4">
        <button className="pr-4">
          hi, {displayName}!
        </button>
        <button className="bg-violet-700 text-slate-50 py-2 px-3 rounded-full text-xl w-12 h-12 items-center justify-center">
          {displayName[0]}
        </button>
      </div>
    </nav>
  )
}

export default Navbar;