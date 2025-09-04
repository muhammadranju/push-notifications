import { useState } from "react";
import toast from "react-hot-toast";
import { LuSend } from "react-icons/lu";

const SendNotification = () => {
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [tokensList, setTokensList] = useState<string[]>([]); // tokens as an array

  // Send notification to backend
  const sendNotification = async () => {
    try {
      const response = await fetch("http://localhost:3000/send-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Include this header
        },
        body: JSON.stringify({
          title,
          body,
          image: imageUrl,
          tokens: tokensList, // Ensure tokensList is an array of strings
        }),
      });

      const data = await response.json();

      console.log(data.success);

      if (data.success) {
        toast.success("Notification sent successfully!");
      } else {
        toast.error(`Error sending notification: ${data.error}`);
      }
    } catch (err) {
      console.error("Send notification error:", err);
      toast.error(`Failed to send notification. Error: ${err}`);
    }
  };

  // Add token as tag
  const handleTokenInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newToken = e.currentTarget.value.trim();
      if (newToken && !tokensList.includes(newToken)) {
        setTokensList([...tokensList, newToken]);
        e.currentTarget.value = ""; // Clear the input after adding
      }
    }
  };

  // Remove token from list
  const removeToken = (tokenToRemove: string) => {
    setTokensList(tokensList.filter((token) => token !== tokenToRemove));
  };

  console.log(tokensList);
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

      {/* Tokens input */}
      <input
        type="text"
        onKeyDown={handleTokenInput} // Trigger on Enter or comma
        placeholder="Enter token and press Enter or comma"
        className="w-full p-2 border border-gray-300 rounded mb-4"
      />

      {/* Display tokens as tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tokensList.map((token, index) => (
          <span
            key={index}
            className="bg-neutral-900 text-white px-3 py-1 rounded-full flex items-center gap-2"
          >
            {token?.length > 10 ? token.slice(0, 10) + "..." : token}
            <button className="text-white" onClick={() => removeToken(token)}>
              &times;
            </button>
          </span>
        ))}
      </div>

      <div className="flex flex-row justify-between w-full">
        <button
          onClick={sendNotification}
          className="bg-neutral-900 flex gap-2 items-center text-white cursor-pointer px-4 py-2 rounded-lg hover:bg-neutral-700 transition"
        >
          Send Many <LuSend />
        </button>
      </div>
    </>
  );
};

export default SendNotification;
