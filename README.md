# learn_note

一些笔记和学习资料

## ES6

[手动实现一个Promise]([https://github.com/317qdH/learn_note/blob/master/%E6%89%8B%E5%86%99%E4%B8%80%E4%B8%AAPromise.js])

## 小程序

[小程序wx.request请求封装及登录过期]([https://github.com/317qdH/learn_note/blob/master/%E6%89%8B%E5%86%99%E4%B8%80%E4%B8%AAPromise.js])

### 对象深拷贝

```javascript
function deepCopy(source){
	let target = Array.isArray(source)?[]:{};
	for(let i in source){
  	  if(typeof source[i] === 'object'){
    	target[i] = deepCopy(source[i])
      }else{
      	target[i] = source[i]
      }
  	}
  	return target
}
```

### 实现一个new函数

```javascript
functoin _new(executor,...arg){
	let newObj = {};
	newObj.__proto__ = executor.prototype;
	executor.apply(newObj,...arg)
	return newObj
}
```

### 原型继承

```
Sub.prototype = new Supper();//为了能看到父类型的方法
Sub.prototype.constructor = Sub;//修正constructor属性

//组合继承
function Sub(...arg){
	Supper.apply(this,...arg)//为了得到属性
}
```

### 从浏览器地址栏输入url到现实页面的步骤

1.查看缓存，请求资源在缓存中新鲜，

​	http1.0提供Expires值为一个绝对时间表示缓存新鲜日期

​	http1.1增加了Cache-Control:max-age=，值为以秒为单位的最大新鲜时间

2,.浏览器解析url获取协议，主机端口，path，

3,dns域名解析获取主机ip地址

4,端口建立TCP连接，

5.检查响应状态码：是否为1xx，3xx，4xx，5xx

6.解析HTML文档，构建DOM树，下载资源构建cssom树，执行js脚本，显示页面

### 网站性能优化

+ 减少http请求：合并文件、css精灵
+ 非必须组件延迟加载、未来所需组件预加载
+ 减少DOM元素
+ 将资源放到不同的域下
+ 添加Expires或者Cache-Control响应头
+ 图片压缩.透明用png，不透明用jpg

