"use client";
import Image from "next/image";
import { signIn, useSession, getProviders } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FadeLoader } from "react-spinners";
import { ReactTyped } from "react-typed";

const FrontPage = () => {
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
    [status]
  );

  return status === "loading" ? (
    <div className="absolute top-1/2 left-1/2">
      <FadeLoader color="#000000" loading={true} size={50} />
    </div>
  ) : (
    <div>
      <div
        className="h-[280px] flex flex-col justify-center items-center"
        style={{
          backgroundImage: `url("../banner.jpg")`,
        }}>
        <div className="text-6xl text-white font-pt-sans">
          Edu<span className="text-blue-100">Wallet</span>
        </div>
        <div className="text-2xl text-white mt-3 mb-6 font-semibold">
          All your{" "}
          <ReactTyped
            strings={[
              "tuition costs",
              "scholarships",
              "student loans",
              "work-study earnings",
              "stipends",
              "grants",
              "room and board costs",
              "financial aid packages",
            ]}
            typeSpeed={40}
            backSpeed={50}
            className="text-blue-100"
            loop
          />{" "}
          in one place.
        </div>
        {providers &&
          Object.values(providers).map((provider) => (
            <button
              key={provider.name}
              onClick={() => {
                signIn(provider.id, { callbackUrl: "/dashboard" });
              }}
              className="shadow-lg w-[200px] rounded-full text-center text-lg bg-blue-100 py-3 hover:bg-blue-200 transition duration-300 ease-in-out"
              href="/dashboard">
              Get Started
            </button>
          ))}
      </div>
      <div className="max-w-[950px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10 py-10">
        <FrontPageCard
          img="/notes.png"
          title="Record Your Finances"
          description="Record all your educational finances with detail and ease"
        />
        <FrontPageCard
          img="/pie.png"
          title="Visualize Your Finances"
          description="See your expenses and earnings graphically represented"
        />
        <FrontPageCard
          img="/graph.png"
          title="Track Your Balance"
          description="See how your total balance changed over time"
        />
      </div>
    </div>
  );
};

const FrontPageCard = ({ img, description, title }) => {
  return (
    <div className="w-[280px] h-[300px] p-8 text-center bg-white shadow-sm flex flex-col justify-center items-center mx-auto">
      <Image src={img} width={60} height={60} className="mx-auto my-5" />
      <p className="text-lg font-semibold mx-auto mb-3">{title}</p>
      <p className="mx-auto text-md">{description}</p>
    </div>
  );
};

export default FrontPage;
