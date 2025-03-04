import { useState, useEffect } from "react";

// Ensure API_URL is defined in Vite's environment variables
const API_URL: string | undefined = import.meta.env.VITE_API_URL;

const ServerWakeUpMessage: React.FC = () => {
  const [serverReady, setServerReady] = useState<boolean>(false);
  const [showAdminMessage, setShowAdminMessage] = useState<boolean>(false);

  useEffect(() => {
    if (!API_URL) {
      console.error("API_URL is not defined in environment variables.");
      setShowAdminMessage(true);
      return;
    }

    const checkServerHealth = async () => {
      try {
        const response = await fetch(`${API_URL}/healthcheck`, { method: "GET" });
        if (response.ok) {
          setServerReady(true);
        } else {
          throw new Error("Server responded but is not ready.");
        }
      } catch (error) {
        console.log("Server not ready yet, retrying...", error);
        setTimeout(checkServerHealth, 5000); // Retry after 5 seconds
      }
    };

    checkServerHealth();

    const timeout: ReturnType<typeof setTimeout> = setTimeout(() => {
      setShowAdminMessage(true);
    }, 50000); // Show admin message if server takes > 50 seconds

    return () => clearTimeout(timeout);
  }, []);

  if (serverReady) return null; // Hide component once server is ready

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>⚡ Waking up the server...</h2>
      <p>Please wait while we check the server status.</p>

      {showAdminMessage && (
        <p style={{ color: "red", marginTop: "10px" }}>
          ⏳ If this takes too long, please contact the website administrator.
        </p>
      )}
    </div>
  );
};

export default ServerWakeUpMessage;
