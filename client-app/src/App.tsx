import { useEffect, useState } from "react";

import "./App.css";

import { Header, List } from "semantic-ui-react";
import axios from "axios";

function App() {
  const [activites, setActivites] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/activities").then((response) => {
      setActivites(response.data);
    });
  }, []);
  return (
    <>
      <Header as="h2" icon="users" content="Reactivities" />

      <List>
        {activites.map((activity: any) => (
          <List.Item key={activity.id}>{activity.title}</List.Item>
        ))}
      </List>
    </>
  );
}

export default App;
