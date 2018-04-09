import React from "react"
import { render } from "react-dom"
import { pipeProps } from "react-streams"

const HelloWorld = pipeProps()

render(
  <HelloWorld greeting="Hello" name="react-streams">
    {props => (
      <h1>
        {props.greeting}, {props.name}
      </h1>
    )}
  </HelloWorld>,
  document.querySelector("#root")
)
