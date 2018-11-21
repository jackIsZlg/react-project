export default (reducer, state, action, isAsync) => {
  if (isAsync) {
    return {
      pending: reducer(state, {
        ...action,
        type: `${action.type}_PENDING`
      }),
      rejected: reducer(state, {
        ...action,
        type: `${action.type}_REJECTED`
      }),
      fulfilled: reducer(state, {
        ...action,
        type: `${action.type}_FULFILLED`
      })
    }
  } else {
    return reducer(state, action)
  }
}
