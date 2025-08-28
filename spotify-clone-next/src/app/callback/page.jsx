// src/app/callback/page.jsx
"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function Callback() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    console.log("Authorization code:", code);

    if (code) {
      const codeVerifier = localStorage.getItem("code_verifier");
      console.log("Code verifier:", codeVerifier);
      if (!codeVerifier) {
        console.error("Code verifier not found in local storage");
        return;
      }

      fetch("/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, codeVerifier }),
      })
        .then((response) => {
          console.log("Token response status:", response.status);
          if (!response.ok) {
            return response.json().then((errorData) => {
              console.error("Spotify error details:", errorData);
              throw new Error(`HTTP error! Status: ${response.status}`);
            });
          }
          return response.json();
        })
        .then((data) => {
          console.log("Token response:", data);
          if (data.success) {
            localStorage.removeItem("code_verifier");
            window.location.href = "/";
          } else {
            console.error("Failed to retrieve tokens:", data);
          }
        })
        .catch((error) => {
          console.error("Error fetching token:", error);
        });
    } else {
      console.error("No authorization code found in URL");
    }
  }, [searchParams]);

  return <div>Processing login...</div>;
}
