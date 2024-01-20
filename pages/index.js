import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import * as Tone from 'tone'

import Controls from '../components/Controls'
import SoundPicker from '../components/SoundPicker'
import ActiveIndicator from '../components/ActiveIndicator'
import ThemeSwitch from '../components/ThemeSwitch'

import styles from '../styles/Home.module.scss'

const NOTE = 'C2'

const samples = [
  { url: "/snare.wav", name: "Snare" },
  { url: "/clap.wav", name: "Clap" },
  { url: "/hat-closed.wav", name: "Hat" },
  { url: "/kick.wav", name: "Kick" },
]

export default function Home() {
  const [measures, setMeasures] = useState(6);
  const [beats, setBeats] = useState(4);
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

  // setting the full length of the sequence of measures with beats
  const stepIds = [...Array((beats * measures)).keys()];

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
  }, [selectedSamples,  (beats * measures) ])

  useEffect(() => {
    const fadeTime = setTimeout(() => {
      const element = document.getElementById(styles.openingTitle);
      if (element) {
        element.classList.add(styles.fadeOut);

        // Start second animation after 5 seconds

        const controlsElement = document.getElementById('topControls');
        if (controlsElement) {
          controlsElement.classList.add(styles.pullUp);
          console.log('pullUp fired: '+controlsElement);
        }

      }
      //console.log(selectedSamples)
    }, 4000);

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
        setSelectedSamples={setSelectedSamples}
        setMeasures={setMeasures}
        setBeats={setBeats}
      />

      <div className={styles.container}>

        <ThemeSwitch />

        <SoundPicker 
          samples={samples} 
          selectedSamples={selectedSamples}
          setSelectedSamples={setSelectedSamples}
        />
        
        {Array.from({ length: measures }, (_, measureIndex) => (
          <div key={measureIndex} className={styles.measure}>
            {/* Active Indicators for this measure */}
            <div className={styles.activeIndicators}>
              {Array.from({ length: beats }, (_, beatIndex) => (
                <ActiveIndicator key={beatIndex} stepId={beatIndex + measureIndex * beats} activeRef={activeRef}/>
              ))}
            </div>
            
            {/* Drum Pads for this measure */}
            {selectedSamples.map((selectedSample, trackId) => (
              
              /* one full row of notes */
              <div key={trackId} className={styles.track}>
                {Array.from({ length: beats }, (_, beatIndex) => {
                  const stepId = beatIndex + measureIndex * beats;
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
