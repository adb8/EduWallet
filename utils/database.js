import mongoose from "mongoose";

let connected = false;

export const db_connect = async () => {
	mongoose.set("strictQuery", true);
	if (connected) {
		console.log("Database is already connected");
		return;
	} else {
		try {
			await mongoose.connect(process.env.MONGODB_URI, {
				dbName: "eduwallet",
				useNewUrlParser: true,
				useUnifiedTopology: true,
			});
			connected = true;
			console.log("Database successfully connected");
			return;
		} catch (error) {
			console.error(error);
		}
	}
};