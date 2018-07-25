// pages/anchorcase/anchorcase.js
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var server = require('../../services/server.js');

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: wx.getStorageSync('userinfo'),
    program:{},
    cgoods: []
  },

  reviewSubmit: function (e) {
    let that = this;
    var formId = e.detail.formId;
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    let params = e.detail.value;
    if (params.livename == "") {
      util.showErrorToast("播单名称不能为空");
      return;
    }
    if (params.livedate == "") {
      util.showErrorToast("直播日期不能为空！");
      return;
    }
    if (params.livestime == "") {
      util.showErrorToast("直播开始时间不能为空！");
      return;
    }
    if (params.liveetime == "") {
      util.showErrorToast("直播结束时间不能为空！");
      return;
    }
    that.data.params.formId = formId;
    that.data.params.livename = params.livename;
    that.data.params.isbook = params.isbook[0];
    that.data.params.startTime = params.livedate + " " + params.livestime + ":00";
    that.data.params.endTime = params.livedate + " " + params.liveetime + ":00";
    let userinfo = wx.getStorageSync('userinfo');
    that.data.params.openid = userinfo.openid;

    let goodslist = [];
    for (let i of that.data.cgoods) {
      goodslist.push(i.goodsid);
    }
    that.data.params.goodslist = goodslist.toString();
    server.applyProgram(that.data.params).then(res => {
      console.log("res:", res);
      if (res.code === 200) {
        prevPage.goodsList();
        wx.showToast({
          title: '提交成功',
          icon: 'success',
          duration: 2000
        })
        wx.switchTab({
          url: '/pages/index/index'
        });
      } else {
        util.showErrorToast(res.msg);
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var bean = JSON.parse(options.model);
    this.setData({
      userInfo: wx.getStorageSync('userinfo'),
      program: bean
    });
    this.programgoods();
  },

  programgoods: function () {
    let that = this;
    server.programgoods({ goodslist: that.data.program.goodslist }).then(res => {
      console.log("res:", res);
      if (res.code === 200) {
        that.setData({
          cgoods: res.data
        });
      } else {
        util.showErrorToast(res.data.msg);
      }
    });
  },

  invalidProgram: function (e) {
    var that = this;
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];
    wx.showModal({
      title: '确定取消吗？',
      content: '',
      success: function (res) {
        if (res.confirm) {
          server.invalidProgram({ id: that.data.program.id }).then(res => {
            console.log("res:", res);
            if (res.code === 200) {
              that.data.program.status = 2;
              that.setData({
                program: that.data.program
              });
              wx.showToast({
                title: '取消成功',
                icon: 'success',
                duration: 2000
              })
              prevPage.goodsList();
            } else {
              util.showErrorToast(res.data.msg);
            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  //跳转详情页
  viewreport: function (e) {
    wx.navigateTo({
      url: '/pages/pageopen/pageopen?id=' + this.data.program.reportid,
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