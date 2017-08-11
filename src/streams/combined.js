import Observable from 'zen-observable';

export default function combined(streams) {
    return new Observable(observer => {
        let cancels = streams.map(
            stream => stream().subscribe(p => observer.next(p))
        );
        return () => cancels.map(cancel => cancel());
    });
}
