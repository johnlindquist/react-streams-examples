import React from "react"
import { render } from "react-dom"
import { combineStateStreams } from "react-streams"
import CountState from "./CountState"
import NameState from "./NameState"

const CountAndName = combineStateStreams(
  CountState({ count: 5 }),
  NameState({ name: "John" })
)

const App = () => (
  <div>
    <CountAndName>
      {({ count, onInc, onDec, name }) => (
        <div>
          <h2>
            {name} has {count} apples
          </h2>
          <button onClick={onInc}>+</button>
          <button onClick={onDec}>-</button>
        </div>
      )}
    </CountAndName>
    <div>
      <div>
        <div>
          <div>
            <CountAndName>
              {({ count, onInc, onDec, name, onUpdate }) => (
                <div>
                  <h3>I'm deep in the app: {count}</h3>
                  <button onMouseMove={onInc}>MouseMove to Inc</button>
                  <button onMouseMove={onDec}>MouseMove to Dec</button>

                  <h2>{name}</h2>
                  <input type="text" onChange={onUpdate} value={name} />
                </div>
              )}
            </CountAndName>
          </div>
        </div>
      </div>
    </div>
  </div>
)

render(<App />, document.querySelector("#root"))
