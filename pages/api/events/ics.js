import dbConnect from "@/db/connect";
import Event from "@/db/models/Event";
import { formatLocation } from "@/lib/formatLocation";
import ical from "ical-generator";

export default async function handler(request, response) {
  if (request.method !== "GET") {
    return response.status(405).json({ error: "Method not allowed" });
  }

  try {
    await dbConnect();
  } catch (error) {
    console.error(error);
    return response.status(503).json({ error: "Database connection failed" });
  }

  try {
    const { categories } = request.query;

    const query = categories
      ? { categories: { $in: categories.split(",").map((cat) => cat.trim()) } }
      : {};

    const events = await Event.find(query).sort({ start: 1 });

    const calendar = ical({
      name: "Calendar App",
      timezone: "Europe/Berlin",
      prodId: {
        company: "Calendar App",
        product: "Calendar",
        language: "DE",
      },
    });

    for (const event of events) {
      const location = formatLocation(event.location);

      calendar.createEvent({
        uid: `${event._id}@calendar-app`,
        start: event.start,
        end: event.end,
        summary: event.title,
        ...(event.description && { description: event.description }),
        ...(location && { location }),
      });
    }

    response.setHeader("Content-Type", "text/calendar; charset=utf-8");
    response.setHeader("Cache-Control", "public, max-age=60");
    response.setHeader(
      "Content-Disposition",
      'attachment; filename="calendar.ics"'
    );

    const lastModified =
      events.length > 0
        ? new Date(
            Math.max(...events.map((event) => new Date(event.updatedAt)))
          ).toUTCString()
        : new Date().toUTCString();

    response.setHeader("Last-Modified", lastModified);

    return response.status(200).send(calendar.toString());
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: "ICS generation failed" });
  }
}
