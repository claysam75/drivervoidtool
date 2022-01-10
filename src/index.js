import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Container from 'react-bootstrap/Container';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import Alert from 'react-bootstrap/Alert';
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import ExplainModal from './ExplainModal';

function App() {
  const [driverLength, setDriverLength] = useState();
  const [driverHeight, setDriverHeight] = useState();
  const [driverWidth, setDriverWidth] = useState();

  const [apertureWidth, setApertureWidth] = useState();
  const [apertureDepth, setApertureDepth] = useState();
  const [voidDepth, setVoidDepth] = useState();

  const [presetValue, setPresetValue] = useState();

  const [alert, setAlert] = useState('');
  const [alertMsg, setAlertMsg] = useState('');
  const [alertType, setAlertType] = useState('');

  let driverAdj;

  const renderResult = (type, msg) => {
    if (alert) {
      return <Alert variant={type}>{msg}</Alert>;
    }
  };

  const handleCalculate = (evt) => {
    evt.preventDefault();
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
      driverAdj = Math.cos(maxDriverAngleRads) * driverLength;
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
        const requiredVoid = parseInt(driverAdj, 10) + 5;
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

  const handleDriverPreset = (val) => {
    setPresetValue(val);
    switch (val) {
      case '240A':
        setDriverLength(160);
        setDriverHeight(31);
        setDriverWidth(42);
        break;

      case '360A':
        setDriverLength(210);
        setDriverHeight(34);
        setDriverWidth(40);
        break;

      case '20MA-E1Z0D':
        setDriverLength(151);
        setDriverHeight(28);
        setDriverWidth(42);
        break;

      case '0':
        setDriverLength('');
        setDriverHeight('');
        setDriverWidth('');
        setPresetValue('');
        break;

      default:
        break;
    }
  };

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="#">
          <img
            src="plug.svg"
            width="30"
            height="30"
            fill="#ffffff"
            alt="plug icon"
          />{' '}
          Driver Void Tool
        </Navbar.Brand>
        <a
          href="https://github.com/claysam75/drivervoidtool"
          target="_blank"
          rel="noreferrer"
          className="ml-auto"
          style={{ color: 'white' }}
        >
          <img
            src="github-original.svg"
            width="30"
            height="30"
            fill="#ffffff"
            alt="github icon"
          />
        </a>
      </Navbar>
      <Container className="mt-3 mb-4 ml-4">
        <Alert variant="warning">
          This tool is still in BETA. The maths being done under the hood is
          still being tweaked so please do not trust the results 100%. <br />
          <br />
          It also assumes all drivers are perfectly rectangular, which we know
          isn't true, so there may be some wiggle room if the tool says the
          driver won't fit.
        </Alert>
        <h6>Common Driver Presets</h6>
        <ToggleButtonGroup
          type="radio"
          name="driverPresets"
          onChange={handleDriverPreset}
          value={presetValue}
        >
          <ToggleButton value={'240A'}>240A</ToggleButton>
          <ToggleButton value={'360A'}>360A</ToggleButton>
          <ToggleButton value={'20MA-E1Z0D'}>20MA-E1Z0D</ToggleButton>
          <ToggleButton value={'0'}>Clear</ToggleButton>
        </ToggleButtonGroup>
        <hr></hr>
        <Form onSubmit={handleCalculate}>
          <Form.Row>
            <Col>
              <Form.Label>Driver Length (mm)</Form.Label>
              <InputGroup>
                <Form.Control
                  type="number"
                  onChange={(e) => setDriverLength(e.target.value)}
                  value={driverLength}
                  required
                ></Form.Control>

                <InputGroup.Append>
                  <InputGroup.Text>mm</InputGroup.Text>
                </InputGroup.Append>
              </InputGroup>
              <Form.Text muted>Longest driver dimension</Form.Text>
            </Col>
            <Col>
              <Form.Label>Driver Height (mm)</Form.Label>
              <InputGroup>
                <Form.Control
                  type="number"
                  onChange={(e) => setDriverHeight(e.target.value)}
                  value={driverHeight}
                  required
                ></Form.Control>
                <InputGroup.Append>
                  <InputGroup.Text>mm</InputGroup.Text>
                </InputGroup.Append>
              </InputGroup>
              <Form.Text muted>
                Whichever is the shortest out of the driver width/depth.
                Maximises chances of driver fitting.
              </Form.Text>
            </Col>
            <Col>
              <Form.Label>Driver Width (mm)</Form.Label>
              <InputGroup>
                <Form.Control
                  type="number"
                  onChange={(e) => setDriverWidth(e.target.value)}
                  value={driverWidth}
                  required
                ></Form.Control>
                <InputGroup.Append>
                  <InputGroup.Text>mm</InputGroup.Text>
                </InputGroup.Append>
              </InputGroup>
              <Form.Text muted>Remaining driver dimension.</Form.Text>
            </Col>
          </Form.Row>

          <Form.Row className="pt-3">
            <Col>
              <Form.Label>Aperture Diameter (mm)</Form.Label>
              <InputGroup>
                <Form.Control
                  type="number"
                  onChange={(e) => setApertureWidth(e.target.value)}
                  value={apertureWidth}
                  required
                ></Form.Control>
                <InputGroup.Append>
                  <InputGroup.Text>mm</InputGroup.Text>
                </InputGroup.Append>
              </InputGroup>
              <Form.Text muted>
                Smallest opening which the driver must fit through. Be careful
                with plaster in fittings.
              </Form.Text>
            </Col>
            <Col>
              <Form.Label>Aperture Depth (mm)</Form.Label>
              <InputGroup>
                <Form.Control
                  type="number"
                  onChange={(e) => setApertureDepth(e.target.value)}
                  value={apertureDepth}
                  required
                ></Form.Control>
                <InputGroup.Append>
                  <InputGroup.Text>mm</InputGroup.Text>
                </InputGroup.Append>
              </InputGroup>
              <Form.Text muted>
                The vertical depth which the driver must travel through, ie
                plaster board, plaster in kit. Be careful with plaster in
                fittings. DOUBLE PLASTER BOARD CEILINGS ARE COMMON. NOT UNREASONABLE TO
                ASSUME WORST CASE SCENARIO OF 24MM DEPTH.{' '}
              </Form.Text>
            </Col>
            <Col>
              <Form.Label>Void depth (mm)</Form.Label>
              <InputGroup>
                <Form.Control
                  type="number"
                  onChange={(e) => setVoidDepth(e.target.value)}
                  value={voidDepth}
                  required
                ></Form.Control>
                <InputGroup.Append>
                  <InputGroup.Text>mm</InputGroup.Text>
                </InputGroup.Append>
              </InputGroup>
              <Form.Text muted>
                Void depth you are testing for. From top side of ceiling build
                up to upper restriction (ie joist, conduit etc).
              </Form.Text>
            </Col>
          </Form.Row>
          <Button variant="primary" className="mt-3" type="submit">
            Calculate
          </Button>
        </Form>
        <hr></hr>
        {renderResult(alertType, alertMsg)}
        <ExplainModal />
      </Container>
    </>
  );
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
