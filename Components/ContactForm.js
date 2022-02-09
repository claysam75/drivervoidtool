import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';
import axios from 'axios';
import ReCAPTCHA from 'react-google-recaptcha';

const ContactForm = () => {
  const [show, setShow] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactText, setContactText] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactPending, setContactPending] = useState(false);
  const [contactAlert, setContactAlert] = useState(false);
  const [contactAlertVariant, setContactAlertVariant] = useState('');
  const [contactAlertMessage, setContactAlertMessage] = useState('');

  const handleShow = () => {
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setContactName('');
    setContactEmail('');
    setContactSubject('');
    setContactText('');
    setContactAlert(false);
    setContactAlertVariant('');
    setContactAlertMessage('');
  };

  const handleContactAlert = (show) => {
    if (show) {
      return (
        <Alert className="mt-3" variant={contactAlertVariant}>
          {contactAlertMessage}
        </Alert>
      );
    } else {
      return <></>;
    }
  };

  const handleContactSubmitButtonContents = (loading) => {
    if (loading) {
      return (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      );
    } else {
      return 'Submit';
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactPending(true);
    await axios
      .post(
        '/api/contact',
        { contactEmail, contactName, contactSubject, contactText },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      .then(() => {
        setContactPending(false);
        setContactAlertVariant('success');
        setContactAlertMessage('Email sent successfully.');
        setContactAlert(true);
      })
      .catch((error) => {
        console.log('contact form response = ' + error.response.status);
        switch (error.response.status) {
          case 403:
            setContactPending(false);
            setContactAlertVariant('danger');
            setContactAlertMessage('Recaptcha verification required');
            setContactAlert(true);

            break;
          case 500:
            setContactPending(false);
            setContactAlertVariant('warning');
            setContactAlertMessage(
              'Server error - please try again later. If the issue persists please email directly at contact@drivervoidtool.samclay.uk'
            );
            setContactAlert(true);
            break;
        }
      });
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
            {/* <Alert variant="warning">
              If submitting a driver preset request, please attach the driver
              datasheet to the contact form.
            </Alert> */}
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
              {/* <Row className="mt-3">
                <Form.Group>
                  <Form.Label>File Upload</Form.Label>
                  <Form.Control type="file"></Form.Control>
                </Form.Group>
              </Row> */}
              <Row className="mt-3">
                <hr />
                <Row>
                  <ReCAPTCHA
                    size="normal"
                    sitekey="6LebkmseAAAAAN6Vbr5ea2bDcuNmoIly0Jf3mZjb"
                  />
                </Row>

                <Button type="submit" className="mt-3">
                  {handleContactSubmitButtonContents(contactPending)}
                </Button>
              </Row>
              <Row>{handleContactAlert(contactAlert)}</Row>
            </Form>
          </Container>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ContactForm;
