import { useEffect, useState } from "react";
import { Container } from "semantic-ui-react";
import axios from "axios";
import { Activity } from "../models/activity";
import NavBar from "./NavBar";
import ActivityDashboard from "../features/activities/dashboard/ActivityDashboard";
import { v4 as uuid } from "uuid";

function App() {
  const [activities, setActivites] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<
    Activity | undefined
  >(undefined);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    axios
      .get<Activity[]>("http://localhost:5000/api/activities")
      .then((response) => {
        setActivites(response.data);
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
    activity.id
      ? setActivites([
          ...activities.filter((x) => x.id !== activity.id),
          activity,
        ])
      : setActivites([...activities, { ...activity, id: uuid() }]);

    setEditMode(false);
    setSelectedActivity(activity);
  }

  function handleDeleteActivity(id: string) {
    setActivites([...activities.filter((x) => x.id !== id)]);
  }

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
