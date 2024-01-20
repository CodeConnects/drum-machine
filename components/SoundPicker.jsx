import styles from '../styles/SoundPicker.module.scss';

const SoundPicker = ({ samples, selectedSamples, setSelectedSamples }) => {
  return (
    <div className={styles.soundPicker}>

      {selectedSamples.map((selectedSample, trackId) => (
        <div key={trackId}>
          <select
            value={selectedSample}
            onChange={(e) => {
              const updatedSamples = [...selectedSamples];
              updatedSamples[trackId] = e.target.value;
              setSelectedSamples(updatedSamples);
              //console.log(updatedSamples);
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

export default SoundPicker;
