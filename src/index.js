import React from "react"
import { render } from "react-dom"
import CountState from "./CountState"

const CountStateComp = CountState({ count: 5 })

const App = () => (
  <div>
    <CountStateComp>
      {({ count, onInc, onDec }) => (
        <div>
          <h2>{count}</h2>
          <button onClick={onInc}>+</button>
          <button onClick={onDec}>-</button>
        </div>
      )}
    </CountStateComp>
    <div>
      <div>
        <div>
          <div>
            <CountStateComp>
              {({ count, onInc, onDec }) => (
                <div>
                  <h3>I'm deep in the app: {count}</h3>
                  <button onMouseMove={onInc}>MouseMove to Inc</button>
                  <button onMouseMove={onDec}>MouseMove to Dec</button>
                </div>
              )}
            </CountStateComp>
          </div>
        </div>
      </div>
    </div>
  </div>
)

render(<App />, document.querySelector("#root"))
