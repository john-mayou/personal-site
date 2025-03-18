import { render, screen, fireEvent } from "@testing-library/react"
import CounterBox from "./CounterBox"

test("CounterBox renders 5 counters and tracks total count", () => {
  render(<CounterBox />)
  expect(screen.getByText("Total Count: 0")).toBeInTheDocument()

  const incrementButtons = screen.getAllByLabelText("Increment")
  const decrementButtons = screen.getAllByLabelText("Decrement")

  expect(incrementButtons.length == 5)
  expect(decrementButtons.length == 5)

  fireEvent.click(incrementButtons[0])
  fireEvent.click(incrementButtons[0])

  expect(screen.getByText("Total Count: 2")).toBeInTheDocument()

  fireEvent.click(incrementButtons[1])

  expect(screen.getByText("Total Count: 3")).toBeInTheDocument()

  fireEvent.click(decrementButtons[0])

  expect(screen.getByText("Total Count: 2")).toBeInTheDocument()
})