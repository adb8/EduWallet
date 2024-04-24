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
    <div className="w-full flex justify-center items-center">
      <FadeLoader color="#000000" loading={true} size={50} />
    </div>
  ) : (
    <div className="grid place-items-center w-full bg-blue-50 my-14">
      <div className={`flex flex-col w-[450px] shadow-sm bg-white p-6 ${formSize}`}>
        <div className="text-lg font-semibold mx-auto mb-1">Update Your Balance</div>
        <div className="my-2">
          <label>Select type</label>
          <Radio name="type" value="Earnings" callback={handleRadioType} />
          <Radio name="type" value="Expense" callback={handleRadioType} />
        </div>
        {type === "Earnings" ? (
          <div className="my-2">
            <label>Select category</label>
            <Radio name="category" value="Jobs" callback={handleRadioCategory} />
            <Radio name="category" value="Grants" callback={handleRadioCategory} />
            <Radio name="category" value="Stipends" callback={handleRadioCategory} />
            <Radio name="category" value="Other" callback={handleRadioCategory} />
          </div>
        ) : (
          <></>
        )}
        {type === "Expense" ? (
          <div className="my-2">
            <label>Select category</label>
            <Radio name="category" value="Tuition" callback={handleRadioCategory} />
            <Radio name="category" value="Living" callback={handleRadioCategory} />
            <Radio name="category" value="Supplies" callback={handleRadioCategory} />
            <Radio name="category" value="Other" callback={handleRadioCategory} />
          </div>
        ) : (
          null
        )}
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
        <div className="flex flex-col my-2">
          <label>Enter amount</label>
          <input
            type="number"
            className="outline-none border-none h-[40px] p-2 px-4 bg-blue-50 rounded-sm mt-1"
            onChange={(e) => {
              amount.current = parseInt(e.target.value);
            }}
            required
          />
        </div>
        <div className="flex flex-col my-2">
          <label>Enter description</label>
          <input
            type="text"
            className="outline-none border-none h-[40px] p-2 px-4 bg-blue-50 rounded-sm mt-1"
            onChange={(e) => {
              description.current = e.target.value;
            }}
            required
          />
        </div>
        <div className="flex flex-col my-2">
          <label>Select date</label>
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
        <button type="button" className="text-center text-md rounded-full bg-blue-200 hover:bg-blue-300 transiton duration-300 ease-in-out shadow-md w-[180px] h-[40px] mt-4 mx-auto" onClick={handleSubmit}>
          Update Balance
        </button>
      </div>
    </div>
  );
};

export default UpdateBalance;
