import React, { useEffect, useState, useRef, useContext } from "react";
import { Container, Row, Col, Alert, Overlay, Popover } from "react-bootstrap";

import ErrorBoundary from "./ErrorBoundary";
import ErrorContext from "./ErrorContext";
import ApiContext from "./ApiContext";
import ListBusStops from "./BusStop";

function Home() {
  const [location, setLocation] = useState(null);
  const [stopList, setStopList] = useState([]);
  const [useLocation, setUseLocation] = useState(false);
  const [errorMsg, setErrorMsg] = useState({});
  const [address, setAddress] = useState("");
  const [showAddressAlternatives, setShowAddressAlternatives] = useState([]);
  const target = useRef(null);
  const client = useContext(ApiContext);

  useEffect(() => {
    if (location !== null) {
      client.UpdateStopInfo(location).then(
        (res) => {
          setStopList(res);
        },
        (err) => {
          setErrorMsg({
            Text: "Misslyckades med att hämta hållplatser",
            Error: err.message,
          });
        }
      );
    }
  }, [client, location]);

  function HandleUseLocationChanged(event) {
    if (event.target.checked) {
      setStopList([]);
      FetchUserLocation();
    } else {
      setUseLocation(false);
      setLocation(null);
    }
  }

  async function HandleAddressChange(event) {
    if (event.target.value.length === 0) return;

    var address = event.target.value;

    setAddress(address);

    if (address.length > 2) {
      // Visa alternativen
      client.LookupPlaces(address).then(
        (res) => setShowAddressAlternatives(res),
        (err) =>
          setErrorMsg({
            Text: "Misslyckades med att hämta adresser",
            Error: err.message,
          })
      );
    }
  }

  return (
    <>
      <ErrorContext.Provider value={{ errorMsg, setErrorMsg }}>
        <Container>
          <Row>
            <Col>
              <div className="jumbotron">
                <h1>När går nästa buss?</h1>
              </div>
            </Col>
          </Row>
          <Row>
            <Col xs="6" md="3">
              <div className="custom-control custom-switch">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id="customSwitch1"
                  checked={useLocation}
                  onChange={HandleUseLocationChanged}
                />
                <label className="custom-control-label" htmlFor="customSwitch1">
                  Använd min plats
                </label>
              </div>
            </Col>
            <Col xs="6" md="4">
              <div className="form-group" hidden={useLocation}>
                <input
                  data-testid="Adress"
                  className="form-control form-control-sm"
                  type="text"
                  placeholder="Adress"
                  id="inputSmall"
                  value={address}
                  onChange={HandleAddressChange}
                  ref={target}
                />
              </div>
              <ErrorBoundary>
                <Overlay
                  show={showAddressAlternatives.length > 0}
                  target={target.current}
                  placement="bottom"
                  containerPadding={20}
                >
                  <Popover id="popover-contained">
                    <Popover.Content>
                      {showAddressAlternatives.map((address, key) => {
                        return (
                          <div
                            key={key}
                            className="pointer"
                            onClick={() => {
                              setAddress(address.Name);
                              HandleAddressChosen(address);
                            }}
                          >
                            {address.Type === "Station" ? "(H) " : ""}
                            {address.Name}
                          </div>
                        );
                      })}
                    </Popover.Content>
                  </Popover>
                </Overlay>
              </ErrorBoundary>
            </Col>
          </Row>
          <Row hidden={Object.keys(errorMsg).length === 0}>
            <Col xs="6">
              <Alert
                variant="danger"
                dismissible
                onClose={() => setErrorMsg({})}
              >
                <strong>{errorMsg.Text}</strong>
                <br />
                <i>{errorMsg.Error}</i>
              </Alert>
            </Col>
          </Row>
          <Row>
            <Col>
              <ErrorBoundary>
                <ListBusStops Lista={stopList}></ListBusStops>
              </ErrorBoundary>
            </Col>
          </Row>
        </Container>
      </ErrorContext.Provider>
    </>
  );

  function FetchUserLocation() {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        setUseLocation(true);
        setLocation(position.coords);
      },
      function (error) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setErrorMsg({ Text: "Saknar behörighet att hämta din position" });
            break;
          case error.POSITION_UNAVAILABLE:
            setErrorMsg({ Text: "Kunde ej hämta din position" });
            break;
          case error.TIMEOUT:
            setErrorMsg({ Text: "Kunde ej hämta din position" });
            break;
          default:
        }
      }
    );
  }

  async function HandleAddressChosen(site) {
    setShowAddressAlternatives([]);
    setStopList([]);
    client
      .UpdateStopInfo({
        latitude: site.Y.substring(0, 2) + "." + site.Y.substring(2),
        longitude: site.X.substring(0, 2) + "." + site.X.substring(2),
      })
      .then((res) => {
        setStopList(res);
      });
  }
}

export default Home;
