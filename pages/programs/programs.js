// pages/reports/reports.js
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var server = require('../../services/server.js');
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userinfo: wx.getStorageSync('userinfo'),
    openid: "",
    programs: [],
    navList:[
      {id:1000,name:"全部"},
      { id: 0, name: "待审核" },
      { id: 1, name: "已通过" },
      { id: 2, name: "已取消" }
    ],
    scrollLeft: 0,
    scrollTop: 0,
    scrollHeight: 0,
    status: 1000,
    currentTab: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userinfo: wx.getStorageSync('userinfo'),
    }); 
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });
    this.userPrograms();
  },

  // 滚动切换标签样式
  switchTab: function (e) {
    console.log("detail:", e.detail);
    var id = this.data.navList[e.detail.current].id;
    this.setData({
      status: id
    });
    this.userPrograms();
  },

  userPrograms: function () {
    let that = this;
    server.userPrograms({ openid: that.data.userinfo.openid, status: that.data.status }).then(res => {
      console.log("res:", res);
      if (res.code === 200) {
          that.setData({
            programs: res.data
          });
      } else {
        util.showErrorToast(res.data.msg);
      }
    });
  },

  switchCate: function (event) {
    if (this.data.id == event.currentTarget.dataset.id) {
      return false;
    }
    var that = this;
    var clientX = event.detail.x;
    var currentTarget = event.currentTarget;
    if (clientX < 60) {
      that.setData({
        scrollLeft: currentTarget.offsetLeft - 60
      });
    } else if (clientX > 330) {
      that.setData({
        scrollLeft: currentTarget.offsetLeft
      });
    }
    this.setData({
      status: event.currentTarget.dataset.id
    });

    this.userPrograms();
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
  
  },
  //跳转详情页
  jumptodetail: function (e) {
    console.log(e);
    let that = this;
    var index = e.currentTarget.dataset.index;
    var model = JSON.stringify(that.data.programs[index]);
    wx.navigateTo({
      url: '/pages/programdetail/programdetail?model=' + model,
    })
  },
})