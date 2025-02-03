import { jwtDecode } from 'jwt-decode';

export interface GoogleUser {
  email: string;
  name: string;
  picture?: string;
}

export interface SignUpData {
  email: string;
  name: string;
  password: string;
}

export const handleSignIn = async (email: string, password: string) => {
  try {
    const response = await fetch('http://localhost:3000/api/v1/user/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: email,
        password: password
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to sign in');
    }

    localStorage.setItem('token', data.token);
    return data;
  } catch (error) {
    console.error('Error during sign in:', error);
    throw error;
  }
};

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

export const handleSignUp = async (signUpData: SignUpData) => {
  try {
    if (!signUpData.email || !signUpData.name || !signUpData.password) {
      throw new Error('All fields are required');
    }

    const response = await fetch('http://localhost:3000/api/v1/user/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        username: signUpData.email,
        firstName: signUpData.name.split(' ')[0],
        lastName: signUpData.name.split(' ')[1] || '',
        password: signUpData.password
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to sign up');
    }

    localStorage.setItem('token', data.token);
    return data;
  } catch (error) {
    console.error('Error during sign up:', error);
    throw error;
  }
};