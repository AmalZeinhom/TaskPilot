import { store } from "@/Store/store";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { logout } from "@/Store/authSlice";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasekey = import.meta.env.VITE_SUPABASE_KEY;

// Create an axios instance with the base URL of Supabase, any request using api will automatically prepend this URL to the request path. This is useful for keeping the code clean and avoiding repetition of the base URL in every request.
const api = axios.create({
  baseURL: supabaseUrl
});

const forceLogout = () => {
  Cookies.remove("access_token");
  Cookies.remove("refresh_token");

  store.dispatch(logout());
};

// Interceptors for add the token with every request
// The request interceptor is used to add the access token to the Authorization header of every outgoing request. It retrieves the token from cookies and attaches it to the request headers if it exists.
// config: The configuration object for the request, which includes details like headers, URL, method, etc. The interceptor modifies this config object to include the Authorization header with the access token before the request is sent out.
api.interceptors.request.use((config) => {
  const token = Cookies.get("access_token");
  if (token) {
    // Authorization is a standard JWT format.
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Add the apikey header for Supabase
  config.headers.apikey = supabasekey;
  return config;
});

// This works after the reply comes back. It has 2 status success && error.
api.interceptors.response.use(
  (response) => response, // If there is no error, just return the response as it is.
  async (error) => {
    const originalRequest = error.config;

    // If the response has an error and the status code is 401 (Unauthorized), it means that the access token has expired or is invalid. In this case, the interceptor will attempt to refresh the access token using the refresh token stored in cookies. If the refresh token is available, it sends a request to the Supabase authentication endpoint to get a new access token. If successful, it updates the cookies with the new access token and retries the original request with the new token. If any step fails (e.g., no refresh token, failed to get a new access token), it will remove both tokens from cookies and reject the error.
    if (error.response?.status === 401) {
      if (!originalRequest._retry) {
        forceLogout();
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      const refreshToken = Cookies.get("refresh_token");

      if (!refreshToken) {
        forceLogout();
        return Promise.reject(error);
      }

      try {
        // Send a new request to renew the token
        const res = await axios.post(
          `${supabaseUrl}/auth/v1/token?grant_type=refresh_token`,
          { refresh_token: refreshToken },
          {
            headers: {
              "Content-Type": "application/json",
              apikey: supabasekey,
              Authorization: `Bearer ${supabasekey}`
            }
          }
        );

        // Recieve the new access token from the response.
        const newAccessToken = res.data.access_token;

        // Store the new token into cookies
        Cookies.set("access_token", newAccessToken, {
          expires: 7 * 24 * 60 * 60 // 7 days
        });

        // Retry the original request, and update the Authorization header with the new access token.
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Retry the original request with the new token and return the response.
        // This is a Token Refresh Flow with Request Reply.
        return api(originalRequest);

        // Incase of the refresh failed
      } catch (err) {
        toast.error((err as Error).message);
        forceLogout();
      }
    }
    return Promise.reject(error);
  }
);

export default api;
