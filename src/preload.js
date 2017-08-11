export default function preload(pictures) {
    return Promise.all(
        [pictures.default, pictures.hover].concat(pictures.move).map(
            src => new Promise((resolve, reject) => {
                let img = new Image();
                img.onload = () => resolve({[src]: img});
                img.src = src;
            })
        )
    ).then(
        pairs => pairs.reduce((o, pair) => Object.assign(o, pair), {})
    );
}
