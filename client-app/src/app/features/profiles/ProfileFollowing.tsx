import { observer } from "mobx-react-lite";

import { useStore } from "../../stores/store";
import { Card, Header } from "semantic-ui-react";
import { Tab } from "semantic-ui-react";
import { Grid } from "semantic-ui-react";
import ProfileCard from "./ProfileCard";

export default observer(function ProfileFollowing() {
  const { profileStore } = useStore();
  const { profile, followings, loadingFollowings, activeTab } = profileStore;

  return (
    <>
      <Tab.Pane loading={loadingFollowings}>
        <Grid>
          <Grid.Column width={16}>
            <Header
              floated="left"
              icon="user"
              content={
                activeTab === 3
                  ? `People following ${profile?.displayName}`
                  : `People followed by ${profile?.displayName}`
              }
            />
          </Grid.Column>
          <Grid.Column width={16}>
            <Card.Group itemsPerRow={4}>
              {followings.map((profile) => (
                <ProfileCard key={profile.username} profile={profile} />
              ))}
            </Card.Group>
          </Grid.Column>
        </Grid>
      </Tab.Pane>
    </>
  );
});
