import React from "react";
const ImageUpload = props => {
  return (
    <input
      id="tinyimage"
      type="file"
      refs={props.ref}
      style={{ display: "none" }}
      onChange={props.onChangeFile.bind(this)}
    />
  );
};
export default ImageUpload;
