import Form from '@/app/ui/dashboard/intervenants/create-form';
import Breadcrumbs from '@/app/ui/dashboard/intervenants/breadcrumbs';

export default async function Page() {
 
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Intervenants', href: '/dashboard/intervenants' },
          {
            label: "Création d'un Intervenant",
            href: '/dashboard/intervenants/create',
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}