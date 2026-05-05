'use client';

import { useState, useTransition } from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { saveUniversity, removeSavedUniversity } from '@/actions/user';

interface SaveButtonProps {
  universityId: string;
  initialSaved: boolean;
  isLoggedIn: boolean;
}

export function SaveButton({ universityId, initialSaved, isLoggedIn }: SaveButtonProps) {
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    if (!isLoggedIn) {
      window.location.href = '/login';
      return;
    }
    startTransition(async () => {
      if (saved) {
        await removeSavedUniversity(universityId);
        setSaved(false);
      } else {
        await saveUniversity(universityId);
        setSaved(true);
      }
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      title={saved ? 'Remove from saved' : isLoggedIn ? 'Save university' : 'Login to save'}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-50 ${
        saved
          ? 'bg-indigo-100 text-indigo-700 hover:bg-red-100 hover:text-red-600'
          : 'bg-zinc-100 text-zinc-600 hover:bg-indigo-100 hover:text-indigo-700'
      }`}
    >
      {saved ? (
        <BookmarkCheck className="w-3.5 h-3.5" />
      ) : (
        <Bookmark className="w-3.5 h-3.5" />
      )}
      {saved ? 'Saved' : 'Save'}
    </button>
  );
}
