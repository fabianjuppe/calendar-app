import { useState } from "react";
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
};

const AddButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const [selectedCategories, setSelectedCategories] = useState([]);

  const { data: events = [], mutate } = useSWR("/api/events");

  const filteredEvents =
    selectedCategories.length === 0
      ? events
      : events.filter((event) =>
          event.categories?.some((category) =>
            selectedCategories.includes(category)
          )
        );

  function toggleCategory(id) {
    setSelectedCategories((prev) =>
      prev.includes(id)
        ? prev.filter((category) => category !== id)
        : [...prev, id]
    );
  }

  function updateForm(path, value) {
    setForm((prev) => {
      const keys = path.split(".");
      if (keys.length === 1) {
        return { ...prev, [path]: value };
      }
      return {
        ...prev,
        [keys[0]]: {
          ...prev[keys[0]],
          [keys[1]]: value,
        },
      };
    });
  }

  function openForm({ date = null, event = null } = {}) {
    if (event) {
      setForm({
        _id: event._id,
        title: event.title,
        date: dayjs(event.start).format("YYYY-MM-DD"),
        startTime: dayjs(event.start).format("HH:mm"),
        endTime: dayjs(event.end).format("HH:mm"),
        description: event.description || "",
        location: {
          street: event.location?.street || "",
          houseNumber: event.location?.houseNumber || "",
          zip: event.location?.zip || "",
          city: event.location?.city || "",
        },
        categories: event.categories || [],
      });
    } else {
      setForm({
        ...EMPTY_FORM,
        date: date ? dayjs(date).format("YYYY-MM-DD") : "",
        startTime: dayjs().format("HH:mm"),
        endTime: dayjs().add(1, "hour").format("HH:mm"),
      });
    }

    setIsFormOpen(true);
    setSelectedEvent(null);
  }

  function closeForm() {
    setIsFormOpen(false);
    setForm(EMPTY_FORM);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const start = dayjs(`${form.date} ${form.startTime}`);
    const rawEnd = form.endTime
      ? dayjs(`${form.date} ${form.endTime}`)
      : start.add(1, "hour");

    const end = rawEnd.isBefore(start) ? rawEnd.add(1, "day") : rawEnd;

    const payload = {
      title: form.title,
      start: start.toDate(),
      end: end.toDate(),
      location: form.location,
      description: form.description,
      categories: form.categories,
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
  }

  async function handleDelete(id) {
    const confirmed = window.confirm("Event wirklich löschen?");
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/events/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        alert("Fehler beim Löschen");
        return;
      }

      mutate();
      setSelectedEvent(null);
    } catch (error) {
      alert("Verbindungsfehler");
    }
  }

  function prevMonth() {
    setCurrentDate((prev) => prev.subtract(1, "month"));
  }

  function nextMonth() {
    setCurrentDate((prev) => prev.add(1, "month"));
  }

  return (
    <>
      <CalendarHeader
        currentDate={currentDate}
        onPrevMonth={prevMonth}
        onNextMonth={nextMonth}
      />

      <ICSExport selectedCategories={selectedCategories} />

      <CategoryFilter
        selectedCategories={selectedCategories}
        onToggle={toggleCategory}
        onReset={() => setSelectedCategories([])}
      />

      <CalendarGrid
        currentDate={currentDate}
        events={filteredEvents}
        onDayClick={(date) => openForm({ date })}
        onEventClick={(event) => {
          setIsFormOpen(false);
          setSelectedEvent(event);
        }}
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

      {!isFormOpen && !selectedEvent && (
        <AddButtonWrapper>
          <button
            type="button"
            onClick={() => openForm({ date: currentDate })}
            aria-label="Add new event"
          >
            +
          </button>
        </AddButtonWrapper>
      )}

      {selectedEvent && (
        <Modal onClose={() => setSelectedEvent(null)}>
          <EventDetail
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
            onEdit={() => {
              openForm({ event: selectedEvent });
              setSelectedEvent(null);
            }}
            onDelete={() => handleDelete(selectedEvent._id)}
          />
        </Modal>
      )}
    </>
  );
}
