import { onMessage } from "firebase/messaging";
import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
// import reportWebVitals from './reportWebVitals'
import "tw-elements";

import { messaging } from "./firebase-config";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // eslint-disable-next-line react/jsx-filename-extension
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

serviceWorkerRegistration.register({
  onRegister: (registration) => {
    console.log(`Service Worker: Registered with scope: ${registration.scope}`);
    window.serviceWorkerRegistrationObj = registration;
  },
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals()

onMessage(messaging, (payload) => {
  console.log("Message received:", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/logo.png",
  };

  const notification = new Notification(notificationTitle, notificationOptions);

  notification.onclick = (e) => {
    e.preventDefault();
    notification.close();
  };
});
