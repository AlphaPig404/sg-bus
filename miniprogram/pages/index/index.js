// miniprogram/pages/index/index.js
var QQMapWX = require('../../libs/qqmap-wx-jssdk.min.js');
var qqmapsdk;
Page({

  /**
   * Page initial data
   */
  data: {
    location: {
      street: '定位中...',
      latitude: '',
      longitude: ''
    },
    nearbyBusStopList: []
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'ISYBZ-M3GW3-RTI3W-YRKSH-35UCK-QTBK4'
    });
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {
    this.getLocation()
  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  },
  getLocation(){
    const self = this
    wx.getLocation({
      type: 'gcj02',
      success (res) {
        const latitude = res.latitude
        const longitude = res.longitude
        self.getNearbyStations(latitude, longitude)
        qqmapsdk.reverseGeocoder({
          location: {
            latitude,
            longitude
          },
          success: function (addressRes) {
            console.log(addressRes)
            if(addressRes.status === 0){
              const street = addressRes.result.address_component.street
              self.setData({
                location:{
                  street,
                  latitude,
                  longitude
                }
              })
            }
          }
        })
      }
     })
  },
  getNearbyStations: function(latitude, longitude) {
    // 调用云函数
    console.dir({
      latitude, 
      longitude
    })
    wx.cloud.callFunction({
      name: 'get-nearby-stations',
      data: {
        latitude, 
        longitude
      },
      success: res => {
        console.log('[云函数] getNearbyStations: ', res)
        if(!res.result.status){
          const nearbyBusStopList = res.result.results 
          this.setData({
            nearbyBusStopList: nearbyBusStopList
          })
        }
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
})