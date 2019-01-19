# [Creepyface](https://creepyface.io) &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/4lejandrito/creepyface/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/creepyface.svg?style=flat)](https://www.npmjs.com/package/creepyface) [![Build Status](https://api.travis-ci.org/4lejandrito/creepyface.svg?branch=master)](https://travis-ci.org/4lejandrito/creepyface) [![Coverage Status](https://coveralls.io/repos/github/4lejandrito/creepyface/badge.svg?branch=master)](https://coveralls.io/github/4lejandrito/creepyface?branch=master)

Creepyface is a little JavaScript tool that makes your face look at the mouse (or fingers). It is ideal for resumes, team presentation sites, etc...

[Demo](https://creepyface.io)

![Example animated gif of a face looking at the pointer](example.gif)

## Usage

The simplest way to create your Creepyface is by using [our wizard](https://creepyface.io/create).

---

If you want to customize it even more you can use our declarative data-attribute API:

1. Take a bunch of pictures of yourself looking at different directions.

2. Create a standard `<img>` tag like the following using the pictures you just took:

   ```html
   <img
     data-creepyface
     src="img/face/serious.jpg"
     data-src-hover="img/face/crazy.jpg"
     data-src-look-0="img/face/north.jpg"
     data-src-look-45="img/face/north-east.jpg"
     data-src-look-90="img/face/east.jpg"
     data-src-look-135="img/face/south-east.jpg"
     data-src-look-180="img/face/south.jpg"
     data-src-look-225="img/face/south-west.jpg"
     data-src-look-270="img/face/west.jpg"
     data-src-look-315="img/face/north-west.jpg"
   />
   ```

   The `data-src-look` attributes must be set to degrees (0 - 360).

3. Include Creepyface script in your page:

   ```html
   <script src="https://creepyface.io/creepyface.js"></script>
   ```

   Creepyface will automatically detect your image (thanks to the `data-creepyface` attribute) and make it look at the mouse or fingers depending on which device you are using.

   You can add as many Creepyfaces as you want as long as they all have the `data-creepyface` attribute.

   If you want to stop Creepyface on a given image:

   ```js
   creepyface.cancel(document.querySelector('img'))
   ```

## Advanced usage

For more advanced use cases Creepyface can also be set up via a programmatic API:

```js
import creepyface from 'creepyface'

const img = document.querySelector('img#face')

const cancel = creepyface(img, {
  // Time (in ms) to wait between src updates
  throttle: 100,
  // Image URL to display on hover
  hover: 'img/face/crazy.jpg',
  // Each of the images looking at a given direction
  looks: [
    { angle: 0, src: 'img/face/north.jpg' },
    { angle: 45, src: 'img/face/north-east.jpg' },
    { angle: 90, src: 'img/face/east.jpg' },
    { angle: 135, src: 'img/face/south-east.jpg' },
    { angle: 180, src: 'img/face/south.jpg' },
    { angle: 225, src: 'img/face/south-west.jpg' },
    { angle: 270, src: 'img/face/west.jpg' },
    { angle: 315, src: 'img/face/north-west.jpg' }
  ],
  // Time (in ms) to restore the default image after the last input
  timeToDefault: 1000
})

// at some point restore the original image and stop creepyface
cancel()
```

## Developing

- `npm start` will spin up a local server with the sample page watching your file changes.
- `npm test` will run the tests.
- `npm run build` will generate the production scripts under the `dist` folder.

## Contributing

Please feel free to create issues and / or submit pull requests. For the latter, [test cases](src/__test__) are very welcome.

## License

MIT, see [LICENSE](https://github.com/4lejandrito/creepyface/blob/master/LICENSE) for details.
