import { useState, useMemo, useCallback } from "react";
import styled from "styled-components";
import dayjs from "dayjs";
import EventForm from "./EventForm";
import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";
import useSWR from "swr";
import EventDetail from "./EventDetail";
import Modal from "./Modal";
import CategoryFilter from "./CategoryFilter";
import ICSExport from "./ICSExport";
import { expandRecurringEvents } from "@/lib/expandRecurringEvents";
import { useSwipe } from "@/lib/useSwipe";
import { useSession, signOut } from "next-auth/react";
import LoginForm from "./LoginForm";
import { CATEGORIES } from "@/lib/categories";
import { useLocalStorage } from "@/lib/useLocalStorage";
import Trash from "./Trash";

const EMPTY_FORM = {
  title: "",
  date: "",
  startTime: "",
  endTime: "",
  description: "",
  location: {
    street: "",
    houseNumber: "",
    zip: "",
    city: "",
  },
  categories: [],
  recurrence: null,
};

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px;
`;

const Button = styled.button`
  padding: 4px;
  margin: 2px;
  border-radius: 8px;
  border: 1.5px solid #108197;
  background: white;
  color: #108197;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #b9f3ff;
  }
`;

const AddButton = styled.button`
  position: fixed;
  bottom: 12px;
  right: 12px;
  width: 48px;
  height: 48px;
  border-radius: 16px;
  background: #e6fbff;
  color: #108197;
  border: 1.5px solid #108197;
  font-size: 28px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 12px rgba(16, 129, 151, 0.2);
  z-index: 50;

  &:hover {
    background: #b9f3ff;
  }
