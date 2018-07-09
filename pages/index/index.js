//index.js
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var server = require('../../services/server.js');
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: wx.getStorageSync(app.globalData.userInfoKey),
    hasUserInfo: app.globalData.hasUserInfo,
    imgUrls: [],
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 800,
    isShowUserPannel:false, //是否显示个人中心面板
    goodslist:[],
    addgoods:[]
  },
  onLoad: function () {
    this.setData({
      userInfo: app.getUserinfo()
    });
    this.goodsList();
  },

  goodsList: function () {
    let that = this;
    server.goodsList({ openid: that.data.userInfo.openid }).then(res => {
      console.log("res:", res);
      console.log("data0:", res.data);
      if (res.code === 200) {
        that.setData({
          goodslist: res.data[0],
          imgUrls: res.data[1]
        });
      } else {
        util.showErrorToast(res.data.msg);
      }
    });
  },

  showUserPannel: function(){
    let isShow = this.data.isShowUserPannel
    if (!isShow) {
      isShow = true
    } else {
      isShow = false
    }
    this.setData({
      isShowUserPannel: isShow
    })
  },
  //跳转详情页
  gotoDetail: function(e) {
    let that = this;
    var index = e.currentTarget.dataset.index;
    var goodsid = that.data.imgUrls[index].goodsid;
    var model = JSON.stringify(that.data.imgUrls[index]);
    wx.navigateTo({
      url: '/pages/goods/goods?model=' + model,
    })
  },

  //跳转详情页
  jumptodetail: function (e) {
    console.log(e);
    let that = this;
    var index = e.currentTarget.dataset.index;
    var goodsid = that.data.goodslist[index].goodsid;
    var model = JSON.stringify(that.data.goodslist[index]);
    wx.navigateTo({
      url: '/pages/goods/goods?model=' + model,
    })
  },

  //跳转到申请页
  jumplist: function (e) {
    console.log(e);
    let that = this;
    wx.navigateTo({
      url: '/pages/anchorcase/anchorcase',
    })
  },

  addGoods: function(e) {
    let that = this;
    console.log(e);
    var index = e.currentTarget.dataset.index;
    
    var lists = wx.getStorageSync('lists');
    if(!lists){
      lists = [];
    } 
    var listids = wx.getStorageSync('listids');
    if(!listids) {
      listids = [];
    }

    lists.push(that.data.goodslist[index]);
    listids.push(that.data.goodslist[index].goodsid);

    wx.setStorageSync('lists', lists);
    wx.setStorageSync('listids', listids);

    server.addcheckedGoods({ openid: that.data.userInfo.openid, goodsid: that.data.goodslist[index].goodsid}).then(res => {
      console.log("res:", res);
      if (res.code === 200) {
        that.data.goodslist[index].isadd = 1;
        that.setData({
          goodslist: that.data.goodslist
        });
      } else {
        util.showErrorToast(res.data.msg);
      }
    });
    
  },
  /**
   * 用户点击右上角分享
   */
   onShareAppMessage: function () {
    return {
      title: '微岛主播小助手',
      desc: '微岛主播小助手',
      path: '/pages/index/index'
    }
  }
})

