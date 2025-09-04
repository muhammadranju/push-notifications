/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import toast from "react-hot-toast";
import { LuSend } from "react-icons/lu";

const SendSingleNotification = ({ token }: any) => {
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [tokensList, setTokensList] = useState<string>(""); // for multiple tokens

  // Send notification to backend
  const sendNotification = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/send-single-notification",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Include this header
          },
          body: JSON.stringify({
            title,
            body,
            image: imageUrl,
            token: tokensList, // Ensure tokensList is an array of strings
          }),
        }
      );

      const data = await response.json();

      console.log(data.success);

      if (data.success) {
        toast.success("Notification sent successfully!");
        setBody("");
        setTitle("");
        setImageUrl("");
        setTokensList("");
      } else {
        toast.error(`Error sending notification: ${data.error}`);
      }
    } catch (err) {
      console.error("Send notification error:", err);
      toast.error(`Failed to send notification. Error: ${err}`);
    }
  };
  return (
    <>
      <input
        type="text"
        value={title as string}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="w-full p-2 border border-gray-300 rounded mb-2"
      />
      <textarea
        value={body as string}
        rows={6}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Body"
        className="w-full p-2 border border-gray-300 rounded mb-2"
      />
      <input
        type="text"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        placeholder="Image URL"
        className="w-full p-2 border border-gray-300 rounded mb-2"
      />
      <input
        value={tokensList}
        onChange={(e) => setTokensList(e.target.value)}
        defaultValue={token}
        placeholder="Your browser token (one per line)"
        className="w-full p-2 border border-gray-300 rounded mb-4"
      />

      <div className="flex flex-row justify-between w-full">
        {/* <button
          onClick={() => {
            navigator.clipboard
              .writeText(token as string)
              .then(() => toast.success("Token copied to clipboard!"))
              .catch((err) => console.error("Failed to copy: ", err));
          }}
          className="bg-blue-900 text-white cursor-pointer px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Copy Token
        </button> */}
        <button
          onClick={sendNotification}
          className="bg-neutral-900 flex gap-2 items-center text-white cursor-pointer px-4 py-2 rounded-lg hover:bg-neutral-700 transition"
        >
          Send <LuSend />
        </button>
      </div>
    </>
  );
};

export default SendSingleNotification;
