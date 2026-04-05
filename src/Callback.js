import React, { useEffect } from "react";

function Callback() {
  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);

    const accessToken = params.get("access_token");
    const instanceUrl = params.get("instance_url");

    if (accessToken && instanceUrl) {
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("instance_url", instanceUrl);
      window.location.href = "/dashboard";
    } else {
      alert("Login failed. No access token found.");
      window.location.href = "/";
    }
  }, []);

  return <h2 style={{ textAlign: "center", marginTop: "100px" }}>Logging in...</h2>;
}

export default Callback;