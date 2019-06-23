// 云函数入口文件
const cloud = require('wx-server-sdk')
const busApi = require('utils/busApi')
const getDistance = require('utils/getDistance')
const utils = require('utils')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const {latitude, longitude} = event
  return new Promise((resolve, reject) => {
    busApi.get('/ltaodataservice/BusStops?$skip=500').then(async res => {
      const value = res.data.value
      const data = value.map(item =>{ 
        const distance = getDistance(latitude, longitude, item.Latitude, item.Longitude)
        item.distance = distance
        return item
      })
      const sortArr = data.sort(utils.compare('distance'))
      const nearbyStations = sortArr.slice(0,5)

      const anAsyncFunction = async stop => {
        const response = await busApi.get('/ltaodataservice/BusArrivalv2',{
          params: {
            BusStopCode: stop.BusStopCode
          }
        })
        stop.services = response.data.Services
        return stop
      }

      const getData = async () => {
        return await Promise.all(nearbyStations.map(anAsyncFunction))
      }
      const results = await getData()
      
      resolve({
        status: 0,
        results: results
      })
    })
  })
  
}