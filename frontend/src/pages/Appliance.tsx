import SearchBox from "../components/SearchBox"
import Sidebar from "../components/Sidebar"


function Appliance() {

  return (
    <div className="flex max-w-max">
      <Sidebar />
      <div className="ml-2">
        <SearchBox />
      </div>
    </div>
  )
}

export default Appliance