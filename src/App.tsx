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

  const tracksRef = React.useRef<Track[]>([]);
  const stepsRef = React.useRef<HTMLInputElement[][]>([[]]);
  const seqRef = React.useRef<Tone.Sequence | null>(null);

  const trackIds = [...Array(samples.length).keys()] as const;
  const stepIds = [...Array(numOfSteps).keys()] as const;

  const handleStartClick = async () => {
    if (Tone.Transport.state === "started") {
      Tone.Transport.stop();
      setIsPlaying(false);
    } else {
      await Tone.start();
      Tone.Transport.start();
      setIsPlaying(true);
    }
  };

  React.useEffect(() => {
    tracksRef.current = samples.map((sample, i) => ({
      id: i,
      sampler: new Tone.Sampler({
        urls: {
          [NOTE]: sample.url,
        },
      }).toDestination(),
    }));
    seqRef.current = new Tone.Sequence(
      (time, step) => {
        tracksRef.current.forEach(trk => {
          if (stepsRef.current[trk.id]?.[step]?.checked) {
            trk.sampler.triggerAttack(NOTE, time);
          }
        });
      }, 
      [...stepIds],
      "16n"
    ).start(0);

    return () => {
      // todo look into this
      seqRef.current?.dispose();
      tracksRef.current.forEach((trk) => trk.sampler.dispose());
    };
  }, [samples, numOfSteps]);

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
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
                        if (!stepsRef.current[trackId]) {
                          stepsRef.current[trackId] = [];
                        }
                        stepsRef.current[trackId][stepId] = elm;
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
        <button className={styles.button} onClick={handleStartClick}>
          {isPlaying ? "Pause" : "Start"}
        </button>
      </div>
    </div>
  );
}
