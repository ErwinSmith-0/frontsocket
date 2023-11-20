"use client";
import React, { useEffect, useState } from "react";

import { AiOutlineClose } from "react-icons/ai";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { socket } from "../../lib/socket";

const Fulldel = ({ username, me, other }) => {
  const [roomId, setRoomId] = useState();
  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const url = "https://chatsocket.thesuitchstaging.com:3050";
        const roomRes = await fetch(`${url}/api/v1/room`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sender: me,
            receiver: other,
          }),
        });
        const roomData = await roomRes.json();
        const { _id: roomId } = roomData.data;
        setRoomId(roomId);
      } catch (error) {
        console.error("Error fetching room data:", error);
      }
    };

    fetchRoomData();

    return () => {
      socket.off("delete_room", handleDelete);
    };
  }, [me, other]);

  const handleDelete = () => {
    let userId = me;
    socket.emit("delete_room", { roomId, userId });
  };

  return (
    <Dialog>
      <DialogTrigger>
        <AiOutlineClose className="text-red-700 hover:scale-150 duration-300  rounded-md" />{" "}
      </DialogTrigger>
      <DialogContent className="bg-gray-700/90">
        <DialogHeader>
          {/* <DialogTitle className=" p-2 text-sm"> Confirm Delete</DialogTitle> */}
          <DialogDescription>
            All Chats with{" "}
            <span className="font-extrabold text-lg">{username}</span> will be
            deleted Permanently for you and will still be visible for{" "}
            <span className="font-extrabold text-lg">{username}</span>
          </DialogDescription>
        </DialogHeader>
        <button
          onClick={handleDelete}
          className="bg-blue-500 rounded-md p-1.5 hover:scale-105 duration-300"
        >
          Confirm Delete
        </button>
      </DialogContent>
    </Dialog>
  );
};

export default Fulldel;
