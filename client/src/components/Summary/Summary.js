import React from "react";

const SummaryBlock = props => {
  return (
    <div>
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

export default SummaryBlock;
