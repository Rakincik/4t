"use client";

import { useState } from "react";
import { SparklesIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/solid";
import LeadModal from "@/app/components/LeadModal";

export default function LeadBar({ source = "site" }: { source?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="w-full bg-white/90 border-b border-black/10 backdrop-blur-md">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-dark/70">
            <SparklesIcon className="h-5 w-5 text-secondary" />
            Ücretsiz danışmanlık • 1 dk’da aran
          </div>

          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-extrabold
                       btn-4t-secondary"
          >
            <ChatBubbleLeftRightIcon className="h-5 w-5" />
            Hemen Başla
          </button>
        </div>
      </div>

      <LeadModal open={open} onClose={() => setOpen(false)} source={source} />
    </>
  );
}
