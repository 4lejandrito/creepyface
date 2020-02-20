# React-Creepyface &middot; [![npm version](https://img.shields.io/npm/v/react-creepyface.svg?style=flat)](https://www.npmjs.com/package/react-creepyface)

React-Creepyface is a [React](https://reactjs.org/) component for [Creepyface](https://github.com/4lejandrito/creepyface).

[![Edit quizzical-dawn-0hzuq](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/quizzical-dawn-0hzuq?fontsize=14&hidenavigation=1&theme=dark)

## Installation

```
npm i creepyface react-creepyface
```

`react-creepyface` uses `creepyface` as a peer dependency therefore both need to be installed.

## Usage

```jsx
import React from 'react'
import { render } from 'react-dom'
import Creepyface from 'react-creepyface'

render(
  <Creepyface
    src={`https://creepyface.io/img/0/serious`}
    options={{
      hover: `https://creepyface.io/img/0/hover`,
      looks: [
        { angle: 0, src: `https://creepyface.io/img/0/0` },
        { angle: 45, src: `https://creepyface.io/img/0/45` },
        { angle: 90, src: `https://creepyface.io/img/0/90` },
        { angle: 135, src: `https://creepyface.io/img/0/135` },
        { angle: 180, src: `https://creepyface.io/img/0/180` },
        { angle: 225, src: `https://creepyface.io/img/0/225` },
        { angle: 270, src: `https://creepyface.io/img/0/270` },
        { angle: 315, src: `https://creepyface.io/img/0/315` }
      ]
    }}
  />,
  document.getElementById('root')
)
```

Check out [the stories](src/stories.tsx) for working examples.

## Developing

- `npm start` will spin up the storybook.
- `npm run build` will generate the production scripts under the `dist` folder.
