import { combineReducers } from 'redux'
import getNext from '../util/get-next'
import { State, Action } from './types'

export default combineReducers({
  shortcuts: (shortcuts: boolean = false, action: Action) => {
    switch (action.type) {
      case 'toggleShortcuts':
        return !shortcuts
      case 'stopCreation':
        return false
      default:
        return shortcuts
    }
  },
  shoot: (shoot: State['shoot'] = null, action: Action) => {
    switch (action.type) {
      case 'videoReady':
        return action.payload
      case 'videoNotReady':
        return null
      default:
        return shoot
    }
  },
  pictures: (pictures: State['pictures'] = {}, action: Action) => {
    switch (action.type) {
      case 'takePicture':
        const next = getNext(pictures)
        return next !== undefined
          ? {
              ...pictures,
              [next]: action.payload,
            }
          : pictures
      case 'restartCreation':
      case 'stopCreation':
        return {}
      default:
        return pictures
    }
  },
  permissions: (
    permissions: State['permissions'] = {
      download: true,
      samples: true,
      research: false,
      show: false,
    },
    action: Action
  ) => {
    switch (action.type) {
      case 'toggleDownloadPermission':
        return {
          ...permissions,
          download: !permissions.download,
        }
      case 'toggleSamplesPermission':
        return {
          ...permissions,
          samples: !permissions.samples,
        }
      case 'toggleResearchPermission':
        return {
          ...permissions,
          research: !permissions.research,
        }
      case 'restartCreation':
      case 'stopCreation':
        return {
          download: true,
          samples: true,
          research: false,
          show: false,
        }
      case 'showPermissions':
        return { ...permissions, show: !permissions.show }
      default:
        return permissions
    }
  },
  uploading: (uploading: boolean = false, action: Action) => {
    switch (action.type) {
      case 'requestUpload':
        return true
      case 'receiveUpload':
        return false
      case 'uploadFailed':
        return false
      case 'restartCreation':
      case 'stopCreation':
        return false
      default:
        return uploading
    }
  },
  downloadLink: (
    downloadLink: State['downloadLink'] = null,
    action: Action
  ) => {
    switch (action.type) {
      case 'requestUpload':
        return null
      case 'receiveUpload':
        return action.payload.download
      case 'uploadFailed':
        return null
      case 'restartCreation':
      case 'stopCreation':
        return null
      default:
        return downloadLink
    }
  },
  viewLink: (viewLink: State['viewLink'] = null, action: Action) => {
    switch (action.type) {
      case 'requestUpload':
        return null
      case 'receiveUpload':
        return action.payload.view || null
      case 'uploadFailed':
        return null
      case 'restartCreation':
      case 'stopCreation':
        return null
      default:
        return viewLink
    }
  },
  selectedCreepyface: (
    selectedCreepyface: number | null = null,
    action: Action
  ) => {
    switch (action.type) {
      case 'selectCreepyface':
        return action.payload
      default:
        return selectedCreepyface
    }
  },
  showCode: (showCode: boolean = false, action: Action) => {
    switch (action.type) {
      case 'toggleCode':
        return !showCode
      case 'changePointProvider':
        return action.payload === 'dance' ? false : showCode
      default:
        return showCode
    }
  },
  pointProvider: (
    pointProvider: State['pointProvider'] = 'pointer',
    action: Action
  ) => {
    switch (action.type) {
      case 'changePointProvider':
        return action.payload
      default:
        return pointProvider
    }
  },
  isCreating: (isCreating: boolean = false, action: Action) => {
    switch (action.type) {
      case 'startCreation':
        return true
      case 'stopCreation':
        return false
      default:
        return isCreating
    }
  },
  reload: (reload: (() => void) | null = null, action: Action) => {
    switch (action.type) {
      case 'setReload':
        return action.payload
      default:
        return reload
    }
  },
})
