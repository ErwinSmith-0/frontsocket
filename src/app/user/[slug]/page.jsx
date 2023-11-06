import Link from "next/link";
import React from "react";

const page = async ({ params }) => {
  const getall = async () => {
    const res = await fetch("http://localhost:3050/api/v1/getall", {
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
    <div>
      <h1>UserName:{uName}</h1>
      <hr />
      {res.data.map((e) => (
        <div key={e._id}>
          <Link href={`/chat/${params.slug}/${e._id}`}>{e.username}</Link>
        </div>
      ))}
    </div>
  );
};

export default page;
