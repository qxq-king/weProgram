/**
 * Author : 丸子团队（波波、Chi、ONLINE.信）
 * Github 地址: https://github.com/dchijack/Travel-Mini-Program
 * GiTee 地址： https://gitee.com/izol/Travel-Mini-Program
 */
const API = require('../../utils/api')
var app = getApp()

Page({

  data: {
    posts: [],
    page:1,
    siteInfo: '',
    indicatorDots: !1,
    autoplay: !0,
    interval: 3e3,
    currentSwiper: 0,
    navBarHeight: app.globalData.StatusBar,
    placeHolder: '输入你想知道的内容...',
    autoFocus: false,
    inputEnable: true,
    isLastPage: false,
    rollpositions: 0,
    windowSize: wx.getSystemInfoSync(),
    windowHeight: 0,
    windowWidth: 0,
    opacity:0,
    navBarTitleHeight: (app.globalData.menu.top - app.globalData.StatusBar) * 2 + app.globalData.StatusBar+app.globalData.menu.height + 5,
    logoblockTop_r: 100,//rpx
    logoblockTop: 100 * app.globalData.k_rpx_px,
    logoblockHeight: app.globalData.menu.height * 2,
    logoblockWidth:  app.globalData.menu.height * 6,
    titleTextHeight: app.globalData.StatusBar + (150*app.globalData.k_rpx_px),
    titleTextBarHeight: app.globalData.menu.top,
    titleFontSize_r: 58,
    titleFontSize: 58,//rpx
    titleTextLeft:  40, 
    titleTextLeft1: 40,
    titleTextLeft2: 40,
    subtitleTextHeight: app.globalData.StatusBar + (150*app.globalData.k_rpx_px),
    mobile: true,
  },

  onLoad: function () {
    let that=this;
    wx.getSystemInfo({
      success: function (a) {
        that.setData({
          isIphoneX: a.model.match(/iPhone X/gi)
        });
      }
    });
    if(app.globalData.platform=="windows"){this.setData({mobile: false})}
    else{this.setData({mobile: true})}
    console.log(app.globalData.platform)
    console.log(this.data.mobile)
    this.getSiteInfo();
    this.getStickyPosts();
    this.getCategories({per_page:2});
    this.getAdvert();
    this.getPostList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  onClear:function(){
    this.setData({
      searchKey:'',
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.setData({
      page:1,
      posts:[],
      isLastPage: false
    })
    this.getPostList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (!this.data.isLastPage) {
      this.getPostList({
        page:this.data.page
      })
    }
  },

  /**
   * 监听用户滑动页面事件s
   */
	onPageScroll (e) {
    this.setData({
      rollpositions: e.scrollTop,
    })
    this.sumfunction = (150*app.globalData.k_rpx_px)+this.data.navBarHeight-e.scrollTop*0.5;
    if (this.sumfunction > this.data.navBarHeight){
      this.setData({
        titleTextHeight: this.sumfunction
      })
    }else{
      this.setData({
        titleTextHeight: this.data.navBarHeight
      })
    }
    this.long = this.data.subtitleTextHeight-this.data.navBarHeight
    this.dy = this.data.titleTextHeight-this.data.navBarHeight
    this.persent = 1 - (this.dy / this.long)
    let query = wx.createSelectorQuery();
    let that = this;
    query.select('#texttitle').boundingClientRect(function (res) {
      that.setData({
        titleTextLeft2: (app.globalData.windowWidth - res.width)/2 * app.globalData.k_px_rpx
      })
    }).exec();
    this.data.titleTextLeft1 = (app.globalData.menu.height * 3 * app.globalData.k_px_rpx + 10) * this.persent + 40
    this.setData({
      opacity: this.persent,
      logoblockTop: app.globalData.menu.top + ((this.data.logoblockTop_r * app.globalData.k_rpx_px - app.globalData.menu.top)*(1-this.persent)),
      logoblockHeight: app.globalData.menu.height * (2-this.persent),
      logoblockWidth:  app.globalData.menu.height * (2-this.persent) * 3,
      titleFontSize:  (this.data.titleFontSize_r - app.globalData.menu.height) * (1 - this.persent) + app.globalData.menu.height,
      titleTextLeft: this.data.titleTextLeft1 * (1 - this.persent) + (this.data.titleTextLeft2 * this.persent),
    })
	},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: this.data.siteInfo.name ,
      path: '/pages/index/index'
    }
  },

  getSiteInfo: function() {
    API.getSiteInfo().then(res => {
      this.setData({
        siteInfo: res
      })
    })
    .catch(err => {
      console.log(err)
    })
  },

  onInput: function(e) {
    this.setData({
      searchKey: e.detail.value
    })
  },

  currentChange: function(e) {
    this.setData({
      currentSwiper: e.detail.current
    });
  },

  getStickyPosts: function() {
    API.getStickyPosts().then(res => {
      this.setData({
        stickyPost: res
      })
    })
    .catch(err => {
      console.log(err)
    })
  },

  getCategories: function(args) {
    API.getCategories(args).then(res => {
      this.setData({
        category: res
      })
    })
    .catch(err => {
      console.log(err)
    })
  },

  getPostList: function(data) {
    API.getPostsList(data).then(res => {
      let args = {}
      if (res.length < 10) {
        this.setData({
          isLastPage: true,
          loadtext: '到底啦',
          showloadmore: false
        })
      }
      if (this.data.isBottom) {
        args.posts = [].concat(this.data.posts, res)
        args.page = this.data.page + 1
      } else {
        args.posts = [].concat(this.data.posts, res)
        args.page = this.data.page + 1
      }
      this.setData(args)
      wx.stopPullDownRefresh()
    })
    .catch(err => {
      console.log(err)
      wx.stopPullDownRefresh()
    })
  },

  getAdvert: function() {
    API.indexAdsense().then(res => {
      console.log(res)
      if(res.status === 200) {
        this.setData({
          advert: res.data
        })
      }
    })
    .catch(err => {
      console.log(err)
    })
  },

  bindCateByID: function (e) {
    let id = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/list/list?id=' + id,
    })
  },

  bindCateList:function(){
    wx.switchTab({
      url: '/pages/category/category',
    })
  },

  bindDetail: function(e) {
    let id = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + id,
    })
  },

  onConfirm:function(e){
    let s=e.detail.value;
    wx.navigateTo({
      url: '/pages/list/list?s='+s,
    })
  },

  bind2vrpage:function(){
    wx.navigateTo({
      url: '/pages/vr/vr/vr'
    })
  }
})
