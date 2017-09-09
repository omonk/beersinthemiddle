import React, { Component } from 'react';
import Input from './input';
class InputWrap extends Component {
    render() {
        const { removeLocation, updateLocationValue, location, name, value } = this.props;
        return (
            <div>
                <div className='w100 mb4'>
                    <label className='db mb2'>Location {this.props.number + 1}</label>
                    <Input updateLocationValue={updateLocationValue} name={name} value={value}/>
                    <button onClick={removeLocation}>X</button>
                </div>
            </div>
        )
    }
}

export default InputWrap;