import axios from "axios";

const PINATA_JWT = import.meta.env.VITE_PINATA_JWT;

export async function uploadFileToIPFS(file) {
  const formData = new FormData();
  formData.append("file", file);

  const metadata = JSON.stringify({
    name: file.name,
  });
  formData.append("pinataMetadata", metadata);

  const options = JSON.stringify({
    cidVersion: 0,
  });
  formData.append("pinataOptions", options);

  try {
    const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
      maxBodyLength: "Infinity",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${PINATA_JWT}`,
      },
    });

    const ipfsHash = res.data.IpfsHash;
    return `ipfs://${ipfsHash}`;
  } catch (error) {
    console.error("Error uploading to IPFS:", error);
    throw error;
  }
}
