import React from "react";
import { waitFor, render } from "@testing-library/react";

import CreateMockedClient from "./TestHelpers";
import ApiContext from "./ApiContext";
import ListBusStops, { NextDeparture } from "./BusStop";

jest.mock("@happycoderse/js-sl-api");

it("renders without crashing", () => {
  const { asFragment } = render(<ListBusStops />);
  expect(asFragment).toMatchSnapshot();
});

it("table has header row", () => {
  const page = render(<ListBusStops Lista={[]} />);
  expect(page.getByTestId("table-header")).toContainHTML(
    '<thead data-testid="table-header"><tr class="table-primary"><th>Avstånd</th><th>Hållplats</th><th>Nästa avgång</th><th>Destination</th></tr></thead>'
  );

  expect(page).toMatchSnapshot();
});

it("no departure info should render dash", () => {
  const component = render(<NextDeparture />);
  expect(component.container).toContainHTML("<b>-</b>");
});

it("departure info should render nicely", () => {
  const component = render(
    <table>
      <tbody>
        <tr>
          <NextDeparture
            NextDep={[
              {
                DisplayTime: "7 min",
                LineNumber: "666",
                Destination: "Heaven",
              },
            ]}
          />
        </tr>
      </tbody>
    </table>
  );
  expect(component.container).toContainHTML(
    '<td>7 min</td><td><span class="badge badge-pill badge-danger">666</span> Heaven</td>'
  );
});

it("whole component and subcomponents should render nicely", async () => {
  const client = CreateMockedClient();

  const page = await waitFor(() =>
    render(
      <ApiContext.Provider value={client}>
        <ListBusStops
          Lista={[
            {
              StopLocation: {
                name: "Stureplan",
                dist: "200",
                mainMastExtId: "74923452",
              },
            },
          ]}
        />
      </ApiContext.Provider>
    )
  );

  // The Badge is rendered in the deepest child, everything in the component should render fine if this is test passes
  expect(page.container).toContainHTML(
    '<span class="badge badge-pill badge-danger">666</span>'
  );
});
