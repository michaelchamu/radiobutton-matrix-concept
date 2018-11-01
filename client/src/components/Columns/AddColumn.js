import React from "react";
const AddColumn = props => {
  return (
    <div>
      <button
        onClick={props.onClick}
        className="button button-square button-tiny"
      >
        <i className="fa fa-plus" style={{ color: "green" }} />
      </button>
      <br />
    </div>
  );
};
export default AddColumn;
