export default {
  pages: [
    'pages/posts/index',
    'pages/records/index',
    'pages/msgs/index',
    'pages/postDetail/index',
    'pages/commentDetail/index',
    'pages/postEditor/index',
    'pages/user/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fb89ab',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#000000',
    selectedColor: '#fb89ab',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/posts/index',
        text: '社区',
        iconPath: './images/index.png',
        selectedIconPath: './images/selected_index.png'
      },{
        pagePath: 'pages/msgs/index',
        text: '消息',
        iconPath: './images/msg.png',
        selectedIconPath: './images/selected_msg.png'
      },{
        pagePath: 'pages/records/index',
        text: '我的',
        iconPath: './images/user.png',
        selectedIconPath: './images/selected_user.png'
      }
    ]
  },
}
