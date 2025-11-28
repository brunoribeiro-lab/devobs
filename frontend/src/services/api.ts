import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "localhost";
const isClient = typeof window !== "undefined";
const api = axios.create({
  baseURL,
  withCredentials: true,
});

api.interceptors.request.use(async (config) => {
  if (!isClient) {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;
    if (token) config.headers["Authorization"] = `Bearer ${token}`;
  }

  if (isClient) {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)access_token\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    if (token) config.headers["Authorization"] = `Bearer ${token}`;
  }

  config.headers!["Cache-Control"] =
    "no-store, no-cache, must-revalidate, proxy-revalidate";
  config.headers!["Pragma"] = "no-cache";
  config.headers!["Expires"] = "0";

  if (config.method === "get") {
    config.params = {
      ...config.params,
    };
  }

  return config;
});

export default api;
