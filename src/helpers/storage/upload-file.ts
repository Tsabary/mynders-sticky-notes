import {
  FirebaseStorage,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";

export async function uploadFile(
  user: User,
  storage: FirebaseStorage,
  file: Blob,
  folderName: string,
  fileName: string,
  fileNameInMeta: string,
  fileTypeInMeta: string
): Promise<{ url: string; size: number }> {
  if (!user) {
    throw new Error("Unauthenticated user");
  }

  if (user.storage_usage > 1024 * 1024 * 1024) {
    alert("You've used 1gb of storage. Upgrade to BOLT for more.");
    throw new Error("Storage quota reached");
  }
  // Upload the encrypted blob to Firebase Storage
  const fileRef = ref(storage, `${folderName}/${fileName}`);
  const customMetadata = {
    customMetadata: { fileName: fileNameInMeta, fileType: fileTypeInMeta },
  };
  await uploadBytes(fileRef, file, customMetadata);

  const url = await getDownloadURL(fileRef);

  return { url, size: file.size };
}
