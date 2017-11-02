# Creepy Face

Creepy Face is a little JavaScript tool (2.7K minified & gzipped) for making your face follow the mouse (or fingers). It is ideal for resumes, team presentation sites, etc...

![Example animated gif of a face following the pointer](example.gif)

## Usage

Creepy Face works out-of-the-box via a declarative data-attribute API.

1. Take a bunch of pictures of yourself looking at different directions.

2. Create a standard `<img>` tag like the following using the pictures taken in step 1:

    ```html
    <img
      data-creepy
      src="img/face/serious.jpg"
      data-src-hover="img/face/crazy.jpg"
      data-src-look-n="img/face/north.jpg"
      data-src-look-ne="img/face/north-east.jpg"
      data-src-look-e="img/face/east.jpg"
      data-src-look-se="img/face/south-east.jpg"
      data-src-look-s="img/face/south.jpg"
      data-src-look-sw="img/face/south-west.jpg"
      data-src-look-w="img/face/west.jpg"
      data-src-look-nw="img/face/north-west.jpg"
    />
    ```

    The `data-src-look` attributes can specify either compass points (n, ne, w...) or degrees (0 - 360). For example `data-src-look-s` would be equivalent to `data-src-look-180`.

3. Include creepyface script at the end of your page:

    ```html
    <script type="text/javascript" src="creepyface.umd.js"></script>
    ```

    Creepy Face will automatically detect your image (thanks to the `data-creepy` attribute) and make it follow the mouse or fingers depending on which device you are.

    You can add as many creepy faces as you want as long as they all have the `data-creepy` attribute.

## Advanced usage

For more advanced use cases Creepy Face can also be set up via a programmatic API:

```js
import creepyFace from 'creepyface'

const faceImg = document.querySelector('img#face')

const cancel = creepyFace(faceImg, {
  throttle: 100, // Number of milliseconds to wait between src updates
  hover: 'img/face/crazy.jpg', // Image URL to display on hover
  looks: [ // Each of the images looking at a given direction (angles in radians)
    {angle: 0 * Math.PI / 4, src: 'img/face/north.jpg'},
    {angle: 1 * Math.PI / 4, src: 'img/face/north-east.jpg'},
    {angle: 2 * Math.PI / 4, src: 'img/face/east.jpg'},
    {angle: 3 * Math.PI / 4, src: 'img/face/south-east.jpg'},
    {angle: 4 * Math.PI / 4, src: 'img/face/south.jpg'},
    {angle: 5 * Math.PI / 4, src: 'img/face/south-west.jpg'},
    {angle: 6 * Math.PI / 4, src: 'img/face/west.jpg'},
    {angle: 7 * Math.PI / 4, src: 'img/face/north-west.jpg'}
  ]
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
