import React from 'react';
import * as Tone from 'tone';

import styles from './App.module.scss';

const NOTE = 'C2';

type Track = {
  id: number;
  sampler: Tone.Sampler;
};

type Props = {
  samples: {url:string; name: string; }[];
  numOfSteps: number;
};

export default function App({ samples, numOfSteps }:Props) {
  const [isPlaying, setIsPlaying] = React.useState(false);

  const trkRef = React.useRef<Track[]>([]);
  const stepRef = React.useRef<HTMLInputElement[][]>([[]]);
  const activeRef = React.useRef<HTMLInputElement[]>([]);
  const seqRef = React.useRef<Tone.Sequence | null>(null);

  const trackIds = [...Array(samples.length).keys()] as const;
  const stepIds = [...Array(numOfSteps).keys()] as const;

  const handleStart = async () => {
    if (Tone.Transport.state === "started") {
      Tone.Transport.pause();
      setIsPlaying(false);
    } else {
      await Tone.start();
      Tone.Transport.start();
      setIsPlaying(true);
    }
  };

  const handleBPM = (e: React.ChangeEvent<HTMLInputElement>) => {
    Tone.Transport.bpm.value = Number(e.target.value);
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    Tone.Destination.volume.value = Tone.gainToDb(Number(e.target.value));
  };

  React.useEffect(() => {
    trkRef.current = samples.map((sample, i) => ({
      id: i,
      sampler: new Tone.Sampler({
        urls: {
          [NOTE]: sample.url,
        },
      }).toDestination(),
    }));
    seqRef.current = new Tone.Sequence(
      (time, step) => {
        trkRef.current.forEach(trk => {
          if (stepRef.current[trk.id]?.[step]?.checked) {
            trk.sampler.triggerAttack(NOTE, time);
          }
          activeRef.current[step].checked = true;
        });
      }, [...stepIds]
    ).start(0);

    return () => {
      // todo look into this
      seqRef.current?.dispose();
      trkRef.current.forEach((trk) => void trk.sampler.dispose());
    };
  }, [samples, numOfSteps]);

  return (
    <div className={styles.container}>

      <div className={styles.soundLabels}>
        {samples.map((sample) => (<div>{sample.name}</div>))}
      </div>

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
                  if (!elm) return;
                  activeRef.current[stepId] = elm;
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
                        if (!elm) return;
                        if (!stepRef.current[trackId]) {
                          stepRef.current[trackId] = [];
                        }
                        stepRef.current[trackId][stepId] = elm;
                      }}
                    />
                    <div className={styles.cell__content}></div>
                  </label>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.controls}>

        <label className={styles.fader} id="bpm-ctrl">
          <span>BPM</span>
          <input type="range" min={20} max={400} step={1} defaultValue={120} onChange={handleBPM} />
        </label>

        <label className={styles.fader} id="volume-ctrl">
          <span>Volume</span>
          <input type="range" min={0} max={0} step={0.01} defaultValue={0.5} onChange={handleVolume} />
        </label>
        
        <button className={styles.button} onClick={handleStart}>
          {isPlaying ? "Pause" : "Start"}
        </button>

      </div>

    </div>
  );
}
