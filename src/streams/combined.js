import Observable from 'zen-observable';

export default function combined(streams) {
    return new Observable(observer => {
        let subscriptions = streams.map(
            stream => stream().subscribe(p => observer.next(p))
        );
        return () => subscriptions.map(s => s.unsubscribe());
    });
}
