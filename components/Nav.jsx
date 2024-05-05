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
    <div className="w-full h-[50px] flex bg-white">
      <div className="flex flex-row justify-center items-center mx-auto font-medium">
        <Link
          href="/dashboard"
          className="h-[50px] text-ms flex items-center hover:bg-gray-100 transition duration-300 ease-in-out px-5">
          Dashboard
        </Link>
        <Link
          href="/history"
          className="h-[50px] text-md flex items-center hover:bg-gray-100 transition duration-300 ease-in-out px-5">
          History
        </Link>
        <Link
          href="/update"
          className="h-[50px] text-md flex items-center hover:bg-gray-100 transition duration-300 ease-in-out px-5">
          Update
        </Link>
        <Link
          href={""}
          onClick={signOut}
          className="h-[50px] text-md flex items-center hover:bg-gray-100 transition duration-300 ease-in-out px-5">
          Logout
        </Link>
        <img src={session.user.image} className="h-[24px] w-[24px] rounded-full mx-5" />
      </div>
    </div>
  ) : (
    <div className="w-full h-[50px] flex bg-white">
      <div className="flex flex-row justify-center items-center mx-auto font-medium">
        <Link
          href="/update"
          className="h-[50px] text-md flex items-center hover:bg-gray-100 transition duration-300 ease-in-out px-5">
          About
        </Link>
        <Link
          href="/update"
          className="h-[50px] text-md flex items-center hover:bg-gray-100 transition duration-300 ease-in-out px-5">
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
              className="h-[50px] text-md flex items-center hover:bg-gray-100 transition duration-300 ease-in-out px-5">
              Sign In
            </Link>
          ))}
      </div>
    </div>
  );
};

export default Nav;
