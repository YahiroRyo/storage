/* eslint-disable */
import type * as Types from '../@types'

export type Methods = {
  /** ファイル一覧取得 */
  get: {
    status: 200
    /** ファイル一覧取得 */
    resBody: Types.FilesRes
    reqBody: Types.FilesReq
  }

  /** ファイルアップロード */
  post: {
    status: 200
    /** ファイルアップロード成功 */
    resBody: Types.UploadFileRes
    reqBody: Types.UploadFileReq
  }

  /** ファイル更新 */
  put: {
    status: 200
    /** ファイル更新成功 */
    resBody: Types.UpdateFileRes
    reqBody: Types.UpdateFileReq
  }

  /** ファイル削除 */
  delete: {
    reqBody: Types.DeleteFileReq
  }
}
