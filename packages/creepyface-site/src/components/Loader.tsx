import React from 'react'
import Icon from './Icon'

export default function Loader() {
  return (
    <span className="loader">
      <Icon name="spinner" spin />
    </span>
  )
}
