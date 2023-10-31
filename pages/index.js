import React, { useEffect } from 'react'
import Head from 'next/head'
import * as Tone from 'tone'

import Controls from '../components/Controls'
import SoundLabels from '../components/SoundLabels'
import ActiveLight from '../components/ActiveLight'
import ThemeSwitch from '../components/ThemeSwitch'

import styles from '../styles/Home.module.scss'

const measures = 6;
const beatsPerMeasure = 4;
const NOTE = 'C2'

const samples = [
  { url: "/snare.wav", name: "Snare" },
  { url: "/clap.wav", name: "Clap" },
  { url: "/hat-closed.wav", name: "Hat" },
  { url: "/kick.wav", name: "Kick" },
]

export default function Home() {
  const tracksRef = React.useRef([])
  const stepsRef = React.useRef([[]])
  const activeRef = React.useRef([])
  const seqRef = React.useRef()

  const stepIds = [...Array( (beatsPerMeasure * measures) ).keys()]

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
  }, [samples,  (beatsPerMeasure * measures) ])

  useEffect(() => {
    const fadeTime = setTimeout(() => {
      const element = document.getElementById(styles.openingTitle);
      if (element) {
        element.classList.add(styles.fadeOut);
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

      <h1 id={styles.openingTitle}>Drum Machine Sequencer</h1>

      <div className={styles.container}>

        <ThemeSwitch />

        <SoundLabels samples={samples} />
        
        {Array.from({ length: measures }, (_, measureIndex) => (
          <div key={measureIndex} className={styles.measure}>
            {/* Active Lights for this measure */}
            <div className={styles.activeLights}>
              {Array.from({ length: beatsPerMeasure }, (_, beatIndex) => (
                <ActiveLight key={beatIndex} stepId={beatIndex + measureIndex * beatsPerMeasure} activeRef={activeRef}/>
              ))}
            </div>
            
            {/* Drum Pads for this measure */}
            {samples.map((sample, trackId) => (
              <div key={sample.name} className={styles.track}>
                {Array.from({ length: beatsPerMeasure }, (_, beatIndex) => {
                  const stepId = beatIndex + measureIndex * beatsPerMeasure;
                  const id = `${trackId}-${stepId}`;
                  return (
                    <label key={id} className={styles.cell}>
                      <input
                        id={id}
                        type="checkbox"
                        ref={(elm) => {
                          if (!elm) return;
                          if (!stepsRef.current[trackId]) {
                            stepsRef.current[trackId] = [];
                          }
                          stepsRef.current[trackId][stepId] = elm;
                        }}
                        className={styles.cell__input}
                      />
                      <div className={styles.cell__content} />
                    </label>
                  );
                })}
              </div>
            ))}
          </div>
        ))}
      </div>

      <Controls />
    </>
  )
}
