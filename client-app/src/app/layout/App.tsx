import { useEffect, useState } from "react";
import { Container } from "semantic-ui-react";
import { Activity } from "../models/activity";
import NavBar from "./NavBar";
import ActivityDashboard from "../features/activities/dashboard/ActivityDashboard";
import { v4 as uuid } from "uuid";
import agent from "../api/agent";
import LoadingComponent from "./LoadingComponent";

function App() {
  const [activities, setActivites] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<
    Activity | undefined
  >(undefined);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submiting, setSubmiting] = useState(false);

  useEffect(() => {
    agent.Activities.list().then((response) => {
      let activities: Activity[] = [];

      //Temporary Solution

      response.forEach((activity) => {
        activity.date = activity.date.split("T")[0];
        activities.push(activity);
      });

      setLoading(false);
      setActivites(response);
    });
  }, []);

  function handleSelectActivity(id: string) {
    setSelectedActivity(activities.find((x) => x.id === id));
    handleFormClose();

    // why can't we use index here. Instead of finding that particular object

    //TODO : OPTIMISE this but will impact during pagination
  }

  function handleCancelSelectActivity() {
    setSelectedActivity(undefined);
  }

  function handleFormOpen(id?: string) {
    id ? handleSelectActivity(id) : handleCancelSelectActivity();
    setEditMode(true);
  }

  function handleFormClose() {
    setEditMode(false);
  }

  function handleCreateOrEditActivity(activity: Activity) {
    setSubmiting(true);

    if (activity.id) {
      agent.Activities.update(activity).then(() => {
        setActivites([
          ...activities.filter((x) => x.id !== activity.id),
          activity,
        ]);
        setSelectedActivity(activity);
        setEditMode(false);
        setSubmiting(false);
      });
    } else {
      activity.id = uuid();
      agent.Activities.create(activity).then(() => {
        setActivites([...activities, activity]);
      });
      setSelectedActivity(activity);
      setEditMode(false);
      setSubmiting(false);
    }
    // activity.id
    //   ? setActivites([
    //       ...activities.filter((x) => x.id !== activity.id),
    //       activity,
    //     ])
    //   : setActivites([...activities, { ...activity, id: uuid() }]);

    // setEditMode(false);
    // setSelectedActivity(activity);
  }

  function handleDeleteActivity(id: string) {
    setSubmiting(true);
    agent.Activities.delete(id).then(() => {
      setActivites([...activities.filter((x) => x.id !== id)]);
      setSubmiting(false);
    });
  }

  if (loading) return <LoadingComponent content="Loading app" />;

  return (
    <>
      <NavBar openForm={handleFormOpen} />
      <Container style={{ marginTop: "7em" }}>
        <ActivityDashboard
          activities={activities}
          selectedActivity={selectedActivity}
          selectActivity={handleSelectActivity}
          cancelSelectActivity={handleCancelSelectActivity}
          editMode={editMode}
          openForm={handleFormOpen}
          closeForm={handleFormClose}
          createOrEdit={handleCreateOrEditActivity}
          deleteActivity={handleDeleteActivity}
          submiting={submiting}
        />
      </Container>
    </>
  );
}

export default App;

/* 


Clean Architecture


1. Independent from framework
2. Testable
3. Independent from the interface
4. Independent from the database

CQRS -. Command Query Speration


Command : 


Does Something
Modifies State
Should not return a value


Query : 

Answers a question 
Does not not modify state
Returns a value


*/
