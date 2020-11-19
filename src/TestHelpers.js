import SlApiClient from "@happycoderse/js-sl-api";

function CreateMockedClient() {
  const client = new SlApiClient({
    apiKey_realtimeInfo: "a",
    apiKey_nearMe: "b",
    apiKey_location: "c",
  });

  client.LookupPlaces.mockImplementationOnce(() => {
    return Promise.resolve([
      { Name: "Sergelstorg", Type: "", X: "15.134", Y: "59.254" },
      { Name: "Odenplan", Type: "", X: "15.234", Y: "59.234" },
    ]);
  });

  client.UpdateStopInfo.mockImplementationOnce(() => {
    return Promise.resolve([]);
  });

  client.GetNextDeparture.mockImplementationOnce(() => {
    return Promise.resolve([
      {
        DisplayTime: "7 min",
        LineNumber: "666",
        Destination: "Heaven",
      },
    ]);
  });

  return client;
}

export default CreateMockedClient;
