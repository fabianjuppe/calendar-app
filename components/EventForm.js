import { CATEGORIES } from "@/lib/categories";
import dayjs from "dayjs";
import styled from "styled-components";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  font-size: 30px;
  font-weight: 600;
  color: #292b2e;
  margin: 0;
`;

const CloseButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: #e6fbff;
  color: #108197;
  border: 1px solid #108197;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #b9f3ff;
  }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Label = styled.label`
  font-size: 11px;
  font-weight: 600;
  color: #108197;
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

const Input = styled.input`
  padding: 10px 12px;
  border-radius: 8px;
  border: 1.5px solid #b1f2ff;
  background: #f8feff;
  font-size: 14px;
  color: #292b2e;
  outline: none;
  width: 100%;

  &:focus {
    border-color: #108197;
    background: #fff;
  }
`;

const TimeRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`;

const Textarea = styled.textarea`
  padding: 10px 12px;
  border-radius: 8px;
  border: 1.5px solid #b1f2ff;
  background: #f8feff;
  font-size: 14px;
  color: #292b2e;
  outline: none;
  resize: vertical;
  min-height: 80px;
  width: 100%;

  &:focus {
    border-color: #108197;
    background: #fff;
  }
`;

const Fieldset = styled.fieldset`
  border: 1.5px solid #b1f2ff;
  border-radius: 8px;
  padding: 12px;
`;

const Legend = styled.legend`
  font-size: 11px;
  font-weight: 600;
  color: #108197;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 0 4px;
`;

const LocationGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
`;

const CategoryChip = styled.label`
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12px;
  cursor: pointer;
  border: 1px solid
    ${({ $isActive, $color }) => ($isActive ? $color : "#d1d5db")};
  background: ${({ $isActive, $color }) => ($isActive ? $color : "#ffffff")};
  color: ${({ $isActive }) => ($isActive ? "white" : "#374151")};

  input {
    display: none;
  }

  &:hover {
    border-color: ${({ $color }) => $color};
    color: ${({ $isActive, $color }) => ($isActive ? "white" : $color)};
  }
`;

const Toggle = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #292b2e;
  cursor: pointer;

  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    accent-color: #108197;
    cursor: pointer;
  }
`;

const SubmitButton = styled.button`
  padding: 12px;
  border-radius: 8px;
  border: none;
  background: #108197;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #0c6474;
  }
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
      <TopRow>
        <Title>{isEditing ? "Termin bearbeiten" : "Termin erstellen"}</Title>
        <CloseButton type="button" onClick={onClose} aria-label="Close Form">
          X
        </CloseButton>
      </TopRow>

      <Field>
        <Label htmlFor="title">Titel </Label>
        <Input
          type="text"
          id="title"
          name="title"
          value={form.title}
          onChange={(event) => updateForm("title", event.target.value)}
          placeholder="Titel hinzufügen"
          required
        />
      </Field>

      <Field>
        <Label htmlFor="date">Datum </Label>
        <Input
          type="date"
          id="date"
          name="date"
          value={form.date}
          onChange={(event) => updateForm("date", event.target.value)}
          required
        />
      </Field>

      <TimeRow>
        <Field>
          <Label htmlFor="startTime">Startzeit </Label>
          <Input
            type="time"
            id="startTime"
            name="startTime"
            value={form.startTime}
            onChange={(event) => updateForm("startTime", event.target.value)}
            required
          />
        </Field>

        <Field>
          <Label htmlFor="endTime">Endzeit </Label>
          <Input
            type="time"
            id="endTime"
            name="endTime"
            value={form.endTime}
            onChange={(event) => updateForm("endTime", event.target.value)}
            required
          />
        </Field>
      </TimeRow>

      <Field>
        <Label htmlFor="description">Beschreibung </Label>
        <Textarea
          id="description"
          name="description"
          value={form.description}
          onChange={(event) => updateForm("description", event.target.value)}
          placeholder="Beschreibung hinzufügen"
        />
      </Field>

      <Fieldset>
        <Legend>Ort</Legend>
        <LocationGrid>
          <Field>
            <Label htmlFor="street">Straße </Label>
            <Input
              type="text"
              id="street"
              name="street"
              value={form.location.street}
              onChange={(event) =>
                updateForm("location.street", event.target.value)
              }
              placeholder="Straße"
            />
          </Field>

          <Field>
            <Label htmlFor="houseNumber">Hausnummer </Label>
            <Input
              type="text"
              id="houseNumber"
              name="houseNumber"
              value={form.location.houseNumber}
              onChange={(event) =>
                updateForm("location.houseNumber", event.target.value)
              }
              placeholder="Hausnummer"
            />
          </Field>

          <Field>
            <Label htmlFor="zip">PLZ </Label>
            <Input
              type="text"
              id="zip"
              name="zip"
              value={form.location.zip}
              onChange={(event) =>
                updateForm("location.zip", event.target.value)
              }
              placeholder="PLZ"
            />
          </Field>

          <Field>
            <Label htmlFor="city">Stadt </Label>
            <Input
              type="text"
              id="city"
              name="city"
              value={form.location.city}
              onChange={(event) =>
                updateForm("location.city", event.target.value)
              }
              placeholder="Stadt"
            />
          </Field>
        </LocationGrid>
      </Fieldset>

      <Fieldset>
        <Legend>Kategorien</Legend>

        <CheckboxGroup>
          {form.categories &&
            CATEGORIES.map((category) => (
              <CategoryChip
                key={category.id}
                $isActive={form.categories.includes(category.id)}
                $color={category.color}
              >
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
              </CategoryChip>
            ))}
        </CheckboxGroup>
      </Fieldset>

      <Fieldset>
        <Legend>Wiederholung</Legend>
        <Toggle>
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
        </Toggle>

        {form.recurrence?.enabled && (
          <Field>
            <Label htmlFor="until"> bis </Label>
            <Input
              type="date"
              id="until"
              value={form.recurrence.until}
              onChange={(event) =>
                updateForm("recurrence.until", event.target.value)
              }
              required
            />
          </Field>
        )}
      </Fieldset>

      <SubmitButton type="submit">
        {isEditing ? "Speichern" : "Erstellen"}
      </SubmitButton>
    </Form>
  );
}
