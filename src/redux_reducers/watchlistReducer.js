import { ADD_TO_WATCHLIST, REMOVE_FROM_WATCHLIST } from '../redux_actions'

const initialState = {
  watchlist: JSON.parse(localStorage.getItem('watchlist')) ?? []
}

const watchlistReducer = (state = initialState, action) => {
  switch (action.type) {
  case ADD_TO_WATCHLIST:
    const updatedAddWatchlist = [...state.watchlist, action.payload]
    localStorage.setItem('watchlist', JSON.stringify(updatedAddWatchlist))
    return { ...state, watchlist: updatedAddWatchlist }

  case REMOVE_FROM_WATCHLIST:
    const updatedRemoveWatchlist = state.watchlist.filter(coin => coin.id !== action.payload)
    localStorage.setItem('watchlist', JSON.stringify(updatedRemoveWatchlist))
    return { ...state, watchlist: updatedRemoveWatchlist }

  default:
    return state
  }
}

export default watchlistReducer
