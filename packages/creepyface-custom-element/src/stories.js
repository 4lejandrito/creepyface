import '.'
import { withKnobs, number } from '@storybook/addon-knobs'

export default {
  title: 'Creepyface Custom Element',
  decorators: [withKnobs],
}

export const CustomizedBuiltInElement = () => {
  const id = number('Picture number', 0)
  return `
    <img is="creepy-face"
      src="https://creepyface.io/img/${id}/serious"
      data-src-hover="https://creepyface.io/img/${id}/hover"
      data-src-look-0="https://creepyface.io/img/${id}/0"
      data-src-look-45="https://creepyface.io/img/${id}/45"
      data-src-look-90="https://creepyface.io/img/${id}/90"
      data-src-look-135="https://creepyface.io/img/${id}/135"
      data-src-look-180="https://creepyface.io/img/${id}/180"
      data-src-look-225="https://creepyface.io/img/${id}/225"
      data-src-look-270="https://creepyface.io/img/${id}/270"
      data-src-look-315="https://creepyface.io/img/${id}/315"
      data-timeToDefault=${number('Time to default', 1000)}
    />
  `
}
