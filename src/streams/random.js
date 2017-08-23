import mappable from './util/mappable';
import point from '../util/point';

let random = x => Math.floor(Math.random() * x);

export default (every = 200) => mappable(next => (
    setInterval(() => (
        next(
            point(
                [random(window.innerWidth), random(window.innerHeight)],
                window,
                'random'
            )
        )
    ), every);
));
