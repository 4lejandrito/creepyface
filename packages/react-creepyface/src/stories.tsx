import React from 'react'
import Creepyface from '.'
import { withKnobs, number, boolean } from '@storybook/addon-knobs'

export default {
  title: 'Creepyface',
  decorators: [withKnobs],
}

export const WithOptions = () => {
  return (
    <Creepyface
      disabled={boolean('Disabled', false)}
      src={`https://creepyface.io/img/nala/serious`}
      options={{
        hover: `https://creepyface.io/img/nala/hover`,
        looks: [
          { angle: 0, src: `https://creepyface.io/img/nala/0` },
          { angle: 45, src: `https://creepyface.io/img/nala/45` },
          { angle: 90, src: `https://creepyface.io/img/nala/90` },
          { angle: 135, src: `https://creepyface.io/img/nala/135` },
          { angle: 180, src: `https://creepyface.io/img/nala/180` },
          { angle: 225, src: `https://creepyface.io/img/nala/225` },
          { angle: 270, src: `https://creepyface.io/img/nala/270` },
          { angle: 315, src: `https://creepyface.io/img/nala/315` },
        ],
        timeToDefault: number('Time to default', 1000),
      }}
    />
  )
}

export const WithDataAttributes = () => {
  return (
    <Creepyface
      disabled={boolean('Disabled', false)}
      src={`https://creepyface.io/img/nala/serious`}
      data-src-hover={`https://creepyface.io/img/nala/hover`}
      data-src-look-0={`https://creepyface.io/img/nala/0`}
      data-src-look-45={`https://creepyface.io/img/nala/45`}
      data-src-look-90={`https://creepyface.io/img/nala/90`}
      data-src-look-135={`https://creepyface.io/img/nala/135`}
      data-src-look-180={`https://creepyface.io/img/nala/180`}
      data-src-look-225={`https://creepyface.io/img/nala/225`}
      data-src-look-270={`https://creepyface.io/img/nala/270`}
      data-src-look-315={`https://creepyface.io/img/nala/315`}
      data-timetodefault={number('Time to default', 1000)}
    />
  )
}
