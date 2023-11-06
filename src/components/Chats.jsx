import React, { useEffect, useState, useRef } from "react";
import { socket } from "../../lib/socket";
import Link from "next/link";

const Chats = (props) => {
  const { sender, receiver } = props;
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const [attachment, setAttachment] = useState(null);
  const [room, setRoom] = useState();
  const [uSender, setuSender] = useState("");
  const [uReceiver, setuReceiver] = useState("");
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    socket.on("update_messages", (messages) => {
      setMessages(messages);
      setTimeout(() => {
        scrollToBottom();
      }, 500);
    });
    return () => socket.off("update_messages");
  }, []);

  useEffect(() => {
    const Rooming = async () => {
      const getroom = async () => {
        const res = await fetch("http://localhost:3050/api/v1/room", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sender: sender,
            receiver: receiver,
          }),
        });
        return res.json();
      };
      const room = await getroom();
      setRoom(room.data._id);

      const getnames = async () => {
        const res = await fetch(
          "http://localhost:3050/api/v1/getsenderreceiver",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              roomId: room.data._id,
            }),
          }
        );
        return res.json();
      };

      const names = await getnames();
      if (names.data.sender._id === sender) {
        setuSender(names.data.sender.username);
        setuReceiver(names.data.receiver.username);
      } else {
        setuReceiver(names.data.sender.username);
        setuSender(names.data.receiver.username);
      }
      socket.emit("join_room", room.data._id);
    };
    Rooming();

    return () => socket.off("join_room");
  }, []);

  const handleNewMessageSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    let data = {
      text: formData.get("message"),
      sender: sender,
      receiver: receiver,
      room: room,
      attachment: {
        fileName: formData.get("attachment").name,
        fileType: formData.get("attachment").type,
        fileData: formData.get("attachment"),
      },
    };
    if (data.attachment.fileName !== "" || data.text !== "") {
      socket.emit("send_message", data);
    }
  };

  return (
    <div>
      <div className="max-w-lg mx-auto mt-10">
        <div className="flex justify-between">
          <h1>UserName: {uSender}</h1>
          <h1>Send To: {uReceiver}</h1>
        </div>
        <hr />

        <div>
          <h1 className="flex justify-center mt-2">MESSAGES</h1>
          <div className="h-96 overflow-auto">
            <ul>
              {messages.map((e) => (
                <li
                  key={e._id}
                  className={` ${
                    sender === e.sender ? "text-left" : "text-right"
                  }`}
                >
                  {e.attachment && <Fileviewer tag={e.attachment} />}

                  {e.text}
                </li>
              ))}
              <div ref={messagesEndRef} />
            </ul>
          </div>
        </div>

        <form
          onSubmit={(e) => handleNewMessageSubmit(e)}
          className="flex justify-center"
        >
          <div className=" bottom-10">
            <div className="space-x-4">
              <input
                className="text-black rounded-md"
                name="message"
                type="text"
              />
              <label className="bg-blue-500 rounded-md pl-4 pr-4 p-1.5">
                +
                <input
                  className="w-full hidden h-full rounded text-gray-950"
                  type="file"
                  name="attachment"
                  placeholder="Attachment"
                  onChange={(e) => setAttachment(e.target.files[0])}
                />
              </label>
              {/* <button className="bg-blue-500 rounded-md pl-4 pr-4">+</button> */}
              <button
                type="submit"
                className="bg-blue-500 rounded-md pl-4 pr-4 p-0.5"
              >
                send
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chats;

const Fileviewer = (props) => {
  const { tag } = props;
  return (
    <>
      <Link
        className="text-blue-600 underline"
        href={`http://localhost:3050/${tag.fileName}`}
        target="_blank"
      >
        {tag.fileName}
        <br />
      </Link>
    </>
  );
  // }
};
