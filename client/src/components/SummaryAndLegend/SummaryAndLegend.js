import React from "react";

const SummaryBlock = props => {
  return (
    <div>
      <h4>
        <b>Question Summary View</b>
      </h4>
      <h5>
        <i>Summary</i>
      </h5>
      Number of rows {props.rows.length}
      <br />
      Number of columns {props.columns.length}
      <br />
      Number of images uploaded {props.totalImages}
      <br />
      Longest row label: {props.longestRow}
      <br />
      Longest column label: {props.longestColumn}
    </div>
  );
};

const LegendBlock = () => {
  return (
    <div>
      <div className="col-md-6">
        <h4>
          <b>Legend</b>
        </h4>
        <button className="button button-square button-tiny">
          <i className="fa fa-plus" />
        </button>{" "}
        - Add image <br />
        <button className="button button-square button-tiny">
          <i className="fa fa-plus" style={{ color: "green" }} />
        </button>
        - Add row/column <br />
      </div>
      <div className="col-md-6">
        <h4>
          <b>Notes</b>
        </h4>
        <i>Blue text is editable</i>
        <br />
      </div>
    </div>
  );
};

export { SummaryBlock, LegendBlock };
