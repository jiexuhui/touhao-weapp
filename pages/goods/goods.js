// pages/goods/goods.js
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var server = require('../../services/server.js');
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: wx.getStorageSync(app.globalData.userInfoKey),
    goodsid:"",
    goodsdetail:[],
    thumbs: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: app.getUserinfo()
    });
    var bean = JSON.parse(options.model);
    console.log(bean);
    var thumbs = [];
    if (bean.thumbs != "" && bean.thumbs != null){
      var thumbs = bean.thumbs.split(",");
    }
    
    this.setData({
      goodsdetail: bean,
      thumbs: thumbs
    });
  },

  adddetial: function () {
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];
    var that = this;
    var lists = wx.getStorageSync('lists');
    if (!lists) {
      lists = [];
    }
    var listids = wx.getStorageSync('listids');
    if (!listids) {
      listids = [];
    }
    lists.push(that.data.goodsdetail);
    listids.push(that.data.goodsdetail.goodsid);
    wx.setStorageSync('lists', lists);
    wx.setStorageSync('listids', listids);
    
    server.addcheckedGoods({ openid: that.data.userInfo.openid, goodsid: that.data.goodsdetail.goodsid }).then(res => {
      console.log("res:", res);
      if (res.code === 200) {
        that.data.goodsdetail.isadd = 1;
        that.setData({
          goodsdetail: that.data.goodsdetail
        });
        prevPage.goodsList();
      } else {
        util.showErrorToast(res.data.msg);
      }
    });
  },

  //跳转到申请页
  jumplist: function (e) {
    console.log(e);
    let that = this;
    wx.navigateTo({
      url: '/pages/anchorcase/anchorcase',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})