"use client";
import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";

export default function MiniProfile() {
  const { data: session } = useSession();

  return (
    <div className="flex justify-between items-center mt-14 ml-10 ">
      <img
        src={session?.user?.image || "instalogo.png"}
        alt="profile"
        className="w-16 h-16 rounded-full border p-[2px]"
      />
      <div className="flex-1 ml-4">
        <h2 className="font-bold">{session?.user?.username || ""}</h2>
        <h3 className="text-sm text-gray-400">Welcome to Instagram</h3>{" "}
      </div>
      <div>
        {session ? (
          <button
            className="text-blue-400 text-sm font-semibold"
            onClick={() => signOut()}
          >
            Sign Out
          </button>
        ) : (
          <button
            className="text-blue-400 text-sm font-semibold"
            onClick={() => signIn()}
          >
            Sign In
          </button>
        )}
      </div>
    </div>
  );
}
