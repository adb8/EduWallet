"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Legend,
} from "chart.js";
import { Pie } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { getPieData, pieOptions } from "@chart/pie";
import { FadeLoader } from "react-spinners";
import BriefCard from "@components/BriefCard";
import DashboardCard from "@components/DashboardCard";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

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
        <div className="h-[250px] text-center flex flex-col items-center justify-center px-10">
          <p className="font-semibold mb-1">
            No {type === "expense" ? "expenses" : "earnings"} to display
          </p>
          <p>
            Create an {type === "expense" ? "expense" : "earnings"} entry using the{" "}
            <span>Update Balance</span> button above
          </p>
        </div>
      );
    } else {
      return <Pie options={pieOptions} data={getPieData(history, type)} />;
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
    <div className="bg-blue-50 flex justify-center flex-col flex-grow p-6">
      <div className="bg-blue-50 grid grid-cols-3 gap-6 mx-auto max-w-[1000px]">
        <BriefCard balance={balance} />
        <DashboardCard
          type="earnings"
          title="Earnings"
          history={history}
          getEarningsExpenses={getEarningsExpenses}
        />
        <DashboardCard
          type="expense"
          title="Expenses"
          history={history}
          getEarningsExpenses={getEarningsExpenses}
        />
        <DashboardCard
          type="balance"
          title="Balance"
          history={history}
          getEarningsExpenses={getEarningsExpenses}
        />
      </div>
    </div>
  );
};

export default Dashboard;
