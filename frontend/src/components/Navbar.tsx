function Navbar() {
  return (
    <nav className="my-6 flex justify-between">
      <div className="font-bold text-xl pl-3">
        <p>!RISK</p>
      </div>
      <div className="pr-3">
        <button className="pr-3">
          hi, name!
        </button>
        <button className="bg-violet-700 text-slate-50 py-2 px-6 rounded-lg">
          image
        </button>
      </div>
    </nav>
  )
}

export default Navbar