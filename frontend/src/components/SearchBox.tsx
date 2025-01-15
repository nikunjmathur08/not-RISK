

function SearchBox() {
  return (
    <div className="border border-gray-400 flex py-2 px-2 max-w-64 rounded-lg my-2 mx-2">
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" className="pr-2">
        <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M20.9999 21L16.6499 16.65" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      <p>search...</p>
    </div>
  )
}

export default SearchBox