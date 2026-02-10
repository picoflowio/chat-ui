const RUN_MSG_URL = "/ai/run";
const RUN_MSG_URL2 = "/ai/chat";
const DELETE_SESSION_URL = "/ai/end";

export const sendMessage = async (message, flowName, sessionId) => {
  const url = flowName === "TutorialFlow" ? RUN_MSG_URL2 : RUN_MSG_URL;
  const headers = {
    "Content-Type": "application/json",
    ...(sessionId && { "CHAT_SESSION_ID": sessionId }),
  };

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
