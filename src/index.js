import React from "react"
import { render } from "react-dom"
import { pipeProps } from "react-streams"
import { map, switchMap } from "rxjs/operators"
import { ajax } from "rxjs/ajax"
const URL = `https://swapi.glitch.me`

const StarWars = pipeProps(
  switchMap(({ url, type, id }) =>
    ajax(`${url}/${type}/${id}`).pipe(
      map(({ response }) => ({
        person: response,
        url
      }))
    )
  )
)

render(
  <StarWars url={URL} type="people" id={0}>
    {({ person, url }) => (
      <div>
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
