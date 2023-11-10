"use client";
import React, { useState } from "react";
import Chats from "./Chats";

import { AiOutlineClose } from "react-icons/ai";
import Fulldel from "./Fulldel";
// AiOutlineClose;

const Users = (props) => {
  const { res, me } = props;
  //   console.log("res.data.at(-1)");
  //   console.log(res.data.at(-1));
  const [other, setOther] = useState();
  let uName = "not found";
  res.data.map((e) => {
    if (e._id === me) {
      uName = e.username;
    }
  });
  //   setOther();
  // uName;
  const handler = (Id) => {
    setOther(Id);
  };
  return (
    <div className="flex">
      <div className="w-1/4">
        <h1 className="text-xl ml-3">
          <span className="border-b-2"> UserName</span> :{" "}
          <span className="capitalize  border-b-2 ">{uName}</span>
        </h1>
        <div className="overflow-hidden h-[91vh] hover:overflow-auto">
          {res.data.map((e) => (
            <li
              onClick={() => handler(e._id)}
              className="bg-gray-800 p-3 m-2 rounded-lg flex cursor-pointer justify-between items-center"
              key={e._id}
            >
              <p>
                {e.username}
                {e._id === me ? (
                  <span className="font-bold pl-2">(YOU)</span>
                ) : (
                  ""
                )}
              </p>
              <Fulldel username={e.username} other={other} me={me} />
            </li>
          ))}
        </div>
      </div>
      <div className="border-r mt-20 mb-10 p-2 border-zinc-600" />
      <div className="w-[60%]  mx-auto">
        {other ? (
          <div className="">
            <Chats sender={me} receiver={other} />
          </div>
        ) : (
          <div className="flex text-xl justify-center items-center h-[100vh] ">
            <span className="border-zinc-600 border-b-2 p-2 rounded-lg">
              Click on usernames To Open Chat
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
