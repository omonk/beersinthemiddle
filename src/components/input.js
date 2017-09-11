import React, { Component } from 'react';

class Input extends Component {
    
    render() {
        console.log(this.props);
        const { 
            updateLocationValue,
            name,
            value,
            id } = this.props;
        return (
            <input onChange={updateLocationValue(id)} name={name} defaultValue={value}/>
        )
    }
}

export default Input;