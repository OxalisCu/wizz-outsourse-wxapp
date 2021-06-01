import Https from '../../service/index'

/**
 * @description在下面定义接口数据类型
 */
interface RequestRes<T> {
  data: T
  errorCode: number
  errorMessage: string
}

interface GetTagsResSubArr {
  label: string
  value: number
}
interface GetTagsResArr {
  label: string
  sub: Array<GetTagsResSubArr>
  value: number
}

interface TagsList {
  tagsList: Array<GetTagsResArr>
}

interface ListArrResType {
  OfficialVerifyDesc: string
  face: string
  name: string
  fans: number
  mid: number
}

interface ListList {
  upInformationList: Array<ListArrResType>
  total: number
}

interface UpList {
  total: number
  upListTotal?: number
  upList: Array<ListArrResType>
}

interface incRankListResType {
  fans: number
  incDecNumber: number
  name: string
  imageUrl: string
  mid: number
}

interface IncRankList {
  incRankData: Array<incRankListResType>
  decRankData: Array<incRankListResType>
  rankData: Array<incRankListResType>
  total: number
}

interface VideoListArrResType {
  title: string
  description: string
  pic: string
  name: string
  view: number
  aid: number
  mid: number
  danmaku: number
  like: number
  favourite: number
  reply: number
  tagList: string[]
}

interface VideoList {
  videoList: Array<VideoListArrResType>
  videoInformationList: Array<VideoListArrResType>
  total: number
  videoListTotal?: number
}

interface TagsListArrResType {
  name: string
  newLike: number
  newView: number
  newCount: number
  newLikeDay: number
  newViewDay: number
  newCountDay: number
  newLikeWeek: number
  newViewWeek: number
  newCountWeek: number
  newLikeMon: number
  newViewMon: number
  newCountMon: number
  id: number
}

interface TagsList_2 {
  rankList: Array<TagsListArrResType>
  // total: number
}

interface SearchTagsList {
  tagInformationList: Array<TagsListArrResType>
}

/**
 * @description以下是详情页
 *
 */

interface PersonalTags {
  tagName: string
  tagType: number
}

interface PersonalDetail {
  face: string
  name: string
  OfficialVerifyDesc: string
  sign: string
  tags: Array<PersonalTags>
  fans: number
  archiveView: number //播放总数
  likes: number
  totalFavourite: number //收藏
  archiveCount: number //作品总数
  totalCount: number //充电总数
}

interface PersonalRank {
  tagName: string
}

interface PersonalDetailRank {
  rank: string
  typeid: Array<PersonalRank>
}

interface TagsDetailList {
  name: string
  ctime: number
  newView: number
  subscribed: number
  newCount: number
}

interface CanlandarData {
  time: number
}

interface CanlandarDataList {
  canlandarData: CanlandarData
}

interface DurationType {
  row: string
  value: number
}

interface Pubdate {
  row: string
  value: number
}

interface VideoCanvasData {
  duration: Array<DurationType>
  pubdate: Array<Pubdate>
}

interface VideoHistoryData {
  likes: Array<DurationType>
  fans: Array<DurationType>
  archiveView: Array<DurationType>
  archiveCount: Array<DurationType>
  articleView: Array<DurationType>
  articleCount: Array<DurationType>
  totalCount: Array<DurationType>
  danmu: Array<DurationType>
  collect: Array<DurationType>
  comments: Array<DurationType>
  likesInc: Array<DurationType>
  fansInc: Array<DurationType>
  archiveViewInc: Array<DurationType>
  archiveCountInc: Array<DurationType>
  articleViewInc: Array<DurationType>
  articleCountInc: Array<DurationType>
  totalCountInc: Array<DurationType>
  danmuInc: Array<DurationType>
  collectInc: Array<DurationType>
  commentsInc: Array<DurationType>
}

interface VideoHistoryDetailOrigin {
  view: Array<DurationType>
  danmaku: Array<DurationType>
  favourite: Array<DurationType>
  like: Array<DurationType>
  reply: Array<DurationType>
  share: Array<DurationType>
}
interface VideoHistoryDetailInc {
  viewInc: Array<DurationType>
  danmakuInc: Array<DurationType>
  favouriteInc: Array<DurationType>
  likeInc: Array<DurationType>
  replyInc: Array<DurationType>
  shareInc: Array<DurationType>
}

