import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import SlApiClient from "@happycoderse/js-sl-api";

import ApiContext from "./ApiContext";
import Home from "./Home";
import Stop from "./Stop";

import "./custom.css";
import CONFIG from "./config.json";

const client = new SlApiClient({
  apiKey_realtimeInfo: CONFIG.APIKEY_REALTIMEINFO,
  apiKey_nearMe: CONFIG.APIKEY_NEARME,
  apiKey_location: CONFIG.APIKEY_LOCATION,
});

function App() {
  if (!CONFIG.APIKEY_REALTIMEINFO)
    return <h2>Missing APIKEY_REALTIMEINFO in config.json</h2>;

  if (!CONFIG.APIKEY_NEARME)
    return <h2>Missing APIKEY_NEARME in config.json</h2>;

  if (!CONFIG.APIKEY_LOCATION)
    return <h2>Missing APIKEY_LOCATION in config.json</h2>;

  return (
    <ApiContext.Provider value={client}>
      <BrowserRouter>
        <Switch>
          <Route path="/stop/:siteId/:siteName" component={Stop}></Route>
          <Route>
            <Home />
          </Route>
        </Switch>
      </BrowserRouter>
    </ApiContext.Provider>
  );
}

export default App;
