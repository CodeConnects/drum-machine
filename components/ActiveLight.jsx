
import styles from '../styles/ActiveLight.module.scss'

const ActiveLight = ({ stepIds, activeRef }) => {

  return(
    <div className={styles.row}>
      {stepIds.map(stepId => (
        <label key={stepId} className={styles.active}>
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
  )
};

export default ActiveLight;
