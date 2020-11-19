import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";

import CreateMockedClient from "./TestHelpers";
import ApiContext from "./ApiContext";
import Home from "./Home";

jest.mock("@happycoderse/js-sl-api");

it("Renders without crashing", () => {
  const { asFragment } = render(<Home />);
  expect(asFragment).toMatchSnapshot();
});

it("Address dropdown working", async () => {
  const client = CreateMockedClient();

  const page = render(
    <ApiContext.Provider value={client}>
      <Home />
    </ApiContext.Provider>
  );

  // "Write" 'Stur' in address field
  const txtInput = page.getByPlaceholderText("Adress");
  fireEvent.change(txtInput, { target: { value: "Stur" } });

  // Wait for render
  await waitFor(() => screen.getByPlaceholderText("Adress"));

  // Verify that address field now has value 'Stur'
  expect(screen.getByTestId("Adress")).toHaveValue("Stur");

  // Find 'Odenplan' in dropdown/popover and click it
  const stop = await screen.findByText("Odenplan");
  expect(stop).toBeDefined();
  fireEvent.click(stop);

  // Wait for render
  await waitFor(() => screen.getByPlaceholderText("Adress"));

  // Verify that address field now has value 'Odenplan'
  expect(screen.getByTestId("Adress")).toHaveValue("Odenplan");

  expect(client.LookupPlaces).toHaveBeenCalledTimes(1);
  expect(client.UpdateStopInfo).toHaveBeenCalledTimes(1);
  expect(client.GetNextDeparture).toHaveBeenCalledTimes(0);
});
