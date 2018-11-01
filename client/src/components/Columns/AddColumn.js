import React from "react";

const AddColumn = props => {
  return (
    <button
      onClick={props.onClick}
      className="button button-square button-tiny"
    >
      <i className="fa fa-plus" style={{ color: "green" }} />
    </button>
  );
};

export default AddColumn;
