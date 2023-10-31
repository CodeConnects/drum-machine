import React, { useEffect } from 'react'
import Head from 'next/head'
import * as Tone from 'tone'

import Controls from '../components/Controls'
import ActiveLight from '../components/ActiveLight'
import ThemeSwitch from '../components/ThemeSwitch'

import styles from '../styles/Home.module.scss'

const numSteps = 24
const NOTE = 'C2'

const samples = [
  { url: "/snare.wav", name: "snare" },
  { url: "/clap.wav", name: "clap" },
  { url: "/hat-closed.wav", name: "hat" },
  { url: "/kick.wav", name: "kick" },
]


export default function Home() {

  const tracksRef = React.useRef([])
  const stepsRef = React.useRef([[]])
  const activeRef = React.useRef([])
  const seqRef = React.useRef()

  const trackIds = [...Array(samples.length).keys()]
  const stepIds = [...Array(numSteps).keys()]

  React.useEffect(() => {
    tracksRef.current = samples.map((sample, i) => ({
      id: i,
      key: "track"+i,
      sampler: new Tone.Sampler({
        urls: {
          [NOTE]: sample.url,
        },
      }).toDestination(),
    }))
    seqRef.current = new Tone.Sequence(
      (time, step) => {
        tracksRef.current.map((trk) => {
          if (stepsRef.current[trk.id]?.[step]?.checked) {
            trk.sampler.triggerAttack(NOTE, time)
          }
          activeRef.current[step].checked = true
        })
      },
      [...stepIds], "16n"
    )
    seqRef.current.start(0)

    return () => {
      seqRef.current?.dispose()
      tracksRef.current.map((trk) => trk.sampler.dispose())
    }
  }, [samples, numSteps])

  useEffect(() => {
    const fadeTime = setTimeout(() => {
      const element = document.getElementById("opening-title");
      if (element) {
        element.classList.add("fade-out");
      }
    }, 5000);

    return () => {
      clearTimeout(fadeTime);
    };
  }, []);

  return (
    <>
      <Head>
        <title>Drum machine sequencer built on React with Next.js and Tone.js</title>
        <meta name="description" content="Drum machine sequencer built on React with Next.js and Tone.js" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href="/drum-set.svg" />
      </Head>

      <h1 className={styles.openingTitle}>Drum Machine Sequencer</h1>

      <div className={styles.container}>

        <ThemeSwitch />

        <div className={styles.soundLabels}>
          {samples.map((sample) => (
            <div key={sample.id}>{sample.name}</div>
          ))}
        </div>
        
        <div className={styles.grid}>

          <ActiveLight stepIds={stepIds} activeRef={activeRef} />
          
          <div className={styles.cellList}>
            {trackIds.map((trackId) => (
              <div key={trackId} className={styles.row}>
                {stepIds.map((stepId) => {
                  const id = trackId + "-" + stepId;
                  return (
                    <label key={id} className={styles.cell}>
                      <input
                        key={id}
                        id={id}
                        type="checkbox"
                        ref={(elm) => {
                          if (!elm) return;
                          if (!stepsRef.current[trackId]) {
                            stepsRef.current[trackId] = []
                          }
                          stepsRef.current[trackId][stepId] = elm
                        }}
                        className={styles.cell__input}
                      />
                      <div className={styles.cell__content} />
                    </label>
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        <Controls />

      </div>
    </>
  )
}
