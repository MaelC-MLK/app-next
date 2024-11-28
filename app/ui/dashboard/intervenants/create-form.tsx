'use client';

import { useState } from 'react';
import Link from 'next/link';
import { UserCircleIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createIntervenant, State } from '@/app/lib/action';
import { addMonths, format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

export default function Form() {
  const initialState: State = { message: null, errors: {} };
  const [state, setState] = useState(initialState);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const randomKey = uuidv4();
    formData.set('key', randomKey);
    const creationDate = new Date();
    formData.set('creationdate', format(creationDate, 'yyyy-MM-dd'));
    const endDate = addMonths(creationDate, 2);
    formData.set('enddate', format(endDate, 'yyyy-MM-dd'));

    const result = await createIntervenant(state, formData);
    if (result.errors) {
      setState(result);
    } else {
      setState({ message: 'Intervenant créé avec succès', errors: {} });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* First Name */}
        <div className="mb-4">
          <label htmlFor="firstname" className="mb-2 block text-sm font-medium">
            Prénom
          </label>
          <div className="relative">
            <input
              id="firstname"
              name="firstname"
              type="text"
              placeholder="Entrez le prénom"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            />
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          {state.errors?.firstname &&
            state.errors.firstname.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
        </div>

        {/* Last Name */}
        <div className="mb-4">
          <label htmlFor="lastname" className="mb-2 block text-sm font-medium">
            Nom
          </label>
          <div className="relative">
            <input
              id="lastname"
              name="lastname"
              type="text"
              placeholder="Entrez le nom"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            />
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          {state.errors?.lastname &&
            state.errors.lastname.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
        </div>

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Email
          </label>
          <div className="relative">
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Entrez l'email"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            />
            <EnvelopeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          {state.errors?.email &&
            state.errors.email.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
        </div>

      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/intervenants"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Annuler
        </Link>
        <Button type="submit">Créer Intervenant</Button>
      </div>
      {state.message && (
        <div className="mt-4 text-red-500">
          {state.message}
        </div>
      )}
    </form>
  );
}