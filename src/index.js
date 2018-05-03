import React from "react"
import { render } from "react-dom"
import { streamState, streamActions, action, handler } from "react-streams"
import { of } from "rxjs"

const CountState = streamState({ count: 1 })(({ count }) => {
  const onInc = handler()
  const onDec = handler()

  const count$ = streamActions(of(count), [
    action(onInc, () => count => count + 1),
    action(onDec, () => count => count - 1)
  ])

  return {
    count: count$,
    onInc,
    onDec
  }
})

const App = () => (
  <div>
    <CountState>
      {({ count, onInc, onDec }) => (
        <div>
          <h2>{count}</h2>
          <button onClick={onInc}>+</button>
          <button onClick={onDec}>-</button>
        </div>
      )}
    </CountState>
    <div>
      <div>
        <div>
          <div>
            <CountState>
              {({ count, onInc, onDec }) => (
                <div>
                  <h2>{count}</h2>
                  <button onClick={onInc}>+</button>
                  <button onClick={onDec}>-</button>
                </div>
              )}
            </CountState>
          </div>
        </div>
      </div>
    </div>
  </div>
)

render(<App />, document.querySelector("#root"))
