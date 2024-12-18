'use client';

import { TrashIcon, PencilIcon, ClipboardIcon, PlusIcon, CheckIcon, KeyIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteInterveant, regenKey, regenAllKeys } from '@/app/lib/action';
import { useState } from 'react';
import { ConfirmationPopup } from '@/app/ui/dashboard/intervenants/confirmationPopup';


export function CopyKeyButton({ intervenantKey }: { intervenantKey: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopyKey = () => {
    navigator.clipboard.writeText(intervenantKey).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000); // Efface le message après 3 secondes
    });
  };

  return (
    <div className="relative group">
      <button
        onClick={handleCopyKey}
        className="rounded-md border p-2 hover:bg-gray-100"
      >
        {copied ? <CheckIcon className="w-5 text-green-500" /> : <ClipboardIcon className="w-5" />}
      </button>
      <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden w-max rounded bg-black px-2 py-1 text-xs text-white group-hover:block">
        Copier la clé
      </span>
    </div>
  );
}

export function CreateIntervenant() {
  return (
    <Link
      href="/dashboard/intervenants/create"
      className="relative flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Créer un intervenant</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
      <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden w-max rounded bg-black px-2 py-1 text-xs text-white group-hover:block">
        Créer un intervenant
      </span>
    </Link>
  );
}

export function UpdateIntervenant({ id }: { id: number }) {
  return (
    <div className="relative group">
      <Link
        href={`/dashboard/intervenants/${id}/edit`}
        className="flex items-center justify-center rounded-md border p-2 hover:bg-gray-100"
      >
        <PencilIcon className="w-5" />
      </Link>
      <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden w-max rounded bg-black px-2 py-1 text-xs text-white group-hover:block">
        Modifier l&apos;utilisateur
      </span>
    </div>
  );
}

export function DeleteIntervenant({ id }: { id: number }) {
  const handleDelete = async (event: React.FormEvent) => {
    event.preventDefault();
    const confirmed = window.confirm('Êtes-vous sûr de vouloir supprimer cet intervenant ?');
    if (confirmed) {
      try {
        await deleteInterveant(id);
      } catch (error) {
        console.error('Failed to delete intervenant:', error);
      }
    }
  };

  return (
    <div className="relative group">
      <form onSubmit={handleDelete}>
        <button type="submit" className="flex items-center justify-center rounded-md border p-2 hover:bg-gray-100">
          <span className="sr-only">Delete</span>
          <TrashIcon className="w-5" />
        </button>
      </form>
      <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden w-max rounded bg-black px-2 py-1 text-xs text-white group-hover:block">
        Supprimer l&apos;utilisateur
      </span>
    </div>
  );
}

export function RegenKey({ id }: { id: number }) {
  const [showPopup, setShowPopup] = useState(false);

  const handleRegenKey = async () => {
    try {
      await regenKey(id);
      setShowPopup(false);
      window.location.reload(); // Recharger la page pour mettre à jour les données
    } catch (error) {
      console.error('Failed to regenerate key:', error);
    }
  };

  return (
    <div className="relative group">
      <button
        onClick={() => setShowPopup(true)}
        className="flex items-center justify-center rounded-md border p-2 hover:bg-gray-100"
      >
        <span className="sr-only">Regenerate Key</span>
        <KeyIcon className="w-5" />
      </button>
      {showPopup && (
        <ConfirmationPopup
          title="Confirmation"
          message="Êtes-vous sûr de vouloir régénérer la clé de cet intervenant ?"
          onConfirm={handleRegenKey}
          onCancel={() => setShowPopup(false)}
        />
      )}
      <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden w-max rounded bg-black px-2 py-1 text-xs text-white group-hover:block">
        Régénérer la clé
      </span>
    </div>
  );
}

export function RegenAllKeys() {
  const [showPopup, setShowPopup] = useState(false);

  const handleRegenAllKeys = async () => {
    try {
      await regenAllKeys();
      setShowPopup(false);
    } catch (error) {
      console.error('Failed to regenerate all keys:', error);
      alert('Échec de la régénération des clés.');
    }
  };

  return (
    <div className="relative group">
      <button
        onClick={() => setShowPopup(true)}
        className="relative flex gap-3 h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        <span>Régénérer toutes les clés</span>
        <ArrowPathIcon className="w-5" />
      </button>
      {showPopup && (
        <ConfirmationPopup
          title="Vous voulez régénérer toutes les clés ?"
          message="Êtes-vous sûr de vouloir régénérer les clés de tous les intervenants ?"
          onConfirm={handleRegenAllKeys}
          onCancel={() => setShowPopup(false)}
        />
      )}
    </div>
  );
}