"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface AnnouncementBarProps {
  message?: string;
}

export default function AnnouncementBar({
  message = "Free shipping on orders above ₹999 | Explore our latest collection",
}: AnnouncementBarProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="relative flex min-h-9 items-center justify-center bg-[#282828] px-10 py-2 text-center text-xs font-medium tracking-wide text-white sm:text-sm">
      <p>{message}</p>

      <button
        type="button"
        onClick={() => setVisible(false)}
        aria-label="Close announcement"
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-sm p-1 transition hover:bg-white/10"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
