import React from 'react';
import $ from 'jquery';
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
    lookAt(x, y, target) {
        var node = this.refs[this.state.picture],
            offset = $(node).offset(),
            {hover, move} = this.props.pictures,
            center = {
                x: offset.left + node.clientWidth / 2,
                y: offset.top + node.clientHeight / 2
            }, v = {
                x: x - center.x,
                y: y - center.y
            };

        if (hover && target === node) {
            this.setState({picture: hover});
        } else {
            this.setState({
                picture: move[this.getNumber(v)]
            })
        }
    }
    componentDidMount() {
        $('body').mousemove(_.throttle((event) => {
            this.lookAt(event.pageX, event.pageY, event.target);
        }, 100));
        $('body').on('touchmove', _.throttle((event) => {
            var touch = event.originalEvent.changedTouches[0];
            this.lookAt(touch.pageX, touch.pageY, event.target);
        }, 100));
    }
    componentWillUnmount() {
        $('body').off('mousemove touchmove');
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
