
import styles from './ActiveLight.module.scss';

export default function ActiveLight(/*stepIds, activeRef*/) {

    /*return(
        <div className={styles.row}>
        {stepIds.map(stepId => (
          <label className={styles.active}>
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
    );*/
}
