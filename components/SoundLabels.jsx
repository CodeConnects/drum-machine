import styles from '../styles/SoundLabels.module.scss';

const SoundLabels = ({ samples, selectedSamples }) => {
  return (
    <div className={styles.soundLabels}>

      {selectedSamples.map((selectedSample, trackId) => (
        <div key={trackId}>
          <select
            value={selectedSample}
            onChange={(e) => {
              const updatedSamples = [...selectedSamples];
              updatedSamples[trackId] = e.target.value;
              setSelectedSamples(updatedSamples);
            }}
          >
            {samples.map((sample) => (
              <option key={sample.name} value={sample.name}>
                {sample.name}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}

export default SoundLabels;
