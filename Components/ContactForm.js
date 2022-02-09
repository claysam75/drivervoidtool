import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';

const ContactForm = () => {
  const [show, setShow] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactText, setContactText] = useState('');
  const [contactSubject, setContactSubject] = useState('');

  const handleShow = () => {
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
  };

  const testButton = () => {
    fetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify({ key: 'value' }),
    });
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    await axios.post(
      '/api/contact',
      { contactEmail, contactName, contactSubject, contactText },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  };
  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Contact
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard="false"
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Contact</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Alert variant="warning">
              If submitting a driver preset request, please attach the driver
              datasheet to the contact form.
            </Alert>
            <Form onSubmit={handleContactSubmit}>
              <Row className="mt-3">
                <Col>
                  <Form.Group>
                    <Form.Label>Your name</Form.Label>
                    <Form.Control
                      type="text"
                      value={contactName}
                      required
                      onChange={(e) => setContactName(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Your email</Form.Label>
                    <Form.Control
                      type="email"
                      value={contactEmail}
                      required
                      onChange={(e) => setContactEmail(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mt-3">
                <Form.Group>
                  <Form.Label>Subject</Form.Label>
                  <Form.Control
                    type="text"
                    value={contactSubject}
                    required
                    onChange={(e) => setContactSubject(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Row>
              <Row className="mt-3">
                <Form.Group>
                  <Form.Label>Message</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    required
                    onChange={(e) => setContactText(e.target.value)}
                    value={contactText}
                  ></Form.Control>
                </Form.Group>
              </Row>
              <Row className="mt-3">
                <Form.Group>
                  <Form.Label>File Upload</Form.Label>
                  <Form.Control type="file"></Form.Control>
                </Form.Group>
              </Row>
              <Row className="mt-3">
                <hr />

                <Button type="submit">Submit</Button>
              </Row>
            </Form>
          </Container>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ContactForm;
