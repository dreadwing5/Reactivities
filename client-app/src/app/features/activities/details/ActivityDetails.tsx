import { Grid } from "semantic-ui-react";

import { useStore } from "../../../stores/store";
import LoadingComponent from "../../../layout/LoadingComponent";
import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import ActivityDetailsHeader from "./ActivityDetailsHeader";
import ActivityDetailsInfo from "./ActivityDetailsInfo";
import ActivityDetailsChat from "./ActivityDetailsChat";
import ActivityDetailsSidebar from "./ActivityDetailsSidebar";

export default observer(function ActivityDetails() {
  const { activityStore } = useStore();

  const {
    selectedActivity: activity,
    loadActivity,
    loadingInitial,
    clearSelectedActivity,
  } = activityStore;

  const { id } = useParams();

  useEffect(() => {
    if (id) loadActivity(id);
    return () => clearSelectedActivity();
  }, [id, loadActivity, clearSelectedActivity]);

  if (loadingInitial || !activity) return <LoadingComponent content={""} />;

  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityDetailsHeader activity={activity} />
        <ActivityDetailsInfo activity={activity} />
        <ActivityDetailsChat activityId={activity.id} />
      </Grid.Column>

      <Grid.Column width={6}>
        <ActivityDetailsSidebar activity={activity} />
      </Grid.Column>
    </Grid>
  );
});
