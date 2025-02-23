import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
	auth0Id: {
		type: String,
		required: true,
		unique: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	name: {
		type: String,
		required: true,
	},
	friendIds: {
		type: Array,
	},
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
