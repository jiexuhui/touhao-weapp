const ApiRootUrl = 'https://top.v-islands.com/api/';

module.exports = {
  IndexUrl: ApiRootUrl + 'index/index', //首页数据接口

  AuthLoginByWeixin: ApiRootUrl + 'loginByWeixin', //微信登录

  WecomeReview: ApiRootUrl + 'saveuserinfo',

  UserReport: ApiRootUrl + 'userreports',
  ReportDetail: ApiRootUrl + 'reportdetail',
  GoodsList: ApiRootUrl + 'goodslist',
  AddtoList: ApiRootUrl + 'addcheckedlist',
  GetCheckedGoods: ApiRootUrl + 'checkedgoods',
  DelCheckedGoods: ApiRootUrl + 'delcheckedgoods',
  ApplyProgram: ApiRootUrl + 'applyprogram',
};