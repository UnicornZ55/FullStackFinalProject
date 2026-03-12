import axios from "axios";

const externalClient = axios.create({
  timeout: 5000,
});

externalClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ECONNABORTED") {
      error.userMessage = "Request timeout. Using cached data if available.";
    } else if (!error.response) {
      error.userMessage = "Network unavailable. Using cached data if available.";
    } else {
      error.userMessage =
        error.response?.data?.message || "Service temporarily unavailable.";
    }

    return Promise.reject(error);
  }
);

export default externalClient;