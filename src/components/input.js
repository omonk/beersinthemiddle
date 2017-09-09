import React, { Component } from 'react';

class Input extends Component {
    
    render() {
        const { updateLocationValue, name, value } = this.props;

        return (
            <input onChange={updateLocationValue.bind(this, value)} name={name} value={value}/>
        )
    }
}

export default Input;