import { action, handler, stateToStreams, streamActions } from "react-streams"
import { of } from "rxjs"

export default stateToStreams(({ count }) => {
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
