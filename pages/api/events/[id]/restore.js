import dbConnect from "@/db/connect";
import Event from "@/db/models/Event";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(request, response) {
  const session = await getServerSession(request, response, authOptions);

  if (!session) {
    return response.status(401).json({ error: "Not authorized" });
  }

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

    const event = await Event.findByIdAndUpdate(
      id,
      { deleted: false, deletedAt: null },
      { new: true }
    );

    if (!event) {
      return response.status(404).json({ error: "Event not found" });
    }

    return response.status(200).json(event);
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: "Restore failed" });
  }
}
