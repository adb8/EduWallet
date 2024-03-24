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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
	const { data: session, status } = useSession();
	const router = useRouter();
	const [history, setHistory] = useState(null);
	const [balance, setBalance] = useState(null);

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
					const history = await response.json();
					setHistory(history);
					findBalance(history);
				} catch (error) {
					console.error(error);
				}
			}
		};
		getHistory();
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
	};

	if (status === "loading") {
		return <div className="loading">Loading...</div>;
	} else if (status === "unauthenticated") {
		router.push("/");
	} else if (status === "authenticated") {
		return (
			<div>
				<div className="top-cont">
					<section className="summary-cont">
						{balance && (
							<>
								<div className="welcome-cont">
									<div className="hi-msg">Hi, {session?.user.name}</div>
									<div className="balance-msg">
										{balance && `Your balance: ${balance}`}
									</div>
								</div>
								<div className="grid place-items-center">
									<Link className="dash-btn" href="/update">
										Update Balance
									</Link>
									<Link className="dash-btn" href="/history">
										See History
									</Link>
								</div>
							</>
						)}
					</section>
				</div>
				<div className="brief-cont">
					<section className="earnings-box-cont">
						<p>Your total earnings</p>
						<div className="earnings-graph-cont">
							{history && history.length > 0 && (
								<>
									{(() => {
										let earningsCount = 0;
										history.map((entry) => {
											if (entry.type === "earnings") {
												earningsCount++;
											}
										});
										if (earningsCount === 0) {
											return (
												<article className="no-data">
													No earnings to display. <br />
													Update your balance above.
												</article>
											);
										} else {
											return (
												<Pie
													options={pieOptions}
													data={getPieData(history, "earnings")}
												/>
											);
										}
									})()}
								</>
							)}
							{history && history.length === 0 && (
								<article className="no-data">
									No data to display. <br />
									Update your balance above.
								</article>
							)}
							{!history && "Loading..."}
						</div>
					</section>
					<section className="expense-box-cont">
						<p>Your total expenses</p>
						<div className="expense-graph-cont">
							{history && history.length > 0 && (
								<>
									{(() => {
										let expenseCount = 0;
										history.map((entry) => {
											if (entry.type === "expense") {
												expenseCount++;
											}
										});
										if (expenseCount === 0) {
											return (
												<article className="no-data">
													No expenses to display. <br />
													Update your balance above.
												</article>
											);
										} else {
											return (
												<Pie
													options={pieOptions}
													data={getPieData(history, "expense")}
												/>
											);
										}
									})()}
								</>
							)}
							{history && history.length === 0 && (
								<article className="no-data">
									No data to display. <br />
									Update your balance above.
								</article>
							)}
							{!history && "Loading..."}
						</div>
					</section>
					<section className="changes-box-cont">
						<p>Your balance growth</p>
						<div className="changes-graph-cont">
							{history && history.length > 0 && (
								<Bar options={barOptions} data={getBarData(history)} />
							)}
							{history && history.length === 0 && (
								<article className="no-data">
									No data to display. <br />
									Update your balance above.
								</article>
							)}
							{!history && "Loading..."}
						</div>
					</section>
				</div>
			</div>
		);
	}
};

export default Dashboard;