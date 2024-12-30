import { useField } from "formik";
import { Form, Label } from "semantic-ui-react";
import DatePicker from "react-datepicker";

interface Props {
  name: string;
  placeholderText?: string;
  showTimeSelect?: boolean;
  timeCaption?: string;
  dateFormat?: string;
}

export default function MyDateInput(props: Props) {
  const [field, meta, helpers] = useField(props.name);

  return (
    <Form.Field error={meta.touched && !!meta.error}>
      <DatePicker
        placeholderText={props.placeholderText}
        {...field}
        selected={field.value ? new Date(field.value) : null}
        onChange={(date) => helpers.setValue(date)}
        onBlur={() => helpers.setTouched(true)}
        {...props}
      />
      {meta.touched && meta.error ? (
        <Label basic color="red">
          {meta.error}
        </Label>
      ) : null}
    </Form.Field>
  );
}
