# [Creepyface](https://creepyface.io) &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/4lejandrito/creepyface/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/creepyface.svg?style=flat)](https://www.npmjs.com/package/creepyface) [![Build Status](https://api.travis-ci.org/4lejandrito/creepyface.svg?branch=master)](https://travis-ci.org/4lejandrito/creepyface) [![Coverage Status](https://coveralls.io/repos/github/4lejandrito/creepyface/badge.svg?branch=master)](https://coveralls.io/github/4lejandrito/creepyface?branch=master)

Creepyface is a little JavaScript tool (<4K minified & gzipped) that makes your face follow the mouse (or fingers). It is ideal for resumes, team presentation sites, etc...

[Demo](https://creepyface.io)

![Example animated gif of a face following the pointer](example.gif)

## Usage

The simplest way to create your Creepyface is by using [our wizard](https://creepyface.io/create).

---

If you want to customize it even more you can use our declarative data-attribute API:

1. Take a bunch of pictures of yourself looking at different directions.

2. Create a standard `<img>` tag like the following using the pictures you just took:

    ```html
    <img
      data-creepy
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

3. Include Creepyface script at the end of your page:

    ```html
    <script type="text/javascript" src="creepyface.umd.js"></script>
    ```

    Creepyface will automatically detect your image (thanks to the `data-creepy` attribute) and make it follow the mouse or fingers depending on which device you are using.

    You can add as many Creepyfaces as you want as long as they all have the `data-creepy` attribute.

    If you want to stop Creepyface on a given image:
    ```js
    creepyFace.cancel(document.querySelector('img'))
    ```

## Advanced usage

For more advanced use cases Creepyface can also be set up via a programmatic API:

```js
import creepyFace from 'creepyface'

const faceImg = document.querySelector('img#face')

const cancel = creepyFace(faceImg, {
  throttle: 100, // Number of milliseconds to wait between src updates
  hover: 'img/face/crazy.jpg', // Image URL to display on hover
  looks: [ // Each of the images looking at a given direction
    {angle:   0, src: 'img/face/north.jpg'},
    {angle:  45, src: 'img/face/north-east.jpg'},
    {angle:  90, src: 'img/face/east.jpg'},
    {angle: 135, src: 'img/face/south-east.jpg'},
    {angle: 180, src: 'img/face/south.jpg'},
    {angle: 225, src: 'img/face/south-west.jpg'},
    {angle: 270, src: 'img/face/west.jpg'},
    {angle: 315, src: 'img/face/north-west.jpg'}
  ],
  timeToDefault: 1000 // Time (in ms) to show back the default image after no input is detected
})

// at some point
cancel() // will restore the original image and stop creepyface
```

## Developing

* `npm start` will spin up a local server with the sample page watching your file changes.
* `npm test` will run the tests.
* `npm run build` will generate the production scripts under the `dist` folder.

## Contributing

Please feel free to create issues and / or submit pull requests. For the latter, [test cases](src/__test__) are very welcome.

## License

MIT, see [LICENSE](https://github.com/4lejandrito/creepyface/blob/master/LICENSE) for details.