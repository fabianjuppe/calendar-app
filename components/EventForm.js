import { CATEGORIES } from "@/lib/categories";
import dayjs from "dayjs";
import styled from "styled-components";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const LocationFieldset = styled.fieldset`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`;

export default function EventForm({
  form,
  updateForm,
  onClose,
  onSubmit,
  isEditing,
}) {
  return (
    <Form onSubmit={onSubmit}>
      <button type="button" onClick={onClose} aria-label="Close Form">
        X
      </button>
      <h3>{isEditing ? "Termin bearbeiten" : "Termin erstellen"}</h3>

      <label htmlFor="title">Titel </label>
      <input
        type="text"
        id="title"
        name="title"
        value={form.title}
        onChange={(event) => updateForm("title", event.target.value)}
        placeholder="Titel hinzufügen"
        required
      />

      <label htmlFor="date">Datum </label>
      <input
        type="date"
        id="date"
        name="date"
        value={form.date}
        onChange={(event) => updateForm("date", event.target.value)}
        required
      />

      <label htmlFor="startTime">Startzeit </label>
      <input
        type="time"
        id="startTime"
        name="startTime"
        value={form.startTime}
        onChange={(event) => updateForm("startTime", event.target.value)}
        required
      />

      <label htmlFor="endTime">Endzeit </label>
      <input
        type="time"
        id="endTime"
        name="endTime"
        value={form.endTime}
        onChange={(event) => updateForm("endTime", event.target.value)}
        required
      />

      <label htmlFor="description">Beschreibung </label>
      <textarea
        id="description"
        name="description"
        value={form.description}
        onChange={(event) => updateForm("description", event.target.value)}
        placeholder="Beschreibung hinzufügen"
      />

      <LocationFieldset>
        <legend>Ort</legend>

        <label htmlFor="street">Straße </label>
        <input
          type="text"
          id="street"
          name="street"
          value={form.location.street}
          onChange={(event) =>
            updateForm("location.street", event.target.value)
          }
          placeholder="Straße"
        />

        <label htmlFor="houseNumber">Hausnummer </label>
        <input
          type="text"
          id="houseNumber"
          name="houseNumber"
          value={form.location.houseNumber}
          onChange={(event) =>
            updateForm("location.houseNumber", event.target.value)
          }
          placeholder="Hausnummer"
        />

        <label htmlFor="zip">PLZ </label>
        <input
          type="text"
          id="zip"
          name="zip"
          value={form.location.zip}
          onChange={(event) => updateForm("location.zip", event.target.value)}
          placeholder="PLZ"
        />

        <label htmlFor="city">Stadt </label>
        <input
          type="text"
          id="city"
          name="city"
          value={form.location.city}
          onChange={(event) => updateForm("location.city", event.target.value)}
          placeholder="Stadt"
        />
      </LocationFieldset>

      <fieldset>
        <legend>Kategorien</legend>

        <div>
          {form.categories &&
            CATEGORIES.map((category) => (
              <label key={category.id}>
                <input
                  type="checkbox"
                  checked={form.categories.includes(category.id)}
                  onChange={(event) => {
                    const updated = event.target.checked
                      ? [...form.categories, category.id]
                      : form.categories.filter((id) => id !== category.id);
                    updateForm("categories", updated);
                  }}
                />
                {category.label}
              </label>
            ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>Wiederholung</legend>

        <label>
          <input
            type="checkbox"
            checked={!!form.recurrence?.enabled}
            onChange={(event) =>
              updateForm(
                "recurrence",
                event.target.checked
                  ? {
                      enabled: true,
                      interval: 1,
                      until: dayjs().endOf("year").format("YYYY-MM-DD"),
                    }
                  : null
              )
            }
          />
          Wöchentlich wiederholen
        </label>

        {form.recurrence?.enabled && (
          <>
            <label htmlFor="until"> bis </label>
            <input
              type="date"
              id="until"
              value={form.recurrence.until}
              onChange={(event) =>
                updateForm("recurrence.until", event.target.value)
              }
              required
            />
          </>
        )}
      </fieldset>

      <button type="submit">{isEditing ? "Speichern" : "Erstellen"}</button>
    </Form>
  );
}
