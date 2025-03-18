import { render, screen, fireEvent } from "@testing-library/react"
import Counter from "./Counter"

test("Counter increments when button is clicked", () => {
  render(<Counter />)
  expect(screen.getByText("Count: 0")).toBeInTheDocument()
  fireEvent.click(screen.getByLabelText("Increment"))
  expect(screen.getByText("Count: 1")).toBeInTheDocument()
})

test("Counter decrements when button is clicked", () => {
  render(<Counter />)
  fireEvent.click(screen.getByLabelText("Increment"))
  expect(screen.getByText("Count: 1")).toBeInTheDocument()
  fireEvent.click(screen.getByLabelText("Decrement"))
  expect(screen.getByText("Count: 0")).toBeInTheDocument()
  fireEvent.click(screen.getByLabelText("Decrement")) // ensure stops at zero
  expect(screen.getByText("Count: 0")).toBeInTheDocument()
})

test("Counter sends the appropriate delta to onCountChange", () => {
  const values: number[] = []
  render(<Counter onCountChange={(delta) => values.push(delta)}/>)
  fireEvent.click(screen.getByLabelText("Increment"))
  fireEvent.click(screen.getByLabelText("Decrement"))
  expect(JSON.stringify(values) == JSON.stringify([1, -1]))
})