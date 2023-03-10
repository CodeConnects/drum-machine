
import styles from './styles/ActiveLight.module.scss'

export default function ActiveLight(props) {

    return(
        <div className={styles.row}>
        {props.stepIds.map(stepId => (
          <label className={styles.active}>
            <input 
              type="radio" 
              name="active" 
              id={"active-" + stepId} 
              disabled
              ref={(elm) => {
                if (!elm) return;
                props.activeRef.current[stepId] = elm;
              }}
              className={styles.active__input}
            />
            <div className={styles.active__content} ></div>
          </label>
        ))}
      </div>
    )
}
