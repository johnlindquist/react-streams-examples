import React from "react"
import { render } from "react-dom"
import { pipeProps } from "react-streams"
import { delay, startWith } from "rxjs/operators"

const HelloWorld = pipeProps(
  delay(3000),
  startWith({ greeting: "Wait..." })
)

render(
  <HelloWorld greeting="Hello">
    {props => <h1>{props.greeting}</h1>}
  </HelloWorld>,
  document.querySelector("#root")
)
