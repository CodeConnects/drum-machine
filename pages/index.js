import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import * as Tone from 'tone'

import Controls from '../components/Controls'
import SoundLabels from '../components/SoundLabels'
import ActiveLight from '../components/ActiveLight'
import ThemeSwitch from '../components/ThemeSwitch'

import styles from '../styles/Home.module.scss'

const beatsPerMeasure = 4;
const NOTE = 'C2'

const samples = [
  { url: "/snare.wav", name: "Snare" },
  { url: "/clap.wav", name: "Clap" },
  { url: "/hat-closed.wav", name: "Hat" },
  { url: "/kick.wav", name: "Kick" },
]

export default function Home() {
  const [measures, setMeasures] = useState(6);
  const [selectedSamples, setSelectedSamples] = useState([
    samples[0].name,
    samples[1].name,
    samples[2].name,
    samples[3].name
  ]);
  const tracksRef = React.useRef([])
  const stepsRef = React.useRef([[]])
  const activeRef = React.useRef([])
  const seqRef = React.useRef()

  const stepIds = [...Array((beatsPerMeasure * measures)).keys()];

  const handleClear = () => {
    //Tone.Transport.stop()
    //Tone.Transport.cancel()
    //Tone.Transport.position = 0
    console.log('clear ran')
  }

  React.useEffect(() => {
    tracksRef.current = selectedSamples.map((selectedSample, i) => ({
      id: i,
      key: "track" + i,
      sampler: new Tone.Sampler({
        urls: {
          [NOTE]: samples.find(sample => sample.name === selectedSample).url,
        },
      }).toDestination(),
    }));
    seqRef.current = new Tone.Sequence(
      (time, step) => {
        tracksRef.current.forEach((trk) => {
          if (stepsRef.current[trk.id]?.[step]?.checked) {
            trk.sampler.triggerAttack(NOTE, time);
          }
          activeRef.current[step].checked = true;
        });
      },
      [...stepIds], "16n"
    );
    seqRef.current.start(0);

    return () => {
      seqRef.current?.dispose()
      tracksRef.current.forEach((trk) => trk.sampler.dispose())
    }
  }, [selectedSamples,  (beatsPerMeasure * measures) ])

  useEffect(() => {
    const fadeTime = setTimeout(() => {
      const element = document.getElementById(styles.openingTitle);
      if (element) {
        element.classList.add(styles.fadeOut);
      }
      console.log(selectedSamples)
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

      <Controls 
        handleClear={handleClear} 
        setSelectedSamples={setSelectedSamples}
        setMeasures={setMeasures}
      />

      <div className={styles.container}>

        <ThemeSwitch />

        <SoundLabels 
          samples={samples} 
          selectedSamples={selectedSamples}
          setSelectedSamples={setSelectedSamples}
        />
        
        {Array.from({ length: measures }, (_, measureIndex) => (
          <div key={measureIndex} className={styles.measure}>
            {/* Active Lights for this measure */}
            <div className={styles.activeLights}>
              {Array.from({ length: beatsPerMeasure }, (_, beatIndex) => (
                <ActiveLight key={beatIndex} stepId={beatIndex + measureIndex * beatsPerMeasure} activeRef={activeRef}/>
              ))}
            </div>
            
            {/* Drum Pads for this measure */}
            {selectedSamples.map((selectedSample, trackId) => (
              <div key={trackId} className={styles.track}>
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
    </>
  )
}
