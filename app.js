/**
 * Date : 2019.12.01
 * Author : 丸子团队（波波、Chi、ONLINE.信）
 * Github 地址: https://github.com/dchijack/Travel-Mini-Program
 * GiTee 地址： https://gitee.com/izol/Travel-Mini-Program
 */
const API = require('/utils/base')

App({

  onLaunch: function () {
    API.login();
    // 获取系统状态栏信息
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        this.globalData.CustomBar = e.platform == 'android' ? e.statusBarHeight + 50 : e.statusBarHeight + 45;
        this.globalData.k_rpx_px = e.windowWidth / 750;
        this.globalData.k_px_rpx = 750 / e.windowWidth;
        this.globalData.windowWidth = e.windowWidth;
        this.globalData.platform = e.platform
        console.log("px与rpx的转换系数：")
        console.log("1rpx=",this.globalData.k_rpx_px,"px")
        console.log("1px=",this.globalData.k_px_rpx,"rpx")    
        console.log("获取到的状态栏高度", this.globalData.StatusBar)
        this.globalData.menu = wx.getMenuButtonBoundingClientRect()
        console.log(this.globalData.menu.top)
      }
    })
  },
  

  onShow: function () {
    this.globalData.user = API.getUser();
  },

  globalData: {
    user: '',
    StatusBar: 0,
    CustomBar: '',
    menu:'',
    sourcehost: "https://cdn.sysusos.shaunking.cn",
    sourcehosttemp: "https://vr.shaunking.cn",
    k_rpx_px: 1,
    k_px_rpx: 1,
    windowWidth: 750,
    platform: '',
  }

})