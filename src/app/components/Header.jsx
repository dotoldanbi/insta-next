import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Header() {
  return (
    <div className="shadow-sm border-b sticky top-0 bg-white z-30 p-3">
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        <Link href="/" className="lg:inline-flex">
          <Image src="/instalogo.png" width={96} height={96} alt="logo" />
        </Link>
        <Link href="/" className="sm:hidden">
          <Image src="/instalogotitle.png" width={96} height={96} alt="logo" />
        </Link>
        <input
          type="text"
          placeholder="search"
          className="bg-gray-50 border border-gray-200 rounded text-sm w-full py-2 px-4 max-w-[210px] "
        />

        <button className="text-sm font-semibold text-blue-500">Log In</button>
      </div>
    </div>
  );
}
