import fetchAllInterveants from "@/app/lib/action";


export default async function Intervenants() {
  const data = await fetchAllInterveants();

    return (
      <div>
        <h1>Gestion des Intervenants</h1>
        {data ? (
        <pre>{JSON.stringify(data, null, 2)}</pre>
        ) : (
          <p>Failed to load data</p>
        )}
      </div>
    );
  }