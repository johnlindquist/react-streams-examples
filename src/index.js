import React from "react"
import { render } from "react-dom"
import { pipeProps } from "react-streams"
import { of } from "rxjs"
import { pluck, switchMap, map, catchError } from "rxjs/operators"
import { ajax } from "rxjs/ajax"

const URL = `https://azure-lipstick.glitch.me/`

const Success = props => (
  <div>
    <h1>{props.name}</h1>
    <img src={URL + props.image} alt={props.name} />
  </div>
)

const Fail = err =>
  of(
    <div>
      <h1>Failed!!!!</h1>
      <img src={URL + "darth_vader.jpg"} alt="FAILED" />
    </div>
  )

const CatchDemo = pipeProps(
  map(({ url, person }) => `${url}people/${person}`),
  switchMap(ajax),
  pluck("response"),
  map(Success),
  catchError(Fail)
)

//change the person to an invalid # to force an error
render(<CatchDemo url={URL} person={3333} />, document.querySelector("#root"))
