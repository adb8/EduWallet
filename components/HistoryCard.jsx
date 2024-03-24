import React from "react";

const HistoryCard = ({ date, type, category, amount, description }) => {
	return (
		<tr className="history-card">
			<td className="date-cont">{date}</td>
			<td className="type-cont">{type}</td>
			<td className="cat-cont">{category}</td>
			<td className="amt-cont">{amount}</td>
			<td className="descr-cont">{description}</td>
		</tr>
	);
};

export default HistoryCard;