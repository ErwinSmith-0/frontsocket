import React, { useEffect, useState, useRef } from "react";
import { socket } from "../../lib/socket";
import Link from "next/link";
import { BiCheckDouble } from "react-icons/bi";

const Chats = (props) => {
  const { sender, receiver } = props;
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const [typer, setTyper] = useState();
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
      messages.forEach((message) => {
        console.log(messages);
        console.log(sender);
        if (message.isSeen === false && message.receiver === sender) {
          socket.emit("update_seen_message", message);
        }
      });
    });
    return () => socket.off("update_messages");
  }, []);

  useEffect(() => {
    const Rooming = async () => {
      const getroom = async () => {
        const res = await fetch(
          "https://prod2.thesuitchstaging.com:2083/api/v1/room",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              sender: sender,
              receiver: receiver,
            }),
          }
        );
        return res.json();
      };
      const room = await getroom();
      setRoom(room.data._id);

      const getnames = async () => {
        const res = await fetch(
          "https://prod2.thesuitchstaging.com:2083/api/v1/getsenderreceiver",
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

  useEffect(() => {
    socket.on("user_typing", (res) => {
      setMsg(`${res} is typping`);
      setTyper(res);
      return () => socket.off("user_typing");
    });
  }, []);

  useEffect(() => {
    socket.on("stop_typing", () => {
      setMsg("");
      return () => socket.off("stop_typing");
    });
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
      formData.delete("attachment");
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
            <ul className="space-y-2 ">
              {messages.map((e) => (
                <li
                  key={e._id}
                  className={`rounded-md p-2 ml-4 mr-4 flex gap-x-2 items-end ${
                    sender === e.sender
                      ? "text-left bg-blue-200 text-black"
                      : "text-right bg-stone-300 text-black"
                  }`}
                >
                  {e.attachment && (
                    <Fileviewer
                      sender={sender}
                      type={e.sender}
                      tag={e.attachment}
                    />
                  )}

                  {e.text}
                  {e.isSeen === true ? (
                    <BiCheckDouble className="text-blue-500" />
                  ) : (
                    <BiCheckDouble />
                  )}
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
            <h1>{typer === uSender ? "" : msg}</h1>
            <div className="space-x-4">
              <input
                className="text-black rounded-md mt-2"
                name="message"
                type="text"
                onKeyPress={() => {
                  socket.emit("typing", room, uSender);
                }}
                onBlur={() => {
                  socket.emit("nottyping", room);
                }}
              />
              <label className="bg-blue-500 rounded-md pl-4 pr-4 p-1.5">
                +
                <input
                  className="w-full hidden h-full rounded text-gray-950"
                  type="file"
                  name="attachment"
                  placeholder="Attachment"
                  // onChange={(e) => setAttachment(e.target.files[0])}
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
  const { tag, type, sender } = props;
  console.log(tag);
  return (
    <>
      {/* ${sender === type ? "justify-end " : "text-right"}` */}
      {tag.fileType === "image/jpeg" ||
      tag.fileType === "image/jpg" ||
      tag.fileType === "image/png" ||
      tag.fileType === "image/gif" ||
      tag.fileType === "image/bmp" ||
      tag.fileType === "image/tiff" ||
      tag.fileType === "image/webp" ? (
        <img
          className={``}
          src={`https://prod2.thesuitchstaging.com:3050/${tag.fileName}`}
        />
      ) : (
        <Link
          className="text-blue-600 underline"
          href={`https://prod2.thesuitchstaging.com:3050/${tag.fileName}`}
          target="_blank"
        >
          {tag.fileName}
          <br />
        </Link>
      )}
    </>
  );
};
