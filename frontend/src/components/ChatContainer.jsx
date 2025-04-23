import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import { Trash2 } from "lucide-react"; // or use any icon from your icon lib
import toast from "react-hot-toast";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    deleteMessage, 
    subscribeToDeleteMessages,
    unsubscribeFromDeleteMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToDeleteMessages()
    subscribeToMessages();
    return () => {
      unsubscribeFromMessages()
      unsubscribeFromDeleteMessages()
    }
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages, deleteMessage, unsubscribeFromDeleteMessages, subscribeToDeleteMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }
  const confirmDeleteMessage = (messageId) => {
    const handleDelete = (messageId, toastId) => {
      deleteMessage(messageId); // from store
      toast.dismiss(toastId);
    };
  
    const handleCancel = (toastId) => {
      toast.dismiss(toastId);
    };
  
    toast((t) => (
      <div className="flex flex-col gap-4 p-4 bg-white shadow-md rounded-lg">
        <span className="text-lg font-semibold text-gray-800">Are you sure you want to delete this message?</span>
        <div className="flex justify-between">
          <button
            onClick={() => handleDelete(messageId, t.id)}
            className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none"
          >
            Yes
          </button>
          <button
            onClick={() => handleCancel(t.id)}
            className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none"
          >
            Cancel
          </button>
        </div>
      </div>
    ), {
      duration: 5000,
    });
  };
  
  
  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-3 sm:space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
            ref={messageEndRef}
          >
            <div className="chat-image avatar">
              <div className="size-8 sm:size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>

            <div className="chat-header mb-0.5 sm:mb-1 flex items-center gap-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
              {message.senderId === authUser._id && (
                <button
                  onClick={() => confirmDeleteMessage(message._id)}
                  className="text-red-500 hover:text-red-700"
                  title="Delete message"
                >
                  <Trash2 size={14} />
                </button>
              )}

            </div>

            <div className="chat-bubble flex flex-col max-w-[80%] sm:max-w-[60%]">
            {message.image && (
              <img
                src={message.image}
                alt="Attachment"
                className="w-[150px] sm:w-[200px] h-auto rounded-md mb-1 sm:mb-2"
              />
            )}
            {message.text && <p className="text-sm sm:text-base">{message.text}</p>}
          </div>

          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
