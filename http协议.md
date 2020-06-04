## HTTP/1.1

**HTTP是无状态协议，每次请求都必须附上所有信息**

### HTTP报文的四个组成部分

**请求报文**

+ 请求行：请求方法 URL地址 协议名称或版本号
+ 请求头 键值对 服务器据此获取客户端信息 (cookie)
+ 请求体： 通过请求体传值

**响应报文**

+ 状态行 ：说明所请求的资源情况
+ 响应头：描述服务器基本信息
+ 响应体：服务端返回的数据

### HTTP状态码

+ 301 永久重定向
+ 302 临时重定向
+ 304 自从上次请求后，请求内容未改变，不会返回网页内容。
+ 403 服务器拒绝请求
+ 500 服务器内部错误，无法完成请求
+ 505 服务器不支持请求中所用的HTTP协议版本

### 跨域

+ jsonp,只能解决get跨域

原理：动态创建一个script标签，利用script标签的src属性不受同源策略限制，因为所有的src属性和href属性都不受同源策略限制

```
1,创建一个script标签
2，script的src属性设置接口地址
3，接口参数，必须要带一个自定义函数名，接收数据

var script = document.createElement("script");
script.src= "http://127.0.0.1:8888/index.php?callback=jsonpCallback";
//插入到页面
document.head.appendChild(script)；
//通过定义函数名接收后台返回数据
function jsonpCallback(data) {
    //注意 jsonp返回的数据是json对象可以直接使用 
    //取得数据是json字符串需要转换成json对象才可以使用
}
```

+ CORS：跨域资源共享

原理：服务器设置`Access-Control-Allow-OriginHTTP`响应头后，浏览器将会允许跨域请求

```
需要后台设置
Access-Control-Allow-Origin:*	//允许所有域名访问，
Access-Control-Allow-Origin:http://a.com	//只允许所有域名访问
```



### 持久连接

引入了持久连接，即TCP连接默认不关闭，可以被多个请求复用，不用声明`Connection:keep-alive`

对于同一个域名，大多数浏览器允许同时建立6个持久连接

### 管道机制

引入了管道机制，即在同一个TCP连接里面客户端可以同时发送多个请求。

### Content-Length字段

`content-length`声明本次回应的数据长度，现在一个TCP连接可以传送多个回应，势必要有一个机制，区分数据包是属于哪一个回应的。

```
Content-length: 3495
```

### 分块传输编码

使用content-length字段的前提条件是，服务器发送回应之前，必须知道回应的数据长度

对于一些耗时的动态操作，效率不高

**更好地处理方式是：**产生一块数据，就发送一块，采用流模式(stream)取代缓存模式(buffer)只要请求或回应的头信息有transfer-Encoding字段，就表明回应将由数量未定的数据块组成。

```
HTTP/1.1 200 OK
Content-Type: text/plain
Transfer-Encoding: chunked
Host: www.example.com
```

缺点：

```
允许复用TCP连接，但是同一个TCP连接里面，数据通信是按次序进行的，要是前面的特别慢，后面的就会有许多求情排队等着，这称为“队头堵塞”
```

解决方法

+ 减少HTTP请求数
+ 同时多开TCP持久连接

引出很多网页优化技巧

合并脚本和样式表、将图片嵌入css代码

域名分片。

### Cookie

cookie是什么

当你浏览某个网站的时候，一个记录了你用户名，密码，浏览的网页，停留的时间等等信息，当你再次来到这个网站，服务器看有没有上次留下来的cookie，来判断使用者

http请求时，有cookie，添加在request header的cookie字段中，每一次都带上，

**客户端设置cookie**

```
document.cookie="name=hudelong;age=18"
```

cookie是存在客户端浏览器上，session会话存在服务器上

#### localStorage和sessionStorage

```
sessionStorage，用于本地存储一个会话中的数据，只在同一个会话中的页面才能访问，关闭页面，数据销毁

localStorage是持久化本地存储，除非是通过js删除，或清除浏览器缓存，否则数据是永远不会过期的.
IE5、6、7有个userData.用于本地存储
```

```
web storage有setitem、getitem、removeitem、clear等方法.
```

