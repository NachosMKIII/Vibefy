// Callback.jsx
import React, { useEffect } from "react";
import authUtils from "./authUtils";

const Callback = () => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      // Exchange the code for tokens (implement this in authUtils or here)
      console.log("Authorization code:", code);
      // Next step: Use the code and stored code_verifier to get tokens
    }
  }, []);

  return <div>Processing login...</div>;
};

export default Callback;
