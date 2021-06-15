import Https from '../../service/index'

/**
 * @description在下面定义接口数据类型
 */
interface RequestRes<T> {
  data: T
  code: number
  message: string,
  success: boolean
}

interface LoginType {
  id: string
}

/**
 * @description首页
 */
export interface UserExp{
  id: number,
  type: number,
  expireTIme: number,
  exp: number | null,
  _last_Update: number
}

export interface ZoneItem{
  id: number,
  name: string
}

export interface UserInfo{
  id: number,
  name: string
}

export interface UserMsg{
  creator: number,
  creatorName: string,
  createTime: number,
  avatar: string,
  userType: number
}

export interface ContentMsg{
  id: number,
  title: string,
  content: string,
  pictures: Array<string> | null,
  files: Array<string> | null,
  last_update: number,
  pin: boolean
}

export interface ZoneMsg{
  zone: number,
  awesome: boolean
}

export interface LikeMsg{
  likeCount: number,
  isLiked: boolean,
  likers: Array<UserInfo> | null
}

export interface CommentItem{
  id: number,
  user: number,
  userName: string,
  createTime: number,
  reply: number | null,
  content: string,
  userAvatar: string,
  userType: number
}

export interface CommentMsg{
  commentCount: number,
  comments: Array<Array<CommentItem>> | null
}

export interface PostMsg extends UserMsg,ContentMsg,ZoneMsg,LikeMsg,CommentMsg{
}

export interface PostData{
  current: number,
  pages: number,
  total: number,
  size: number
  records: Array<PostMsg> | null,
}

interface Like{
  id: number,
}

interface FileUrl{
  url: string
}

interface PostRes{
  id: number
}

/**
 * @description登录接口
 */

export const login = (params) => {
  return Https.login<RequestRes<LoginType>>(
    'https://www.blbldata.com/xiaoLogin/grantAuthorization',
    params,
    undefined,
    'POST'
  )
}

// export const getNewToken = (params) => {
//   return Https.login<RequestRes<unknown>>(
//     'https://www.blbldata.com/xiaoLogin/getAuthorityById',
//     params,
//     undefined,
//     'GET'
//   )
// }


/**
 * @description测试接口
 */

export const getUserExp = (params) => {
  return Https.get<RequestRes<UserExp>>('user/' + params.id)
}

export const getZones = () => {
  return Https.get<RequestRes<Array<ZoneItem>>>('post/zone')
}

export const getPostList = (params) => {
  return Https.get<RequestRes<PostData>>('post/home', params)
}

export const getPostDetail = (params) => {
  return Https.get<RequestRes<PostMsg>>('post/' + params.id)
}

export const putLike = (params) => {
  return Https.put<RequestRes<Like>>('post/like/' + params.id, {}, 'application/json')
}

export const deleteLike = (params) => {
  return Https.delete<RequestRes<Like>>('post/like/' + params.id, {}, 'application/json')
}

export const postComment = (params) => {
  return Https.post<RequestRes<Comment>>('comment/', params, 'application/json')
}

export const delComment = (params) => {
  return Https.delete<RequestRes<Comment>>('comment/' + params.id, {}, 'application/json')
}

export const getFileUrl = (params) => {
  return Https.get<RequestRes<FileUrl>>('file/oss', params)
}

export const putFileOss = (url, data, contentType) => {
  return Https.oss<RequestRes<undefined>>(url, data, contentType)
}

export const createPost = (params) => {
  return Https.post<RequestRes<PostRes>>('post', params, 'application/json')
}

export const delPost = (params) => {
  return Https.delete<RequestRes<undefined>>('post/' + params.id, {}, 'application.json')
}

export const editPost = (params) => {
  const {id,...data} = params;
  console.log(data);
  return Https.put<RequestRes<PostRes>>('post/' + id, data, 'application/json')
}