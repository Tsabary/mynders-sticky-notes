import { FirebaseStorage } from "firebase/storage";
import { uploadFile } from "./upload-file";
import { resizeImage } from "./resize-image";

export async function uploadImage(
  user: User,
  storage: FirebaseStorage,
  uri: string,
  folderName: string,
  fileName: string,
  fileNameInMeta: string,
  fileTypeInMeta: string,
  encryptFile: (
    uri: string,
    fileName: string,
    fileTypeInMeta: string
  ) => Promise<Blob>,
  maxWidth: number = 1600
): Promise<{ url: string; size: number; preview: string }> {
  /** First let's create and upload a small blurred preview thumbnail */
  const previewFileUri = await resizeImage(uri, 400, 20);
  const response = await fetch(previewFileUri);
  const blob: Blob = await response.blob();
  const previewFile = new File([blob], fileName, { type: fileTypeInMeta });
  const { url: preview } = await uploadFile(
    user,
    storage,
    previewFile,
    folderName,
    fileName + "-preview",
    fileNameInMeta,
    fileTypeInMeta
  );

  /** Then let's slghtly resize the bigger version, encryp it and upload */
  const fullsizeFileUri = await resizeImage(uri, maxWidth);
  const fullsizeFile = await encryptFile(
    fullsizeFileUri,
    fileName,
    fileTypeInMeta
  );

  const { url, size } = await uploadFile(
    user,
    storage,
    fullsizeFile,
    folderName,
    fileName,
    fileNameInMeta,
    fileTypeInMeta
  );

  return { url, size, preview };
}
