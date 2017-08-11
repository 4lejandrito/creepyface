export default function preload(pictures, element) {
    return Promise.all(
        [pictures.default, pictures.hover].concat(pictures.move).map(
            src => new Promise((resolve, reject) => {
                let img = element.cloneNode();
                img.onload = () => resolve([src, img]);
                img.src = src;
            })
        )
    );
}
