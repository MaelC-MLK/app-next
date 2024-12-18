import { useEffect, useState } from 'react';
import { fetchIntervenantByKey } from '@/app/lib/action';
import { notFound } from 'next/navigation';
import Calendar from '@/app/ui/calendar';

interface PageParams {
  params: {
    key: string;
  };
}

interface Intervenant {
  firstname: string;
  enddate: string;
  availability: string | null;
  id: number;
}

export default function Page({ params }: PageParams) {
  const { key } = params;
  const [intervenants, setIntervenants] = useState<Intervenant | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchIntervenantByKey(key);
      if (!data) {
        notFound();
      } else {
        setIntervenants(data);
      }
    };
    fetchData();
  }, [key]);

  if (!intervenants) {
    return <div>Loading...</div>;
  }

  const currentDate = new Date();
  const endDate = new Date(intervenants.enddate);

  if (currentDate > endDate) {
    return (
      <main>
        <h1>Clé expirée</h1>
      </main>
    );
  }

  return (
    <main>
      <div className='m-12'>
        <h1 className='text-xl font-semibold'>Disponibilités de {intervenants.firstname}</h1>
        <Calendar availability={intervenants.availability ?? ''} intervenantId={intervenants.id.toString()} />
      </div>
    </main>
  );
}