import React from "react"
import { render } from "react-dom"
import { pipeProps, source } from "react-streams"
import {
  first,
  map,
  scan,
  switchMap
} from "rxjs/operators"
import { ajax } from "rxjs/ajax"
import { merge } from "rxjs"

const URL = `https://swapi.glitch.me`

const StarWars = pipeProps(props$ => {
  const onClick = source()

  return merge(props$.pipe(first()), onClick).pipe(
    scan(props => ({ ...props, id: props.id + 1 })),
    switchMap(({ url, type, id }) =>
      ajax(`${url}/${type}/${id}`).pipe(
        map(({ response }) => ({
          person: response,
          url,
          onClick
        }))
      )
    )
  )
})

render(
  <StarWars url={URL} type="people" id={0}>
    {({ person, url, onClick }) => (
      <div>
        <button onClick={onClick}>Load Next</button>
        <h1>{person.name}</h1>
        <img
          src={`${url}/${person.image}`}
          alt={person.name}
        />
      </div>
    )}
  </StarWars>,
  document.querySelector("#root")
)
