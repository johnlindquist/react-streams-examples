import React from "react"
import { render } from "react-dom"
import { pipeProps, source } from "react-streams"
import { map, startWith, pluck, switchMap } from "rxjs/operators"

const TypingDemo = pipeProps(
  pluck("text"),
  switchMap(text => {
    const onInput = source(pluck("target", "value"))

    return onInput.pipe(startWith(text), map(text => ({ text, onInput })))
  })
)
render(
  <TypingDemo text="Text from props">
    {props => (
      <div>
        <input placeholder={props.text} onInput={props.onInput} />
        <h1>{props.text}</h1>
      </div>
    )}
  </TypingDemo>,
  document.querySelector("#root")
)
