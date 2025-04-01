import axios from "axios";

const API_URL = "http://localhost:3000/auth"; // Your NestJS backend

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  password:string;
  email: string;
  role: string;
  phoneNo: string;
}


export const registerUser = async (data: {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  role: string;
  phoneNo: string;
}) => {
  return axios.post(`${API_URL}/register`, data);
};

export const loginUser = async (username: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/login`, 
      { username, password },
      {
        // Required to read custom headers in cross-origin requests
        withCredentials: true,
      }
    );
    // Check for token in multiple possible locations
    const token = response.data.access_token.access_token;

    console.log("token ",token)
    if (!token) {
      throw new Error('No authentication token found in response');
    }

    // Store token securely
    localStorage.setItem('token', token);
    console.log('Token stored successfully');

    // Return the response data (excluding sensitive token if it was in body)
    const { token: _, accessToken: __, ...safeData } = response.data;
    return safeData;

  } catch (error:any) {
    console.error('Login failed:', {
      error: error.response?.data || error.message,
      status: error.response?.status,
      headers: error.response?.headers
    });

    // Clear any existing token on failure
    localStorage.removeItem('token');

    // Convert to standardized error format
    const errMessage = error.response?.data?.message || 
                      error.message || 
                      'Login failed';
    throw new Error(errMessage);
  }
};
// export const loginUser = async (usernameOrEmail: string, password: string) => {
//   try {
//     const response = await axios.post(`${API_URL}/login`, {
//       username: usernameOrEmail,
//       password,
//     });
//     return response.data;
//   } catch (error: any) {
//     throw error.response?.data || 'Login failed';
//   }
// };

export const getProfile = async (token: string) => {
  try {
    const response = await axios.get(`${API_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || 'Failed to fetch profile';
  }
};

export const logoutUser = () => {
  localStorage.removeItem("token");
};
