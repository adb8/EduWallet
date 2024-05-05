import { db_connect } from "@utils/database";
import Entry from "@models/entry";

export const POST = async (req, res) => {
  const { amount, type, description, date, creator, category } = await req.json();
  try {
    await db_connect();
    const new_entry = new Entry({
      creator: creator,
      description: description,
      type: type,
      amount: amount,
      date: date,
      category: category,
    });
    await new_entry.save();
    return new Response(JSON.stringify(new_entry), {
      status: 201,
    });
  } catch (error) {
    console.error(error);
    return new Response("Failed to edit balance", { status: 500 });
  }
};
