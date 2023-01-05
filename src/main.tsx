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
        url: "/snare.wav",
        name: "snare"
      },{
        url: "/clap.wav",
        name: "clap"
      },{
        url: "/hat-closed.wav",
        name: "hat"
      },{
        url: "/kick.wav",
        name: "kick"
      },
    ]}
    numOfSteps={numSteps}
    />
  </React.StrictMode>,
);
