import React from 'react'
import * as Tone from 'tone'

import styles from '../styles/Controls.module.scss'

function Controls() {

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

    </div>
  )
}

export default Controls;
