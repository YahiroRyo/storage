/* eslint-disable */
import type * as Types from '../@types'

export type Methods = {
  /** ディレクトリ作成 */
  post: {
    status: 200
    /** ディレクトリ作成成功 */
    resBody: Types.CreateDirectoryRes
    reqBody: Types.CreateDirectoryReq
  }
}
