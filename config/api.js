const ApiRootUrl = 'https://top.v-islands.com/api/';
// const ApiRootUrl = 'http://127.0.0.1:3010/api/';

module.exports = {
  IndexUrl: ApiRootUrl + 'index/index', //首页数据接口

  AuthLoginByWeixin: ApiRootUrl + 'loginByWeixin', //微信登录

  WecomeReview: ApiRootUrl + 'saveuserinfo',
  UserPrograms: ApiRootUrl + 'userprograms',
  UserReport: ApiRootUrl + 'userreports',
  ReportDetail: ApiRootUrl + 'reportdetail',
  GoodsList: ApiRootUrl + 'goodslist',
  AddtoList: ApiRootUrl + 'addcheckedlist',
  GetCheckedGoods: ApiRootUrl + 'checkedgoods',
  DelCheckedGoods: ApiRootUrl + 'delcheckedgoods',
  ApplyProgram: ApiRootUrl + 'applyprogram',
  CatelogList: ApiRootUrl + 'cateloglist',
  ProgramGoods: ApiRootUrl + 'programgoods',
  invalidProgram: ApiRootUrl + 'invalidprogram',
  SearchIndex: ApiRootUrl + 'searchindex',
  GoodsStore: ApiRootUrl + 'goodsstore',
};