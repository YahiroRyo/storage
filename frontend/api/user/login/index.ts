/* eslint-disable */
import type * as Types from '../../@types'

export type Methods = {
  /** ログイン */
  post: {
    status: 200
    /** ログイン成功 */
    resBody: Types.LoginRes
    reqBody: Types.LoginReq
  }
}
