import React from "react";

function App() {
  const handleLogin = () => {
    const clientId = "3MVG9rZjd7MXFdLgAFuHnK2J5ZsRE4vLIK9Nme3gpdOzdoo9I.PNk4Bba89izbGznNc62bUGdkfd.kg02y1tl";
    const redirectUri = "http://localhost:3000/callback";

    const authUrl =
      `https://login.salesforce.com/services/oauth2/authorize` +
      `?response_type=token` +
      `&client_id=${clientId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}`;

    window.location.href = authUrl;
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Salesforce Validation Rule Manager</h1>
      <button
        onClick={handleLogin}
        style={{ padding: "10px 20px", fontSize: "16px" }}
      >
        Login with Salesforce
      </button>
    </div>
  );
}

export default App;