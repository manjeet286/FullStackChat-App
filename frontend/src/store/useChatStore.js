import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthstore";

export const useChatStore = create((set, get) => ({
  messages: JSON.parse(localStorage.getItem("messages")) || {}, // Store messages by userId
  users: [],
  selectedUser: null,
  isUserLoading: false,
  isMessagesLoading: false,
  getUser: async () => {
    set({ isUserLoading: true });
    try {
      const res = await axiosInstance.get("/message/users");
      console.log("Fetched Users:", res.data);
      set({ users: res.data });
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error(error?.response?.data?.message || "Failed to fetch users");
    } finally {
      set({ isUserLoading: false });
    }
  },
  getMessage: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/message/${userId}`);
      console.log("Fetched messages:", res.data);
      const updatedMessages = { ...get().messages, [userId]: res.data };
      set({ messages: updatedMessages });
      localStorage.setItem("messages", JSON.stringify(updatedMessages)); // Save to localStorage
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error(error?.response?.data?.message || "Failed to fetch messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  setSelectedUser: (selectedUser) => {
    set({ selectedUser });
  },
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    if (!selectedUser) {
      toast.error("No user selected to send a message.");
      return;
    }
    try {
      const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, messageData);
      console.log("Message sent successfully:", res.data);
      const updatedMessages = {
        ...messages,
        [selectedUser._id]: [...(messages[selectedUser._id] || []), res.data],
      };
      set({ messages: updatedMessages });
      localStorage.setItem("messages", JSON.stringify(updatedMessages)); // Save to localStorage
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(error?.response?.data?.message || "Failed to send message");
    }
  },
  subscribeToMessages:()=>{
      const  {selectedUser} = get();
      if(!selectedUser)
      {
          return ;
      }
      const socket= useAuthStore.getState().socket;
      socket.on("newMessage", (newMessage) => {
          const isMessageSentFromSelectedUser= newMessage.senderId===selectedUser._id;
          if(!isMessageSentFromSelectedUser)
          {
               return;
          }
        
        const { messages } = get();
        const updatedMessages = {
            ...messages,
            [newMessage.senderId]: [...(messages[newMessage.senderId] || []), newMessage],
        };
        set({ messages: updatedMessages });
        localStorage.setItem("messages", JSON.stringify(updatedMessages)); // Persist the update
    });
  },
  unsubscribeToMessages:()=>{
    const socket= useAuthStore.getState().socket;
    socket.off("newMessage");
  }
}));
