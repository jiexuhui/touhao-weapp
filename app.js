var util = require('./utils/util.js');
var api = require('./config/api.js');
var user = require('./services/user.js');

//app.js
//本地存储中userinfo key
const USERINFOKEY = "userinfo";

let app = {
  globalData: {
    userInfoKey: USERINFOKEY,
    hasUserInfo: !!wx.getStorageSync(USERINFOKEY), //是否获取用户信息成功标志
    userInfo: wx.getStorageSync(USERINFOKEY), //用户信息
  },
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    //获取用户的登录信息
    user.checkLogin().then(res => {
      console.log('app login')
      this.globalData.userInfo = wx.getStorageSync('userInfo');
      this.globalData.token = wx.getStorageSync('token');
    }).catch(() => {

    });
  },
  onShow: function (options) {
    // Do something when show.
    let userinfo = wx.getStorageSync(USERINFOKEY)
    if(!userinfo){
      wx.reLaunch({
        url: '/pages/auth/auth'
      });
    }else {
      wx.reLaunch({
        url: '/pages/index/index'
      });
    }
  },
  //获取用户信息
  setUserinfo: function (e) {
    //先判断缓存中时候存在用户信息
    let userinfo = wx.getStorageSync(USERINFOKEY)
    // if (!userinfo) {
      user.loginByWeixin().then(res => {
        // this.setData({
        //   userInfo: res.data.userInfo
        // });
        // console.log("userinfo1:", res);
        app.globalData.userInfo = res.data.userinfo;
        app.globalData.token = res.data.token;
        console.log("userinfo:", res.data.userinfo);
        if (res.data.userinfo.isnew === 1){
          wx.reLaunch({
            url: '/pages/welcome/welcome'
          })
        }else {
          wx.reLaunch({
            url: '/pages/index/index'
          });
        }
      }).catch((err) => {
        console.log(err)
      });
    // }
    //  else {
    //   wx.reLaunch({
    //     url: '/pages/index/index'
    //   })
    // }
  },
  getUserinfo: function() {
    return wx.getStorageSync(USERINFOKEY)
  }
};


App(app)