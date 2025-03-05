import { useState, useEffect } from "react";

const API_URL: string | undefined = import.meta.env.VITE_API_URL;

export const useServerHealth = () => {
  const [serverReady, setServerReady] = useState<boolean>(false);

  useEffect(() => {
    if (!API_URL) {
      console.error("API_URL is not defined.");
      return;
    }

    const checkServerHealth = async () => {
      try {
        const response = await fetch(`${API_URL}/healthcheck`);
        if (response.ok) {
          setServerReady(true);
        } else {
          setTimeout(checkServerHealth, 3000); // Retry after 3 seconds
        }
      } catch (error) {
        console.error("Server is not ready, retrying...", error);
        setTimeout(checkServerHealth, 3000);
      }
    };

    checkServerHealth();
  }, []);

  return serverReady;
};
