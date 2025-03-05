import { useServerHealth } from "../hooks/ServerHealthCheck.ts";

const ServerSuspenseWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const serverReady = useServerHealth();

  if (!serverReady) {
    return <div style={{ textAlign: "center", padding: "20px", margin:'auto' }}>
                <h2>⚡ Waking up the server...</h2>
                <p>Please wait while we check the server status.</p>
            </div>
  }

  return <>{children}</>;
};

export default ServerSuspenseWrapper;
