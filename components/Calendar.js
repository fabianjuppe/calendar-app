import { useState } from "react";
import styled from "styled-components";
import dayjs from "dayjs";
import EventForm from "./EventForm";
import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";
import useSWR from "swr";

const AddButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(dayjs());

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState({
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
  });

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

  function openForm(date) {
    setForm({
      title: "",
      date: date ? dayjs(date).format("YYYY-MM-DD") : "",
      time: dayjs().format("HH:mm"),
      description: "",
      location: {
        street: "",
        houseNumber: "",
        zip: "",
        city: "",
      },
    });

    setIsFormOpen(true);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        alert("Fehler beim Speichern");
        return;
      }

      mutate();
      setIsFormOpen(false);
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
        onDayClick={(date) => openForm(date)}
      />

      {isFormOpen ? (
        <EventForm
          form={form}
          updateForm={updateForm}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleSubmit}
        />
      ) : (
        <AddButtonWrapper>
          <button
            type="button"
            onClick={() => openForm(currentDate)}
            aria-label="Add new event"
          >
            +
          </button>
        </AddButtonWrapper>
      )}
    </>
  );
}
