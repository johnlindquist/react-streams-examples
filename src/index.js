import React from "react"
import { of, interval } from "rxjs"
import { render } from "react-dom"
import { pipeProps, source } from "react-streams"
import {
  concat,
  map,
  repeatWhen,
  scan,
  startWith,
  takeUntil,
  takeWhile,
  share,
  ignoreElements,
  tap,
  withLatestFrom
} from "rxjs/operators"

const Alarm = pipeProps(props$ => {
  const snooze = source()
  const dismiss = source()

  const countdown$ = interval(250).pipe(
    startWith(5),
    scan(time => time - 1),
    takeWhile(time => time > 0)
  )

  const message$ = countdown$.pipe(
    concat(of("Wake up! 🎉")),
    repeatWhen(() => snooze.pipe(takeUntil(dismiss))),
    concat(of("Have a nice day! 🤗"))
  )

  const isSnoozeDisabled$ = countdown$.pipe(
    ignoreElements(),
    concat(of(false)),
    startWith(true),
    repeatWhen(() => snooze),
    takeUntil(dismiss),
    concat(of(true))
  )

  const isDismissDisabled$ = isSnoozeDisabled$.pipe(
    startWith(true),
    takeUntil(dismiss),
    concat(of(true))
  )

  return message$.pipe(
    withLatestFrom(isSnoozeDisabled$, (message, isSnoozeDisabled) => ({
      message,
      isSnoozeDisabled
    })),

    withLatestFrom(isDismissDisabled$, (props, isDismissDisabled) => ({
      ...props,
      isDismissDisabled
    })),

    map(values => ({
      ...values,
      snooze,
      dismiss
    })),
    tap(console.log.bind(console)),
    share()
  )
})

render(
  <Alarm>
    {props => (
      <div>
        <h2>{props.message}</h2>
        <button disabled={props.isSnoozeDisabled} onClick={props.snooze}>
          Snooze
        </button>
        <button disabled={props.isDismissDisabled} onClick={props.dismiss}>
          Dismiss
        </button>
      </div>
    )}
  </Alarm>,
  document.querySelector("#root")
)
