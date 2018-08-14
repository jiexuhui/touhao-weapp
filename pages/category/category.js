var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var server = require('../../services/server.js');
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: wx.getStorageSync(app.globalData.userInfoKey),
    // text:"这是一个页面"
    navList: [],
    goodsList: [],
    id: 0,
    currentCategory: {},
    scrollLeft: 0,
    scrollTop: 0,
    scrollHeight: 0,
    page: 1,
    size: 10000,
    currentTab:0,
    pageEnd: false
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    if (options.id) {
      that.setData({
        userInfo: app.getUserinfo(),
        id: parseInt(options.id)
      });
    }
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });
    this.getCategoryInfo();
  },
  // 滚动切换标签样式
  switchTab: function (e) {
    var that = this;
    console.log("detail:", e.detail);
    var id = this.data.navList[e.detail.current].id;
    let navListCount = that.data.navList.length;
    for (let i = 0; i < navListCount; i++) {
      if (that.data.navList[i].id == id) {
        if (i < 6) {
          that.setData({
            scrollLeft: 0,
          });
        }
        break;
      }
    }
    that.setData({
      id: id,
      page: 1,
      goodsList: [],
      pageEnd: false,
      scrollTop: 0
    });
    that.getCategoryInfo();
  },
  //页面滑动到底部
  bindDownLoad: function () { 
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    if(that.data.pageEnd){
      wx.hideLoading()
      return;
    }
    console.log("lower");
    var curpage = that.data.page + 1;
    that.setData({
      page: curpage
    });
    that.goodsList();
    wx.hideLoading();
  },

  // scroll: function (event) {
  //   this.setData({
  //     scrollTop: event.detail.scrollTop
  //   })
  // },
  getCategoryInfo: function () {
    let that = this;
    server.catelogList({ id: this.data.id })
      .then(function (res) {
        that.setData({
          navList: res.data,
          currentCategory: res.data[0]
        });

        //nav位置
        let currentIndex = 0;
        let navListCount = that.data.navList.length;
        for (let i = 0; i < navListCount; i++) {
          currentIndex += 1;
          if (that.data.navList[i].id == that.data.id) {
            that.setData({
              currentCategory: that.data.navList[i],
              currentTab: i
            });
            break;
          }
        }
        if (currentIndex > navListCount / 2 && navListCount > 5) {
          that.setData({
            scrollLeft: currentIndex * 60
          });
        }
        that.goodsList();
      });
  },

  //跳转详情页
  jumptodetail: function (e) {
    console.log(e);
    let that = this;
    var index = e.currentTarget.dataset.index;
    var goodsid = that.data.goodsList[index].goodsid;
    var model = JSON.stringify(that.data.goodsList[index]);
    var goodsdetailStore = wx.getStorageSync("goodsdetail");
    if(goodsdetailStore) {
      wx.removeStorageSync("goodsdetail");
    }
    wx.setStorageSync("goodsdetail", (that.data.goodsList[index]))
    console.log(model);
    wx.navigateTo({
      url: '/pages/goods/goods?model=' + model,
    })
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    console.log(1);
  },
  onHide: function () {
    // 页面隐藏
  },
  goodsList: function () {
    var that = this;
    server.goodsList({ openid: that.data.userInfo.openid, category: that.data.id, page: that.data.page }).then(res => {
      // console.log("res:", res);
      // console.log("data0:", res.data);
      if (res.code === 200) {
        if(res.data[0].length>0) {
          wx.setStorageSync("categoryGoods", res.data[0])
          var goodsList = that.data.goodsList.concat(wx.getStorageSync("categoryGoods"));
          that.setData({
            goodsList: goodsList
          });
        }else {
          that.setData({
            pageEnd: true,
          });  
        }
        
      } else {
        util.showErrorToast(res.data.msg);
      }
    });
  },
  onUnload: function () {
    // 页面关闭
  },
  switchCate: function (event) {
    wx.removeStorageSync("categoryGoods");
    var index = event.currentTarget.dataset.index;
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
    console.log("clientX:" + clientX + "currentTarget:" + currentTarget)
    this.setData({
      id: event.currentTarget.dataset.id,
      page: 1,
      goodsList: [],
      pageEnd: false,
      scrollTop: 0
    });

    this.getCategoryInfo();
  }
})