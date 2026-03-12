import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  withCredentials: true,
});

// Retry logic for network failures (max 3 retries)
const MAX_RETRIES = 3;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;

    // No config or already retried enough
    if (!config) return Promise.reject(error);

    config.__retryCount = config.__retryCount || 0;

    const shouldRetry =
      !error.response && // network error (no response)
      config.__retryCount < MAX_RETRIES;

    if (!shouldRetry) {
      return Promise.reject(error);
    }

    config.__retryCount += 1;

    console.log(`Retrying... (${config.__retryCount})`);

    // small delay between retries
    await new Promise((resolve) =>
      setTimeout(resolve, 300 * config.__retryCount)
    );

    return api(config);
  }
);

export default api;
