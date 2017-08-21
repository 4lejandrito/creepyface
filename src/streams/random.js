import Observable from 'zen-observable';
import point from '../util/point';

let random = x => Math.floor(Math.random() * x);

export default (every = 200) => new Observable(observer => {
    let interval = setInterval(() => (
        observer.next(
            point(
                [random(window.innerWidth), random(window.innerHeight)],
                window,
                'random'
            )
        )
    ), every);
    return () => clearInterval(interval);
});
