import Head from '../Components/head';
import Image from 'next/image';
import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import Navbar from 'react-bootstrap/Navbar';
import Table from 'react-bootstrap/Table';
import Accordion from 'react-bootstrap/Accordion';
import plug from '../public/plug.svg';
import { nanoid } from 'nanoid';

export default function Home() {
  const [driverLength, setDriverLength] = useState();
  const [driverHeight, setDriverHeight] = useState();
  const [driverWidth, setDriverWidth] = useState();

  const [apertureWidth, setApertureWidth] = useState();
  const [apertureDepth, setApertureDepth] = useState();
  const [voidDepth, setVoidDepth] = useState();

  const [useCableRadius, setUseCableRadius] = useState('on');

  const [alert, setAlert] = useState('');
  const [alertMsg, setAlertMsg] = useState('');
  const [alertType, setAlertType] = useState('');

  let driverAdj;

  const tableHeaders = [
    'Name',
    'Description',
    'Wattage',
    'DALI Version',
    'DALI Type',
    'Outputs',
    'Select',
  ];

  const presets = [
    {
      name: 'EldoLED 240A',
      description: 'Standard 20W single colour downlight driver.',
      wattage: '20W',
      dVersion: 'DALI-2',
      dType: 'DT-6',
      outputs: 1,
      selectId: '240A',
      length: '160',
      width: '42',
      height: '31',
    },
    {
      name: 'EldoLED 360A',
      description: 'Standard 30W single colour downlight driver.',
      wattage: '30W',
      dVersion: 'DALI-2',
      dType: 'DT-6',
      outputs: 1,
      selectId: '360A',
      length: '210',
      width: '40',
      height: '34',
    },
    {
      name: 'EldoLED 20MA-E1Z0D',
      description: '20W DALI-2 DT6 Single Colour',
      wattage: '20W',
      dVersion: 'DALI-2',
      dType: 'DT-6',
      outputs: 1,
      selectId: '20MA-E1Z0D',
      length: '151',
      width: '42',
      height: '28',
    },
    {
      name: 'EldoLED 20MA-E2Z0C',
      description: '20W DALI-2 DT8 Dual Colour',
      wattage: '20W',
      dVersion: 'DALI-2',
      dType: 'DT-8',
      outputs: 2,
      selectId: '20MA-E2Z0C',
      length: '184',
      width: '42',
      height: '30',
    },
    {
      name: 'Liteplan NLP/1/TP40',
      description: 'Emergency Pack',
      wattage: 'NA',
      dVersion: 'NA',
      dType: 'NA',
      outputs: 1,
      selectId: 'TP40',
      length: '231',
      width: '34',
      height: '23',
    },
  ];

  const renderResult = (type, msg) => {
    if (alert) {
      return <Alert variant={type}>{msg}</Alert>;
    }
  };

  const handlePreset2 = (evt) => {
    evt.preventDefault();
    let key = evt.target.id;

    let keyObject = presets.find((preset) => preset.selectId === key);

    console.log(keyObject);

    setDriverLength(keyObject.length);
    setDriverHeight(keyObject.height);
    setDriverWidth(keyObject.width);
  };

  const handleCalculate = (evt) => {
    evt.preventDefault();
    //check if including cable radius
    if (useCableRadius) {
    }
    const endHypotenuse = Math.sqrt(driverWidth ** 2 + driverHeight ** 2);
    console.log('End hypotenuse = ' + endHypotenuse + 'mm');
    //check if driver can fit through cutout at all
    if (endHypotenuse > apertureWidth) {
      setAlertType('danger');
      setAlertMsg('Driver too wide for cutout');
      setAlert(1);
    } else {
      //find aperture hypotenuse
      const apertureHyp = Math.sqrt(apertureWidth ** 2 + apertureDepth ** 2);
      console.log('Aperture Hyp = ' + apertureHyp);
      // find aperture hyp angle
      const apertureHypAngle =
        (Math.asin(apertureDepth / apertureHyp) * 180) / Math.PI;
      console.log('Aperture Hyp Angle = ' + apertureHypAngle);
      // find max driver angle
      const maxDriverAngle =
        (Math.acos(driverHeight / apertureHyp) * 180) / Math.PI -
        apertureHypAngle;
      console.log('Max driver angle = ' + maxDriverAngle);
      // check if driver can make turn
      const maxDriverAngleRads = (maxDriverAngle * Math.PI) / 180;
      console.log('Max driver angle rads =  ' + maxDriverAngleRads);
      driverAdj =
        Math.cos(maxDriverAngleRads) *
        (useCableRadius ? parseInt(driverLength) + 40 : driverLength);
      console.log('Driver adjacent = ' + driverAdj);
      if (driverAdj <= voidDepth) {
        setAlertType('success');

        setAlertMsg(
          'Driver will fit this aperture/void combo. Minimum depth required is ' +
            Math.round(driverAdj) +
            'mm.'
        );
        setAlert(1);
      } else if (driverAdj >= voidDepth) {
        const requiredVoid = parseInt(driverAdj, 10);
        setAlertType('danger');
        setAlertMsg(
          'Driver will not fit this aperture/void combo. Void depth of at least ' +
            requiredVoid +
            'mm required for this driver/aperture combo.'
        );
        setAlert(1);
      }
    }
  };

  return (
    <div>
      <Head title="Driver Void Tool"></Head>
      <>
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand href="#">
            <Image src={plug} alt="electrical plug logo" height="30"></Image>{' '}
            Driver Void Tool
          </Navbar.Brand>
        </Navbar>
        <Container className="mt-3 mb-4 ml-4">
          <Alert variant="warning">
            This tool is still in BETA. The maths being done under the hood is
            still being tweaked so please do not trust the results 100%.
          </Alert>

          <Accordion>
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                <h5>Common Driver Presets</h5>
              </Accordion.Header>
              <Accordion.Body>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      {tableHeaders.map((header) => (
                        <th key={nanoid()}>{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {presets.map((preset) => (
                      <tr key={nanoid()}>
                        <td>{preset.name}</td>
                        <td>{preset.description}</td>
                        <td>{preset.wattage}</td>
                        <td>{preset.dVersion}</td>
                        <td>{preset.dType}</td>
                        <td>{preset.outputs}</td>
                        <td>
                          <Button
                            variant="outline-primary"
                            id={preset.selectId}
                            onClick={handlePreset2}
                          >
                            Select
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          <hr></hr>
          <Form onSubmit={handleCalculate}>
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>Driver Length (mm)</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="number"
                      onChange={(e) => setDriverLength(e.target.value)}
                      value={driverLength}
                      min={0}
                      required
                    ></Form.Control>
                    <InputGroup.Text>mm</InputGroup.Text>
                  </InputGroup>
                  <Form.Text>Longest driver dimension</Form.Text>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Driver Height (mm)</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="number"
                      onChange={(e) => setDriverHeight(e.target.value)}
                      value={driverHeight}
                      min={0}
                      required
                    ></Form.Control>
                    <InputGroup.Text>mm</InputGroup.Text>
                  </InputGroup>
                  <Form.Text>
                    Whichever is the shortest out of the driver width/height.
                    Maximises chances of driver fitting.
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Driver Width (mm)</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="number"
                      onChange={(e) => setDriverWidth(e.target.value)}
                      value={driverWidth}
                      min={0}
                      required
                    ></Form.Control>
                    <InputGroup.Text>mm</InputGroup.Text>
                  </InputGroup>
                  <Form.Text>Remaining driver dimension.</Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>Aperture Diameter (mm)</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="number"
                      onChange={(e) => setApertureWidth(e.target.value)}
                      value={apertureWidth}
                      min={0}
                      required
                    ></Form.Control>

                    <InputGroup.Text>mm</InputGroup.Text>
                  </InputGroup>
                  <Form.Text muted>
                    Smallest opening which the driver must fit through. Be
                    careful with plaster in fittings.
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Aperture Depth (mm)</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="number"
                      onChange={(e) => setApertureDepth(e.target.value)}
                      value={apertureDepth}
                      min={0}
                      required
                    ></Form.Control>

                    <InputGroup.Text>mm</InputGroup.Text>
                  </InputGroup>
                  <Form.Text muted>
                    The vertical depth which the driver must travel through, ie
                    plaster board, plaster in kit. Be careful with plaster in
                    fittings. DOUBLE PLASTER BOARD CEILINGS ARE COMMON. NOT
                    UNREASONABLE TO ASSUME WORST CASE SCENARIO OF 24MM DEPTH.{' '}
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col>
                <Form.Label>Void depth (mm)</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="number"
                    onChange={(e) => setVoidDepth(e.target.value)}
                    value={voidDepth}
                    min={0}
                    required
                  ></Form.Control>

                  <InputGroup.Text>mm</InputGroup.Text>
                </InputGroup>
                <Form.Text muted>
                  Void depth you are testing for. From top side of ceiling build
                  up to upper restriction (ie joist, conduit etc).
                </Form.Text>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Label>Include cable bend radius (40mm)</Form.Label>
                <Form.Group>
                  <Form.Check
                    type="switch"
                    controlId="cableRadiusCheck"
                    checked={useCableRadius}
                    onChange={(e) => setUseCableRadius(e.target.checked)}
                  ></Form.Check>
                </Form.Group>
              </Col>
            </Row>
            <div className="d-grid gap-2">
              <Button
                variant="primary"
                className="mt-3 "
                size="lg"
                type="submit"
              >
                Calculate
              </Button>
            </div>
          </Form>
          <hr></hr>
          {renderResult(alertType, alertMsg)}
        </Container>
      </>
    </div>
  );
}
