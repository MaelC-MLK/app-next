'use client';

import { useState } from 'react';

export default function CopyLinkButton({ intervenantKey }: { intervenantKey: string }) {
  const [copyMessage, setCopyMessage] = useState<string | null>(null);

  const handleCopyLink = () => {
    const url = `http://localhost:3000/availability/${intervenantKey}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopyMessage('Lien copié dans le presse-papiers');
      setTimeout(() => {
        setCopyMessage(null);
      }, 3000); // Efface le message après 3 secondes
    });
  };

  return (
    <div>
      <button
        onClick={handleCopyLink}
        className="text-blue-600 hover:underline"
      >
        Copier le lien
      </button>
      {copyMessage && (
        <div className="mt-2 text-sm text-green-700">
          {copyMessage}
        </div>
      )}
    </div>
  );
}