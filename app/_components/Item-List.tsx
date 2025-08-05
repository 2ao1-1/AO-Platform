"use client";

import Link from "next/link";

interface Item {
  itemTitle: string;
  icon: React.ReactNode;
  to: string;
}
export function BarItem({ itemTitle, icon, to }: Item) {
  return (
    <Link href={to}>
      <li className="flex flex-col md:flex-row items-center group relative cursor-pointer w-full gap-2">
        {icon}
        <span className="hidden sm:block sm:absolute md:relative sm:top-10 md:top-0 text-sm md:text-base sm:opacity-0 md:opacity-100 group-hover:opacity-100 transition-opacity w-20 text-center bg-secondary md:bg-transparent rounded-md p-1 md:p-0 text-white md:text-main">
          {itemTitle}
        </span>
      </li>
    </Link>
  );
}
