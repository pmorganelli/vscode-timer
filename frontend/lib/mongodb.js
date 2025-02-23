// lib/mongodb.js

import mongoose from "mongoose";

const connectToDatabase = async () => {
	if (mongoose.connections[0].readyState) {
		// Already connected
		return;
	}

	// Connect to MongoDB using your connection string
	console.log("KEY: ", process.env.MONGODB_URI);
	await mongoose.connect(process.env.MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
};

export default connectToDatabase;
