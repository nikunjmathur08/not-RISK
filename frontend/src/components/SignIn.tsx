function SignIn() {
  return (
    <div>
      <div className="mt-16 flex justify-center items-center flex-col">
        <p className="font-bold text-3xl">!RISK</p>
        <p className="mt-20 font-semibold text-2xl">sign in to !RISK</p>
        <div className="mt-16 w-full max-w-4xl">
          <form className="space-y-6">
            <div>
              <label
                htmlFor="userEmail"
                className="block text-sm font-medium"
              >
                email
              </label>
              <input
                type="email"
                id="userEmail"
                placeholder="enter your email"
                className="mt-3 w-full border-2 rounded bg-gray-100 p-2 focus:outline-none focus:ring-2 focus:ring-violet-700"
              />
            </div>
            <div>
              <div className="flex justify-between">
                <label
                  htmlFor="userPassword"
                  className="block text-sm font-medium"
                >
                  password
                </label>
                <label
                  className="block text-sm font-medium"
                >
                  forgot your password?
                </label>
              </div>
              <input
                type="password"
                id="userPassword"
                placeholder="enter your password"
                className="mt-3 w-full border-2 rounded bg-gray-100 p-2 focus:outline-none focus:ring-2 focus:ring-violet-700"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
