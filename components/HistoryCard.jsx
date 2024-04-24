import React from "react";

const HistoryCard = ({ date, type, category, amount, description }) => {
  return (
    <tr>
      <td>{date}</td>
      <td>{type}</td>
      <td>{category}</td>
      <td>{amount}</td>
      <td>{description}</td>
    </tr>
  );
};

export default HistoryCard;
