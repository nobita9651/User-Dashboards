// utils/fileUtils.js

// fileUtils.js

const isImageFile = (file) => {
  const allowedExtensions = ["jpg", "jpeg", "png"];
  const fileExtension = file.name.split(".").pop().toLowerCase();
  return allowedExtensions.includes(fileExtension);
};

export { isImageFile };
