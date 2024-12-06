import EditIntervenantForm from '@/app/ui/dashboard/intervenants/edit-form';
import Breadcrumbs from '@/app/ui/dashboard/intervenants/breadcrumbs';
import { fetchIntervenantById } from '@/app/lib/action';
import { notFound } from 'next/navigation';

export default async function Page( props : { params: { id: string } }) {
    const { id } = props.params;
    const intervenant = await fetchIntervenantById(id);

    if (!intervenant) {
      notFound();
    }
    
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Intervenants', href: '/dashboard/intervenants' },
          {
            label: 'Modifier un intervenant',
            href: `/dashboard/intervenants/${id}/edit`,
            active: true,
          },
        ]}
      />
      <EditIntervenantForm intervenant={intervenant} />
    </main>
  );
}