interface VideoHistoryDetail {
  origin: VideoHistoryDetailOrigin
  increase: VideoHistoryDetailInc
}

interface TagHistoryDetail {
  v: Array<Pubdate>
  co: Array<Pubdate>
  s: Array<Pubdate>
  d: Array<Pubdate>
  l: Array<Pubdate>
  r: Array<Pubdate>
  c: Array<Pubdate>
}

interface TagHistoryDetailType {
  history: TagHistoryDetail
}

interface WordCloud {
  word: string
  weight: number
}

interface WordCloudType {
  description: Array<WordCloud>
  taglist: Array<WordCloud>
  title: Array<WordCloud>
}

interface LoginType {
  id: string
}

/**
 * @description在下面定义接口
 */
export const getTags = () => {
  return Https.get<RequestRes<TagsList>>('xiao/tags/queryAllTags')
}

export const getXiaoLists = (params) => {
  return Https.get<RequestRes<ListList>>('xiao/up/queryFansRankData', params)
}

export const getLists = (params) => {
  return Https.get<RequestRes<ListList>>('api/up/queryFansRankData', params)
}

export const searchLists = (params) => {
  return Https.get<RequestRes<UpList>>('api/up/searchUp', params)
}

export const getRankLists = (params) => {
  return Https.get<RequestRes<IncRankList>>('api/up/queryFansRankData', params)
}

export const getVideoRankLists = (params) => {
  return Https.get<RequestRes<VideoList>>(
    'api/video/queryVideoRankData',
    params
  )
}

export const searchVideoRankLists = (params) => {
  return Https.get<RequestRes<VideoList>>('api/video/searchVideo', params)
}

export const getTagsList = (params) => {
  return Https.get<RequestRes<TagsList_2>>('api/tags/queryRank', params)
}

export const searchTags = (params) => {
  return Https.get<RequestRes<SearchTagsList>>('api/tags/queryTag', params)
}

export const getPersonalDetail = (params) => {
  return Https.get<RequestRes<PersonalDetail>>('api/up/queryUp', params)
}

export const getPersonalDetailRank = (params) => {
  return Https.get<RequestRes<Array<PersonalDetailRank>>>(
    'api/up/queryUpRankByMid',
    params
  )
}

export const getPersonalVideo = (id) => {
  return Https.get<RequestRes<VideoList>>('api/video/queryLimitVideo', id)
}

export const getTagsListById = (id) => {
  return Https.get<RequestRes<TagsDetailList>>('api/tags/queryTagById', id)
}

export const getCanlandar = (id) => {
  return Https.get<RequestRes<CanlandarDataList>>('api/up/queryUpCanlandar', id)
}

export const getCanvasVideo = (id) => {
  return Https.get<RequestRes<VideoCanvasData>>('api/up/queryUpStatistics', id)
}

export const getVideoHistory = (params) => {
  return Https.get<RequestRes<VideoHistoryData>>(
    'api/video/queryVideoHistory',
    params
  )
}

export const getVideoHistoryDetail = (params) => {
  return Https.get<RequestRes<VideoHistoryDetail>>(
    'api/video/queryVideoHistoryByAid',
    params
  )
}

export const getTagDetailHistory = (id) => {
  return Https.get<RequestRes<TagHistoryDetailType>>(
    'api/tags/queryTagHistory',
    id
  )
}

export const getTagDetailHistroyUp = (params) => {
  return Https.get<RequestRes<UpList>>('api/tags/queryUpList', params)
}

export const getTagDetailHistoryVideo = (params) => {
  return Https.get<RequestRes<VideoList>>('api/tags/queryVideoList', params)
}

export const login = (params) => {
  return Https.post<RequestRes<LoginType>>(
    'xiaoLogin/grantAuthorization',
    params,
    undefined
  )
}
export const getWordCloud = (id) => {
  return Https.get<RequestRes<WordCloudType>>('api/up/queryWordCloud', id)
}

export const getNewToken = (id) => {
  return Https.get<RequestRes<unknown>>('xiaoLogin/getAuthorityById',id)
}

// api/tags/queryTagById
