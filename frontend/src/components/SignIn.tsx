import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { handleGoogleSuccess, handleSignIn } from "../utils/auth";

function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      await handleSignIn(email, password);
      navigate('/home');
    } catch (error) {
      console.error('Sign in failed:', error);
      setError('Failed to sign in. Please check your credentials.');
    }
  };

  // Google Sign-In success handler
  const onGoogleSuccess = async (credentialResponse: any) => {
    try {
      // Call the utility function to handle authentication
      await handleGoogleSuccess(credentialResponse);

      // Navigate to home after successful authentication
      navigate("/home");
    } catch (error) {
      console.error("Google authentication failed:", error);
      alert("Failed to sign in with Google. Please try again.");
    }
  };

  return (
    <div className="flex h-screen flex-col md:flex-row relative">
      {/* Mobile Background Image */}
      <div
        className="absolute inset-0 md:hidden bg-cover bg-center"
        style={{ backgroundImage: "url(/temp/PS5.jpg)" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-70"></div>
      </div>

      {/* Left Section */}
      <div className="w-full md:w-7/12 flex flex-col justify-center items-center min-h-screen md:min-h-0 bg-gray-50 md:bg-gray-50 bg-transparent px-4 md:px-20 py-8 md:py-0 relative z-10">
        <p className="font-bold text-2xl md:text-3xl mb-8 md:mb-16 text-white md:text-black">!RISK</p>
        <p className="text-xl md:text-2xl font-semibold mb-6 md:mb-10 text-white md:text-black">sign in to !RISK</p>

        {error && (
          <div className="w-full p-3 mb-4 text-red-500 bg-red-100 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full space-y-4 md:space-y-6">
          {/* Email Input */}
          <div>
            <label htmlFor="userEmail" className="block text-sm font-medium mb-2 text-white md:text-black">
              your email
            </label>
            <input
              type="email"
              id="userEmail"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-2 rounded bg-gray-100 p-2 focus:outline-none focus:ring-2 focus:ring-violet-700"
            />
          </div>

          {/* Password Input */}
          <div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2">
              <label htmlFor="userPassword" className="text-sm font-medium text-white md:text-black">
                password
              </label>
              <a href="#" className="text-sm text-gray-300 md:text-gray-400 hover:text-gray-100 md:hover:text-gray-600 mt-1 sm:mt-0">
                forgot your password?
              </a>
            </div>
            <input
              type="password"
              id="userPassword"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-2 rounded bg-gray-100 p-2 focus:outline-none focus:ring-2 focus:ring-violet-700"
            />
          </div>

          {/* Sign In Button */}
          <button 
            type="submit"
            className="w-full bg-violet-700 rounded py-2 text-white text-lg font-semibold hover:bg-violet-800">
            sign in
          </button>

          <p className="text-center text-sm text-gray-500 mt-4">or</p>

          {/* Google Sign In Button */}
          <div className="w-full flex justify-center items-center">
            <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
              <GoogleLogin
                onSuccess={onGoogleSuccess}
                onError={() => console.log("Google Login Failed")}
                useOneTap
                type="standard"
                theme="outline"
                size="large"
                text="continue_with"
                shape="rectangular"
                width="300"
              />
            </GoogleOAuthProvider>
          </div>

          {/* Sign Up Link for Mobile */}
          <div className="md:hidden text-center mt-6">
            <p className="text-sm text-gray-300 mb-2">don't have an account?</p>
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="text-white font-semibold hover:text-gray-300"
            >
              create account
            </button>
          </div>
        </form>
      </div>

      {/* Right Section - Only visible on desktop */}
      <div
        className="hidden md:block w-5/12 bg-cover bg-center relative"
        style={{ backgroundImage: "url(/temp/PS5.jpg)" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col justify-center items-center text-white px-10">
          <h2 className="text-3xl font-semibold mb-4 text-center">
            fffortless tracking, always <br /> at your fingertips
          </h2>
          <p className="text-center mb-6">
            share your details to track your invoices and <br /> warranty status effortlessly.
          </p>
          <button
            onClick={() => navigate("/signup")}
            className="bg-transparent border border-white rounded px-10 py-2 text-white text-lg hover:bg-white hover:text-black"
          >
            sign up
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
