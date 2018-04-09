import React from "react"
import { render } from "react-dom"
import { pipeProps } from "react-streams"
import { map } from "rxjs/operators"

const OperatorExample = pipeProps(
  map(props => ({ message: `${props.message} example` }))
)

render(
  <OperatorExample message="Operator">
    {props => <div>{props.message}</div>}
  </OperatorExample>,
  document.querySelector("#root")
)
