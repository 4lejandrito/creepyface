import React from 'react';
import ReactDOM from 'react-dom';
import stream from './stream';

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
        let {pictures} = this.state;
        let cancel = stream(
            () => this.refs[this.state.picture],
            () => this.props.pictures
        ).subscribe(picture => this.setState({picture}));
        this.setState({cancel});
    }
    componentWillUnmount() {
        this.state.cancel();
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
