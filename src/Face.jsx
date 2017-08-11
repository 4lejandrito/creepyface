import React from 'react';
import ReactDOM from 'react-dom';
import angles from './angles';

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
    getNumber(angle) {
        return Math.floor(this.props.pictures.move.length * angle / 360);
    }
    componentDidMount() {
        let cancel = angles(ReactDOM.findDOMNode(this)).subscribe(angle => {
            let {hover, move} = this.props.pictures;
            console.log(`${this.getNumber(angle)}: ${move[this.getNumber(angle)]}`);
            this.setState({
                picture: angle === -1 ? hover : move[this.getNumber(angle)]
            })
        });

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
