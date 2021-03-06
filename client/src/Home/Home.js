import React, { Component } from "react";
import randomstring from "randomstring";
import Notifications, { notify } from 'react-notify-toast';
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
                notify.show('Data successfully retrieved!', 'success');
                this.setState({
                    rows: result.data.dataStore.rows,
                    columns: result.data.dataStore.columns,
                    totalImages: result.data.dataStore.images,
                    longestRow: result.data.dataStore.longestRow,
                    longestColumn: result.data.dataStore.longestColumn
                });
            })
            .catch((error) => {
                notify.show('Data retrieval failed!', 'error');
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
        updateData(data).then((result) => {
            if (result.data.statusCode === 201) {
                notify.show(`${data.type} successfully updated!`, 'success');
                this.fetchItems(API_URL);
            } else {
                notify.show(`${data.type} failed to update!`, 'error');
            }
        });

    };

    postImage = (id, type, fileObject) => {

        let file = fileObject[0];

        formData.append("image", file);
        formData.append('id', id);
        formData.append('filename', file.name);
        formData.append('type', type);

        uploadImage(formData).then((result) => {
            //clear formdata
            formData.delete('image');
            formData.delete('id');
            formData.delete('filename');
            formData.delete('type');
            if (result.data.statusCode === 201) {
                notify.show(`Image successfully uploaded!`, 'success');
                this.fetchItems(API_URL);
            } else {
                notify.show(`Image failed to upload!`, 'error');
            }
        });

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
        }).then((result) => {
            if (result.data.statusCode === 201) {
                notify.show(`Row successfully added!`, 'success');
                this.fetchItems(API_URL);
            } else {
                notify.show(`Row failed to add!`, 'error');
            }
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
        saveData({
            type: "column",
            label: this.state.defaultColumnName,
            uniqueid: item.name
        }).then((result) => {
            if (result.data.statusCode === 201) {
                notify.show(`Column successfully added!`, 'success');
                this.fetchItems(API_URL);
            } else {
                notify.show(`Column failed to add!`, 'error');
            }
        });

    };

    handleRemoveSpecificRow = (idx, key) => () => {
        const rows = [...this.state.rows];
        rows.splice(idx, 1);
        this.setState({ rows });
        deleteData(key).then((result) => {

            if (result.data.statusCode === 201) {
                notify.show(`Row successfully deleted!`, 'success');
                this.fetchItems(API_URL);
            } else {
                notify.show(`Row failed to delete!`, 'error');
            }
        });;
    };

    handleRemoveSpecificColumn = (idx, key) => () => {
        const columns = [...this.state.columns];
        columns.splice(idx, 1);
        this.setState({ columns });
        deleteData(key).then((result) => {
            if (result.data.statusCode === 201) {
                notify.show(`Column successfully deleted!`, 'success');
                this.fetchItems(API_URL);
            } else {
                notify.show(`Column failed to delete!`, 'error');
            }
        });;

    };

    render() {
        return (
            <div>
      <Notifications />
        <div className="row">
          <div className="col-md-12">
            <div className="col-md-7">
              <DrawTable
                columns={this.state.columns}
                rows={this.state.rows}
                callback={this.postImage}
                changeCallback={this.handleSave}
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