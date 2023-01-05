import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// todo this const the default with UI to change
const numSteps = 24;

// todo have two sounds be the default, snare and clap
// todo add/delete row function
// todo select list of samples on add row
// todo sample upload
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App samples={[
      {
        url: "/hat-closed.wav",
        name: "CH"
      },
      {
        url: "/clap.wav",
        name: "CL"
      },
      {
        url: "/snare.wav",
        name: "SD"
      },
      {
        url: "/kick.wav",
        name: "BD"
      },
    ]}
    numOfSteps={numSteps}
    />
  </React.StrictMode>,
);
