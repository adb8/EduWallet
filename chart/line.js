export const lineOptions = {
  maintainAspectRatio: true,
  aspectRatio: 3,
  plugins: {
    title: {
      display: false,
    },
    legend: {
      labels: {
        font: {
          size: 17,
        },
        color: "black",
      },
    },
  },
  responsive: true,
  interaction: {
    mode: "index",
    intersect: false,
  },
  scales: {
    x: {
      stacked: true,
      ticks: {
        font: {
          size: 17,
        },
        color: "black",
      },
    },
    y: {
      stacked: true,
      ticks: {
        font: {
          size: 17,
        },
        color: "black",
        callback: function (value, index) {
          return index % 2 === 0 ? value : undefined;
        },
      },
    },
  },
};

function getChangesCurrentMonth(month, year, history) {
  let monthSum = 0;
  history.map((entry) => {
    if (isDateInRange(entry.date, month, year)) {
      if (entry.type === "earnings") {
        monthSum += entry.amount;
      } else if (entry.type === "expense") {
        monthSum -= entry.amount;
      }
    }
  });
  return monthSum;
}

function getRecent12Months() {
  const currentDate = new Date();
  const recentSixMonths = [];
  for (let i = 11; i >= 0; i--) {
    let month = currentDate.getMonth() - i;
    let year = currentDate.getFullYear();
    if (month < 0) {
      month += 12;
      year -= 1;
    }
    recentSixMonths.push({ month: month + 1, year });
  }
  return recentSixMonths;
}

function isDateInRange(inputDateString, targetMonth, targetYear) {
  let inputDate = new Date(inputDateString);
  const inputMonth = inputDate.getMonth() + 1;
  const inputYear = inputDate.getFullYear();

  if (inputMonth === targetMonth && inputYear === targetYear) {
    return true;
  } else {
    return false;
  }
}

function findPreviousMonthSum(data, currentMonthSum, currentMonthIndex, history) {
  const recentMonths = getRecent12Months();
  const currentMonth = recentMonths[currentMonthIndex].month;
  const currentYear = recentMonths[currentMonthIndex].year;
  const currentMonthChanges = getChangesCurrentMonth(currentMonth, currentYear, history);
  const previousMonthSum = currentMonthSum - currentMonthChanges;
  data.push(previousMonthSum);
  if (currentMonthIndex === 1) return;
  findPreviousMonthSum(data, previousMonthSum, currentMonthIndex - 1, history);
}

export const getLineData = (history) => {
  const data = [];
  let lastMonthSum = 0;
  history.map((entry) => {
    if (entry.type === "earnings") {
      lastMonthSum += entry.amount;
    } else if (entry.type === "expense") {
      lastMonthSum -= entry.amount;
    }
  });
  data.push(lastMonthSum);

  findPreviousMonthSum(data, lastMonthSum, 11, history);
  const labels = getRecent12Months().map(({ month, year }) => `${month}/${year}`);
  return {
    labels,
    datasets: [
      {
        label: "Balance",
        data: data.reverse(),
        backgroundColor: "#5497f6",
      },
    ],
  };
};
