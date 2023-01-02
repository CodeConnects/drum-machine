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
        <div className={styles.row}>

        </div>
      </div>
    </div>
  )
}
