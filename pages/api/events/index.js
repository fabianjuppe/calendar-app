import dbConnect from "@/db/connect";
import Event from "@/db/models/Event";

export default async function handler(request, response) {
  await dbConnect();

  if (request.method === "GET") {
    const events = await Event.find().sort({ date: 1, time: 1 });
    return response.status(200).json(events);
  }

  if (request.method === "POST") {
    try {
      const eventData = request.body;
      const createdEvent = await Event.create(eventData);
      return response.status(201).json(createdEvent);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: "Create failed" });
    }
  }

  return response.status(405).json({ error: "Method not allowed" });
}
