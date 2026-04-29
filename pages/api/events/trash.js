import dbConnect from "@/db/connect";
import Event from "@/db/models/Event";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(request, response) {
  const session = await getServerSession(request, response, authOptions);

  if (!session) {
    return response.status(401).json({ error: "Not authorized" });
  }

  try {
    await dbConnect();
  } catch (error) {
    console.error(error);
    return response.status(503).json({ error: "Database connection failed" });
  }

  if (request.method === "GET") {
    try {
      await Event.deleteMany({
        deleted: true,
        deletedAt: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      });

      const events = await Event.find({ deleted: true }).sort({
        deletedAt: -1,
      });
      return response.status(200).json(events);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: "Fetch failed" });
    }
  }

  if (request.method === "DELETE") {
    try {
      await Event.deleteMany({ deleted: true });
      return response.status(200).json({ message: "Trash emptied" });
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: "Failed to empty trash" });
    }
  }

  return response.status(405).json({ error: "Method not allowed" });
}
