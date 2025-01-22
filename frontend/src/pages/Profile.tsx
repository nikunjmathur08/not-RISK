import Sidebar from "../components/Sidebar";

function Profile() {
  return (
    <div className="flex min-h-screen">
      <div className="fixed top-0 left-0 h-screen">
        <Sidebar />
      </div>
      <main className="flex-1 ml-56 overflow-auto">
        <div className="p-6">
          <p className="text-3xl font-semibold mb-8 ml-4">edit profile</p>
          <div className="flex items-center mb-8 mt-20 ml-4">
            <div className="h-16 w-16 bg-violet-300 rounded-full flex items-center justify-center text-lg font-bold uppercase text-white">
              N
            </div>
            <div className="ml-4">
              <p className="text-xl font-medium">nikunj mathur</p>
              <button className="text-violet-700 underline mt-1">
                change profile photo
              </button>
            </div>
          </div>
          <div className="mt-8 max-w-2xl ml-4">
            <form className="space-y-6">
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium"
                >
                  name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  placeholder="nikunj mathur"
                  className="mt-3 w-full border-2 rounded p-2 focus:outline-none focus:ring-2 focus:ring-violet-700"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium"
                >
                  email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="nikunjmathur0810@gmail.com"
                  className="mt-3 w-full border-2 rounded p-2 focus:outline-none focus:ring-2 focus:ring-violet-700"
                />
              </div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="w-full bg-violet-700 text-white py-2 px-4 rounded-md text-lg font-semibold hover:bg-violet-800 focus:ring-2 focus:ring-offset-2 focus:ring-violet-700"
                >
                  save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Profile;
