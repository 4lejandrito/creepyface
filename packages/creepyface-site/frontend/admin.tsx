import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import CreepyFace, { getHostedImages } from './components/CreepyFace'
import Language from './components/Language'
import State from './components/State'
import Logo from './components/Logo'
import Icon from './components/Icon'
import SelectableList from './components/SelectableList'

type CreepyfaceType = {
  uuid: string
  approved: number
  canUseAsSample: number
  canUseForResearch: number
  namespace?: string
}

function Admin() {
  const [creepyfaces, setCreepyfaces] = useState<CreepyfaceType[]>()
  const [approved, setApproved] = useState(false)
  const filteredCreepyfaces = creepyfaces
    ? creepyfaces.filter(cf => (approved ? cf.approved : true))
    : []

  const api = (path = '', method = 'GET') =>
    fetch(`/admin/${path}`, {
      credentials: 'include',
      method,
      headers: {
        Accept: 'application/json'
      }
    })
      .then(res => res.json())
      .then(setCreepyfaces)

  useEffect(() => {
    api()
  }, [])

  return (
    <>
      <header className="light">
        <h1 className="logo" onClick={() => (window.location.href = '/')}>
          {filteredCreepyfaces.length} <Logo hidePointer={true} />s
        </h1>
        <small className="filter">
          <button onClick={() => setApproved(!approved)}>
            Show {approved ? 'all' : 'approved'}
          </button>
        </small>
      </header>
      {creepyfaces && (
        <SelectableList
          items={filteredCreepyfaces}
          actions={({ uuid, approved, canUseAsSample }) => ({
            'thumbs-up':
              !!canUseAsSample && !approved
                ? () => api(`${uuid}/approve`, 'POST')
                : undefined,
            'thumbs-down': !!approved
              ? () => api(`${uuid}/unapprove`, 'POST')
              : undefined,
            trash: () => api(`${uuid}`, 'DELETE'),
            code: () => api(`${uuid}/namespace`, 'POST')
          })}
        >
          {(creepyface, visible, selected) => (
            <>
              <CreepyFace
                images={getHostedImages(
                  creepyface.uuid,
                  !selected ? 'small' : undefined
                )}
                hidden={!visible}
              />
              <div className="badges">
                {creepyface.namespace && (
                  <small className="badge">
                    <strong>{creepyface.namespace}</strong>
                  </small>
                )}
                {!!creepyface.canUseAsSample && !approved && (
                  <small className="badge">
                    <strong>New!</strong>
                  </small>
                )}
                {!!creepyface.approved && !approved && (
                  <small className="badge">
                    <strong>
                      <Icon name="accept" />
                    </strong>
                  </small>
                )}
                {!!creepyface.canUseForResearch && (
                  <small className="badge">
                    <strong>
                      <Icon name="camera" />
                    </strong>
                  </small>
                )}
              </div>
            </>
          )}
        </SelectableList>
      )}
    </>
  )
}

ReactDOM.render(
  <State>
    <Language>
      <Admin />
    </Language>
  </State>,
  document.getElementById('root')
)
