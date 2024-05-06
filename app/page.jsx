"use client";
import Image from "next/image";
import { signIn, useSession, getProviders } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FadeLoader } from "react-spinners";
import { ReactTyped } from "react-typed";

const FrontPage = () => {
  const TEXTS = [
    "tuition costs",
    "scholarships",
    "student loans",
    "work-study earnings",
    "stipends",
    "grants",
    "room and board costs",
    "financial aid packages",
  ];
  const router = useRouter();
  const { data: session, status } = useSession();
  const [providers, setProviders] = useState(null);

  useEffect(() => {
    getProviders().then(setProviders);
  }, []);
  useEffect(
    status === "authenticated"
      ? () => {
          router.push("/dashboard");
        }
      : () => {},
    [status, session]
  );

  return status === "loading" ? (
    <div className="absolute top-1/2 left-1/2">
      <FadeLoader color="#000000" loading={true} size={50} />
    </div>
  ) : (
    <div className="flex bg-blue-50 flex-col flex-grow relative">
      <div className="flex flex-col w-1/2 flex-grow justify-center items-center">
        <div className="ml-12">
          <div className="text-5xl font-bold leading-tight">
            Master your finances
            <br /> with <span className="text-blue-300">EduWallet.</span>
          </div>
          <div className="text-xl mt-10 font-regular">
            All your{" "}
            <ReactTyped
              strings={TEXTS}
              typeSpeed={40}
              backSpeed={50}
              className="text-blue-300"
              loop
            />{" "}
            in one place.
          </div>
          <p className="font-regular text-xl mt-6 mb-14">
            Taking control of your finances as a student can <br />
            be difficult. EduWallet is here to help.
          </p>
          <div className="flex flex-row">
            {providers &&
              Object.values(providers).map((provider) => (
                <button
                  key={provider.name}
                  onClick={() => {
                    signIn(provider.id, { callbackUrl: "/dashboard" });
                  }}
                  className="shadow-sm w-[190px] rounded-full text-center text-lg bg-blue-200 py-3 hover:bg-blue-200 transition duration-300 ease-in-out mr-2"
                  href="/dashboard">
                  Get Started
                </button>
              ))}
            <button
              className="shadow-sm w-[190px] rounded-full text-center text-lg bg-blue-200 ml-2 py-3 hover:bg-blue-200 transition duration-300 ease-in-out"
              href="/dashboard">
              Learn More
            </button>
          </div>
        </div>
      </div>
      <div className="w-1/2 h-full absolute right-0 top-0">
        <img
          src="phone.png"
          alt="Person using their phone"
          style={{ objectFit: "cover", width: "100%", height: "100%" }}
        />
        <div className="absolute inset-0 overlay"></div>
      </div>
    </div>
  );
};

export default FrontPage;
