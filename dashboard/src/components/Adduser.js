import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { TextField, Button, Modal } from "@mui/material";
import { useHistory } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import Camera from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";
import "./Adduser.css";
import CameraIcon from "@mui/icons-material/PhotoCamera";

const isImageFile = (file) => {
  return file.type.startsWith("image/");
};

const AddUser = ({ fetchData }) => {
  const history = useHistory();
  const [photoTaken, setPhotoTaken] = useState(false);
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    mobile: "",
    image: null,
  });
  const cameraRef = useRef(null);
  const [fileError, setFileError] = useState("");
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isCameraStopping, setIsCameraStopping] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "userName") {
      // Validation for Alphabets only (userName)
      if (!/^[A-Za-z\s]+$/.test(value)) {
        console.warn("Invalid input for User Name");
        return;
      }
    }

    if (name === "email") {
      // Validation for Alphanumeric only (email)
      if (!/^[a-zA-Z0-9@.]+$/.test(value)) {
        console.warn("Invalid input for Email");
        return;
      }
    }

    if (name === "mobile") {
      // Validation for Numbers only (mobile)
      if (!/^\d+$/.test(value)) {
        console.warn("Invalid input for Mobile");
        return;
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  const onDrop = (acceptedFiles, rejectedFiles) => {
    if (rejectedFiles && rejectedFiles.length > 0) {
      console.warn(
        `Skipped "${rejectedFiles.length}" files because they are not valid.`
      );
    }

    if (acceptedFiles && acceptedFiles.length > 0) {
      const [file] = acceptedFiles;
      if (isImageFile(file)) {
        setFormData({ ...formData, image: file });
      } else {
        console.warn(
          `Skipped "${file.name}" because it is not a valid image file.`
        );
      }
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop,
  });
  useEffect(() => {
    return () => {
      if (isCameraOpen && cameraRef.current) {
        cameraRef.current.stopStream();
      }
    };
  }, [isCameraOpen]);
  const handleTakePicture = async (dataUri) => {
    if (isCameraOpen) {
      const byteString = atob(dataUri.split(",")[1]);
      const mimeString = dataUri.split(",")[0].split(":")[1].split(";")[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });

      setFormData({ ...formData, image: blob });
      setCapturedImage(dataUri);
      setPhotoTaken(true);
      if (!cameraRef.current || isCameraStopping) {
        return;
      }

      // Set a flag to indicate that the camera is currently stopping
      setIsCameraStopping(true);

      try {
        // Stop the camera stream
        await cameraRef.current.stopStream();
      } catch (error) {
        console.error("Error stopping the camera stream:", error);
      } finally {
        // Clear the stopping flag regardless of success or failure
        setIsCameraStopping(false);
        setIsCameraOpen(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (fileError) {
        console.error("File error:", fileError);
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append("userName", formData.userName);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("mobile", formData.mobile);
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      const response = await axios.post(
        "http://localhost:5000/api/users/add",
        formDataToSend
      );

      fetchData();
      console.log("User added:", response.data);
      history.push("/dashboard");
    } catch (error) {
      console.error("Add user error:", error.message);
      if (error.response) {
        console.error("Server responded with:", error.response.data);
        console.error("Status code:", error.response.status);
        console.error("Headers:", error.response.headers);
      } else if (error.request) {
        console.error("No response received");
      } else {
        console.error("Error setting up the request:", error.message);
      }
    }
  };

  const handleOpenCamera = () => {
    setIsCameraOpen(true);
  };

  const handleCancelCamera = () => {
    // Clear the photo taken flag when canceling
    setIsCameraOpen(false);
  };

  return (
    <div className="add-user-container">
      <h2>Add User</h2>
      <form onSubmit={handleSubmit}>
        <TextField
          label="User Name"
          type="text"
          name="userName"
          value={formData.userName}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          label="Mobile"
          type="text"
          name="mobile"
          value={formData.mobile}
          onChange={handleChange}
          fullWidth
          required
        />
        <div {...getRootProps()} className="dropzone-container">
          <input
            {...getInputProps()}
            className="dropzone-input"
            id="fileInput"
          />
          <p>
            Drop a picture here, or click to select a picture from your device.
          </p>
          {formData.image && (
            <div className="file-box">
              <p>{formData.image.name}</p>
            </div>
          )}
          {fileError && <p className="error-message">{fileError}</p>}
        </div>

        <div className="take-picture-button">
          <Button onClick={handleOpenCamera} startIcon={<CameraIcon />}>
            Take a picture
          </Button>
          {isCameraOpen && (
            <Modal open={isCameraOpen} onClose={handleCancelCamera}>
              <div className="camera-container">
                <Camera
                  key={isCameraOpen} // Add a key to force remount
                  ref={cameraRef}
                  onTakePhoto={handleTakePicture}
                />
                <Button onClick={handleCancelCamera}>Cancel</Button>
              </div>
            </Modal>
          )}
        </div>

        {capturedImage && (
          <div className="captured-image-container">
            <img src={capturedImage} alt="Captured" />
          </div>
        )}

        <Button type="submit" variant="contained" color="primary">
          Save
        </Button>
        <Button
          onClick={() => history.push("/dashboard")}
          variant="contained"
          color="secondary"
        >
          Cancel
        </Button>
      </form>
    </div>
  );
};

export default AddUser;
