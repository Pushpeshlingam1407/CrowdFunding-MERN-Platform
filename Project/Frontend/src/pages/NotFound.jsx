import React from "react";
import { useNavigate } from "react-router-dom";

import { Button, Container, Flex } from "../components/ui";
import "./NotFound.css";



const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="notfound-wrapper">
      <Container>
        <Flex justify="center">
          <div className="notfound-content">
            <h1 className="notfound-code">404</h1>
            <h2 className="notfound-title">Identity Lost</h2>
            <p className="notfound-text">
              The resource you are looking for has either been moved, updated,
              or does not exist in our system registry.
            </p>
            <Button
              onClick={() => navigate("/")}
              className="not-found-return-btn"
            >
              Return to Registry
            </Button>
          </div>
        </Flex>
      </Container>
    </div>
  );
};

export default NotFound;
