import React from 'react'
import * as Tone from 'tone'

import Controls from './components/Controls'
import SampleLabels from './components/SampleLabels'
import ThemeSwitch from './components/ThemeSwitch'

import styles from './App.module.scss'

const NOTE = 'C2'

Track = {
  id: number,
  sampler: Tone.Sampler
}


// todo have two sounds be the default, snare and clap
// todo add/delete row function
// todo select list of samples on add row
// todo sample upload

// todo use this const as the default and with UI to change it
const numSteps = 24

const samples = [
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
]



export default function App() {

  const trkRef = React.useRef<Track[]>([])
  const stepRef = React.useRef<HTMLInputElement[][]>([[]])
  const activeRef = React.useRef<HTMLInputElement[]>([])
  const seqRef = React.useRef<Tone.Sequence | null>(null)

  const trackIds = [...Array(samples.length).keys()]
  const stepIds = [...Array(numSteps).keys()]

  React.useEffect(() => {
    
    // iterate through selected samples
    // create a new Tone Sampler for each sample
    trkRef.current = samples.map((sample, i) => ({
      id: i,
      sampler: new Tone.Sampler({
        urls: {
          [NOTE]: sample.url,
        },
      }).toDestination(),
    }))


    // start a new Tone Sequence
    seqRef.current = new Tone.Sequence(
      (time, step) => {
        trkRef.current.forEach(trk => {
          if (stepRef.current[trk.id]?.[step]?.checked) {
            trk.sampler.triggerAttack(NOTE, time)
          }
          activeRef.current[step].checked = true
        })
      }, [...stepIds]
    ).start(0)

    return () => {
      // todo look into this
      seqRef.current?.dispose()
      trkRef.current.forEach((trk) => void trk.sampler.dispose())
    }
  }, [samples, numSteps])

  return (
    <div className={styles.container}>

      <ThemeSwitch />

      <SampleLabels />

      <div className={styles.grid}>
      
        <div className={styles.row}>
          {stepIds.map(stepId => (
            <label className={styles.active}>
              <input 
                type="radio" 
                name="active" 
                id={"active-" + stepId} 
                disabled
                ref={(elm) => {
                  if (!elm) return
                  activeRef.current[stepId] = elm
                }}
                className={styles.active__input}
              />
              <div className={styles.active__content} ></div>
            </label>
          ))}
        </div>


        <div className={styles.cellList}>
          {trackIds.map((trackId) => (
            <div key={trackId} className={styles.row}>
              {stepIds.map((stepId) => {
                const id = trackId + "-" + stepId;
                return (
                  <label key={id} className={styles.cell}>
                    <input 
                      id={id} 
                      type="checkbox" 
                      className={styles.cell__input}
                      ref={(elm) => {
                        if (!elm) return
                        if (!stepRef.current[trackId]) {
                          stepRef.current[trackId] = []
                        }
                        stepRef.current[trackId][stepId] = elm
                      }}
                    />
                    <div className={styles.cell__content}></div>
                  </label>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      <Controls />

    </div>
  )
}
