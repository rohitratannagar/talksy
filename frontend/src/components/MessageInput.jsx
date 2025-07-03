import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage,selectedUser } = useChatStore();

  const [isSubmitting, setSubmitting] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file?.type?.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      setSubmitting(true);
      await sendMessage({ text: text.trim(), image: imagePreview });
      setSubmitting(false);
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="p-2 sm:p-4 w-full">
      {imagePreview && (
        <div className="mb-2 sm:mb-3 flex items-start gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSendMessage}
        className="flex items-center gap-2 sm:gap-3"
      >
        <div className="flex-1 flex items-center gap-1 sm:gap-2">
          <input
            type="text"
            className="input input-bordered input-sm sm:input-md w-full rounded-lg"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          {selectedUser._id !== "6865237404bbbb6c967517f4" && (
              <button
                type="button"
                className={`btn btn-circle btn-sm sm:btn-md hidden sm:flex 
                ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
                onClick={() => fileInputRef.current?.click()}
              >
                  <Image size={20} />
              </button>
            )
          } 
        </div>

        {/* Smaller icon for phones */}
        <button
          type="submit"
          className="btn btn-sm btn-circle sm:btn-md"
          disabled={!text.trim() && !imagePreview && isSubmitting}
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
