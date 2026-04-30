import dbConnect from "@/db/connect";
import Event from "@/db/models/Event";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(request, response) {
  const session = await getServerSession(request, response, authOptions);

  try {
    await dbConnect();
  } catch (error) {
    console.error(error);
    return response.status(503).json({ error: "Database connection failed" });
  }

  const { id } = request.query;

  if (request.method === "PUT") {
    if (!session) {
      return response.status(401).json({ error: "Not authorized" });
    }

    try {
      const {
        title,
        start,
        end,
        location,
        categories,
        description,
        recurrence,
      } = request.body;
      const updatedEvent = await Event.findByIdAndUpdate(
        id,
        { title, start, end, location, categories, description, recurrence },
        {
          new: true,
          runValidators: true,
        }
      );

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
    if (!session) {
      return response.status(401).json({ error: "Not authorized" });
    }

    try {
      const deletedEvent = await Event.findByIdAndUpdate(
        id,
        { deleted: true, deletedAt: new Date() },
        { new: true }
      );

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
