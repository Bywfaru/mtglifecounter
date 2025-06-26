"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSocket } from "@/context/SocketContext";

const formatPodCode = (value: string) => {
  // Remove non-alphanumeric and uppercase
  const cleaned = value
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase()
    .slice(0, 6);
  if (cleaned.length <= 3) return cleaned;
  return cleaned.slice(0, 3) + "-" + cleaned.slice(3);
};

const unformatPodCode = (value: string) =>
  value
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase()
    .slice(0, 6);

const Home = () => {
  const [podCode, setPodCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const socket = useSocket();

  const handleJoin = () => {
    if (podCode.length === 6) {
      router.push(`/pod/${podCode}`);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
      .replace(/[^a-zA-Z0-9]/g, "")
      .toUpperCase()
      .slice(0, 6);
    setPodCode(raw);
  };

  const handleHost = () => {
    if (!socket) return;
    setLoading(true);
    setError(null);
    console.log(socket.id);
    socket.emit(
      "host:create",
      {},
      (response: { code?: string; error?: string }) => {
        setLoading(false);
        if (response.code) {
          const code = unformatPodCode(response.code);
          router.push(`/pod/${code}`);
        } else {
          setError(response.error || "Failed to create pod.");
        }
      }
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <h1 className="text-4xl font-bold mb-12 text-center">MTG Life Counter</h1>
      <div className="flex flex-col gap-8 w-full max-w-xs">
        <div className="flex flex-col items-center gap-4">
          <input
            type="text"
            placeholder="Enter pod code"
            value={formatPodCode(podCode)}
            onChange={handleInputChange}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 text-lg text-center w-full tracking-widest"
            maxLength={7}
            style={{ textTransform: "uppercase", letterSpacing: "0.2em" }}
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
          />
          <button
            className="px-10 py-4 rounded-lg bg-green-600 text-white text-2xl font-semibold shadow-lg hover:bg-green-700 transition-colors w-full"
            onClick={handleJoin}
            disabled={podCode.length !== 6 || loading}
          >
            JOIN
          </button>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="text-gray-500 text-sm">or</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>
        <button
          className="px-10 py-4 rounded-lg bg-blue-600 text-white text-2xl font-semibold shadow-lg hover:bg-blue-700 transition-colors w-full disabled:opacity-60"
          onClick={handleHost}
          disabled={loading || !socket}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <span className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white mr-2"></span>
              Creating pod...
            </span>
          ) : (
            "HOST A POD"
          )}
        </button>
        {error && (
          <div className="text-red-600 text-center text-lg mt-2">{error}</div>
        )}
      </div>
    </div>
  );
};

export default Home;
