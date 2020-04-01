const PUSH_ERROR = 'Lango/errors/PUSH_ERROR';

const initialState = [];

export default function errorsReducer(state = initialState, action) {
  switch (action.type) {
    case PUSH_ERROR:
      return [
        ...state,
        action.error,
      ];

    default:
      return state;
  }
}

export const selectErrors = (rootState) => rootState.errors;

export function pushError(error) {
  return { type: PUSH_ERROR, error };
}
