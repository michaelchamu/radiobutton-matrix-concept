import React from "react";

const AddRow = (props) => {
	return (
		<button onClick={props.onClick} className="button button-square button-tiny">
			<i className="fa fa-plus"  style={{color:"green"}}></i></button>
	);
};

export default  AddRow;