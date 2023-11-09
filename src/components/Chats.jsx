import React, { useEffect, useState, useRef } from "react";
import { socket } from "../../lib/socket";
import Link from "next/link";
import { BiCheckDouble, BiEditAlt } from "react-icons/bi";
import { MdOutlineDeleteForever } from "react-icons/md";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Chats = (props) => {
  const url = "http://localhost:3050";
  // ${url}
  const { sender, receiver } = props;
  const [typingMsg, setTypingMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const [typer, setTyper] = useState();
  const [room, setRoom] = useState();
  const [uSender, setuSender] = useState("");
  const [uReceiver, setuReceiver] = useState("");
  const [edit, setEdit] = useState("");
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
        if (message.isSeen === false && message.receiver === sender) {
          socket.emit("update_seen_message", message);
        }
      });
    });
    return () => socket.off("update_messages");
  }, []);

  useEffect(() => {
    const fetchRoomData = async () => {
      const roomRes = await fetch(`${url}/api/v1/room`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender: sender,
          receiver: receiver,
        }),
      });
      const roomData = await roomRes.json();
      const roomId = roomData.data._id;
      setRoom(roomId);

      const getNames = async () => {
        const namesRes = await fetch(`${url}/api/v1/getsenderreceiver`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            roomId: roomId,
          }),
        });
        return namesRes.json();
      };

      const namesData = await getNames();
      const senderId = namesData.data.sender._id;
      const receiverId = namesData.data.receiver._id;
      const senderUsername = namesData.data.sender.username;
      const receiverUsername = namesData.data.receiver.username;

      if (senderId === sender) {
        setuSender(senderUsername);
        setuReceiver(receiverUsername);
      } else {
        setuReceiver(senderUsername);
        setuSender(receiverUsername);
      }

      socket.emit("join_room", roomId);
    };

    fetchRoomData();

    return () => socket.off("join_room");
  }, []);

  useEffect(() => {
    socket.on("user_typing", (res) => {
      setTypingMsg(`${res} is typping`);
      setTyper(res);
      return () => socket.off("user_typing");
    });
  }, []);

  useEffect(() => {
    socket.on("stop_typing", () => {
      setTypingMsg("");
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

  const handleDelete = (e, msgId) => {
    e.preventDefault();
    socket.emit("delete_msg", msgId, room);
  };

  const handleEdit = (e, msgId) => {
    // e.preventDefault();
    if (edit !== "") {
      socket.emit("edit_msg", msgId, room, edit);
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
              {messages.map((msg) => (
                <li
                  key={msg._id}
                  className={`rounded-md p-2 ml-4 mr-4 flex justify-between items-end ${
                    sender === msg.sender
                      ? "text-left bg-blue-200 text-black"
                      : "text-right bg-stone-300 text-black"
                  }`}
                >
                  {!msg.isDeleted ? (
                    <>
                      <div>
                        {msg.attachment && (
                          <Fileviewer
                            sender={sender}
                            type={msg.sender}
                            tag={msg.attachment}
                          />
                        )}
                        {msg.text}
                      </div>
                      <div className="flex gap-x-2">
                        {msg.isEdited ? (
                          <p className="text-green-800 text-xs flex items-end">
                            Edited
                          </p>
                        ) : (
                          <></>
                        )}
                        {msg.isSeen === true ? (
                          <BiCheckDouble size={20} className="text-blue-500" />
                        ) : (
                          <BiCheckDouble size={20} />
                        )}
                        {msg.sender == sender && (
                          <>
                            {/* ......... */}
                            <Dialog>
                              <DialogTrigger>
                                <BiEditAlt
                                  size={20}
                                  className=" text-blue-900 hover:scale-125 hover:bg-white/50 rounded-md duration-300"
                                />{" "}
                              </DialogTrigger>
                              <DialogContent className="bg-gray-700/90">
                                <DialogHeader>
                                  <DialogTitle className=" p-2 text-sm">
                                    {msg.text}
                                  </DialogTitle>
                                  <DialogDescription>
                                    <input
                                      value={edit}
                                      onChange={(e) => setEdit(e.target.value)}
                                      className="p-2 w-full text-black rounded-md"
                                      placeholder="Enter text here to edit"
                                    />
                                  </DialogDescription>
                                </DialogHeader>
                                <button
                                  onClick={(e) => handleEdit(e, msg._id)}
                                  className="bg-blue-500 rounded-md p-1.5 hover:scale-105 duration-300"
                                >
                                  submit
                                </button>
                              </DialogContent>
                            </Dialog>

                            {/* ......... */}
                            {/* <BiEditAlt
                              onClick={(e) => handleEdit(e)}
                              size={20}
                              className=" text-blue-900 hover:scale-125 hover:bg-white/50 rounded-md duration-300"
                            /> */}
                            <MdOutlineDeleteForever
                              size={20}
                              className="text-red-800  hover:scale-125 hover:bg-white/50 rounded-md  duration-300"
                              onClick={(e) => handleDelete(e, msg._id)}
                            />
                          </>
                        )}
                      </div>
                    </>
                  ) : (
                    <p className="text-red-800">This Message is Deleted</p>
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
            <h1>{typer === uSender ? "" : typingMsg}</h1>
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

  const url = "http://localhost:3050";
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
        <img className={``} src={`${url}/${tag.fileName}`} />
      ) : (
        <Link
          className="text-blue-600 underline"
          href={`${url}/${tag.fileName}`}
          target="_blank"
        >
          {tag.fileName}
          <br />
        </Link>
      )}
    </>
  );
};
