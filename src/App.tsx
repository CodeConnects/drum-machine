// import { useState } from 'react'

import styles from './App.module.scss';

type Props = {
  samples: {url:string; name: string}[];
  numOfSteps: number;
}

export default function App({ samples, numOfSteps }:Props) {
  // const [count, setCount] = useState(0)

  const trackIds = [...Array(samples.length).keys()] as const;
  const stepIds = [...Array(numOfSteps).keys()] as const;

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
                    <input id={id} type="checkbox" className={styles.cell__input} />
                    <div className={styles.cell__content}></div>
                  </label>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
