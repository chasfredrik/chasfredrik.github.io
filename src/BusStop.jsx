import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { Badge } from "react-bootstrap";

import ErrorBoundary from "./ErrorBoundary";
import ErrorContext from "./ErrorContext";
import ApiContext from "./ApiContext";

function ListBusStops({ Lista }) {
  if (Lista === null || Lista === undefined) return null;

  return (
    <table className="table table-hover">
      <thead data-testid="table-header">
        <tr className="table-primary">
          <th>Avstånd</th>
          <th>Hållplats</th>
          <th>Nästa avgång</th>
          <th>Destination</th>
        </tr>
      </thead>
      <tbody>
        {Lista.map((stop, index) => (
          <ErrorBoundary key={index}>
            <BusStop stop={stop.StopLocation} />
          </ErrorBoundary>
        ))}
      </tbody>
    </table>
  );
}

export function BusStop({ stop }) {
  const history = useHistory();
  const [nextDeparture, setNextDeparture] = useState("-");
  const client = useContext(ApiContext);
  const errorContext = useContext(ErrorContext);

  var siteId = stop.mainMastExtId.substring(5);

  useEffect(() => {
    function SetError(error) {
      errorContext.setErrorMsg({
        Text: "Misslyckades med att hämta avgångar",
        Error: error.message,
      });
    }

    client.GetNextDeparture(siteId).then(
      (res) => {
        setNextDeparture(res);
      },
      (err) => SetError(err)
    );
  }, [client, siteId]);

  return (
    <tr
      className="pointer"
      onClick={() => history.push(`/stop/${siteId}/${stop.name}`)}
    >
      <td>{stop.dist} m</td>
      <td>{stop.name}</td>
      <ErrorBoundary>
        <NextDeparture NextDep={nextDeparture} />
      </ErrorBoundary>
    </tr>
  );
}

export function NextDeparture({ NextDep }) {
  if (NextDep === undefined || NextDep === null || NextDep.length === 0)
    return (
      <td>
        <b>-</b>
      </td>
    );

  return (
    <>
      <td>{NextDep[0].DisplayTime}</td>
      <td>
        <Badge pill variant="danger">
          {NextDep[0].LineNumber}
        </Badge>{" "}
        {NextDep[0].Destination}
      </td>
    </>
  );
}

export default ListBusStops;
