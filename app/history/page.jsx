"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import HistoryCard from "@components/HistoryCard";
import Image from "next/image";
import { FadeLoader } from "react-spinners";

const History = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const historyAll = useRef(null);
  const [historyCurrent, setHistoryCurrent] = useState(null);
  const page = useRef(1);

  useEffect(() => {
    const getHistory = async () => {
      if (status === "authenticated") {
        try {
          const response = await fetch(`api/history`, {
            method: "POST",
            body: JSON.stringify({
              userId: session?.user.id,
            }),
          });
          historyAll.current = await response.json();
          updatePageCurrent();
        } catch (error) {
          console.error(error);
        }
      }
    };
    getHistory();
  }, [status]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status]);

  const updatePageCurrent = (direction) => {
    const lowerEnd = (page.current - 1) * 12 - 1;
    const upperEnd = lowerEnd + 13;
    const tempArray = [];
    historyAll.current.map((entry, index) => {
      if (index > lowerEnd && index < upperEnd) {
        tempArray.push(entry);
      }
    });
    if (tempArray.length > 0) {
      setHistoryCurrent(tempArray);
    } else {
      if (direction === "forward") {
        page.current--;
      } else {
        page.current++;
      }
    }
  };

  return status == "loading" ? (
    <div className="absolute top-1/2 left-1/2">
      <FadeLoader color="#000000" loading={true} size={50} />
    </div>
  ) : status == "authenticated" ? (
    <div className="w-full bg-blue-50 my-10">
      <div className="history-cont max-w-[1000px] h-[700px] mx-auto flex flex-col shadow-sm bg-white py-3">
        <div className="flex justify-center items-center">
          <Image
            src={"/previous.png"}
            width={24}
            height={24}
            className="mx-8"
            onClick={() => {
              if (page.current > 1) {
                page.current--;
                updatePageCurrent("back");
              }
            }}
          />
          <div className="text-lg font-semibold mx-auto">Your Balance History</div>
          <Image
            src="/next.png"
            width={24}
            height={24}
            className="mx-8"
            onClick={() => {
              page.current++;
              updatePageCurrent("forward");
            }}
          />
        </div>
        <div className="w-full overflow-auto">
        <table className="w-full">
          <tr>
            <th className="bg-blue-200">Date</th>
            <th className="bg-blue-200">Type</th>
            <th className="bg-blue-200">Category</th>
            <th className="bg-blue-200">Amount</th>
            <th className="bg-blue-200">Description</th>
          </tr>
          {historyCurrent &&
            historyCurrent.map((entry) => {
              const date = entry.date;
              const amount = `$${entry.amount}`;
              const decription =
                entry.description.length > 40
                  ? entry.description.slice(0, 40) + "..."
                  : entry.description;
              const descriptionCapitalized =
                decription.charAt(0).toUpperCase() + decription.slice(1);
              const category =
                entry.category.length > 15 ? entry.category.slice(0, 15) + "..." : entry.category;
              const categoryCapitalized = category.charAt(0).toUpperCase() + category.slice(1);
              const type = entry.type.charAt(0).toUpperCase() + entry.type.slice(1);
              return (
                <HistoryCard
                  date={date}
                  type={type}
                  category={categoryCapitalized}
                  amount={amount}
                  description={descriptionCapitalized}
                />
              );
            })}
        </table>
        </div>
      </div>
    </div>
  ) : null;
};

export default History;
