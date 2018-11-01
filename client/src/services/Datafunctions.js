import axios from "axios";
import { API_URL } from "../config/config";

const saveData = formFields => {
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
};

const updateData = fields => {
  axios
    .patch(API_URL, fields)
    .then(response => {
      console.log(response);
    })
    .catch(error => {
      console.log(error);
    });
};

const deleteData = key => {
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
