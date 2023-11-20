"use client";
import { useState } from "react";
import { useRouter } from "next/navigation.js";
import { socket } from "../../lib/socket";

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const url = "http://localhost:3050";
  // http://localhost:3050
  const loginfun = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${url}/api/v1/createprofile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json ",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });
      const result = await res.json();

      if (result.status) {
        router.push(`/user/${result.data._id}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center items-center mt-20">
      <div className=" justify-center border items-center p-8">
        <h1 className="flex justify-center text-2xl font-bold text-white/80">
          login
        </h1>
        <div>
          <form onSubmit={(e) => loginfun(e)}>
            <label className="text-white/80">USERNAME</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="text-black m-2 rounded-md bg-white/80 pl-1"
            />
            <br />
            <label className="text-white/80">PASSWORD</label>
            <input
              value={password}
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              className="text-black m-2 rounded-md bg-white/80 pl-1"
            />
            <br />
            <div className="flex justify-center ">
              <button
                type="submit"
                className="w-1/2 m-2 bg-blue-500 p-2 rounded-md"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
