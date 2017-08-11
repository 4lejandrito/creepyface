import Observable from 'zen-observable';
import point from './util/point';

let random = x => Math.floor(Math.random() * x);

export default new Observable(observer => {
    let interval = setInterval(() => (
        observer.next(
            point(
                random(window.innerWidth),
                random(window.innerHeight),
                window,
                'random'
            )
        )
    ), 200);
    return () => clearInterval(interval);
});
