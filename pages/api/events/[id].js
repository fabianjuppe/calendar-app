import dbConnect from "@/db/connect";
import Event from "@/db/models/Event";

export default async function handler(request, response) {
  try {
    await dbConnect();
  } catch (error) {
    console.error(error);
    return response.status(503).json({ error: "Database connection failed" });
  }

  const { id } = request.query;

  if (request.method === "PUT") {
    try {
      const updatedEvent = await Event.findByIdAndUpdate(id, request.body, {
        new: true,
        runValidators: true,
      });

      if (!updatedEvent) {
        return response.status(404).json({ error: "Event not found" });
      }

      return response.status(200).json(updatedEvent);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: "Failed to update event" });
    }
  }

  if (request.method === "DELETE") {
    try {
      const deletedEvent = await Event.findByIdAndDelete(id);

      if (!deletedEvent) {
        return response.status(404).json({ error: "Event not found" });
      }

      return response.status(200).json({ message: "Event deleted" });
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: "Failed to delete event" });
    }
  }

  return response.status(405).json({ error: "Method not allowed" });
}
