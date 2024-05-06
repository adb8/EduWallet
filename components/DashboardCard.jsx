import { FadeLoader } from "react-spinners";
import { Line } from "react-chartjs-2";
import { getLineData, lineOptions } from "@chart/line";
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

const DashboardCard = ({ type, title, history, getEarningsExpenses }) => {
  return (
    <div
      className={`${
        type === "balance" ? "col-span-3 w-[1000px]" : "col-span-1 w-[318px]"
      } bg-white rounded-xs p-6 h-[342px]`}>
      <p className="text-center font-semibold">{title}</p>
      <div>
        {history &&
          history.length > 0 &&
          (type === "earnings" ? (
            <>{getEarningsExpenses("earnings")}</>
          ) : type === "expense" ? (
            <>{getEarningsExpenses("expense")}</>
          ) : (
            <Line options={lineOptions} data={getLineData(history)} />
          ))}
        {history && history.length === 0 && (
          <div className="h-[250px] text-center flex flex-col items-center justify-center px-10">
            <p className="font-semibold mb-1">No data to display</p>
            <p>
              Create an entry using the <span>Update Balance</span> button above
            </p>
          </div>
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

export default DashboardCard;
