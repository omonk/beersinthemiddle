import React, { Component } from 'react';

class Input extends Component {
    
    render() {
        const { 
            updateLocationValue,
            name,
            value,
            key } = this.props;

        return (
            <input onChange={updateLocationValue.bind(this, key)} name={name} defaultValue={value}/>
        )
    }
}

export default Input;