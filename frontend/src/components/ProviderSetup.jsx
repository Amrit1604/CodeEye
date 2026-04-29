export default function ProviderSetup({ connected }) {
  const handleConnect = () => {
    window.location.href = "http://localhost:8000/providers/github/login";
  };

  return (
    <button className="connect-button" onClick={handleConnect} type="button">
      {connected ? "Reconnect GitHub" : "Connect GitHub"}
    </button>
  );
}
