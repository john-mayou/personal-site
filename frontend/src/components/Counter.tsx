"use client"
import { useState } from "react"
import { Plus, Minus } from "lucide-react"
import styles from "./Counter.module.scss"

export default function Counter({ onCountChange }: { onCountChange?: (delta: number) => void }) {
  const [count, setCount] = useState(0)

  function increment() {
    setCount((prev) => {
      const newCount = prev + 1
      if (onCountChange) onCountChange(1)
      return newCount
    })
  }

  function decrement() {
    if (count > 0) {
      setCount((prev) => {
        const newCount = prev - 1
        if (onCountChange) onCountChange(-1)
        return newCount
      })
    }
  }

  return (
    <div>
      <p className={styles.countTotal}>Count: {count}</p>
      <div className={styles.btnContainer}>
        <button className={styles.increment} onClick={increment} aria-label="Increment"><Plus /></button>
        <button className={styles.decrement} onClick={decrement} aria-label="Decrement"><Minus /></button>
      </div>
    </div>
  )
}
