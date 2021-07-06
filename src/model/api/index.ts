import Https from '../../service/index'

/**
 * @description登录接口类型
 */
interface RequestData<T>{
  data: T
  errorCode: number
  errorMessage: string
}

interface IdType {
  ownId: number,
  unionId: string
}

/**
 * @description登录接口
 */
export const login = (params) => {
  return Https.login<RequestData<IdType>>(
    'https://www.blbldata.com/xiaoLogin/grantAuthorization/',
    params,
    undefined,
    'POST'
  )
}


/**
 * @description测试接口类型
 */
interface RequestRes<T>{
  data: T
  message: string
  code: number
  success: boolean
}

export interface UserExp{
  id: number,
  type: number,
  expireTime: number,
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

interface CommentRes{
  id: number
}

export interface MessageItem{
  id: string
  emitter: number,
  emitterName: string,
  emitterAvatar: string,
  fromType: number,
  fromId: number,
  fromContent: string,
  toType: number,
  toId: number | null,
  toContent: string | null,
  create_time: number,
  readed: boolean
}

interface MessageData{
  records: Array<MessageItem>,
  size: number,
  total: number,
  pages: number,
  current: number
}

export interface RecordMsg{
  id: number,
  creator: number | null,
  createTime: number | null,
  content: string | null,
  last_update: number | null,
  creatorName: string | null,
  avatar: string | null
}

interface RecordData{
  records: Array<RecordMsg>,
  size: number,
  total: number,
  pages: number,
  current: number
}


/**
 * @description测试接口
 */
export const getToken = (params) => {
  return Https.get<RequestRes<undefined>>('demo/', params);
}

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
  return Https.post<RequestRes<CommentRes>>('comment', params, 'application/json')
}

export const delComment = (params) => {
  return Https.delete<RequestRes<CommentRes>>('comment/' + params.id, {}, 'application/json')
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
  return Https.put<RequestRes<PostRes>>('post/' + id, data, 'application/json')
}

export const getMessage = (params) => {
  return Https.get<RequestRes<MessageData>>('message', params);
}

export const getMsgNum = () => {
  return Https.get<RequestRes<number>>('message/count');
}

export const putMsgRead = (params) => {
  return Https.put<RequestRes<undefined>>('message/read/' + params.id, {}, 'application/json');
}

export const getRecords = (params) => {
  return Https.get<RequestRes<RecordData>>('post/my', params);
}