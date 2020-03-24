import React from 'react'
import State from '../components/State'
import CreepyFaceCreatorModal from '../components/CreepyFaceCreatorModal'
import createStore from '../redux/store'
import range from 'lodash.range'
import Router from '../components/Router'

export default {
  title: 'CreepyFaceCreatorModal'
}

export const ReadyToDownload = () => {
  const store = createStore()

  range(10).forEach(i =>
    store.dispatch({
      type: 'takePicture',
      payload: {
        src: `https://picsum.photos/200/300?random=${i}`,
        blob: new Blob()
      }
    })
  )

  return (
    <State store={store}>
      <Router>
        <CreepyFaceCreatorModal onClose={() => {}} />
      </Router>
    </State>
  )
}
