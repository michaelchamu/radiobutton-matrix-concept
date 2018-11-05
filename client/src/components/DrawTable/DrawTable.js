import React from "react";
import InlineEdit from "react-ions/lib/components/InlineEdit";
import InputFiles from 'react-input-files';
const DrawTable = props => {
  return (
    <div>
      <h4>
        <b>Question Edition View</b>
      </h4>
      <i>Title of question</i>
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
                    
                  { !props.columns[colx].image ? <InputFiles onChange={(files) => {props.callback(props.columns[colx].uniqueid, 'column', files )}}>
                                      <button  className="button button-square button-tiny"> <i className="fa fa-plus" /></button>
                                    </InputFiles> : <InputFiles onChange={(files) => {props.callback(props.columns[colx].uniqueid, 'column', files )}}>
                                      <button  className="button button-square button-tiny"></button>
                                    </InputFiles>}

                  <br />
                  <InlineEdit
                    name="column"
                    value={!props.columns[colx].label ? 'col' : props.columns[colx].label}
                    changeCallback={(event) =>
                      props.changeCallback(event, props.columns[colx].uniqueid)
                    }
                    loading={props.loading}
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

                  { !props.rows[idx].image ? <InputFiles onChange={(files) => {props.callback(props.rows[idx].uniqueid, 'row', files )}}>
                                      <button  className="button button-square button-tiny"> <i className="fa fa-plus" /></button>
                                    </InputFiles> : <InputFiles onChange={(files) => {props.callback(props.rows[idx].uniqueid, 'row', files )}}>
                                      <button  className="button button-square button-tiny"></button>
                                    </InputFiles>}
         
                                         <InlineEdit
                                        name="row"
                                            value={'' ? 'row': props.rows[idx].label}
                                             changeCallback={event =>
                                       props.changeCallback(event, props.rows[idx].uniqueid)
                                         }
                                         loading={props.loading}
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
                    className="form-control"
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DrawTable;
