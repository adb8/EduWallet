"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Pie } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { getPieData, pieOptions } from "@chart/pie";
import { getBarData, barOptions } from "@chart/bar";
import { Bar } from "react-chartjs-2";
import { FadeLoader } from "react-spinners";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [history, setHistory] = useState(null);
  const [balance, setBalance] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [balanceLoading, setBalanceLoading] = useState(true);
  const [profilePicture, setProfilePicture] = useState(null);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const getHistory = async () => {
      try {
        const response = await fetch(`api/history`, {
          method: "POST",
          body: JSON.stringify({
            userId: session?.user.id,
          }),
        });
        const history = await response.json();
        setHistory(history);
        setHistoryLoading(false);
        findBalance(history);
      } catch (error) {
        console.error(error);
      }
    };
    if (status === "authenticated") {
      getHistory();
      const profilePicture = session?.user?.image;
      setProfilePicture(profilePicture);
      const username = session?.user?.name;
      setUsername(username);
    } else if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status]);

  const findBalance = (history) => {
    let balance = 0;
    history.map((entry) => {
      if (entry.type === "earnings") {
        balance += entry.amount;
      } else if (entry.type === "expense") {
        balance -= entry.amount;
      }
    });
    let balanceStr = balance.toString();
    if (balanceStr.startsWith("-")) {
      const numbersPart = balanceStr.slice(1);
      balanceStr = "-" + "$" + numbersPart;
    } else {
      balanceStr = "$" + balanceStr;
    }
    setBalance(balanceStr);
    setBalanceLoading(false);
  };

  const getEarningsExpenses = (type) => {
    let count = 0;
    history.map((entry) => {
      if (entry.type === type) {
        count++;
      }
    });
    if (count === 0) {
      return (
        <article className="no-data">
          No {type === "expense" ? "expenses" : "earnings"} to display. <br />
          Update your balance above.
        </article>
      );
    } else {
      return <Pie options={pieOptions} data={getPieData(history, type)} className="mx-auto" />;
    }
  };

  return status === "loading" ||
    !username ||
    !profilePicture ||
    balanceLoading ||
    historyLoading ? (
    <div className="absolute top-1/2 left-1/2">
      <FadeLoader color="#000000" loading={true} size={50} />
    </div>
  ) : (
    <div className="bg-blue-50">
      <div className="flex flex-col lg:flex-row justify-center items-center mx-auto bg-white w-[320px] lg:w-[700px] p-10 mt-12 mb-8 shadow-sm">
        <div className="mx-4">
          <img src={session?.user?.image} alt="Profile picture" className="rounded-full w-14" />
        </div>
        <div className="mx-6">
          <div className="font-bold text-4xl overflow-hidden whitespace-nowrap my-2">
            Hi,{" "}
            {session?.user.name.length > 10
              ? session?.user.name.slice(0, 10) + "..."
              : session?.user.name}
          </div>
          <div className="text-lg my-2 text-center lg:text-left">
            {balance && `Balance: ${balance}`}
          </div>
        </div>
        <div className="flex flex-col items-center mx-6">
          <Link
            className="shadow-md text-md rounded-full w-[200px] bg-blue-200 hover:bg-blue-300 transition duration-300 ease-in-out h-[40px] flex items-center justify-center my-2"
            href="/update">
            Update Balance
          </Link>
          <Link
            className="shadow-md text-md rounded-full w-[200px] bg-blue-200 hover:bg-blue-300 transition duration-300 ease-in-out h-[40px] flex items-center justify-center my-2"
            href="/history">
            See History
          </Link>
        </div>
      </div>
      <div className="bg-blue-50 grid grid-cols-1 lg:grid-cols-3 max-w-[1050px] mx-auto">
        <DashBoardCard
          type="earnings"
          title="Earnings"
          history={history}
          getEarningsExpenses={getEarningsExpenses}
        />
        <DashBoardCard
          type="expense"
          title="Expenses"
          history={history}
          getEarningsExpenses={getEarningsExpenses}
        />
        <DashBoardCard
          type="balance"
          title="Balance"
          history={history}
          getEarningsExpenses={getEarningsExpenses}
        />
      </div>
    </div>
  );
};

const DashBoardCard = ({ type, title, history, getEarningsExpenses }) => {
  return (
    <div className="h-[340px] w-[320px] bg-white shadow-sm p-5 mb-10 lg:mb-0 mx-auto">
      <p className="text-center font-semibold">{title}</p>
      <div className="w-[280px] h-[280px]">
        {history &&
          history.length > 0 &&
          (type === "earnings" ? (
            <>{getEarningsExpenses("earnings")}</>
          ) : type === "expense" ? (
            <>{getEarningsExpenses("expense")}</>
          ) : (
            <Bar options={barOptions} data={getBarData(history)} className="mx-auto" />
          ))}
        {history && history.length === 0 && (
          <article className="h-full text-center flex items-center justify-center">
            No data to display. <br />
            Update your balance using the
            <br />
            Update Balance button above.
          </article>
        )}
        {!history && (
          <div className="w-full flex justify-center items-center">
            <FadeLoader color="#000000" loading={true} size={50} className="mx-auto" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
