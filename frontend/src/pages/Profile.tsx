import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  const fetchUserData = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/v1/user', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        const { user } = data;
        setFullName(`${user.firstName} ${user.lastName}`.trim());
        setEmail(user.username);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:3000/api/v1/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          firstName: fullName.split(' ')[0],
          lastName: fullName.split(' ')[1] || ''
        })
      });

      if (response.ok) {
        const data = await response.json();
        const { user } = data;
        
        // Update the displayed name with fresh data from backend
        setFullName(`${user.firstName} ${user.lastName}`.trim());
        alert('Profile updated successfully!');
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    document.cookie.split(';').forEach(cookie => {
      document.cookie = cookie
        .replace(/^ +/, '')
        .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
    });
    navigate('/');
  };

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
              {fullName ? fullName[0].toUpperCase() : 'N'}
            </div>
            <div className="ml-4">
              <p className="text-xl font-medium">{fullName || "nikunj mathur"}</p>
              <button className="text-violet-700 underline mt-1">
                change profile photo
              </button>
            </div>
          </div>
          <div className="mt-8 max-w-2xl ml-4">
            <form className="space-y-6" onSubmit={handleSubmit}>
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
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
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
                  value={email}
                  disabled
                  className="mt-3 w-full border-2 rounded p-2 bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-violet-700 text-white py-2 px-6 rounded-lg shadow-lg hover:bg-violet-800"
                >
                  save changes
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="bg-red-600 text-white py-2 px-6 rounded-lg shadow-lg hover:bg-red-700"
                >
                  logout
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
