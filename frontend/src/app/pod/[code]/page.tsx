"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSocket } from "@/context/SocketContext";

const formatPodCode = (value: string) => {
  const cleaned = value
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase()
    .slice(0, 6);
  if (cleaned.length <= 3) return cleaned;
  return cleaned.slice(0, 3) + "-" + cleaned.slice(3);
};

const isValidPodCode = (code: string) => /^[A-Z0-9]{6}$/.test(code);

const PodPage = () => {
  const params = useParams();
  const router = useRouter();
  const socket = useSocket();
  const code =
    typeof params.code === "string"
      ? params.code
      : Array.isArray(params.code)
      ? params.code[0]
      : "";
  const formattedCode = formatPodCode(code || "");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    if (!code) return;
    if (!isValidPodCode(code)) {
      setError("Invalid pod code. Please check your link.");
      return;
    }
    if (!socket) return;
    setLoading(true);
    socket.emit("player:join", { code }, (response: any) => {
      setLoading(false);
      if (!response.success) {
        setError(response.error || "Failed to join pod.");
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        setJoined(true);
      }
    });
    // No disconnect here, socket is global
  }, [code, router, socket]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <h1 className="text-3xl font-bold mb-4">
        Pod: <span className="tracking-widest">{formattedCode}</span>
      </h1>
      {loading ? (
        <div className="flex flex-col items-center mb-8">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600 mb-4"></div>
          <div className="text-blue-600 text-lg">Joining pod...</div>
        </div>
      ) : error ? (
        <div className="text-red-600 text-lg mb-8">
          {error}
          {error.startsWith("Invalid") ? "" : " Redirecting..."}
        </div>
      ) : joined ? (
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Welcome to your pod!
        </p>
      ) : null}
      {/* TODO: Add pod functionality here */}
    </div>
  );
};

export default PodPage;
