import styled from "styled-components";

const Form = styled.form`
  margin: 20px auto;
  padding: 16px;
  border-radius: 12px;
  max-width: 500px;

  background: #80f38f;
  border: 1px solid #e5e5e5;

  display: flex;
  flex-direction: column;
  gap: 12px;

  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const LocationGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`;

export default function EventForm({ form, updateForm, onClose, onSubmit }) {
  return (
    <Form onSubmit={onSubmit}>
      <button type="button" onClick={onClose} aria-label="Close Form">
        X
      </button>
      <h3>Termin erstellen</h3>

      <label htmlFor="title">Titel </label>
      <input
        type="text"
        id="title"
        name="title"
        value={form.title}
        onChange={(event) => updateForm("title", event.target.value)}
        aria-label="Titel hinzufügen"
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
        aria-label="Datum hinzufügen"
        required
      />

      <label htmlFor="time">Uhrzeit </label>
      <input
        type="time"
        id="time"
        name="time"
        value={form.time}
        onChange={(event) => updateForm("time", event.target.value)}
        aria-label="Uhrzeit hinzufügen"
        required
      />

      <label htmlFor="description">Beschreibung </label>
      <textarea
        id="description"
        name="description"
        value={form.description}
        onChange={(event) => updateForm("description", event.target.value)}
        aria-label="Beschreibung hinzufügen"
        placeholder="Beschreibung hinzufügen"
      />

      <h4>Ort</h4>
      <LocationGrid>
        <label htmlFor="street">Straße </label>
        <input
          type="text"
          id="street"
          name="street"
          value={form.location.street}
          onChange={(event) =>
            updateForm("location.street", event.target.value)
          }
          aria-label="Straße"
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
          aria-label="Hausnummer"
          placeholder="Hausnummer"
        />

        <label htmlFor="zip">PLZ </label>
        <input
          type="text"
          id="zip"
          name="zip"
          value={form.location.zip}
          onChange={(event) => updateForm("location.zip", event.target.value)}
          aria-label="PLZ"
          placeholder="PLZ"
        />

        <label htmlFor="city">Stadt </label>
        <input
          type="text"
          id="city"
          name="city"
          value={form.location.city}
          onChange={(event) => updateForm("location.city", event.target.value)}
          aria-label="Stadt"
          placeholder="Stadt"
        />
      </LocationGrid>

      <button type="submit">Erstellen</button>
    </Form>
  );
}
