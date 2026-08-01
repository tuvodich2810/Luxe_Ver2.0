import api from "./api";

export const sendMessage = async (message) => {
  const data = await api.post("/chat", {
    message,
  });

  return data;
};