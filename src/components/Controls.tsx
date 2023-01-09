import React from 'react';
import * as Tone from 'tone';

import styles from './styles/Controls.module.scss';

export default function Controls(): JSX.Element {

    const [isPlaying, setIsPlaying] = React.useState(false);

    async function handleStart(): Promise<void> {
        if (Tone.Transport.state === "started") {
            Tone.Transport.pause();
            setIsPlaying(false);
        } else {
            await Tone.start();
            Tone.Transport.start();
            setIsPlaying(true);
        }
    }
  
    const handleSpeed = (e: React.ChangeEvent<HTMLInputElement>) => {
      Tone.Transport.bpm.value = Number(e.target.value);
    };
  
    const handleVol = (e: React.ChangeEvent<HTMLInputElement>) => {
      Tone.Destination.volume.value = Tone.gainToDb(Number(e.target.value));
    };


    return(
        <div className={styles.controls}>
  
          <button className={styles.button} onClick={handleStart}>
            {isPlaying ? "pause" : "start"}
          </button>
  
          <label className={styles.fader} id="vol-ctrl">
            <span>volume</span>
            <input type="range" min={0} max={1} step={0.01} 
              defaultValue={0.5} onChange={handleVol} />
          </label>
          
          <label className={styles.fader} id="speed-ctrl">
            <span>speed</span>
            <input type="range" min={20} max={320} step={1} 
                defaultValue={120} onChange={handleSpeed} />
          </label>
  
        </div>
    );
  }
  