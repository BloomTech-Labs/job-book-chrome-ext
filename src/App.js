import React from "react";
import "semantic-ui-css/semantic.min.css";
import { Button, Form, Header, Container } from "semantic-ui-react";

function App() {
  return (
    <Container>
      <Header as="h3">Save this Job</Header>
      <Form>
        <Form.Field>
          <label>Company Name</label>
          <input placeholder="Company Name" />
        </Form.Field>
        <Form.Field>
          <label>Job Title</label>
          <input placeholder="Job Title" />
        </Form.Field>
        <Form.Field>
          <label>Job Link</label>
          <input placeholder="Job Link" />
        </Form.Field>
        <Form.Field>
          <label>Location</label>
          <input placeholder="Location" />
        </Form.Field>
        <Form.Field>
          <label>Job Rating</label>
          <input placeholder="Job Rating" />
        </Form.Field>
        <Form.Group grouped>
          <label>"Pin" Job Rating</label>
          <Form.Field label="1" control="input" type="checkbox" />
          <Form.Field label="2" control="input" type="checkbox" />
          <Form.Field label="3" control="input" type="checkbox" />
        </Form.Group>
        <Form.TextArea>
          <label>Description</label>
          <input placeholder="Description" />
        </Form.TextArea>
        <Button type="submit">Submit</Button>
      </Form>
    </Container>
  );
}

export default App;
