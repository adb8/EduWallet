"use client";
import { useSession } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Radio from "@components/Radio";
import { FadeLoader } from "react-spinners";

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

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status]);

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

  return status === "loading" ? (
    <div className="absolute top-1/2 left-1/2">
      <FadeLoader color="#000000" loading={true} size={50} />
    </div>
  ) : (
    <div className="flex flex-col flex-grow items-center justify-center w-full bg-blue-50 my-14">
      <div className={`flex flex-col w-[450px] rounded-xs bg-white px-6 ${formSize}`}>
        <div className="text-lg font-medium mx-auto mb-1 mt-6">Update Your Balance</div>
        <div className="my-3">
          <label className="font-medium">Select type</label>
          <Radio name="type" value="Earnings" callback={handleRadioType} />
          <Radio name="type" value="Expense" callback={handleRadioType} />
        </div>
        {type === "Earnings" ? (
          <div className="my-3">
            <label className="font-medium">Select category</label>
            <Radio name="category" value="Jobs" callback={handleRadioCategory} />
            <Radio name="category" value="Grants" callback={handleRadioCategory} />
            <Radio name="category" value="Stipends" callback={handleRadioCategory} />
            <Radio name="category" value="Other" callback={handleRadioCategory} />
          </div>
        ) : (
          <></>
        )}
        {type === "Expense" ? (
          <div className="my-3">
            <label className="font-medium">Select category</label>
            <Radio name="category" value="Tuition" callback={handleRadioCategory} />
            <Radio name="category" value="Living" callback={handleRadioCategory} />
            <Radio name="category" value="Supplies" callback={handleRadioCategory} />
            <Radio name="category" value="Other" callback={handleRadioCategory} />
          </div>
        ) : null}
        {other ? (
          <input
            className="outline-none border-none h-[40px] p-2 px-4 bg-blue-50 rounded-sm mt-2"
            onChange={(e) => {
              category.current = e.target.value;
            }}
          />
        ) : (
          <></>
        )}
        <div className="flex flex-col my-3">
          <label className="font-medium">Enter amount</label>
          <input
            type="number"
            className="outline-none border-none h-[40px] p-2 px-4 bg-blue-50 rounded-sm mt-1"
            onChange={(e) => {
              amount.current = parseInt(e.target.value);
            }}
            required
          />
        </div>
        <div className="flex flex-col my-3">
          <label className="font-medium">Enter description</label>
          <input
            type="text"
            className="outline-none border-none h-[40px] p-2 px-4 bg-blue-50 rounded-sm mt-1"
            onChange={(e) => {
              description.current = e.target.value;
            }}
            required
          />
        </div>
        <div className="flex flex-col my-3">
          <label className="font-medium">Select date</label>
          <input
            type="date"
            className="outline-none border-none h-[40px] p-2 px-4 bg-blue-50 rounded-sm mt-1"
            onChange={(e) => {
              date.current = e.target.value;
            }}
            required
            max={new Date().toISOString().split("T")[0]}
          />
        </div>
        <button
          type="button"
          className="shadow-sm text-md rounded-full w-[175px] bg-blue-200 hover:bg-blue-300 transition duration-300 ease-in-out h-[40px] flex items-center justify-center mt-3 mb-6 mx-auto"
          onClick={handleSubmit}>
          Update Balance
        </button>
      </div>
    </div>
  );
};

export default UpdateBalance;
