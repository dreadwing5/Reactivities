import { Button, Header, Segment } from "semantic-ui-react";

import { useStore } from "../../stores/store";
import { observer } from "mobx-react-lite";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import MyTextInput from "../../common/form/MyTextInput";
import MyTextArea from "../../common/form/MyTextArea";
import { Profile } from "../../models/profile";
interface Props {
  setEditMode: (editMode: boolean) => void;
}
export default observer(function ProfileForm({ setEditMode }: Props) {
  const {
    profileStore: { profile, updateProfile },
  } = useStore();

  const validationSchema = Yup.object({
    displayName: Yup.string().required("The display name is required"),
  });

  function handleFormSubmit(profile: Partial<Profile>) {
    updateProfile(profile);
    setEditMode(false);
  }

  return (
    <Segment clearing>
      <Header content="Profile Details" sub color="teal" />
      <Formik
        validationSchema={validationSchema}
        initialValues={profile ?? {}}
        onSubmit={(values) => handleFormSubmit(values)}
      >
        {({ handleSubmit, isValid, isSubmitting, dirty }) => (
          <Form className="ui form" onSubmit={handleSubmit} autoComplete="off">
            <MyTextInput name="displayName" placeholder="Display Name" />
            <MyTextArea
              rows={3}
              placeholder="Add a short bio about yourself"
              name="bio"
            />

            <Button
              disabled={isSubmitting || !dirty || !isValid}
              loading={isSubmitting}
              floated="right"
              positive
              type="submit"
              content="Update profile"
            />
            <Button
              onClick={() => setEditMode(false)}
              floated="right"
              type="button"
              content="Cancel"
              disabled={isSubmitting}
            />
          </Form>
        )}
      </Formik>
    </Segment>
  );
});
