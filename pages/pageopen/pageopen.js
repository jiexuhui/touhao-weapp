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
    reportid: "",
    userinfo: wx.getStorageSync('userinfo'),
    report: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      reportid: options.id
    })    
    this.reportDetail();
  },

  //获取报告详情 
  reportDetail: function () {
    let that = this;
    server.reportDetail({ reportid: that.data.reportid }).then(res => {
      console.log("res:", res);
      if (res.code === 200) {
        that.setData({
          report: res.data
        });
      } else {
        util.showErrorToast(res.msg);
      }
    });
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