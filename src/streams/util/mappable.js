let callWith = value => fn => fn(value);

export default function mappable(factory) {
    let subscribers = [];
    let next = value => subscribers.forEach(
        ({apply, nexts}) => nexts.forEach(callWith(apply(value)))
    );
    let map = apply => {
        if (subscribers.length === 0) factory(next);
        let nexts = [];
        subscribers.push({apply, nexts});
        return mappable(nexts.push.bind(nexts));
    };

    return {map};
}
