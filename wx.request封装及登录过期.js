import regeneratorRuntime from '../utils/regenerator-runtime/runtime-module';//在小程序中使用async
import tip from '../utils/tip';//公共弹窗js
const app = getApp();
const BASE_PATH = 'http://10.10.7.189:8083';//请求接口路径

// 是否正在刷新的标记
let isRefreshing = false
// 重试队列，每一项将是一个待执行的函数形式
let requests = []
const wxRequest = async (params = {}, url) => {
    if (params.offLoading) {
        if (params.offMask) {
            tip.loading("加载中", false);
        } else {
            tip.loading();
        }
    }
    let data = params.query || {};
    let headers = params.headers || {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
    };
    let token = swan.getStorageSync('jessionId') || app.globalData.jessionId || '';//从缓存中获取 token
    
    try {
        let res = await new Promise((resolve, reject) => {
            swan.request({
                url: url,
                method: params.method || 'GET',
                data: data,
                header: Object.assign({
                    'Cookie': 'JSESSIONID=' + token
                }, headers),
                success: res => {
                    
                    resolve(res);
                },
                fail: err => {
                    reject(res);
                },
                complete: e => {
                    tip.loaded();
                }
            });
        });
		// code 2016为登录过期，
        if (res.data.code == '2016' && !res.data.success) {
			if (!isRefreshing) {
				isRefreshing = true;
				let result = await getJession({
					headers: {
						'content-type': 'application/json'
					},
					method: 'POST',
					query: {
						id: swan.getStorageSync('userInfoObj').userId || ''
					}
				});
				isRefreshing = false;
				if (result.data.success) {
					let jessionId = result.data.data;
					swan.setStorageSync('jessionId', jessionId);
					requests.forEach(item => item());
					requests = [];
					return wxRequest(params, url)
				} else {
					swan.navigateTo({
						url: '/pages/login/login'
					});
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
        tip.loaded();
        if (e.errMsg == 'request:fail timeout') {
            tip.error('请求超时，请重试');
        } else {
            tip.error('未知错误，请重试');
        }
    }
};

//获取Access_Token
const getToken = params => wxRequest(params, BASE_PATH + "/wx/wxToken.json");




module.exports = {
    BASE_PATH: BASE_PATH,
	getToken:getToken
};