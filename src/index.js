import React from "react"
import { fromEvent, merge } from "rxjs"
import { render } from "react-dom"
import { pipeProps } from "react-streams"
import {
  filter,
  map,
  mapTo,
  pluck,
  scan,
  startWith,
  tap,
  throttleTime,
  withLatestFrom
} from "rxjs/operators"

const deck = [
  "Hi, I'm John Lindquist",
  "egghead.io founder",
  "React + RxJS",
  '"Badass: Making Users Awesome" - Kathy Sierra',
  "Perceptual Exposure",
  "Your Brain Will Detect Patterns"
]

const Slides = pipeProps(props$ => {
  const keys$ = fromEvent(window, "keydown").pipe(pluck("key"))

  const next$ = keys$.pipe(
    tap(() => console.log("next")),
    filter(key => key === "ArrowRight"),
    mapTo(deck => i => (i < deck.length - 1 ? i + 1 : deck.length - 1))
  )

  const prev$ = keys$.pipe(
    filter(key => key === "ArrowLeft"),
    mapTo(deck => i => (i > 0 ? i - 1 : 0))
  )

  const index$ = merge(next$, prev$).pipe(
    throttleTime(250),
    withLatestFrom(props$, (fn, { deck }) => fn(deck)),
    startWith(0),
    scan((acc, fn) => fn(acc))
  )

  const slide$ = index$.pipe(withLatestFrom(props$, (i, { deck }) => deck[i]))

  return slide$.pipe(map(slide => ({ slide })))
})

render(
  <Slides deck={deck}>{props => <h1>{props.slide}</h1>}</Slides>,
  document.querySelector("#root")
)
