import React from 'react'
import Button from '../components/Button'
import { withKnobs } from '@storybook/addon-knobs'
import State from '../components/State'

export default {
  title: 'Button',
  decorators: [withKnobs]
}

export const Default = () => {
  return (
    <State>
      <Button>Do something</Button>
    </State>
  )
}
