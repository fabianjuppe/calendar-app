import dbConnect from "@/db/connect";
import Event from "@/db/models/Event";

export default async function handler(request, response) {
  try {
    await dbConnect();
  } catch (error) {
    console.error(error);
    return response.status(503).json({ error: "Database connection failed" });
  }

  if (request.method === "GET") {
    try {
      const events = await Event.find().sort({ date: 1, time: 1 });
      return response.status(200).json(events);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: "Failed to fetch events" });
    }
  }

  if (request.method === "POST") {
    try {
      const eventData = request.body;
      const createdEvent = await Event.create(eventData);
      return response.status(201).json(createdEvent);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: "Failed to create event" });
    }
  }

  return response.status(405).json({ error: "Method not allowed" });
}
