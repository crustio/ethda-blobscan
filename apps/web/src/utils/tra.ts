const tra = (uint8Array: any, mintype: any) => {
  const blob = new Blob([uint8Array], { type: "image/plain" });
  return blob;
};
export default tra;
