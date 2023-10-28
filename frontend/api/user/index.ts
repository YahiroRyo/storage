/* eslint-disable */
import type * as Types from '../@types'

export type Methods = {
  /** ユーザー作成 */
  post: {
    status: 200
    /** ユーザー作成成功 */
    resBody: Types.CreateUserRes
    reqBody: Types.CreateUserReq
  }
}
