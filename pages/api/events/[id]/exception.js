import dbConnect from "@/db/connect";
import Event from "@/db/models/Event";

export default async function handler(request, response) {
  if (request.method !== "POST") {
    return response.status(405).json({ error: "Method not allowed" });
  }

  try {
    await dbConnect();
  } catch (error) {
    console.error(error);
    return response.status(503).json({ error: "Database connection failed" });
  }

  try {
    const { id } = request.query;
    const { date } = request.body;

    const event = await Event.findByIdAndUpdate(
      id,
      { $addToSet: { "recurrence.exceptions": new Date(date) } },
      { new: true }
    );

    if (!event) {
      return response.status(404).json({ error: "Event not found" });
    }

    return response.status(200).json(event);
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: "Failed to add exception" });
  }
}
