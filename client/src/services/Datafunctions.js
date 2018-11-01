import axios from "axios";
import { API_URL } from "../config/config";

const saveData = formFields => {
  axios
    .post(API_URL, formFields)
    .then(response => {
      //Perform action based on response
    })
    .catch(error => {
      console.log(error);
      //Perform action based on error
    });
};

const updateData = fields => {
  axios
    .patch(API_URL, fields)
    .then(response => {})
    .catch(error => {});
};

const deleteData = key => {
  axios
    .delete(API_URL, { data: { uniquekey: key } })
    .then(response => {
      //handle result from API
    })
    .catch(error => {
      this.fetchItems(API_URL);
    });
};

const uploadImage = formData => {
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
};

export { saveData, updateData, deleteData, uploadImage };
