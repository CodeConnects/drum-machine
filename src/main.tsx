import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

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
    numOfSteps={16}
    />
  </React.StrictMode>,
);
