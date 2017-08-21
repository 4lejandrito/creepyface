export default function preload(options) {
    let srcs = options.looks.map(look => look.src);
    if (options.default) srcs.push(options.default);
    if (options.hover) srcs.push(options.hover);
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
