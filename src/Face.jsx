import React from 'react';
import _ from 'underscore';

export default class Face extends React.Component {
    constructor(props) {
        super(props);

        let pictures = props.pictures.move.slice();

        if (props.pictures.hover) pictures.push(props.pictures.hover);
        if (props.pictures.default) pictures.push(props.pictures.default);

        this.state = {
            picture: props.pictures.default,
            pictures
        };
    }
    rotate(v, deg) {
        return {
            x: v.x * Math.cos(deg) - v.y * Math.sin(deg),
            y: v.x * Math.sin(deg) + v.y * Math.cos(deg)
        };
    }
    getChunks() {
        return this.props.pictures.move.length;
    }
    getAngle(v) {
        var angle = Math.atan2(v.y, v.x);
        if (angle < 0) angle += 2 * Math.PI;
        return angle * 180 / Math.PI;
    }
    getLength(v) {
        return Math.sqrt(v.x * v.x + v.y * v.y);
    }
    getNumber(v) {
        var angle = this.getAngle(this.rotate(v, Math.PI / this.getChunks()));
        return Math.floor(this.getChunks() * angle / 360);
    }
    lookAt = _.throttle((x, y, target) => {
        var node = this.refs[this.state.picture],
            {hover, move} = this.props.pictures,
            hovers = (x > node.offsetLeft && x < (node.offsetLeft + node.clientWidth))
                    &&
                    (y > node.offsetTop && y < (node.offsetTop + node.clientHeight)),
            center = {
                x: node.offsetLeft + node.clientWidth / 2,
                y: node.offsetTop + node.clientHeight / 2
            }, v = {
                x: x - center.x,
                y: y - center.y
            };

        if (hovers && hover) {
            this.setState({picture: hover});
        } else {
            this.setState({
                picture: move[this.getNumber(v)]
            })
        }
    }, 100)
    lookAtMouse = event => this.lookAt(event.pageX, event.pageY, event.target)
    lookAtFinger = event => {
        var touch = event.changedTouches[0];
        this.lookAt(touch.pageX, touch.pageY, event.target);
    }
    componentDidMount() {
        document.addEventListener('mousemove', this.lookAtMouse);
        document.addEventListener('touchmove', this.lookAtFinger);
    }
    componentWillUnmount() {
        document.removeEventListener('mousemove', this.lookAtMouse);
        document.removeEventListener('touchmove', this.lookAtFinger);
    }
    render() {
        return <div className="picture">
            {this.state.pictures.map((src, n) => {
                var active = src === this.state.picture;
                return <img
                    ref={src}
                    key={n}
                    style={{
                        display: active ? 'initial' : 'none'
                    }}
                    alt={this.props.alt}
                    src={src}
                />;
            })}
        </div>;
    }
}
