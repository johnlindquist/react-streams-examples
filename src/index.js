import React from "react"
import { render } from "react-dom"
import { pipeProps, sourceNext } from "react-streams"
import { map, scan, startWith } from "rxjs/operators"

const Counter = pipeProps(() => {
  const [click$, onClick] = sourceNext()

  return click$.pipe(
    startWith(0),
    scan(count => count + 1),
    map(count => ({ count, onClick }))
  )
})

render(
  <Counter>
    {props => (
      <div>
        <h1>{props.count}</h1>
        <button onClick={props.onClick}>+</button>
      </div>
    )}
  </Counter>,
  document.querySelector("#root")
)
