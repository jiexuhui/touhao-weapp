const util = require('../utils/util.js');
const api = require('../config/api.js');

function userReports(params) {
  return new Promise(function (resolve, reject) {
    //登录远程服务器
    util.request(api.UserReport, params, 'POST').then(res => {
      if (res.code === 200) {
        resolve(res);
      } else {
        reject(res);
      }
    }).catch((err) => {
      reject(err);
    });
  });
}

function reportDetail(params) {
  return new Promise(function (resolve, reject) {
    //登录远程服务器
    util.request(api.ReportDetail, params, 'POST').then(res => {
      if (res.code === 200) {
        resolve(res);
      } else {
        reject(res);
      }
    }).catch((err) => {
      reject(err);
    });
  });
}

function goodsList(params) {
  return new Promise(function (resolve, reject) {
    //登录远程服务器
    util.request(api.GoodsList, params, 'POST').then(res => {
      if (res.code === 200) {
        resolve(res);
      } else {
        reject(res);
      }
    }).catch((err) => {
      reject(err);
    });
  });
}

function goodsDetail() {
  return new Promise(function (resolve, reject) {
    //登录远程服务器
    util.request(api.GoodsList, {}, 'POST').then(res => {
      if (res.code === 200) {
        resolve(res);
      } else {
        reject(res);
      }
    }).catch((err) => {
      reject(err);
    });
  });
}

function addcheckedGoods(params) {
  return new Promise(function (resolve, reject) {
    //登录远程服务器
    util.request(api.AddtoList, params, 'POST').then(res => {
      if (res.code === 200) {
        resolve(res);
      } else {
        reject(res);
      }
    }).catch((err) => {
      reject(err);
    });
  });
}

function delcheckedGoods(params) {
  return new Promise(function (resolve, reject) {
    //登录远程服务器
    util.request(api.DelCheckedGoods, params, 'POST').then(res => {
      if (res.code === 200) {
        resolve(res);
      } else {
        reject(res);
      }
    }).catch((err) => {
      reject(err);
    });
  });
}

function checkedgoods(params) {
  return new Promise(function (resolve, reject) {
    //登录远程服务器
    util.request(api.GetCheckedGoods, params, 'POST').then(res => {
      if (res.code === 200) {
        resolve(res);
      } else {
        reject(res);
      }
    }).catch((err) => {
      reject(err);
    });
  });
}

function applyProgram(params) {
  return new Promise(function (resolve, reject) {
    //登录远程服务器
    util.request(api.ApplyProgram, params, 'POST').then(res => {
      if (res.code === 200) {
        resolve(res);
      } else {
        reject(res);
      }
    }).catch((err) => {
      reject(err);
    });
  });
}

module.exports = {
  userReports,
  reportDetail,
  goodsList,
  addcheckedGoods,
  checkedgoods,
  delcheckedGoods,
  applyProgram
};
