import mongoose from "mongoose";

const { Schema } = mongoose;

const eventSchema = new Schema({
  title: { type: String, required: true },
  start: { type: Date, required: true },
  end: { type: Date, required: true },

  location: {
    street: { type: String },
    houseNumber: { type: String },
    zip: { type: String },
    city: { type: String },
  },

  description: { type: String },

  categories: { type: [String], default: [] },
}, { timestamps: true });

const Event = mongoose.models.Event || mongoose.model("Event", eventSchema);

export default Event;
