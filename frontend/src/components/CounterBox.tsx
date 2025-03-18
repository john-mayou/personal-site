"use client"
import { useState } from "react"
import Counter from "./Counter"
import styles from "./CounterBox.module.scss"

export default function CounterBox() {
  const [totalCount, setTotalCount] = useState(0)

  function handleCountChange(delta: number) {
    setTotalCount(prev => prev + delta)
  }

  return (
    <div className={styles.component}>
      <h2 className={styles.countTotal}>Total Count: {totalCount}</h2>
      <div className={styles.counters}>
        {[...Array(5)].map((_, index) => (
          <Counter key={index} onCountChange={handleCountChange} />
        ))}
      </div>
    </div>
  )
}
