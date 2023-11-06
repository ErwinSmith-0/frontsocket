"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import { socket } from "../../../../lib/socket";
import Messages from "./Messages";
import Chats from "@/components/Chats";
const page = async ({ params }) => {
  return (
    <>
      <Chats sender={params.slug[0]} receiver={params.slug[1]} />
      {/* <div className="max-w-lg mx-auto mt-10">
        <div className="flex justify-between">
          <h1>UserName: {params.slug[0]}</h1>
          <h1>Send To: {params.slug[1]}</h1>
        </div>
        <hr />

        <Messages
          currentRoomId={res.data._id}
          senderId={params.slug[0]}
          receiverId={params.slug[1]}
        />
      </div> */}
    </>
  );
};

export default page;
