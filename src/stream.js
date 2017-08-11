import points from './points';

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

function getNumber(angle, chunks, node, target) {
    return node === target ? chunks : Math.floor((angle / 360) * chunks);
}

export default function stream(getNode, getChunks) {
    return points().map(
        ({x, y, target}) => {
            let chunks = getChunks(),
                node = getNode(),
                angle = getAngle(node, x, y, chunks),
                number = getNumber(angle, chunks, node, target);

            console.log(`(${x}, ${y}) = ${angle} = ${number}`)

            return number;
        }
    );
}
