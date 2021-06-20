export default {
  pages: [
    'pages/login/index',
    'pages/posts/posts/index',
    'pages/posts/postDetail/index',
    'pages/posts/commentDetail/index',
    'pages/posts/postEditor/index',
    'pages/user/user/index',
    'pages/user/msgs/index',
    'pages/user/records/index',
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
        pagePath: 'pages/posts/posts/index',
        text: '懂站社区',
        iconPath: './images/index.png',
        selectedIconPath: './images/selected_index.png'
      },{
        pagePath: 'pages/user/user/index',
        text: '个人中心',
        iconPath: './images/user.png',
        selectedIconPath: './images/selected_user.png'
      }
    ]
  },
}
