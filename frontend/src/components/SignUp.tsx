
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { handleGoogleSuccess, handleSignUp } from '../utils/auth';

function SignUp () {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !name || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      await handleSignUp({ email, name, password });
      navigate('/home');
    } catch (error) {
      console.error('Signup failed:', error);
      setError('Failed to sign up. Please try again.');
    }
  };

  const onGoogleSuccess = async (credentialResponse: any) => {
    try {
      await handleGoogleSuccess(credentialResponse);
      navigate('/home');
    } catch (error) {
      console.error('Google authentication failed:', error);
      setError('Failed to sign up with Google. Please try again.');
    }
  };

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
          <button onClick={() => navigate("/signin")} className="bg-transparent border border-white rounded px-10 py-2 text-white text-lg hover:bg-white hover:text-black">
            sign in
          </button>
        </div>
      </div>
      <div className="w-7/12 flex flex-col justify-center items-center bg-gray-50 px-20">
        <p className="font-bold text-3xl mb-16">!RISK</p>
        <p className="text-2xl font-semibold mb-10">sign up to !RISK</p>

        {error && (
          <div className="w-full p-3 mb-4 text-red-500 bg-red-100 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full space-y-6">
          {/* Email Input */}
          <div>
            <label htmlFor="userEmail" className="block text-sm font-medium mb-2">
              your email
            </label>
            <input
              type="email"
              id="userEmail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="enter your password"
              className="w-full border-2 rounded bg-gray-100 p-2 focus:outline-none focus:ring-2 focus:ring-violet-700"
            />
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full bg-violet-700 rounded py-2 text-white text-lg font-semibold hover:bg-violet-800">
            sign up
          </button>

          <p className="text-center text-sm text-gray-500 mt-4">or</p>

          {/* Google Sign Up Button */}
          <div className="w-full">
            <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
              <GoogleLogin
                onSuccess={onGoogleSuccess}
                onError={() => setError('Google sign up failed. Please try again.')}
                useOneTap
              />
            </GoogleOAuthProvider>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;