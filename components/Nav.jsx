"use client";
import Link from "next/link";
import { signIn, signOut, useSession, getProviders } from "next-auth/react";
import { useEffect, useState } from "react";

const Nav = () => {
  const { data: session, status } = useSession();
  const [providers, setProviders] = useState(null);
  useEffect(() => {
    getProviders().then(setProviders);
  }, []);

  return status === "loading" ? (
    <div className="h-[50px]"></div>
  ) : status === "authenticated" ? (
    <div className="w-full h-[50px] bg-white">
      <div className="flex flex-row justify-between items-center max-w-[500px] mx-auto">
        <Link href="/dashboard" className="h-[50px] text-md flex items-center hover:bg-gray-100 transition duration-300 ease-in-out px-4">
          Dashboard
        </Link>
        <Link href="/history" className="h-[50px] text-md flex items-center hover:bg-gray-100 transition duration-300 ease-in-out px-4">
          History
        </Link>
        <Link href="/update" className="h-[50px] text-md flex items-center hover:bg-gray-100 transition duration-300 ease-in-out px-4">
          Update
        </Link>
        <Link href={""} onClick={signOut} className="h-[50px] text-md flex items-center hover:bg-gray-100 transition duration-300 ease-in-out px-4">
          Sign out
        </Link>
      </div>
    </div>
  ) : (
    <div className="w-full h-[50px] bg-white">
      <div className="flex flex-row justify-around items-center max-w-[400px] mx-auto">
        <Link href="/update" className="h-[50px] text-md flex items-center hover:bg-gray-100 transition duration-300 ease-in-out px-4">
          About
        </Link>
        <Link href="/update" className="h-[50px] text-md flex items-center hover:bg-gray-100 transition duration-300 ease-in-out px-4">
          Analytics
        </Link>
        {providers &&
          Object.values(providers).map((provider) => (
            <Link
              key={provider.name}
              href="/"
              onClick={() => {
                signIn(provider.id, { callbackUrl: "/dashboard" });
              }}
              className="h-[50px] text-md flex items-center hover:bg-gray-100 transition duration-300 ease-in-out px-4">
              Sign In
            </Link>
          ))}
      </div>
    </div>
  );
};

export default Nav;
