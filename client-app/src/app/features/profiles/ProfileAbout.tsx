import { observer } from "mobx-react-lite";
import { useStore } from "../../stores/store";
import { useState } from "react";
import ProfileEditForm from "./ProfileEditForm";
import { Button, Grid, Header } from "semantic-ui-react";
import { Tab } from "semantic-ui-react";

export default observer(function ProfileAbout() {
  const {
    profileStore: { profile, isCurrentUser },
  } = useStore();

  const [editMode, setEditMode] = useState(false);

  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16}>
          <Header
            floated="left"
            icon="user"
            content={`About ${profile?.displayName}`}
          />

          {isCurrentUser && (
            <Button
              floated="right"
              basic
              content={editMode ? "Cancel" : "Edit Profile"}
              onClick={() => setEditMode(!editMode)}
            />
          )}
        </Grid.Column>

        <Grid.Column width="16">
          {editMode ? (
            <ProfileEditForm setEditMode={setEditMode} />
          ) : (
            <span style={{ whiteSpace: "pre-wrap" }}>{profile?.bio}</span>
          )}
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
});
