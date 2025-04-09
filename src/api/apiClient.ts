import axios from 'axios';
import { getSession, signOut } from "next-auth/react"

// let currentSession: any = null;

// export const setCurrentSession = (session: any) => {
//     currentSession = session;
//   };

const getBaseConfig = () => ({
  baseURL: process.env.API_URL || 'http://192.168.31.40:4000/api',
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Credentials': 'true',
  },
  withCredentials: true,
});

export const apiClient = axios.create(getBaseConfig());

apiClient.interceptors.request.use(
    async (config) => {
        const session = await getSession()
        if (session?.jwt) {
            config.headers.Authorization = `Bearer ${session.jwt}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        console.log(error);
        if (error.response?.status === 401 && 
            (!error.config.url?.includes('/users/profile') &&
            !error.config.url?.includes('/auth/') || error.response?.data.error === "invalid token")) {
      // Clear the session and redirect to login
            await signOut({ 
                redirect: true, 
                callbackUrl: "/login?error=SessionExpired" 
            })
        }
        return Promise.reject(error)
    }
)

// apiClient.interceptors.request.use(async (config) => {
//     if (currentSession?.jwt) {
//         config.headers.Authorization = `Bearer ${currentSession.jwt}`;
//     }
    
//     return config;
//   })

//   export const clearSessionCache = () => {
//     cachedSession = null;
// };

// apiClient.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//       // Only redirect on 401 errors from non-login/register endpoints
//       if (error.response?.status === 401 && 
//           !['/login', '/register'].includes(error.config.url)) {
//         // Clear stored auth data
//         Cookies.remove('csrf_token');
//         // Let the component handle the redirect
//         throw new Error('Not authenticated');
//       }
//       return Promise.reject(error);
//     }
//   );
