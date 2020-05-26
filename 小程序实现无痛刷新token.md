# 小程序如何无痛刷新token

## 需求：

小程序第一次授权以后再也不用授权。

登录态token过期以后，需要自动更新做到用户无感知。

## 痛点分析

当用户再次登录小程序，保存在本地的token已过期，根据后端返回的状态码。获取去code，重新获取token。

但是当多个请求同时发起，第一个请求发出，还未收到登录过期的状态码之前，其他的接口也已发出。

## 实现思路

接口返回过期以后，先刷新token，在对所有接口进行重试。

## 实现

## 封装wx.request请求

```
const wxlogin = async (params = {}, url, callback) =>{
    let res = await new Promise((resolve, reject) => {
      wx.request({
        url: url,
        method: params.method || 'POST',
        data: data,
        header: Object.assign({
          // set something global
          'Cookie': 'JSESSIONID=' + token
        }, headers),
        success: (res) => {
          resolve(res);
        },
        fail: (err) => {
          reject(err)
        },
      })
    })
    return res
}
```

## 步骤解析

+ 假设我们同时有三个请求,当第一个请求返回的时候告诉我们登陆过期

+  将isRefreshing设置为true

+ 调用重新获取token方法,在此期间返回的接口，将请求存入requests数组

+ 获取新的token之后，循环requests数组，重新发起请求

   ### 首选我们需要一个数组来存放需要重试的接口，需要一个标识符来判断token已刷新

  ```js
  // 已获取过期信息，正在获取新的token
  let isRefreshing = false
  // 重试队列，每一项将是一个待执行的函数形式
  let requests = [] 
  ```

  

```js
假设：code=0001为登陆过期

if (res.data.code == '0002' && !res.data.success) {
  if (!isRefreshing) {
    isRefreshing = true;
    let sessionId = await wxlogin();
    isRefreshing = false;
    if (sessionId) {
      requests.forEach(item => item());
      requests = [];
      return wxRequest(params, url)
    } else {
    }
  } else {
    return new Promise((resolve) => {
      requests.push(() => {
        resolve(wxRequest(params, url));
      })
    })

  }
}
```

## 整体代码

```js

const wxRequest = async (params = {}, url) => {
  let token = wx.getStorageSync('cookie') || '';
  try {
    let res = await new Promise((resolve, reject) => {
      wx.request({
        url: url,
        method: params.method || 'POST',
        data: data,
        header: Object.assign({
          // set something global
          'Cookie': 'JSESSIONID=' + token
        }, headers),
        success: (res) => {
          resolve(res);
        },
        fail: (err) => {
          reject(err)
        },
      })
    })
    if (res.data.code == '0002' && !res.data.success) {
      if (!isRefreshing) {
        isRefreshing = true;
        let sessionId = await wxlogin();
        isRefreshing = false;
        if (sessionId) {
          requests.forEach(item => item());
          requests = [];
          return wxRequest(params, url)
        } else {
        }
      } else {
        return new Promise((resolve) => {
          requests.push(() => {
            resolve(wxRequest(params, url));
          })
        })

      }
    }
    return res;

  } catch (e) {
    console.log(e);
     wx.showToast({
       title: 'request:fail timeout',
       icon: 'none',
       duration: 2000
     })
  }
}
```

