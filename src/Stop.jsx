import React from "react";
import { Container, Row, Col, Alert, Badge } from "react-bootstrap";

import ErrorBoundary from "./ErrorBoundary";
import ApiContext from "./ApiContext";

class Stop extends React.Component {
  static contextType = ApiContext;

  constructor(props) {
    super(props);
    this.state = { errorMsg: {}, nextStops: [] };
  }

  componentDidMount() {
    var siteId = this.props.match.params.siteId;

    try {
      this.context
        .GetNextDeparture(siteId)
        .then((res) =>
          this.setState((state) => ({ ...state, nextStops: res }))
        );
    } catch (err) {
      this.setState((state) => ({
        ...state,
        errorMsg: {
          Text: "Misslyckades med att hämta avgångar",
          Error: err.message,
        },
      }));
    }
  }

  render() {
    const ClearError = () => {
      this.setState((state) => ({
        ...state,
        errorMsg: {},
      }));
    };

    return (
      <Container>
        <Row>
          <Col>
            <div className="jumbotron">
              <h4>När går nästa buss från</h4>
              <h1>{this.props.match.params.siteName}</h1>
            </div>
          </Col>
        </Row>
        <Row hidden={Object.keys(this.state.errorMsg).length === 0}>
          <Col xs="6">
            <Alert variant="danger" dismissible onClose={ClearError}>
              <strong>{this.state.errorMsg.Text}</strong>
              <br />
              <i>{this.state.errorMsg.Error}</i>
            </Alert>
          </Col>
        </Row>
        <Row>
          <Col>
            <table className="table table-hover">
              <thead>
                <tr className="table-primary">
                  <th>Avgång</th>
                  <th>Linje</th>
                  <th>Destination</th>
                </tr>
              </thead>
              <tbody>
                {this.state.nextStops.map((stop, index) => (
                  <ErrorBoundary key={index}>
                    <Departure stop={stop} />
                  </ErrorBoundary>
                ))}
                {this.state.nextStops.length === 0 ? (
                  <tr>
                    <td colSpan="4">Inga avgångar närmaste timmen</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </Col>
        </Row>
      </Container>
    );
  }
}

class Departure extends React.Component {
  render() {
    var stop = this.props.stop;

    return (
      <tr>
        <td>{stop.DisplayTime}</td>
        <td>
          <Badge pill variant="danger">
            {stop.LineNumber}
          </Badge>
        </td>
        <td>{stop.Destination}</td>
      </tr>
    );
  }
}

export default Stop;
