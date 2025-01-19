
function SignUp () {
  return (
    <div className="flex h-screen">
      {/* Left Section */}
      <div
        className="w-5/12 bg-cover bg-center relative"
        style={{ backgroundImage: "url(/temp/Mac.jpg)" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white px-10">
          <h2 className="text-3xl font-semibold mb-4 text-center">effortless tracking, always <br/> at your fingertips</h2>
          <p className="text-center mb-6">
            share your details to track your invoices and <br/> warranty status effortlessly.
          </p>
          <button className="bg-transparent border border-white rounded px-10 py-2 text-white text-lg hover:bg-white hover:text-black">
            sign in
          </button>
        </div>
      </div>
      <div className="w-7/12 flex flex-col justify-center items-center bg-gray-50 px-20">
        <p className="font-bold text-3xl mb-16">!RISK</p>
        <p className="text-2xl font-semibold mb-10">sign up to !RISK</p>

        <form className="w-full space-y-6">
          {/* Email Input */}
          <div>
            <label htmlFor="userEmail" className="block text-sm font-medium mb-2">
              your email
            </label>
            <input
              type="email"
              id="userEmail"
              placeholder="enter your mail"
              className="w-full border-2 rounded bg-gray-100 p-2 focus:outline-none focus:ring-2 focus:ring-violet-700"
            />
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              your name
            </label>
            <input
              type="text"
              id="name"
              placeholder="enter your name"
              className="w-full border-2 rounded bg-gray-100 p-2 focus:outline-none focus:ring-2 focus:ring-violet-700"
            />
          </div>

          {/* Password Input */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="userPassword" className="text-sm font-medium">
                password
              </label>
            </div>
            <input
              type="password"
              id="userPassword"
              placeholder="enter your password"
              className="w-full border-2 rounded bg-gray-100 p-2 focus:outline-none focus:ring-2 focus:ring-violet-700"
            />
          </div>

          {/* Sign In Button */}
          <button className="w-full bg-violet-700 rounded py-2 text-white text-lg font-semibold hover:bg-violet-800">
            sign up
          </button>

          <p className="text-center text-sm text-gray-500 mt-4">or</p>

          {/* Google Sign Up Button */}
          <button className="w-full flex justify-center items-center border rounded py-2 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-700">
            <svg
              width="24"
              height="24"
              viewBox="0 0 256 262"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMidYMid"
              className="mr-2"
            >
              <path
                d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                fill="#4285F4"
              />
              <path
                d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                fill="#34A853"
              />
              <path
                d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                fill="#FBBC05"
              />
              <path
                d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                fill="#EB4335"
              />
            </svg>
            sign up with Google
          </button>
        </form>
      </div>

      {/* Right Section */}
      
    </div>
  );
}

export default SignUp