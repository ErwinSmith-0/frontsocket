"use client";
import React, { useEffect, useState } from "react";
import { socket } from "../../../../lib/socket";

const Messages = (props) => {
  const { currentRoomId, senderId, receiverId } = props;
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState();
  useEffect(() => {
    socket.on("receive_message", (messages) => {
      setMessages(messages);
    });

    return () => socket.off("receive_message");
  }, []);

  async function handleNewMessageSubmit(event) {
    event.preventDefault();

    // const formData = new FormData(event.currentTarget);

    const messageData = {
      room: currentRoomId,
      sender: senderId,
      receiver: receiverId,
      text: msg,
      //   attachment: {
      //     fileName: formData.get("attachment").name,
      //     fileType: formData.get("attachment").type,
      //     fileData: formData.get("attachment"),
      //   },
    };

    socket.emit("send_message", messageData);
  }

  return (
    <>
      <ul className="w-1/4">
        {messages.map((message) => {
          return (
            <li
              className={
                currentUserId === message.sender.toString()
                  ? "text-left"
                  : "text-right"
              }
              key={message._id}
            >
              <p>{message.text}</p>
              {message.attachment && (
                <img src={`/uploads/${message.attachment.fileName}`} alt="" />
              )}
              {message.isSeen ? "✔️" : "❌"}
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default Messages;
