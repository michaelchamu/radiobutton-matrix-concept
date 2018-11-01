import React from "react";
import { EditableTextField } from "react-bootstrap-xeditable";

const DrawTable = props => {
  return (
    <table
      className="table table-borderless table-hover scrollable"
      id="tab_logic"
    >
      <thead>
        {
          <tr>
            <th className="text-center"> </th>

            {props.columns.map((item, colx) => (
              //display columsn depending on total counted from the database
              <th key={colx} className="text-center">
                <button
                  className="button button-square button-tiny"
                  onClick={props.handleRemoveSpecificColumn(
                    colx,
                    props.columns[colx].uniqueid
                  )}
                >
                  <i className="fa fa-minus" style={{ color: "red" }} />
                </button>
                <br />

                <button
                  onClick={() => {
                    props.upload.click(props.columns[colx].uniqueid);
                  }}
                  className="button button-square button-tiny"
                >
                  <i className="fa fa-plus" />
                </button>
                <br />
                {props.columns[colx].uniqueid}
                <EditableTextField
                  value={props.columns[colx].label}
                  onUpdate={e =>
                    this.labelChange(props.columns[colx].uniqueid, "column")
                  }
                />
              </th>
            ))}
          </tr>
        }
      </thead>
      <tbody>
        {props.rows.map((item, idx) => (
          <tr id="addr0" key={idx}>
            <td>
              <span>
                <button
                  onClick={props.handleRemoveSpecificRow(
                    idx,
                    props.rows[idx].uniqueid
                  )}
                  className="button button-square button-tiny"
                >
                  <i className="fa fa-minus" style={{ color: "red" }} />
                </button>
                &nbsp;
                <button
                  onClick={() => {
                    props.upload.click();
                  }}
                  className="button button-square button-tiny"
                >
                  <i className="fa fa-plus" />
                </button>
                <EditableTextField
                  name="row"
                  value={props.rows[idx].label}
                  onUpdate={props.labelChange}
                />
                <br />
              </span>
            </td>

            {props.columns.map((item, pbx) => (
              <td key={pbx}>
                <input
                  type="radio"
                  name="name"
                  value={props.rows[idx].name}
                  //onChange={this.handleChange(idx)}
                  className="form-control"
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DrawTable;
