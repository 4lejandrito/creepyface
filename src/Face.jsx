import React from 'react';
import ReactDOM from 'react-dom';
import transform from './transform';
import mousePoints from './streams/mouse';
import fingerPoints from './streams/finger';
import combined from './streams/combined';

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
    componentDidMount() {
        let points = combined([mousePoints, fingerPoints]);

        let subscription = points.subscribe(point => {
            this.setState({
                picture: transform(
                    point,
                    this.refs[this.state.picture],
                    this.props.pictures
                )
            });
        })
        this.setState({subscription});
    }
    componentWillUnmount() {
        this.state.subscription.unsubscribe();
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
