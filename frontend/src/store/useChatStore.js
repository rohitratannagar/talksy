import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axio";
import { useAuthStore } from "./useAuthStore";
// import { deleteMessage } from "../../../backend/src/controllers/message.controller";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load users.");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    if (!userId) return;
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load messages.");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  // sendMessage: async (messageData) => {
  //   const { selectedUser, messages } = get();
  //   if (!selectedUser) return;

  //   try {
  //     const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
  //     set({ messages: [...messages, res.data] });
  //   } catch (error) {
  //     toast.error(error?.response?.data?.message || "Failed to send message.");
  //   }
  // },

  deleteMessage: async (messageId) => {
    const { messages } = get();
    try {
      await axiosInstance.delete(`/messages/delete/${messageId}`);
      const updatedMessages = messages.filter(msg => msg._id !== messageId);
      set({ messages: updatedMessages });
      toast.success("Message deleted");

    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete message.");
    }
  },
  

  subscribeToMessages: () => {
    const { selectedUser } = get();
    const socket = useAuthStore.getState().socket;

    if (!selectedUser || !socket) return;

    socket.off("newMessage"); // Prevent duplicate listener

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) {
      socket.off("newMessage");
    }
  },
  
  subscribeToDeleteMessages: () => {
    const { selectedUser } = get();
    const socket = useAuthStore.getState().socket;

    if (!selectedUser || !socket) return;

    socket.off("deleteMessage"); // Prevent duplicate listener

    socket.on("deleteMessage", (deletedMessage) => {
      const isMessageSentFromSelectedUser = deletedMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      const currentMessages = get().messages;
      set({
        messages: currentMessages.filter(msg => msg._id !== deletedMessage._id),
      });
    });
  },
  unsubscribeFromDeleteMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) {
      socket.off("deleteMessage");
    }
  },
  setSelectedUser: (selectedUser) => set({ selectedUser }),

  sendMessage: async (messageData) => {
  const { selectedUser, messages } = get();
  if (!selectedUser) return;

  const isGeminiBot = selectedUser._id === "6865237404bbbb6c967517f4"; 

  try {
    
    const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
    const newMessages = [...messages, res.data];
    set({ messages: newMessages });

    // If Gemini, also get AI response
    if (isGeminiBot) {
      const geminiRes = await axiosInstance.post("/gemini",  messageData );

      const botMessage = {
        senderId: selectedUser._id,
        text: geminiRes.data.reply,
        createdAt: new Date().toISOString(),
        _id: `gemini-${Date.now()}`, // temporary local ID, adjust based on your backend
      };

      set({ messages: [...get().messages, botMessage] });
    }
  } catch (error) {
    toast.error(error?.response?.data?.message || "Failed to send message.");
  }
}

}));

