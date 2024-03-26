import {
  FirebaseStorage,
  getDownloadURL,
  getMetadata,
  ref,
} from "firebase/storage";

export const downloadFile = async (
  storage: FirebaseStorage,
  fileUrl: string
): Promise<{ encryptedData: string; fileName: string; fileType: string }> => {
  try {
    // Create a reference from a URL
    const storageRef = ref(storage, fileUrl);
    // Fetch file metadata
    const meta = await getMetadata(storageRef);
    const fileType =
      meta.customMetadata?.fileType || "application/octet-stream";
    const fileName = meta.customMetadata?.fileName || "File";

    // Get the download URL
    const downloadURL = await getDownloadURL(storageRef);

    // Fetch the binary data of the file
    const response = await fetch(downloadURL);
    if (!response.ok) {
      throw new Error("Failed to fetch encrypted file content");
    }

    const encryptedData = await response.text();
    return {
      encryptedData,
      fileName,
      fileType,
    };
  } catch (error) {
    console.error("Error downloading file:", error);
    throw error;
  }
};
