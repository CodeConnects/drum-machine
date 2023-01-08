import styles from './SampleLabels.module.scss';

export default function SampleLabels(samples: any) {
    return(
          {/* Sound Labels */}
          <div className={styles.soundLabels}>
          {samples.map((sample) => (<div>{sample.name}</div>))}
        </div>
    );
}