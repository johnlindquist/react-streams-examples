import React from "react"
import { render } from "react-dom"
import { pipeProps } from "react-streams"
import { interval } from "rxjs"
import { map, switchMap } from "rxjs/operators"

const Timer = pipeProps(
  switchMap(props => interval(props.time)),
  map(tick => ({ tick }))
)

render(
  <Timer time={250}>{props => <h1>{props.tick}</h1>}</Timer>,
  document.querySelector("#root")
)
