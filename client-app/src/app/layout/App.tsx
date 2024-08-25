import { Container } from "semantic-ui-react";
import NavBar from "./NavBar";
import { observer } from "mobx-react-lite";
import { Outlet, useLocation } from "react-router-dom";
import HomePage from "../features/home/HomePage";

const App = () => {
  const location = useLocation();
  return (
    <>
      {location.pathname === "/" ? (
        <HomePage />
      ) : (
        <>
          <NavBar />
          <Container style={{ marginTop: "7em" }}>
            <Outlet />
          </Container>
        </>
      )}
    </>
  );
};

export default observer(App);

/* 

1.Outlet -> Swapped with the actual component




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
