import Users from "@/components/Users";

const page = async ({ params }) => {
  const url = "http://localhost:3050";
  // http://localhost:3050
  const getall = async () => {
    const res = await fetch(`${url}/api/v1/getall`, {
      cache: "no-store",
    });
    return res.json();
  };

  const res = await getall();
  return <Users res={res} me={params.slug} />;
};

export default page;
