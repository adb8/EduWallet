import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

const BriefCard = ({ balance }) => {
  const { data: session, status } = useSession();
  const username = session?.user.name;
  const firstName = username.split(" ")[0];
  const printedName = firstName.length > 10 ? firstName.slice(0, 10) + "..." : firstName;
  const profilePicture = session?.user.image;
  return (
    <div className="col-span-1 w-full flex flex-col justify-center items-center bg-white rounded-xs">
      <div className="flex flex-col items-center">
        <img
          src={profilePicture}
          alt="Profile picture"
          className="w-[50px] h-[50px] rounded-full"
        />
        <p className="font-semibold text-xl mt-4 mb-1">Welcome back, {printedName}</p>
        <p className="mb-3">Total balance: {balance}</p>
      </div>
      <div className="flex flex-col items-center mx-6">
        <Link
          className="shadow-sm text-md rounded-full w-[175px] bg-blue-200 hover:bg-blue-300 transition duration-300 ease-in-out h-[40px] flex items-center justify-center my-2"
          href="/update">
          Update Balance
        </Link>
        <Link
          className="shadow-sm text-md rounded-full w-[175px] bg-blue-200 hover:bg-blue-300 transition duration-300 ease-in-out h-[40px] flex items-center justify-center mt-1"
          href="/history">
          See History
        </Link>
      </div>
    </div>
  );
};

export default BriefCard;
