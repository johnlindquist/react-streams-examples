import React from "react"
import { render } from "react-dom"
import { pipeProps } from "react-streams"
import { pluck, switchMap } from "rxjs/operators"
import { ajax } from "rxjs/ajax"

const PersonLoader = pipeProps(pluck("url"), switchMap(ajax), pluck("response"))

const Person = props => (
  <div>
    <h1>{props.name}</h1>
    <img
      src={`https://azure-lipstick.glitch.me/${props.image}`}
      alt={props.name}
    />
  </div>
)

render(
  <PersonLoader url="https://azure-lipstick.glitch.me/people/10">
    {Person}
  </PersonLoader>,
  document.querySelector("#root")
)
