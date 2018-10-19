import React from 'react';

const DeleteRow = (props) => {
    return (
        <button onClick={props.onClick} className="button button-square button-tiny">
        <i className="fa fa-minus" ></i></button>
    );
}

export default  DeleteRow;