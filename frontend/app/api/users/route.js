// app/api/users/route.js
import connectToDatabase from "../../../lib/mongodb";
import User from "../../../models/User";
import { NextResponse } from "next/server";

export async function GET(req) {
	try {
		// Step 1: Get the Auth0 session (user info)
		const session = await getSession(req); // Ensure we await the session correctly
		if (!session || !session.user) {
			return NextResponse.json(
				{ error: "Not authenticated" },
				{ status: 401 }
			);
		}

		const { user } = session;

		// Step 2: Connect to MongoDB
		await connectToDatabase();

		// Step 3: Check if the user exists in MongoDB (by Auth0 ID)
		let existingUser = await User.findOne({ auth0Id: user.sub });

		if (!existingUser) {
			// Step 4: If user does not exist, create a new user in MongoDB
			existingUser = new User({
				auth0Id: user.sub,
				email: user.email,
				name: user.name,
				friendIds: [],
			});
			await existingUser.save();
		}

		// Step 5: Return the user data (including email)
		return NextResponse.json(existingUser, { status: 200 });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: "Something went wrong" },
			{ status: 500 }
		);
	}
}
