import React from "react"
import { render } from "react-dom"
import { source, streamProps } from "react-streams"
import { concat, of } from "rxjs"
import { ajax } from "rxjs/ajax"
import { catchError, pluck, scan, switchMap } from "rxjs/operators"

const URL = `https://swapi.glitch.me`

const StarWars = streamProps(({ url, type, id }) => {
  const onClick = source()

  const id$ = concat(of(id), onClick).pipe(scan(id => id + 1))

  const person$ = id$.pipe(
    switchMap(id =>
      ajax(`${url}/${type}/${id}`).pipe(
        pluck("response"),
        catchError(() => of({ name: "Missing...", image: "none" }))
      )
    )
  )

  return {
    person: person$,
    url: of(url),
    onClick
  }
})

render(
  <StarWars url={URL} type="people" id={0}>
    {({ person, url, onClick }) => (
      <div>
        <button onClick={onClick}>Load Next</button>
        <h1>{person.name}</h1>
        <img src={`${url}/${person.image}`} alt={person.name} />
      </div>
    )}
  </StarWars>,
  document.querySelector("#root")
)
