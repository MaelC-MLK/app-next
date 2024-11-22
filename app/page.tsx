import fetchAllInterveants from "@/app/lib/action";

export default async function Home() {
  const data = await fetchAllInterveants();

  return (
    <div>
      {data ? (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <p>Failed to load data</p>
      )}
    </div>
  );
}