import { fetchIntervenantByKey} from '@/app/lib/action';
import { notFound } from 'next/navigation';
import Calendar from '@/app/ui/calendar';
import SideNavCalendar from '@/app/ui/sideNavCalendar';

export default async function Page({ params }: { params: { key: string } }) {
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
            
      <h1>Disponibilités de {intervenants.firstname}</h1>
      <Calendar availability={intervenants.availability ?? ''} />
    </main>
  );
}