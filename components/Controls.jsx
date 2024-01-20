import React from 'react'
import * as Tone from 'tone'

import styles from '../styles/Controls.module.scss'

function Controls({ handleClear, setSelectedSamples, setMeasures }) {

  const [isPlaying, setIsPlaying] = React.useState(false)

  const handleStartStop = async () => {
    if (Tone.Transport.state === "started") {
      Tone.Transport.pause()
      setIsPlaying(false)
    } else {
      await Tone.start()
      Tone.Transport.start()
      setIsPlaying(true)
    }
  }

  const handleBpmChange = (e) => {
    Tone.Transport.bpm.value = e.target.value
  }

  const handleVolumeChange = (e) => {
    Tone.Destination.volume.value = Tone.gainToDb(e.target.value)
  }

  return(
    <div className={styles.controls}>
      
      <button onClick={handleStartStop} className={styles.button}>
        {isPlaying ? "Pause" : "Start"}
      </button>
      
      <label className={styles.fader}>
        <span>BPM</span>
        <input
          type="range"
          min={30}
          max={300}
          step={1}
          onChange={handleBpmChange}
          defaultValue={120}
        />
      </label>
      
      <label className={styles.fader}>
        <span>Volume</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          onChange={handleVolumeChange}
          defaultValue={0.5}
        />
      </label>

      
      <button onClick={handleClear} className={styles.button} disabled>
        Load
      </button>
      
      <button onClick={handleClear} className={styles.button} disabled>
        Save
      </button>
      
      <button onClick={handleClear} className={styles.button} disabled>
        Clear
      </button>

      <button onClick={handleClear} className={styles.button} disabled>
        Reset
      </button>


      <div className={styles.controlSelect}>
        <label htmlFor="measures">Measures</label>
        <select id="measures" name="measures" defaultValue="6">
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
          <option value="11">11</option>
          <option value="12">12</option>
        </select>
      </div>

      <div className={styles.controlSelect}>
        <label htmlFor="beats">Beats Per</label>
        <select id="beats" name="beats" defaultValue="4">
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
        </select>
      </div>

    </div>
  )
}

export default Controls;
