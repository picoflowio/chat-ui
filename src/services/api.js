const getApiBase = () => {
  if (typeof window !== "undefined") {
    const localBase = localStorage.getItem("picochat_base_url")?.trim();
    if (localBase) return localBase.replace(/\/$/, "");
  }

  const envBase = import.meta.env.VITE_API_BASE_URL?.trim();
  if (envBase) return envBase.replace(/\/$/, "");

  // When the app is loaded from file:// (packaged Electron), use localhost backend
  if (typeof window !== "undefined" && window.location.protocol === "file:") {
    return "http://localhost:8000";
  }

  return "";
};

const withBase = (route) => {
  const base = getApiBase();
  return base ? `${base}${route}` : route;
};

export const sendMessage = async (message, flowName, sessionId, graphName) => {
  const headers = {
    "Content-Type": "application/json",
    // PicoFlow uses CHAT_SESSION_ID; the LangGraph demo uses SESSION_ID.
    ...(sessionId && {
      "CHAT_SESSION_ID": sessionId,
      "SESSION_ID": sessionId,
    }),
  };

  const url = !graphName && flowName === "TutorialFlow"
    ? withBase("/ai/chat")
    : withBase("/ai/run");

  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(
        graphName ? { message, graphName } : { message, flowName }
      ),
    });

    const data = await response.json().catch(() => ({}));
    const newSessionId =
      response.headers.get("SESSION_ID") ||
      response.headers.get("CHAT_SESSION_ID") ||
      sessionId;

    if (!response.ok) {
      const errMsg = data?.message || `HTTP error! status: ${response.status}`;
      throw new Error(errMsg);
    }

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
    await fetch(withBase("/ai/end"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "CHAT_SESSION_ID": sessionId,
        "SESSION_ID": sessionId,
      },
      body: JSON.stringify({}),
    });
  } catch (error) {
    console.error("Error ending chat:", error);
  }
};

export const getFlows = async () => {
  try {
    const response = await fetch(withBase("/ai/flows"), { method: "GET" });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errMsg = data?.message || `HTTP error! status: ${response.status}`;
      throw new Error(errMsg);
    }

    // Accept multiple possible shapes from the backend
    const rawFlows =
      (Array.isArray(data) && data) ||
      (Array.isArray(data?.flows) && data.flows) ||
      (Array.isArray(data?.data?.flows) && data.data.flows) ||
      [];

    // Normalize to objects with a name field so the UI can render consistently
    const flows = rawFlows
      .map((flow) =>
        typeof flow === "string" ? { name: flow } : flow
      )
      .filter((flow) => flow && flow.name);

    return flows;
  } catch (error) {
    console.error("Error fetching flows:", error);
    throw error;
  }
};

export const getGraphs = async () => {
  try {
    const response = await fetch(withBase("/ai/graphs"), { method: "GET" });
    const data = await response.json().catch(() => ([]));

    if (!response.ok) {
      const errMsg = data?.message || `HTTP error! status: ${response.status}`;
      throw new Error(errMsg);
    }

    // The LangGraph controller returns an array of graph-name strings.
    const rawGraphs =
      (Array.isArray(data) && data) ||
      (Array.isArray(data?.graphs) && data.graphs) ||
      [];

    return rawGraphs
      .map((graph) => (typeof graph === "string" ? { name: graph } : graph))
      .filter((graph) => graph && graph.name);
  } catch (error) {
    console.error("Error fetching graphs:", error);
    throw error;
  }
};
