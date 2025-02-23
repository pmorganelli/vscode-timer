import mongoose from "mongoose";
const sessionSchema = new mongoose.Schema({
	user_id: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
		index: true,
	},

	time_statistics: {
		start_time: {
			type: Date,
			required: true,
			default: Date.now,
		},
		session_duration_minutes: {
			type: Number,
		},
		fileTimes: {
			type: Object,
		},
		created_at: {
			type: Date,
			default: Date.now,
		},
	},

	editor_statistics: {
		keystrokeCt: {
			type: Number,
			default: 0,
		},
		undoCt: {
			type: Number,
			default: 0,
		},
		clickCt: {
			type: Number,
			default: 0,
		},
		copyCutPasteCt: {
			type: Number,
			default: 0,
		},
		deleteCt: {
			type: Number,
			default: 0,
		},
	},
});

const Session =
	mongoose.models.Session || mongoose.model("Session", sessionSchema);

export default Session;
