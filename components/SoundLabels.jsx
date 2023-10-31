import styles from '../styles/SoundLabels.module.scss';

const SoundLabels = ({ samples }) => {
  return (
    <div className={styles.soundLabels}>
      {samples.map((sample) => (
        <div key={sample.id}>{sample.name}</div>
      ))}
    </div>
  );
}

export default SoundLabels;
