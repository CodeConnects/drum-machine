import styles from './styles/SampleLabels.module.scss';

export default function SampleLabels(samples: any) {
    return(
        <div className={styles.soundLabels}>
          {samples.map((sample: any) => (<div>{sample.name}</div>))}
        </div>
    );
}