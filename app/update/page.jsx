"use client";

import { useSession } from "next-auth/react";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Radio from "@components/Radio";

const UpdateBalance = () => {
	const router = useRouter();
	const { data: session, status } = useSession();

	const [formSize, setFormSize] = useState("small-form");
	const [type, setType] = useState(null);
	const [other, setOther] = useState(null);

	const amount = useRef(null);
	const category = useRef(null);
	const description = useRef(null);
	const date = useRef(null);

	const handleRadioType = (e) => {
		setOther(false);
		category.current = null;
		setFormSize("mid-form");
		if (e.target.checked) {
			setType(e.target.value);
		}
	};

	const handleRadioCategory = (e) => {
		if (e.target.value === "Other") {
			setOther(true);
			category.current = null;
			setFormSize("large-form");
			return;
		}
		setFormSize("mid-form");
		setOther(false);
		if (e.target.checked) {
			category.current = e.target.value;
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const isValidInput =
			amount.current > 0 &&
			amount.current < 1000000 &&
			category.current.length > 0 &&
			category.current.length < 30 &&
			(type === "Earnings" || type === "Expense") &&
			description.current.length > 0 &&
			description.current.length < 200;

		if (!isValidInput) {
			alert("Please fill out the form correctly!");
			return;
		}

		try {
			const response = await fetch("/api/update", {
				method: "POST",
				body: JSON.stringify({
					amount: amount.current,
					type: type.toLowerCase(),
					description: description.current.toLowerCase(),
					date: date.current,
					category: category.current.toLowerCase(),
					creator: session?.user.id,
				}),
			});

			if (response.ok) {
				router.push("/dashboard");
			}
		} catch (error) {
			console.error(error);
		}
	};

	if (status === "loading") {
		return <div className="loading">Loading...</div>;
	} else if (status === "unauthenticated") {
		router.push("/");
	} else {
		return (
			<div className="form-page">
				<div className={`form-cont ${formSize}`}>
					<div className="form-head">Update Your Balance</div>
					<div className="field-cont">
						<label>Select type</label>
						<Radio name="type" value="Earnings" callback={handleRadioType} />
						<Radio name="type" value="Expense" callback={handleRadioType} />
					</div>
					{type === "Earnings" ? (
						<div className="field-cont">
							<label>Select category</label>
							<Radio name="category" value="Jobs" callback={handleRadioCategory} />
							<Radio name="category" value="Grants" callback={handleRadioCategory} />
							<Radio
								name="category"
								value="Stipends"
								callback={handleRadioCategory}
							/>
							<Radio name="category" value="Other" callback={handleRadioCategory} />
						</div>
					) : (
						<></>
					)}
					{type === "Expense" ? (
						<div className="field-cont">
							<label>Select category</label>
							<Radio name="category" value="Tuition" callback={handleRadioCategory} />
							<Radio name="category" value="Living" callback={handleRadioCategory} />
							<Radio
								name="category"
								value="Supplies"
								callback={handleRadioCategory}
							/>
							<Radio name="category" value="Other" callback={handleRadioCategory} />
						</div>
					) : (
						<></>
					)}
					{other ? (
						<input
							className="input-box mt-2"
							onChange={(e) => {
								category.current = e.target.value;
							}}
						/>
					) : (
						<></>
					)}
					<div className="field-cont">
						<label>Enter amount</label>
						<input
							type="number"
							className="input-box"
							onChange={(e) => {
								amount.current = parseInt(e.target.value);
							}}
							required
						/>
					</div>
					<div className="field-cont">
						<label>Enter description</label>
						<input
							type="text"
							className="input-box"
							onChange={(e) => {
								description.current = e.target.value;
							}}
							required
						/>
					</div>
					<div className="field-cont">
						<label>Select date</label>
						<input
							type="date"
							className="input-box"
							onChange={(e) => {
								date.current = e.target.value;
							}}
							required
							max={new Date().toISOString().split("T")[0]}
						/>
					</div>
					<button type="button" className="update-btn" onClick={handleSubmit}>
						Update Balance
					</button>
				</div>
			</div>
		);
	}
};

export default UpdateBalance;