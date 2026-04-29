import dbConnect from "@/db/connect";
import Event from "@/db/models/Event";
import { formatLocation } from "@/lib/formatLocation";
import ical from "ical-generator";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

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
      prodId: {
        company: "Calendar App",
        product: "Calendar",
        language: "DE",
      },
    });

    for (const event of events) {
      const location = formatLocation(event.location);

      const ev = calendar.createEvent({
        uid: `${event._id}@calendar-app`,
        start: event.start,
        end: event.end,
        summary: event.title,
        ...(event.description && { description: event.description }),
        ...(location && { location }),
      });

      if (event.recurrence?.enabled) {
        ev.repeating({
          freq: "WEEKLY",
          interval: event.recurrence.interval || 1,
          until: new Date(event.recurrence.until),
          ...(event.recurrence.exceptions?.length > 0 && {
            exclude: event.recurrence.exceptions.map((exception) =>
              dayjs(exception)
                .tz("Europe/Berlin")
                .hour(dayjs(event.start).tz("Europe/Berlin").hour())
                .minute(dayjs(event.start).tz("Europe/Berlin").minute())
                .second(0)
                .toDate()
            ),
          }),
        });
      }
    }

    response.setHeader("Content-Type", "text/calendar; charset=utf-8");
    response.setHeader("Cache-Control", "public, max-age=60");
    response.setHeader(
      "Content-Disposition",
      'inline; filename="calendar.ics"'
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
