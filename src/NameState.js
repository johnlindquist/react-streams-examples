import {
  stateToStreams,
  streamActions,
  action,
  handler,
  getTargetValue
} from "react-streams"
import { of } from "rxjs"

export default stateToStreams(({ name }) => {
  const onUpdate = handler(getTargetValue)

  const name$ = streamActions(of(name), [action(onUpdate, name => () => name)])

  return {
    name: name$,
    onUpdate
  }
})
