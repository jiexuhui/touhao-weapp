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
    isbook: 1,
    startDate: "",
    startTime: "",
    endTime: "",
    params: {
      startTime: "",
      endTime: "",
      livename: "",
      openid: "",
      goodslist:"",
      isbook:1,
      formId: ""
    },
    cgoods: []
  },

  /**
  * 设置开始日期
  */
  setStartDate: function (e) {
    this.setData({
      startDate: e.detail.value
    })
  },

  /**
  * 设置开始时间
  */
  setStartTime: function (e) {
    this.setData({
      startTime: e.detail.value
    })
  },
  /**
  * 设置结束时间
  */
  setEndTime: function (e) {
    console.log(e);
    this.setData({
      endTime: e.detail.value
    })
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
    for(let i of that.data.cgoods) {
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
    this.setData({
      userInfo: wx.getStorageSync('userinfo'),
    });
    this.checkedGoods();
  },

  checkedGoods: function() {
    let that = this;
    server.checkedgoods({ openid: that.data.userInfo.openid }).then(res => {
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

  delGoods: function (e) {
    let that = this;
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];
    console.log("pages:",pages);
    console.log(e);
    var index = e.currentTarget.dataset.index;

    server.delcheckedGoods({ openid: that.data.userInfo.openid, goodsid: that.data.cgoods[index].goodsid }).then(res => {
      console.log("res:", res);
      if (res.code === 200) {
        that.data.cgoods.splice(index, 1);
        that.setData({
          cgoods: that.data.cgoods
        });
        if(pages.length === 3){
          pages[1].data.goodsdetail.isadd = 0;
          pages[1].setData({
            goodsdetail: pages[1].data.goodsdetail
          });
        }
        pages[0].goodsList();
      } else {
        util.showErrorToast(res.data.msg);
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