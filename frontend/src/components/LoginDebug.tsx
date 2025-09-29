// LoginDebug.tsx
import React, { useEffect, useState } from "react";

const LoginDebug: React.FC = () => {
  const [debug, setDebug] = useState<any>({});

  useEffect(() => {
    const checkStorage = () => {
      try {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");
        setDebug({
          hasToken: !!token,
          tokenPreview: token ? `${token.substring(0, 15)}...` : "none",
          hasUser: !!user,
          userKeys: user ? Object.keys(JSON.parse(user)) : [],
          storageAvailable: true,
        });
      } catch (e) {
        setDebug({ error: e.message, storageAvailable: false });
      }
    };

    checkStorage();
  }, []);

  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
      <h3 className="font-semibold mb-2">Login Debug Info</h3>
      <pre className="text-xs whitespace-pre-wrap">
        {JSON.stringify(debug, null, 2)}
      </pre>
      <button
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.reload();
        }}
        className="mt-2 px-3 py-1 text-sm bg-red-500 text-white rounded"
      >
        Clear Storage & Reload
      </button>
    </div>
  );
};

export default LoginDebug;
