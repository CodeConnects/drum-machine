import React from 'react';

import styles from '../styles/ActiveLight.module.scss'

const ActiveLight = ({ stepId, activeRef }) => {

  return(
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
  )
};

export default ActiveLight;
