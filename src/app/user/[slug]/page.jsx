"use client";
import Chats from "@/components/Chats";
import Link from "next/link";
import React from "react";

const page = async ({ params }) => {
  const url = "http://localhost:3050";
  // https://chatsocket.thesuitchstaging.com:3050
  const getall = async () => {
    const res = await fetch(`${url}/api/v1/getall`, {
      cache: "no-store",
    });
    return res.json();
  };

  const res = await getall();
  let uName = "not found";
  res.data.map((e) => {
    if (e._id === params.slug) {
      uName = e.username;
    }
  });
  // uName;

  return (
    <div className="grid grid-cols-2">
      <div>
        <h1>UserName:{uName}</h1>
        <div className="overflow-auto h-[90vh]">
          <hr />
          {res.data.map((e) => (
            <div className="bg-gray-800 p-4 m-2 rounded-lg flex " key={e._id}>
              <Link href={`/chat/${params.slug}/${e._id}`}>{e.username}</Link>
            </div>
          ))}
        </div>
      </div>
      hello
      {/* <Chats
        sender={"654166026c89c71717008985"}
        receiver={"654166026c89c71717008985"}
      /> */}
    </div>
  );
};

export default page;
