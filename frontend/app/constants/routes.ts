export const routes = {
  ROOT: () => "/",
  LOGIN: () => "/login",
  REGISTER: () => "/register",
  DATABOX: (directoryId?: string) =>
    directoryId ? `/databox/${directoryId}` : `/databox`,
  CREATE_DIR: (directoryId?: string) =>
    directoryId ? `/databox/${directoryId}/createDir` : `/databox/createDir`,
  UPDATE_FILE: (directoryId?: string) =>
    directoryId ? `/databox/${directoryId}/uploadFile` : `/databox/uploadFile`,
  PREVIEW_IMAGE: (fileId: string, directoryId?: string) =>
    directoryId
      ? `/databox/${directoryId}/previewImage/${fileId}`
      : `/databox/previewImage/${fileId}`,
  PREVIEW_VIDEO: (fileId: string, directoryId?: string) =>
    directoryId
      ? `/databox/${directoryId}/previewVideo/${fileId}`
      : `/databox/previewVideo/${fileId}`,
  SETTING_FILE: (fileId: string, directoryId?: string) =>
    directoryId
      ? `/databox/${directoryId}/setting/${fileId}`
      : `/databox/setting/${fileId}`,
  DELETE_FILE: (fileId: string, directoryId?: string) =>
    directoryId
      ? `/databox/${directoryId}/delete/${fileId}`
      : `/databox/delete/${fileId}`,
};
