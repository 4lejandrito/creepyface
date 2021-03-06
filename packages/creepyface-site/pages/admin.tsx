import React, { useState, useEffect } from 'react'
import CreepyFace, { getHostedImages } from '../src/components/CreepyFace'
import Logo from '../src/components/Logo'
import Icon from '../src/components/Icon'
import SelectableList from '../src/components/SelectableList'
import { Creepyface } from '@prisma/client'
import Link from 'next/link'

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
        <Link href="/">
          <a className="light logo-wrapper">
            <Logo />
          </a>
        </Link>
        <h1>{filteredCreepyfaces.length}</h1>
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
                {creepyface.canUseAsSample && !creepyface.approved && (
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
