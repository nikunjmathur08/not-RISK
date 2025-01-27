import { jwtDecode } from 'jwt-decode';

export interface GoogleUser {
  email: string;
  name: string;
  picture?: string;
}

export const handleGoogleSuccess = async (credentialResponse: { credential: string }) => {
  try{
    const response = await fetch('http://localhost:3000/api/v1/user/google', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ credential: credentialResponse.credential }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to authenticate with Google');
    }

    const data = await response.json();

    localStorage.setItem('token', data.token);

    return data;
  } catch (error) {
    console.error('Error during Google authentication:', error);
    throw error;
  }
};