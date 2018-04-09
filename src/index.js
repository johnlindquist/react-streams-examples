import React from "react"
import { render } from "react-dom"
import { pipeProps } from "react-streams"
import { interval } from "rxjs"
import { map, pluck } from "rxjs/operators"

const Timer = pipeProps(() => interval(250), map(tick => ({ tick })))

const PropsStreamingDemo = pipeProps(
  pluck("number"),
  map(number => ({ number: number * 2 }))
)

render(
  <Timer>
    {props => (
      <div>
        <h1>{props.tick}</h1>
        <PropsStreamingDemo number={props.tick}>
          {props2 => <h1>{props2.number}</h1>}
        </PropsStreamingDemo>
      </div>
    )}
  </Timer>,
  document.querySelector("#root")
)
