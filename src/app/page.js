"use client";
import { useState } from "react";
import { useRouter } from "next/navigation.js";
import { socket } from "../../lib/socket";

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const loginfun = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        "https://prod2.thesuitchstaging.com:3050/api/v1/createprofile",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json ",
          },
          body: JSON.stringify({
            username: username,
            password: password,
          }),
        }
      );
      const result = await res.json();

      if (result.status) {
        router.push(`/user/${result.data.authData._id}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div>
        login
        <form onSubmit={(e) => loginfun(e)}>
          <label>USERNAME</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="text-black"
          />

          <label>Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="text-black"
          />

          <button type="submit">Submit</button>
        </form>
      </div>
    </>
  );
}
