import React, { Component } from "react";
import randomstring from "randomstring";
import { toast } from 'react-toastify';
import {
  updateData,
  saveData,
  deleteData,
  uploadImage
} from "../services/Datafunctions";
import {
  SummaryBlock,
  LegendBlock
} from "../components/SummaryAndLegend/SummaryAndLegend";
import DrawTable from "../components/DrawTable/DrawTable";
import AddColumn from "../components/Columns/AddColumn";
import AddRow from "../components/Rows/Rows";
import axios from "axios";
import { API_URL } from "../config/config";
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
        toast.success('Success');
        this.setState({
          rows: result.data.dataStore.rows,
          columns: result.data.dataStore.columns,
          totalImages: result.data.dataStore.images,
          longestRow: result.data.dataStore.longestRow,
          longestColumn: result.data.dataStore.longestColumn
        });
      })
      .catch((error) => {
        toast.error('Could not get data');
      });
  };


  handleSave = (event, id) => {
    let data = {};
    if (event.target.name === "column" || event.target.name === "row") {
      data.label = event.target.value;
      data.uniqueid = id;
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
    updateData(data);
    this.fetchItems(API_URL);
  };

  onChangeFile(event) {
    event.stopPropagation();
    //stop browser defalt event
    event.preventDefault();
    let file = event.target.files[0];
    console.log(event.target.files);
    //GET Image
    //get type
    //get name
    //get id
    //post to update
    formData.append("image", file);
    uploadImage(formData);

    this.fetchItems(API_URL);
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
      uniqueid: item.name
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
      uniqueid: item.name
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
