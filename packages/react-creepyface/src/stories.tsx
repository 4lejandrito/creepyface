import React from 'react'
import Creepyface from '.'
import { withKnobs, number, boolean } from '@storybook/addon-knobs'

export default {
  title: 'Creepyface',
  decorators: [withKnobs],
}

export const WithOptions = () => {
  const id = number('Picture number', 0)
  return (
    <Creepyface
      disabled={boolean('Disabled', false)}
      src={`https://creepyface.io/img/${id}/serious`}
      options={{
        hover: `https://creepyface.io/img/${id}/hover`,
        looks: [
          { angle: 0, src: `https://creepyface.io/img/${id}/0` },
          { angle: 45, src: `https://creepyface.io/img/${id}/45` },
          { angle: 90, src: `https://creepyface.io/img/${id}/90` },
          { angle: 135, src: `https://creepyface.io/img/${id}/135` },
          { angle: 180, src: `https://creepyface.io/img/${id}/180` },
          { angle: 225, src: `https://creepyface.io/img/${id}/225` },
          { angle: 270, src: `https://creepyface.io/img/${id}/270` },
          { angle: 315, src: `https://creepyface.io/img/${id}/315` },
        ],
        timeToDefault: number('Time to default', 1000),
        throttle: number('Throttle', 100),
      }}
    />
  )
}

export const WithDataAttributes = () => {
  const id = number('Picture number', 0)
  return (
    <Creepyface
      disabled={boolean('Disabled', false)}
      src={`https://creepyface.io/img/${id}/serious`}
      data-src-hover={`https://creepyface.io/img/${id}/hover`}
      data-src-look-0={`https://creepyface.io/img/${id}/0`}
      data-src-look-45={`https://creepyface.io/img/${id}/45`}
      data-src-look-90={`https://creepyface.io/img/${id}/90`}
      data-src-look-135={`https://creepyface.io/img/${id}/135`}
      data-src-look-180={`https://creepyface.io/img/${id}/180`}
      data-src-look-225={`https://creepyface.io/img/${id}/225`}
      data-src-look-270={`https://creepyface.io/img/${id}/270`}
      data-src-look-315={`https://creepyface.io/img/${id}/315`}
      data-timeToDefault={number('Time to default', 1000)}
      data-throttle={number('Throttle', 100)}
    />
  )
}
