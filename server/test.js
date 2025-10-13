function getPublicIdFromUrl(url) {
  // Remove the base URL up to /upload/
  const parts = url.split("/upload/");
  if (parts.length < 2) return null;

  // Remove version and get path
  let path = parts[1]; // e.g. v1699999999/users/abc123.jpg
  // Remove version number if present
  path = path.replace(/^v\d+\//, ""); // users/abc123.jpg
  // Remove file extension
  path = path.replace(/\.[^/.]+$/, ""); // users/abc123

  return path; // this is the public_id
}

// Example:
const url = "https://res.cloudinary.com/demo/image/upload/v1699999999/users/abc123.jpg";
console.log(getPublicIdFromUrl(url)); // outputs: "users/abc123"