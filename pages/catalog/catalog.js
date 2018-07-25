var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var server = require('../../services/server.js');

Page({
  data: {
    navList: [],
    categoryList: [],
    currentCategory: {},
    scrollLeft: 0,
    scrollTop: 0,
    goodsCount: 0,
    scrollHeight: 0
  },
  onLoad: function (options) {
    this.getCatalog();
  },
  getCatalog: function () {
    //CatalogList
    let that = this;
    wx.showLoading({
      title: '加载中...',
    });
    server.catelogList({}).then(function (res) {
        that.setData({
          navList: res.data,
          currentCategory: res.data[0]
        });
        wx.hideLoading();
      });
    util.request(api.GoodsCount).then(function (res) {
      that.setData({
        goodsCount: res.data.goodsCount
      });
    });

  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  switchCate: function (event) {
    var that = this;
    var currentTarget = event.currentTarget;
    var index = event.currentTarget.dataset.index;
    console.log("id", event.currentTarget.dataset);
    if (this.data.currentCategory.id == event.currentTarget.dataset.id) {
      return false;
    }

    that.setData({
      currentCategory: that.data.navList[index]
    });
  }
})