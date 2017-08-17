export function rotate(v, rad) {
    return [
        v[0] * Math.cos(rad) - v[1] * Math.sin(rad),
        v[0] * Math.sin(rad) + v[1] * Math.cos(rad)
    ];
}

export function getAngle(v) {
    let angle = Math.atan2(v[1], v[0]);
    if (angle < 0) angle += 2 * Math.PI;
    return angle;
}

export let rand = x => Math.floor(Math.random() * x);
export let sum = (x, y) => x + y;
export let square = x => x * x;
export let norm = v => Math.sqrt(v.map(square).reduce(sum, 0));
export let unit = v => v.map(x => x / norm(v));
export let diff = (v1, v2) => v1.map((x, i) => x - v2[i]);
export let times = (v, n) => v.map(x => x * n);
export let add = (v1, v2) => v1.map((x, i) => x + v2[i]);
export let sign = n => n ? n < 0 ? -1 : 1 : 0;
export let rad = deg => deg * Math.PI / 180;
export let mod = (n, m) => (m + n % m) % m;
