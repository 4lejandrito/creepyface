import React, { useState, useEffect } from 'react'
import CreepyFace, { getHostedImages } from '../components/CreepyFace'
import Logo from '../components/Logo'
import Icon from '../components/Icon'
import SelectableList from '../components/SelectableList'
import { Creepyface } from '@prisma/client'

export default function Admin() {
  const [creepyfaces, setCreepyfaces] = useState<Creepyface[]>()
  const [approved, setApproved] = useState(false)
  const filteredCreepyfaces = creepyfaces
    ? creepyfaces.filter((cf) => (approved ? cf.approved : true))
    : []

  const api = (path = '', method = 'GET') =>
    fetch(`/api/admin/${path}`, {
      credentials: 'include',
      method,
      headers: {
        Accept: 'application/json',
      },
    })
      .then((res) => res.json())
      .then(setCreepyfaces)

  useEffect(() => {
    api()
  }, [])

  return (
    <div className="admin">
      <style jsx global>{`
        html,
        body,
        #__next {
          min-height: 100%;
          height: auto;
        }
      `}</style>
      <header className="top-bar light">
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
              canUseAsSample && !approved
                ? () => api(`${uuid}/approve`, 'POST')
                : undefined,
            'thumbs-down': approved
              ? () => api(`${uuid}/unapprove`, 'POST')
              : undefined,
            trash: () => api(`${uuid}`, 'DELETE'),
            code: () => api(`${uuid}/namespace`, 'POST'),
          })}
        >
          {(creepyface, visible, selected) => (
            <>
              <CreepyFace
                images={getHostedImages(
                  creepyface.uuid,
                  undefined,
                  selected ? 'square' : 'small'
                )}
                hidden={!visible}
              />
              <div className="badges">
                {creepyface.namespace && (
                  <small className="badge">
                    <strong>{creepyface.namespace}</strong>
                  </small>
                )}
                {creepyface.canUseAsSample && !approved && (
                  <small className="badge">
                    <strong>New!</strong>
                  </small>
                )}
                {creepyface.approved && !approved && (
                  <small className="badge">
                    <strong>
                      <Icon name="accept" />
                    </strong>
                  </small>
                )}
                {creepyface.canUseForResearch && (
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
    </div>
  )
}
