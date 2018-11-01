import React, { Component } from "react";
import AddRow from "../components/AddRow/AddRow";
import axios from "axios";
import randomstring from "randomstring";
import {
  SummaryBlock,
  LegendBlock
} from "../components/SummaryAndLegend/SummaryAndLegend";
import { API_URL } from "../config/config";
import DrawTable from "../components/DrawTable/DrawTable";
import AddColumn from "../components/Columns/AddColumn";
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
              <DrawTable
                columns={this.state.columns}
                rows={this.state.rows}
                handleRemoveSpecificColumn={this.handleRemoveSpecificColumn}
                handleRemoveSpecificRow={this.handleRemoveSpecificRow}
              />
              <AddRow onClick={this.handleAddRow} />
            </div>

            <div className="col-md-1">
              <AddColumn onClick={this.handleAddColumn} />
            </div>
            <div className="col-md-4">
              <SummaryBlock
                rows={this.state.rows}
                columns={this.state.columns}
                totalImages={this.state.totalImages}
                longestRow={this.state.longestRow}
                longestColumn={this.state.longestColumn}
              />
            </div>
          </div>
        </div>
        <div className="row" />
        <LegendBlock />
      </div>
    );
  }
}
export default Home;
