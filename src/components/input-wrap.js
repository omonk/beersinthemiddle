import React, { Component } from 'react';

class InputWrap extends Component {
    render() {
        const {
            removeLocation,
            index,
            value,
            name } = this.props;
        return (
            <div>
                <div className='w100 mb4'>
                    <label className='db mb2'>Location {index + 1}</label>
                    <input name={name} defaultValue={value}/>
                    <button onClick={removeLocation}>X</button>
                </div>
            </div>
        )
    }
}

export default InputWrap;