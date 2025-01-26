import { jwtDecode } from 'jwt-decode';

export interface GoogleUser {
  email: string;
  name: string;
  picture?: string;
}

export const handleGoogleSuccess = async (credentialResponse: { credential: string }) => {
  const decoded: any = jwtDecode(credentialResponse.credential);
  
  const googleUser: GoogleUser = {
    email: decoded.email,
    name: decoded.name,
    picture: decoded.picture
  };

  try {
    const response = await fetch('http://localhost:3000/api/users/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(googleUser),
    });

    if (!response.ok) {
      throw new Error('Failed to authenticate with Google');
    }

    const data = await response.json();
    localStorage.setItem('token', data.token);
    return data.token;
  } catch (error) {
    console.error('Error during Google authentication:', error);
    throw error;
  }
};