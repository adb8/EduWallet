"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import HistoryCard from "@components/HistoryCard";
import Image from "next/image";

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

	if (status === "loading") {
		return <div className="loading">Loading...</div>;
	} else if (status === "unauthenticated") {
		router.push("/");
	} else {
		return (
			<div className="history-page">
				<div className="history-cont">
					<div className="history-head">Your Balance History</div>
					<table className="entries-cont">
						<tr>
							<th>Date</th>
							<th>Type</th>
							<th>Category</th>
							<th>Amount</th>
							<th>Description</th>
						</tr>
						{historyCurrent &&
							historyCurrent.map((entry) => (
								<HistoryCard
									date={entry.date}
									type={entry.type}
									category={entry.category}
									amount={entry.amount}
									description={entry.description}
								/>
							))}
					</table>
					<div className="lower-bar-cont">
						<div className="arrow-cont flex">
							<Image
								src={"/previous.png"}
								width={40}
								height={40}
								onClick={() => {
									if (page.current > 1) {
										page.current--;
										updatePageCurrent("back");
									}
								}}
							/>
							<Image
								src="/next.png"
								width={40}
								height={40}
								onClick={() => {
									page.current++;
									updatePageCurrent("forward");
								}}
							/>
						</div>
					</div>
				</div>
			</div>
		);
	}
};

export default History;
