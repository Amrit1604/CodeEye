export default function ProviderSetup() {
  const handleConnect = () => {
    window.location.href = "http://localhost:8000/providers/github/login";
  };

  return (
    <button className="connect-button" onClick={handleConnect} type="button">
      Connect GitHub
    </button>
  );
}
