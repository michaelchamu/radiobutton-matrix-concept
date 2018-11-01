import React, { Component } from "react";
import AddRow from "../components/AddRow/AddRow";
import axios from "axios";
import randomstring from "randomstring";
import { EditableTextField } from "react-bootstrap-xeditable";
import { API_URL } from "../config/config";
import DrawTable from "../components/DrawTable/DrawTable";
let formData = new FormData();

class Home extends Component {
  state = {
    columns: [{}],
    rows: [{}],
    formFields: {},
    defaultColumnName: "Col",
    defaultRowName: "Row",
    uniquekey: "",
    imagePresent: false,
    totalImages: 0,
    longestRow: null,
    longestColumn: null
  };
  //always show the default values from the API on component mount
  componentDidMount() {
    const endpoint = `${API_URL}`;
    this.fetchItems(endpoint);
  }
  //perfom a fetch to the API and set the starting values based on the returns from the API
  fetchItems = endpoint => {
    fetch(endpoint)
      .then(result => result.json())
      .then(result => {
        console.log(result);
        this.setState({
          rows: result.rows,
          columns: result.columns,
          totalImages: result.images,
          longestRow: result.longestRow,
          longestColumn: result.longestColumn
        });
      })
      .catch(error => console.error(error));
  };
  //If you want to perform any actions on radio button click
  handleChange = idx => e => {
    const { name, value } = e.target;
    const rows = [...this.state.rows];
    rows[idx] = {
      [name]: value
    };

    this.setState({
      rows
    });
  };
  //changing radio button label
  labelChange = (id, name, value) => {
    //get value and name from the label clicked then update the value
    let data = {};
    if (name === "row") {
      this.setState({ defaultRowName: value });

      data.label = value;
      data.type = "row";
      //  this.updateData(data);
      console.log(this.state.defaultRowName);
    } else {
      this.setState({ defaultColumnName: value });

      data.label = value;
      data.type = "column";
      console.log(this.state.defaultColumnName);
      // this.updateData(data);
    }
    //get image is exists
    //send data to database
  };

  onChangeFile(event) {
    event.stopPropagation();
    //stop browser defalt event
    event.preventDefault();
    var file = event.target.files[0];
    console.log(event.target);
    console.log(this.state.defaultRowName);
    //GET Image
    //get type
    //get name
    //get id
    //post to update
    formData.append("image", file);
    axios
      .post(`${API_URL}/pics`, formData)
      .then(result => {
        console.log(result);
        //Perform action based on response
      })
      .catch(error => {
        console.log(error);
        //Perform action based on error
      });
  }

  handleAddRow = () => {
    const item = {
      name: randomstring.generate(7)
    };

    this.setState({
      rows: [...this.state.rows, item]
    });
    this.saveData({
      type: "row",
      label: this.state.defaultRowName,
      uniquekey: item.name
    });
  };

  handleAddColumn = () => {
    const item = {
      name: randomstring.generate(7)
    };
    this.setState({
      columns: [...this.state.columns, item],
      rows: [...this.state.rows]
    });
    this.saveData({
      type: "column",
      label: this.state.defaultColumnName,
      uniquekey: item.name
    });
  };

  saveData(formFields) {
    axios
      .post(API_URL, formFields)
      .then(response => {
        console.log(response);
        //Perform action based on response
      })
      .catch(error => {
        console.log(error);
        //Perform action based on error
      });
  }

  updateData(fields) {
    axios
      .patch(API_URL, fields)
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      });
  }

  deleteData(key) {
    axios
      .delete(API_URL, { data: { uniquekey: key } })
      .then(response => {
        console.log(response);
        this.fetchItems(API_URL);
      })
      .catch(error => {
        console.log(error);
        this.fetchItems(API_URL);
      });
  }

  handleRemoveSpecificRow = (idx, key) => () => {
    const rows = [...this.state.rows];
    rows.splice(idx, 1);
    this.setState({ rows });
    this.deleteData(key);
  };

  handleRemoveSpecificColumn = (idx, key) => () => {
    console.log(key);
    const columns = [...this.state.columns];
    columns.splice(idx, 1);
    this.setState({ columns });
    this.deleteData(key);
  };

  render() {
    return (
      <div>
        <input
          id="tinyimage"
          type="file"
          ref={ref => (this.upload = ref)}
          style={{ display: "none" }}
          onChange={this.onChangeFile.bind(this)}
        />

        <div className="row">
          <div className="col-md-12">
            <div className="col-md-7">
              <h4>
                <b>Question Edition View</b>
              </h4>
              <i>Title of question</i>
              <DrawTable
                columns={this.state.columns}
                rows={this.state.rows}
                handleRemoveSpecificColumn={this.handleRemoveSpecificColumn}
                handleRemoveSpecificRow={this.handleRemoveSpecificRow}
              />
              <AddRow onClick={this.handleAddRow} />
            </div>
            <div className="col-md-1">
              <button
                onClick={this.handleAddColumn}
                className="button button-square button-tiny"
              >
                <i className="fa fa-plus" style={{ color: "green" }} />
              </button>
              <br />
            </div>
            <div className="col-md-4">
              <h4>
                <b>Question Summary View</b>
              </h4>
              <h5>
                <i>Summary</i>
              </h5>
              Number of rows {this.state.rows.length}
              <br />
              Number of columns {this.state.columns.length}
              <br />
              Number of images uploaded {this.state.totalImages}
              <br />
              Longest row label: {this.state.longestRow}
              <br />
              Longest column label: {this.state.longestColumn}
            </div>
          </div>
        </div>
        <div className="row">
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
            </button>{" "}
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
      </div>
    );
  }
}
export default Home;
