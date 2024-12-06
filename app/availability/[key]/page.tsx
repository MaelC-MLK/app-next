import { fetchIntervenantByKey} from '@/app/lib/action';
import { notFound } from 'next/navigation';
import Calendar from '@/app/ui/calendar';
import { formatISO } from 'date-fns';

export default async function AvailabilityPage({ params }: { params: { key: string } }) {
  const { key } = params;

  const intervenants = await fetchIntervenantByKey(key);

  if (!intervenants) {
    notFound();
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
      {/* <Calendar events={events} /> */}
      <Calendar events={[]} />
    </main>
  );
}