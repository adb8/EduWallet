export const pieOptions = {
	plugins: {
		legend: {
			labels: {
				font: {
					size: 17,
				},
				color: "black",
			},
		},
	},
};

export const getPieData = (history, type) => {
	let categoryArr = [];
	const amountArr = [];

	history.map((entry) => {
		if (entry.type === type) {
			if (!categoryArr.includes(entry.category)) {
				categoryArr.push(entry.category);
			}
		}
	});

	categoryArr.forEach((category) => {
		let categorySum = 0;
		history.map((entry) => {
			if (entry.category === category) {
				categorySum += entry.amount;
			}
		});
		amountArr.push(categorySum);
	});

	categoryArr = categoryArr.map(
		(category) => category.charAt(0).toUpperCase() + category.slice(1)
	);

	return {
		labels: categoryArr,
		datasets: [
			{
				label: " Dollars",
				data: amountArr,
				backgroundColor: [
					"#666bf5",
					"#5497f6",
					"#5c80f5",
					"#6267f7",
					"#5eb2f5",
					"#6ccef5",
					"#11d2ee",
					"#13ebec",
				],
				borderWidth: 3,
			},
		],
	};
};