# learn_note

一些笔记和学习资料

## ES6

[手动实现一个Promise]([https://github.com/317qdH/learn_note/blob/master/%E6%89%8B%E5%86%99%E4%B8%80%E4%B8%AAPromise.js])

## 小程序

[小程序wx.request请求封装及登录过期]([https://github.com/317qdH/learn_note/blob/master/%E6%89%8B%E5%86%99%E4%B8%80%E4%B8%AAPromise.js])

新增小程序优化

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

### 原型链的理解

```javascript
function Person(){
}
function Son(){
    
}
var son = new Son();

son.__proto__  => Son.prototype (原型对象)
Son.prototype.constructor => Son(构造函数)
Son => son (new方法)

Son.prototype.__proto__ => Object.prototype
Object.prototype.__proto__ => null
原型链继承就是把子函数的原型指向父函数的实例对象,让实例去找父类的原型
如果直接把子函数的原型指向父函数的原型，会覆盖父函数的原型，就不是继承了
```

### 一个原型链继承的面试题

```javascript
按照如下要求实现Person和Student对象

a)Student继承Person

b)Person包含一个实例变量name,包含一个方法printName

c)Student包含一个实例变量score,包含一个实例方法printScore

d)所有Person和Student对象之间共享一个方法


原生写法
	   function Student(score) {

​        this.score = score;

​        this.printScore = function() {

​          console.log('Student的printScore方法')

​        }

​      }

​      function Person(name) {

​        this.name = name;

​        this.printName = function () {

​          console.log('person的printName方法')

​        };



​      }

​      Person.prototype.comMethods = function () {

​        console.log('共享的的comMethods方法')

​      }

​      Student.prototype = new Person('小红');

​      Student.prototype.constructor = Student;

​      var stu1 = new Student('12');

​      var per1 = new Student('小人');

​      stu1.printScore()

​      stu1.comMethods()

​      stu1.printName()

​      per1.printName()

​      per1.comMethods()

ES6写法
class Person{
   constructor(name){
       this.name = name;
   }

   printName(){
       console.log('Person的printName方法')
   }

   commonMethods(){
       console.log('我是共享方法')
   }
}

class Student extends Person{
 constructor(name,score){
     super(name);
     this.score - score;
 }
 printScore(){
     console.log('我是student的printscore方法')
 }

}
let stu = new Student('小红',11)
let person = new Person('小紫');
stu.printScore()
person.printName();
           console.log(stu.commonMethods===person.commonMethods);//true
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

