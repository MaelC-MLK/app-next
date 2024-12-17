import { fetchFilteredIntervenants } from "@/app/lib/action";
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { format, isBefore } from 'date-fns';
import { DeleteIntervenant, UpdateIntervenant, CopyKeyButton, RegenKey } from "@/app/ui/dashboard/intervenants/buttonsIntervenants";
import CopyLinkButton from "@/app/ui/dashboard/intervenants/CopyLinkButton";

export default async function InvoicesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const intervenants = await fetchFilteredIntervenants(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {intervenants?.map((intervenant) => (
              <div
                key={intervenant.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p>{intervenant.firstname}</p>
                    </div>
                    <p className="text-sm text-gray-500">{intervenant.email}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Prénom
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Nom
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Email
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Modifier disponibilités
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Validité de la clé
                </th>
                <th scope="col" className="px-3 py-5 font-medium text-right pr-20">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {intervenants?.map((intervenant) => (
                <tr
                  key={intervenant.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{intervenant.firstname}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {intervenant.lastname}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {intervenant.email}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <CopyLinkButton intervenantKey={intervenant.key} />
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <div className="flex items-center gap-2">
                      {isBefore(new Date(), new Date(intervenant.enddate)) ? (
                        <CheckCircleIcon className="w-6 h-6 text-green-500" />
                      ) : (
                        <XCircleIcon className="w-6 h-6 text-red-500" />
                      )}
                      <span>{format(new Date(intervenant.enddate), 'dd/MM/yyyy')}</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3 text-right">
                    <div className="flex flex-row items-center justify-end gap-3 w-full">
                      <RegenKey id={intervenant.id} />
                      <UpdateIntervenant id={intervenant.id} />
                      <DeleteIntervenant id={intervenant.id} />
                      <CopyKeyButton intervenantKey={intervenant.key} firstname={intervenant.firstname} lastname={intervenant.lastname} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}