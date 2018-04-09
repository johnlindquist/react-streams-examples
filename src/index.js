import React from "react"
import { render } from "react-dom"
import { pipeProps } from "react-streams"
import { interval } from "rxjs"
import { map } from "rxjs/operators"

const Timer = pipeProps(() => interval(1000).pipe(map(tick => ({ tick }))))

render(
  <Timer>{props => <h1>{props.tick}</h1>}</Timer>,
  document.querySelector("#root")
)
