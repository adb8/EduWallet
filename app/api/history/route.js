import { db_connect } from "@utils/database";
import Entry from "@models/entry";

export const POST = async (req, res) => {
	const { userId } = await req.json();
	try {
		await db_connect();
		const history = await Entry.find({ creator: userId })
			.populate("creator")
			.sort({ $natural: -1 });
		return new Response(JSON.stringify(history), {
			status: 200,
		});
	} catch (error) {
		console.error(error);
		return new Response("Failed to fetch history", {
			status: 500,
		});
	}
};