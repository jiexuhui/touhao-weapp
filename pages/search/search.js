var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var server = require('../../services/server.js');

var app = getApp()
Page({
  data: {
    userInfo: wx.getStorageSync(app.globalData.userInfoKey),
    keywrod: '',
    searchStatus: false,
    goodsList: [],
    helpKeyword: [],
    historyKeyword: [],
    categoryFilter: false,
    currentSortType: 'default',
    currentSortOrder: '',
    filterCategory: [],
    defaultKeyword: {},
    hotKeyword: [],
    page: 1,
    size: 20,
    currentSortType: 'id',
    currentSortOrder: 'desc',
    categoryId: 0
  },
  //事件处理函数
  closeSearch: function () {
    wx.navigateBack()
  },
  clearKeyword: function () {
    this.setData({
      keyword: '',
      searchStatus: false
    });
  },
  onLoad: function () {
    this.setData({
      userInfo: app.getUserinfo()
    });
    this.SearchIndex();
  },

  SearchIndex() {
    let that = this;
    server.SearchIndex({ openid: that.data.userInfo.openid }).then(function (res) {
      if (res.code === 200) {
        that.setData({
          historyKeyword: res.data[0],
          defaultKeyword: res.data[0][0],
          hotKeyword: res.data[1]
        });
      }
    });
  },

  inputChange: function (e) {

    this.setData({
      keyword: e.detail.value,
      searchStatus: false
    });
    this.getHelpKeyword();
  },
  getHelpKeyword: function () {
    let that = this;
    util.request(api.SearchHelper, { keyword: that.data.keyword }).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          helpKeyword: res.data
        });
      }
    });
  },
  inputFocus: function () {
    this.setData({
      searchStatus: false,
      goodsList: []
    });

    if (this.data.keyword) {
      this.getHelpKeyword();
    }
  },
  clearHistory: function () {
    this.setData({
      historyKeyword: []
    })

    util.request(api.SearchClearHistory, {}, 'POST')
      .then(function (res) {
        console.log('清除成功');
      });
  },
  getGoodsList: function () {
    let that = this;
    server.goodsList({ openid: that.data.userInfo.openid,  keyword: that.data.keyword}).then(function (res) {
      if (res.code === 200) {
        that.setData({
          searchStatus: true,
          categoryFilter: false,
          goodsList: res.data[0],
          // filterCategory: res.data.filterCategory,
          // page: res.data.currentPage,
          // size: res.data.numsPerPage
        });
      }

      //重新获取关键词
      that.SearchIndex();
    });
  },
  onKeywordTap: function (event) {
    console.log(event.target.dataset);
    this.getSearchResult(event.target.dataset.keyword);

  },
  getSearchResult(keyword) {
    this.setData({
      keyword: keyword,
      page: 1,
      categoryId: 0,
      goodsList: []
    });

    this.getGoodsList();
  },
  openSortFilter: function (event) {
    let currentId = event.currentTarget.id;
    switch (currentId) {
      case 'categoryFilter':
        this.setData({
          'categoryFilter': !this.data.categoryFilter,
          'currentSortOrder': 'asc'
        });
        break;
      case 'priceSort':
        let tmpSortOrder = 'asc';
        if (this.data.currentSortOrder == 'asc') {
          tmpSortOrder = 'desc';
        }
        this.setData({
          'currentSortType': 'price',
          'currentSortOrder': tmpSortOrder,
          'categoryFilter': false
        });

        this.getGoodsList();
        break;
      default:
        //综合排序
        this.setData({
          'currentSortType': 'default',
          'currentSortOrder': 'desc',
          'categoryFilter': false
        });
        this.getGoodsList();
    }
  },
  selectCategory: function (event) {
    let currentIndex = event.target.dataset.categoryIndex;
    let filterCategory = this.data.filterCategory;
    let currentCategory = null;
    for (let key in filterCategory) {
      if (key == currentIndex) {
        filterCategory[key].selected = true;
        currentCategory = filterCategory[key];
      } else {
        filterCategory[key].selected = false;
      }
    }
    this.setData({
      'filterCategory': filterCategory,
      'categoryFilter': false,
      categoryId: currentCategory.id,
      page: 1,
      goodsList: []
    });
    this.getGoodsList();
  },
  onKeywordConfirm(event) {
    this.getSearchResult(event.detail.value);
  },

  //跳转详情页
  jumptodetail: function (e) {
    console.log(e);
    let that = this;
    var index = e.currentTarget.dataset.index;
    var goodsid = that.data.goodsList[index].goodsid;
    var model = JSON.stringify(that.data.goodsList[index]);
    var goodsdetailStore = wx.getStorageSync("goodsdetail");
    if (goodsdetailStore) {
      wx.removeStorageSync("goodsdetail");
    }
    wx.setStorageSync("goodsdetail", (that.data.goodsList[index]))
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

  addGoods: function (e) {
    let that = this;
    console.log(e);
    var index = e.currentTarget.dataset.index;

    var lists = wx.getStorageSync('lists');
    if (!lists) {
      lists = [];
    }
    var listids = wx.getStorageSync('listids');
    if (!listids) {
      listids = [];
    }

    lists.push(that.data.goodsList[index]);
    listids.push(that.data.goodsList[index].goodsid);

    wx.setStorageSync('lists', lists);
    wx.setStorageSync('listids', listids);

    server.addcheckedGoods({ openid: that.data.userInfo.openid, goodsid: that.data.goodsList[index].goodsid }).then(res => {
      console.log("res:", res);
      if (res.code === 200) {
        that.data.goodsList[index].isadd = 1;
        that.setData({
          goodsList: that.data.goodsList
        });
      } else {
        util.showErrorToast(res.data.msg);
      }
    });

  },
})