`;

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const [selectedCategories, setSelectedCategories] = useLocalStorage(
    "selectedCategories",
    []
  );

  const [isTrashOpen, setIsTrashOpen] = useState(false);

  const prevMonth = useCallback(() => {
    setCurrentDate((prev) => prev.subtract(1, "month"));
  }, []);

  const nextMonth = useCallback(() => {
    setCurrentDate((prev) => prev.add(1, "month"));
  }, []);

  const { handleTouchStart, handleTouchEnd } = useSwipe({
    onSwipeLeft: nextMonth,
    onSwipeRight: prevMonth,
  });

  const { data: events = [], mutate } = useSWR("/api/events");

  const { data: session } = useSession();

  const { rangeStart, rangeEnd } = useMemo(
    () => ({
      rangeStart: currentDate.startOf("month").subtract(1, "week").toDate(),
      rangeEnd: currentDate.endOf("month").add(2, "week").toDate(),
    }),
    [currentDate]
  );

  const filteredEvents = useMemo(() => {
    if (selectedCategories.length === 0) return events;

    return events.filter((event) =>
      event.categories?.some((category) => {
        if (selectedCategories.includes(category)) return true;
        const parent = CATEGORIES.find((cat) =>
          cat.subcategories?.some((sub) => sub.id === category)
        );
        if (parent && selectedCategories.includes(parent.id)) return true;
        return false;
      })
    );
  }, [events, selectedCategories]);

  const expandedEvents = useMemo(
    () => expandRecurringEvents(filteredEvents, rangeStart, rangeEnd),
    [filteredEvents, rangeStart, rangeEnd]
  );

  /*   const toggleCategory = useCallback(
    (id) => {
      setSelectedCategories((prev) =>
        prev.includes(id)
          ? prev.filter((category) => category !== id)
          : [...prev, id]
      );
    },
    [setSelectedCategories]
  ); */

  const toggleCategory = useCallback(
    (idOrIds) => {
      const ids = Array.isArray(idOrIds) ? idOrIds : [idOrIds];

      setSelectedCategories((prev) => {
        const isAllSelected = ids.every((id) => prev.includes(id));

        return isAllSelected
          ? prev.filter((cat) => !ids.includes(cat))
          : [...new Set([...prev, ...ids])];
      });
    },
    [setSelectedCategories]
  );

  const updateForm = useCallback((path, value) => {
    setForm((prev) => {
      const keys = path.split(".");
      if (keys.length === 1) {
        return { ...prev, [path]: value };
      }

      if (keys.length === 2) {
        return {
          ...prev,
          [keys[0]]: {
            ...prev[keys[0]],
            [keys[1]]: value,
          },
        };
      }

      if (keys.length === 3) {
        return {
          ...prev,
          [keys[0]]: {
            ...prev[keys[0]],
            [keys[1]]: {
              ...prev[keys[0]]?.[keys[1]],
              [keys[2]]: value,
            },
          },
        };
      }

      return prev;
    });
  }, []);

  const openForm = useCallback(({ date = null, event = null } = {}) => {
    if (event) {
      const sourceId = event.isRecurringInstance ? event.originalId : event._id;
      setForm({
        _id: sourceId,
        title: event.title,
        date: dayjs(event.start).tz("Europe/Berlin").format("YYYY-MM-DD"),
        startTime: dayjs(event.start).tz("Europe/Berlin").format("HH:mm"),
        endTime: dayjs(event.end).tz("Europe/Berlin").format("HH:mm"),
        description: event.description || "",
        location: {
          street: event.location?.street || "",
          houseNumber: event.location?.houseNumber || "",
          zip: event.location?.zip || "",
          city: event.location?.city || "",
        },
        categories: event.categories || [],
        recurrence: event.recurrence
          ? {
              enabled: event.recurrence.enabled,
              interval: event.recurrence.interval,
              until: event.recurrence.until
                ? dayjs(event.recurrence.until)
                    .tz("Europe/Berlin")
                    .format("YYYY-MM-DD")
                : "",
            }
          : null,
      });
    } else {
      setForm({
        ...EMPTY_FORM,
        date: date ? dayjs(date).format("YYYY-MM-DD") : "",
        startTime: dayjs().tz("Europe/Berlin").format("HH:mm"),
        endTime: dayjs().tz("Europe/Berlin").add(1, "hour").format("HH:mm"),
      });
    }

    setIsFormOpen(true);
    setSelectedEvent(null);
  }, []);

  const closeForm = useCallback(() => {
    setIsFormOpen(false);
    setForm(EMPTY_FORM);
  }, []);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      const start = dayjs.tz(`${form.date} ${form.startTime}`, "Europe/Berlin");
      const rawEnd = form.endTime
        ? dayjs.tz(`${form.date} ${form.endTime}`, "Europe/Berlin")
        : start.add(1, "hour");

      const end = rawEnd.isBefore(start) ? rawEnd.add(1, "day") : rawEnd;

      const payload = {
        title: form.title,
        start: start.toDate(),
        end: end.toDate(),
        location: form.location,
        description: form.description,
        categories: form.categories,
        recurrence: form.recurrence?.enabled
          ? {
              enabled: true,
              interval: form.recurrence.interval,
              until: dayjs
                .tz(form.recurrence.until, "YYYY-MM-DD", "Europe/Berlin")
                .endOf("day")
                .toDate(),
              exceptions: [],
            }
          : null,
      };

      const isEdit = Boolean(form._id);

      try {
        const response = await fetch(
          isEdit ? `/api/events/${form._id}` : `/api/events`,
          {
            method: isEdit ? "PUT" : "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        if (!response.ok) {
          alert("Fehler beim Speichern");
          return;
        }

        mutate();
        closeForm();
      } catch {
        alert("Verbindungsfehler");
      }
    },
    [form, mutate, closeForm]
  );

  const handleDelete = useCallback(
    async (event, scope) => {
      try {
        let response;

        if (scope === "single" && event.isRecurringInstance) {
          response = await fetch(`/api/events/${event.originalId}/exception`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ date: event.start }),
          });
        } else {
          const id = event.isRecurringInstance ? event.originalId : event._id;

          response = await fetch(`/api/events/${id}`, {
            method: "DELETE",
          });
        }

        if (!response.ok) {
          alert("Fehler beim Löschen");
          return;
        }

        mutate();
        setSelectedEvent(null);
      } catch {
        alert("Verbindungsfehler");
      }
    },
    [mutate]
  );

  const handleEventClick = useCallback((event) => {
    setIsFormOpen(false);
    setSelectedEvent(event);
  }, []);

  const handleDayClick = useCallback(
    (date) => {
      openForm({ date });
    },
    [openForm]
  );

  const handleReset = useCallback(() => {
    setSelectedCategories([]);
  }, [setSelectedCategories]);

  return (
    <div onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <TopBar>
        <CalendarHeader
          currentDate={currentDate}
          onPrevMonth={prevMonth}
          onNextMonth={nextMonth}
        />

        <ICSExport selectedCategories={selectedCategories} />
      </TopBar>

      <CategoryFilter
        selectedCategories={selectedCategories}
        onToggle={toggleCategory}
        onReset={handleReset}
      />

      <CalendarGrid
        currentDate={currentDate}
        events={expandedEvents}
        onDayClick={handleDayClick}
        onEventClick={handleEventClick}
      />

      {isFormOpen && (
        <Modal onClose={closeForm}>
          <EventForm
            form={form}
            updateForm={updateForm}
            onClose={closeForm}
            onSubmit={handleSubmit}
            isEditing={Boolean(form._id)}
          />
        </Modal>
      )}

      {session && (
        <AddButton
          type="button"
          onClick={() => openForm({ date: currentDate })}
          aria-label="Add new event"
        >
          +
        </AddButton>
      )}

      {selectedEvent && (
        <Modal onClose={() => setSelectedEvent(null)}>
          <EventDetail
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
            onEdit={() => {
              openForm({ event: selectedEvent });
            }}
            onDelete={(scope) => handleDelete(selectedEvent, scope)}
          />
        </Modal>
      )}

      <Button
        type="button"
        onClick={() => (session ? signOut() : setIsLoginOpen(true))}
        aria-label={session ? "Abmelden" : "Anmelden"}
      >
        {session ? "Abmelden" : "Anmelden"}
      </Button>

      {isLoginOpen && (
        <Modal onClose={() => setIsLoginOpen(false)}>
          <LoginForm onClose={() => setIsLoginOpen(false)} />
        </Modal>
      )}

      {session && (
        <Button
          type="button"
          onClick={() => setIsTrashOpen(true)}
          aria-label="Papierkorb"
        >
          Papierkorb
        </Button>
      )}

      {isTrashOpen && (
        <Modal onClose={() => setIsTrashOpen(false)}>
          <Trash onClose={() => setIsTrashOpen(false)} onMutate={mutate} />
        </Modal>
      )}
    </div>
  );
}
