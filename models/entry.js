import { Schema, model, models } from "mongoose";

const EntrySchema = new Schema({
	creator: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
	description: {
		type: String,
		required: [true, , "Description required"],
	},
	type: {
		type: String,
		required: [true, "Type required"],
	},
	amount: {
		type: Number,
		required: [true, "Amount required"],
	},
	date: {
		type: String,
		required: [true, "Date required"],
	},
	category: {
		type: String,
		required: [true, "Category required"],
	},
});

const Entry = models.Entry || model("Entry", EntrySchema);
export default Entry;
