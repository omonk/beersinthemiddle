import React, { Component } from 'react';
import Input from './input';
class InputWrap extends Component {
    render() {
        const { removeLocation, index, ...props } = this.props;
        return (
            <div>
                <div className='w100 mb4'>
                    <label className='db mb2'>Location {this.props.index + 1}</label>
                    <Input {...props}/>
                    <button onClick={removeLocation}>X</button>
                </div>
            </div>
        )
    }
}

export default InputWrap;