import React, { Component } from "react";
import axios from "axios";
import AddRow from "../components/Rows/Rows";

import {
  updateData,
  saveData,
  deleteData,
  uploadImage
} from "../services/Datafunctions";
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
    loading: false,
    columns: [{}],
    rows: [{}],
    formFields: {},
    defaultColumnName: "",
    defaultRowName: "",
    uniquekey: "",
    value: "",
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
    axios
      .get(endpoint)
      .then(result => {
        this.setState({
          rows: result.data.rows,
          columns: result.data.columns,
          totalImages: result.data.images,
          longestRow: result.data.longestRow,
          longestColumn: result.data.longestColumn
        });
      })
      .catch(error => console.error(error));
  };

  handleSave = (event, id) => {
    let data = {};
    if (event.target.name === "column" || event.target.name === "row") {
      data.label = event.target.value;
      data.uniquekey = id;
      if (event.target.name === "row") {
        this.setState({ defaultRowName: event.target.name, loading: true });
        data.type = "row";
      } else {
        this.setState({ defaultColumnName: event.target.name, loading: true });
        data.type = "column";
      }
      setTimeout(() => {
        this.setState({ loading: false });
      }, 3000);
    }
    console.log(data);
    updateData(data);
    this.fetchItems(API_URL);
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
    uploadImage(formData);
  }

  handleAddRow = () => {
    const item = {
      name: randomstring.generate(7)
    };

    this.setState({
      rows: [...this.state.rows, item]
    });
    saveData({
      type: "row",
      label: this.state.defaultRowName,
      uniquekey: item.name
    });

    this.fetchItems(API_URL);
  };

  handleAddColumn = () => {
    const item = {
      name: randomstring.generate(7)
    };
    this.setState({
      columns: [...this.state.columns, item],
      rows: [...this.state.rows]
    });
    saveData({
      type: "column",
      label: this.state.defaultColumnName,
      uniquekey: item.name
    });

    this.fetchItems(API_URL);
  };

  handleRemoveSpecificRow = (idx, key) => () => {
    const rows = [...this.state.rows];
    rows.splice(idx, 1);
    this.setState({ rows });
    deleteData(key);

    this.fetchItems(API_URL);
  };

  handleRemoveSpecificColumn = (idx, key) => () => {
    console.log(key);
    const columns = [...this.state.columns];
    columns.splice(idx, 1);
    this.setState({ columns });
    deleteData(key);

    this.fetchItems(API_URL);
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
                changeCallback={this.handleSave}
                upload={this.upload}
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
