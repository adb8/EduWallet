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
    <div className="h-[50px] flex flex-row justify-around items-center max-w-[700px] mx-auto">
      <Link href="/" className="text-lg h-full flex items-center font-pt-sans">
        EduWallet
      </Link>
      <Link href="/dashboard" className="text-lg h-full flex items-center">
        Dashboard
      </Link>
      <Link href="/history" className="text-lg h-full flex items-center">
        History
      </Link>
      <Link href="/update" className="text-lg h-full flex items-center">
        Update
      </Link>
      <Link href={""} onClick={signOut} className="text-lg h-full flex items-center">
        Sign out
      </Link>
    </div>
  ) : (
    <div className="h-[50px] flex flex-row justify-around items-center max-w-[400px] mx-auto">
      <Link href="/" className="text-lg h-full flex items-center font-pt-sans">
        EduWallet
      </Link>
      <Link href="/update" className="text-lg h-full flex items-center">
        About
      </Link>
      {providers &&
        Object.values(providers).map((provider) => (
          <Link
            key={provider.name}
            href="/"
            onClick={() => {
              signIn(provider.id, { callbackUrl: "/dashboard" });
            }}
            className="text-lg h-full flex items-center">
            Sign In
          </Link>
        ))}
    </div>
  );
};

export default Nav;
