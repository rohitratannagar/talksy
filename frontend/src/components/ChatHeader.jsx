import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useState, useRef } from "react";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const ImageRef = useRef(null);
  const [imagePreview , setImagePreview]= useState(false);
  const handleClick = ()=>{
    setImagePreview(prev => !prev)
  }

  return (
    <div className="p-2.5 border-b border-base-300">
       {imagePreview && (
        <div className="mb-2 sm:mb-3 flex items-start gap-2 absolute z-20">
          <div className="relative">
            <img
              src={selectedUser.profilePic || "/avatar.png"}
              alt="Preview"
              className="w-[200px] h-[200px]  object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={handleClick}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img 
                src={selectedUser.profilePic || "/avatar.png"} 
                alt={selectedUser.fullName} 
                ref = {ImageRef}
                onClick = {handleClick}
                />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedUser.fullName}</h3>
            <p className="text-sm text-base-content/70">
              {selectedUser._id === "6865237404bbbb6c967517f4"
                    ? "Your AI"
                    : onlineUsers.includes(selectedUser._id) 
                      ? "Online" 
                      : "Offline"
                  }
            </p>
          </div>
        </div>

        {/* Close button */}
        <button onClick={() => setSelectedUser(null)}>
          <X />
        </button>
      </div>
    </div>
  );
};
export default ChatHeader;