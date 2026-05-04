import { useState, useMemo, useCallback, useEffect } from "react";
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

const Wrapper = styled.div`
  width: 100%;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px;
`;

const BottomLeftGroup = styled.div`
  position: fixed;
  bottom: 12px;
  left: 12px;

  display: flex;
  gap: 8px;
  align-items: center;
`;

const Button = styled.button`
  bottom: 12px;
  background: #e6fbff;
  color: #108197;
  border: 1.5px solid #108197;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background: #b9f3ff;
    }
  }

  &:active {
    transform: scale(0.95);
  }
`;

const AddButton = styled(Button)`
  position: fixed;
  right: 12px;
  width: 48px;
  height: 48px;
  border-radius: 16px;
  font-size: 28px;
`;

const LoginButton = styled(Button)`
  border-radius: 999px;
  font-size: clamp(10px, 1.8vw, 16px);
  font-weight: 600;
`;

const TrashButton = styled(Button)`
  border-radius: 999px;
  font-size: clamp(10px, 1.8vw, 16px);
  font-weight: 600;
`;

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const [direction, setDirection] = useState("next");
  const [animating, setAnimating] = useState(false);

  const [selectedCategories, setSelectedCategories] = useLocalStorage(
    "selectedCategories",
    []
  );

  const [isTrashOpen, setIsTrashOpen] = useState(false);

  const prevMonth = useCallback(() => {
    setDirection("prev");
    setAnimating(true);

    setTimeout(() => {
      setCurrentDate((prev) => prev.subtract(1, "month"));
      setAnimating(false);
    }, 100);
  }, []);

  const nextMonth = useCallback(() => {
    setDirection("next");
    setAnimating(true);

    setTimeout(() => {
      setCurrentDate((prev) => prev.add(1, "month"));
      setAnimating(false);
    }, 100);
  }, []);

  const { handleTouchStart, handleTouchEnd } = useSwipe({
    onSwipeLeft: nextMonth,
    onSwipeRight: prevMonth,
  });

  useEffect(() => {
    function handleKeyDown(e) {
      if (isFormOpen || selectedEvent || isLoginOpen || isTrashOpen) {
        return;
      }

      const active = document.activeElement;
      const isTyping =
        active?.tagName === "INPUT" || active?.tagName === "TEXTAREA";

      if (isTyping) return;

      if (e.key === "ArrowLeft") {
        prevMonth();
      }

      if (e.key === "ArrowRight") {
        nextMonth();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    prevMonth,
    nextMonth,
    isFormOpen,
    selectedEvent,
    isLoginOpen,
    isTrashOpen,
  ]);

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
    <Wrapper onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
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
        direction={direction}
        animating={animating}
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

      <BottomLeftGroup>
        <LoginButton
          type="button"
          onClick={() => (session ? signOut() : setIsLoginOpen(true))}
          aria-label={session ? "Abmelden" : "Anmelden"}
        >
          {session ? "Abmelden" : "Anmelden"}
        </LoginButton>

        {isLoginOpen && (
          <Modal onClose={() => setIsLoginOpen(false)}>
            <LoginForm onClose={() => setIsLoginOpen(false)} />
          </Modal>
        )}

        {session && (
          <TrashButton
            type="button"
            onClick={() => setIsTrashOpen(true)}
            aria-label="Papierkorb"
          >
            Papierkorb
          </TrashButton>
        )}

        {isTrashOpen && (
          <Modal onClose={() => setIsTrashOpen(false)}>
            <Trash onClose={() => setIsTrashOpen(false)} onMutate={mutate} />
          </Modal>
        )}
      </BottomLeftGroup>
    </Wrapper>
  );
}
