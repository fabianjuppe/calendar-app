import dayjs from "dayjs";

export function expandRecurringEvents(events, rangeStart, rangeEnd) {
  const result = [];

  for (const event of events) {
    if (!event.recurrence?.enabled) {
      result.push(event);
      continue;
    }

    const { interval = 1, until, exceptions = [] } = event.recurrence;

    const seriesEnd = dayjs(until).isBefore(rangeEnd)
      ? dayjs(until)
      : dayjs(rangeEnd);

    const duration = dayjs(event.end).diff(dayjs(event.start), "minute");
    let current = dayjs(event.start);

    while (current.isBefore(seriesEnd) || current.isSame(seriesEnd, "day")) {
      const isException = exceptions.some((exception) =>
        dayjs(exception)
          .tz("Europe/Berlin")
          .isSame(current.tz("Europe/Berlin"), "day")
      );

      if (
        !isException &&
        (current.isAfter(rangeStart) || current.isSame(rangeStart, "day"))
      ) {
        result.push({
          ...event,
          _id: `${event._id}_${current.format("YYYY-MM-DD")}`,
          start: current.toDate(),
          end: current.add(duration, "minute").toDate(),
          isRecurringInstance: true,
          originalId: event._id,
        });
      }

      current = current.add(interval, "week");
    }
  }

  return result;
}
