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

const LocationFieldset = styled.fieldset`
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

      <label htmlFor="time">Uhrzeit </label>
      <input
        type="time"
        id="time"
        name="time"
        value={form.time}
        onChange={(event) => updateForm("time", event.target.value)}
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

      <button type="submit">Erstellen</button>
    </Form>
  );
}
