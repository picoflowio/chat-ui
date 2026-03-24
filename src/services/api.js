const apiBase = (() => {
  const envBase = import.meta.env.VITE_API_BASE_URL?.trim();
  if (envBase) return envBase.replace(/\/$/, "");

  // When the app is loaded from file:// (packaged Electron), use localhost backend
  if (typeof window !== "undefined" && window.location.protocol === "file:") {
    return "http://localhost:8000";
  }

  return "";
})();

const withBase = (route) => (apiBase ? `${apiBase}${route}` : route);

const RUN_MSG_URL = withBase("/ai/run");
const RUN_MSG_URL2 = withBase("/ai/chat");
const DELETE_SESSION_URL = withBase("/ai/end");

export const sendMessage = async (message, flowName, sessionId) => {
  const headers = {
    "Content-Type": "application/json",
    ...(sessionId && { "CHAT_SESSION_ID": sessionId }),
  };

  const url = flowName === "TutorialFlow" ? RUN_MSG_URL2 : RUN_MSG_URL;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({ message, flowName }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const newSessionId = response.headers.get("CHAT_SESSION_ID") || sessionId;

    return {
      message: data.message || "No response received",
      sessionId: newSessionId,
    };
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

export const endChat = async (sessionId) => {
  if (!sessionId) return;
  
  try {
    await fetch(DELETE_SESSION_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "CHAT_SESSION_ID": sessionId,
      },
      body: JSON.stringify({}),
    });
  } catch (error) {
    console.error("Error ending chat:", error);
  }
};
