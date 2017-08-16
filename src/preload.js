export default function preload(pictures) {
    let srcs = pictures.slices.slice();
    if (pictures.default) srcs.push(pictures.default);
    if (pictures.hover) srcs.push(pictures.hover);
    return Promise.all(
        srcs.map(
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
