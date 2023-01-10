import styles from './styles/SampleLabels.module.scss'

export default function SampleLabels(samples) {
    return(
        <div className={styles.soundLabels}>
          {samples.map((sample) => (<div>{sample.name}</div>))}
        </div>
    )
}
