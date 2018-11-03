import axios from "axios";
import { API_URL } from "../config/config";

const getData = () => {
      axios
      .get(API_URL)
      .then(result => {
        return result;
      })
      .catch(error => {
        return {statusCode: 500, message: error}
      });
};

const saveData = formFields => {

  let promise = new Promise((resolve, reject) => {
    axios
    .post(API_URL, formFields)
    .then(response => {
      //Perform action based on response
      resolve(response);
    })
    .catch(error => {
    reject({statusCode: 500, message: error});
      //Perform action based on error
    });
  })
  return promise;
};

const updateData = fields => {
  axios
    .patch(`${API_URL}/${fields.uniqueid}`, fields)
    .then(response => {
      console.log(response)
      return response;
    })
    .catch(error => {
      console.log(error)
      return {statusCode: 500, message: error, notification: 'error'}
    });
};

const deleteData = key => {
  axios
    .delete(`${API_URL}/${key}`)
    .then(response => {
      //handle result from API
      return response;
    })
    .catch(error => {
      return {statusCode: 500, message: error, notification: 'error'}
    });
};

const uploadImage = formData => {
  console.log(formData);
  axios
    .post(`${API_URL}/pics`, formData)
    .then(result => {
      console.log(result)
      return result;
      //Perform action based on response
    })
    .catch(error => {
      console.log(error)
      return {statusCode: 500, message: error, notification: 'error'}
      //Perform action based on error
    });
};

export { saveData, updateData, deleteData, uploadImage, getData };
