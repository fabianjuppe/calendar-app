import { useState } from "react";
import styled from "styled-components";
import dayjs from "dayjs";
import EventForm from "./EventForm";
import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";
import useSWR from "swr";
import EventDetail from "./EventDetail";
import Modal from "./Modal";

const emptyForm = {
  title: "",
  date: "",
  time: "",
  description: "",
  location: {
    street: "",
    houseNumber: "",
    zip: "",
    city: "",
  },
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
  const [form, setForm] = useState(emptyForm);

  const { data: events = [], mutate } = useSWR("/api/events");

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
        date: event.date,
        time: event.time,
        description: event.description || "",
        location: {
          street: event.location?.street || "",
          houseNumber: event.location?.houseNumber || "",
          zip: event.location?.zip || "",
          city: event.location?.city || "",
        },
      });
    } else {
      setForm({
        ...emptyForm,
        date: date ? dayjs(date).format("YYYY-MM-DD") : "",
        time: dayjs().format("HH:mm"),
      });
    }

    setIsFormOpen(true);
    setSelectedEvent(null);
  }

  function closeForm() {
    setIsFormOpen(false);
    setForm(emptyForm);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const isEdit = Boolean(form._id);

    try {
      const response = await fetch(
        isEdit ? `/api/events/${form._id}` : `/api/events`,
        {
          method: isEdit ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      if (!response.ok) {
        alert("Fehler beim Speichern");
        return;
      }

      mutate();
      closeForm();
    } catch (error) {
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

      <CalendarGrid
        currentDate={currentDate}
        events={events}
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
