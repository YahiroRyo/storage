/* eslint-disable */
import type { ReadStream } from 'fs'

export type HealthRes = {
  message: string
}

export type ErrorRes = {
  message: string
}

export type CreateUserRes = {
  token: string
}

export type CreateUserReq = {
  username: string
  email: string
  password: string
}

export type LoginRes = {
  token: string
}

export type LoginReq = {
  email: string
  password: string
}

export type LogoutRes = {
  message: string
}

export type UploadFileReq = {
  file: (File | ReadStream)
  directory_id?: string | undefined
}

export type UploadFileRes = {
  id: string
}

export type FilesReq = {
  directory_id?: string | undefined
}

export type FilesRes = {
  path: File[]
  files: (File)[]
}

export type UpdateFileReq = {
  id: string
  name: string
}

export type UpdateFileRes = {
  message: string
}

export type File = {
  id: string
  name: string
  mimetype: string
  url: string
  directory_id?: string | undefined
  createdAt: string
  updatedAt: string
}

export type DeleteFileReq = {
  id: string
}

export type CreateDirectoryReq = {
  name: string
  directory_id?: string | undefined
}

export type CreateDirectoryRes = {
  id: string
}

export type UnauthorizedError = ErrorRes

export type BadRequestError = ErrorRes

export type NotFoundError = ErrorRes

export type InternalError = ErrorRes
