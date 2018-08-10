var util = require('../../utils/util.js'); 
var api = require('../../config/api.js');
var user = require('../../services/user.js');
const app = getApp()
// pages/welcome/welcome.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: wx.getStorageSync('userinfo'),
    realname:"",
    isbook: 1
  },


  //选择领域
  pickerFiled: function (e) {
    this.setData({
      fIndex: e.detail.value
    })
  },

  //选择微博状态
  pickerStatus: function (e) {
    this.setData({
      sIndex: e.detail.value
    })
  },

  validPhone: function (e) {
    console.log("phone:",e);
    if (!util.validPhone(e.detail.value)){
      util.showErrorToast("手机格式不正确");
    }
  },

  // checkboxChange: function (e) {
  //   console.log(e);
  //    this.setData({
  //      isbook: 1
  //    });
  // },

  reviewSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为formId：', e.detail.formId);
    var formId = e.detail.formId;
    let params = e.detail.value;
    if(params.realname == "" ){
      util.showErrorToast("姓名不能为空！");
      return;
    }
    if (!util.validPhone(params.phone) || params.phone == "" ) {
      util.showErrorToast("手机格式不正确");
      return;
    }
    if (params.wechat == "") {
      util.showErrorToast("微信号不能为空！");
      return;
    }
    if (params.taobao == "") {
      util.showErrorToast("直播ID不能为空！");
      return;
    }
    let userinfo = wx.getStorageSync('userinfo');
    Object.assign(params, { isbook: params.isbook[0] }, userinfo, {formId:formId});
    console.log("params:", params);
    user.saveUserinfo(params).then(res => {
      console.log("res.data:", res.data);
       if(res.code === 200 ){
         wx.switchTab({
           url: '/pages/index/index'
         });
       }else {
         util.showErrorToast(res.msg);
       }
    }).catch((err) => {
      console.log("err:",err);
      util.showErrorToast("用户名已存在");
    })
  },

  submitreview: function (e) {
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      userInfo: wx.getStorageSync("userinfo")
    })
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
    return {
      title: '博弈选款助手',
      desc: '博弈选款助手',
      path: '/pages/index/index'
    }
  }
})