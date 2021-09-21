# Creepyface Dance 💃 &middot; [![npm version](https://img.shields.io/npm/v/creepyface-dance.svg?style=flat)](https://www.npmjs.com/package/creepyface-dance)

A point provider for [Creepyface](https://github.com/4lejandrito/creepyface) to make your face dance.

## Usage

```html
<script src="https://creepyface.io/creepyface.js"></script>
<script src="https://unpkg.com/creepyface-dance"></script>
<img
  data-creepyface
  data-points="bensound-buddy"
  src="https://creepyface.io/img/0/serious"
  data-src-hover="https://creepyface.io/img/0/hover"
  data-src-look-0="https://creepyface.io/img/0/0"
  data-src-look-45="https://creepyface.io/img/0/45"
  data-src-look-90="https://creepyface.io/img/0/90"
  data-src-look-135="https://creepyface.io/img/0/135"
  data-src-look-180="https://creepyface.io/img/0/180"
  data-src-look-225="https://creepyface.io/img/0/225"
  data-src-look-270="https://creepyface.io/img/0/270"
  data-src-look-315="https://creepyface.io/img/0/315"
/>
<audio
  src="https://www.bensound.com/bensound-music/bensound-buddy.mp3"
  controls
></audio>
<script>
  const { repeat, circle } = creepyfaceDance.moves
  creepyfaceDance.makePointProvider({
    name: 'bensound-buddy',
    audio: document.querySelector('audio'),
    bpm: 150,
    firstBeat: 0,
    choreography: repeat(4)([
      ...repeat(20)(['w', 'e', 'n', 's']),
      ...repeat(20)(['nw', 'ne', 'sw', 'se']),
      ...repeat(20)(circle('n')),
      ...repeat(20)(circle('s', true)),
    ]),
  })
</script>
```

> Run this example on [codepen](https://codepen.io/4lejandrito/pen/vYOMNJE).

### makePointProvider parameters

| Name           | Description                                                                                                                                                                                                                                                                                                                 |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`         | The name for the point provider to be created. This will be used for the `data-creepyface` attribute of your image.                                                                                                                                                                                                         |
| `audio`        | The [HTMLAudioElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement) with the song. Since browsers now block autoplaying media you will have to manually play the audio or call the [play](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) method in response to a user event. |
| `bpm`          | The number of beats per minute of your song. You can use [this](http://www.beatsperminuteonline.com/) to calculate it.                                                                                                                                                                                                      |
| `firstBeat`    | The time (in seconds) when the first beat happens in your song. This is when the first step of your choreography will be performed.                                                                                                                                                                                         |
| `choreography` | The array of steps to perform on each beat. Valid steps are: `n`, `ne`, `e`, `se`, `s`, `sw`, `w`, `nw`, `serious` and `crazy`.                                                                                                                                                                                             |

### Available moves

Moves are functions that return an array of steps. CreepyfaceDance provides [some of them out of the box](https://github.com/4lejandrito/creepyface/blob/master/packages/creepyface-dance/src/index.ts#L65-L86):

| Name          | Description                                                                                           | Example                            |
| ------------- | ----------------------------------------------------------------------------------------------------- | ---------------------------------- |
| `repeat`      | Repeats the given sequence a specified amount of times.                                               | `repeat(10)(['s', 'n'])`           |
| `circle`      | An 8 step move describing a counterclockwise circle looking to every direction from the one provided. | `circle('e')`                      |
| `intercalate` | Constructs a secuence consisting of the itercalation of a given sequence and a step.                  | `intercalate(['n', 'w'], 'crazy')` |

You can build you own moves too!

## Developing

- `yarn dev` will spin up a test page.
- `yarn build` will generate the production scripts under the `dist` folder.
