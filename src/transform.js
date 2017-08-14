function rotate(v, deg) {
    return {
        x: v.x * Math.cos(deg) - v.y * Math.sin(deg),
        y: v.x * Math.sin(deg) + v.y * Math.cos(deg)
    };
}

function getAngle(node, x, y, chunks) {
    const center = {
        x: node.offsetLeft + node.clientWidth / 2,
        y: node.offsetTop + node.clientHeight / 2
    }, v = rotate({
        x: x - center.x,
        y: y - center.y
    }, Math.PI / chunks);

    let angle = Math.atan2(v.y, v.x);
    if (angle < 0) angle += 2 * Math.PI;
    return angle * 180 / Math.PI;
}

export default function transform(point, node, pictures) {
    let {target, source, coords} = point,
        [x, y] = coords,
        {move, hover} = pictures,
        chunks = move.length,
        angle = getAngle(node, x, y, chunks),
        number = Math.floor((angle / 360) * chunks),
        picture = (node === target && hover) ? hover : move[number];

    if (!picture) {
        picture = pictures.default;
    }

    if (process.env.NODE_ENV !== 'production') {
        console.log(`${source} => ${x}, ${y} => ${angle} => ${number} => ${picture}`);
    }

    return picture;
}
