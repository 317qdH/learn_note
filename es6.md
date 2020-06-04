# 第一章变量的结构赋值

### 1.1数组的结构赋值：

本质上，这种写法属于“模式匹配”,只要等号两边的模式相等，左边的变量就会被赋予对应的值。

```
let [foo, [[bar],baz]] = [1,[[2],3]];

...tail 接收之后的所有参数，取代arguments
let [head,...tail] = [1,2,3,4];
head // 1
tail // [2,3,4]

let[x,y,...z] = ['a'];
x // "a"
y // undefined 如果解构不成功，变量的值就等于undefined
z // []
```

解构赋值允许指定默认值。只有当右边一个数组成员严格等于undefined，默认值才会生效。

如果默认值是一个表达式，惰性求值，取不到值才执行

### 1.2对象的解构赋值

数组的元素是按次序排列的，变量的取值由它的位置决定；而对象的属性没有次序，变量必须与属性同名。

```
let {bar,foo} = {foo:"aaa",bar: "bbb"};
```

如果变量名与属性名不一致，必须写成下面这样

```
let{foo: baz} = {foo:'aaa',bar:'bbb'};
baz // "aaa"
foo // error: foo is not defined
冒号左边的是模式，不是变量，因此不会被赋值。
```

### 1.3字符串的解构赋值

字符串也可以结构赋值，这是因为此时，字符串被转换成了一个类似数组的对象。

```
const [a,b,c,d,e] = 'hello';
a // "h"	b // "e"
c // "l"	d // "l"
e // "o"
```

### 1.5 函数参数的解构赋值

下面代码中，函数add的参数表面上是一个数组，但在传入参数的那一刻，数组参数就被解构赋值成变量x和y，对于函数内部的代码来说，他们能感受到的参数就是x和y。

```
function add([x,y]){
    return x+y;
}
add([1,2]); // 3
```

### 1.7结构赋值的实际用途

+ 交换变量的值`[x, y] = [y, x]`

+ 从函数返回多个值

  ```js
  function example() {
      return {
          foo: 1,
          bar: 2
      };
  }
  let = {foo,bar} = example()
  ```

+ 函数的参数定义

  ```
  // 参数是一组有次序的值
  function([x,y,z]) {...}
  f([1,2,3])
  
  // 参数是一组无次序的值
  function({x,y,z}) {...}
  f({z:3,y:2,x:1})
  ```

+ 提取JSON数据

  ```
  let jsonDate = {
      id: 43,
      status: "OK",
      data: [867, 5309]
  };
  let {id,status,data:number} = jsonData;
  console.log(id, status, number);
  // 42, "OK", [867, 5309]
  ```

# 第二章 let 和 cosnt 命令

### 1.1 let

经典块级作用域的问题。

```
var a = []
for (let i = 0;i < 10; i++) {
    a[i] = function () {
        console.log(i);
    }
}
a[6](); // 6

上面代码中，变量i是let声明的，当前的i只在本轮循环有效，所以每一次循环的i其实都是一个新的变量，所以最后输出的是6.
ps：for循环的特别之处，循环变量的那部分是一个父作用域，而循环体内部是一个单独的子作用域。
```

特点：

+ 不存在变量提升
+ 暂时性死区(声明前不能用)
+ 不允许重复声明

为什么需要块级作用域

+ 内层变量会覆盖外层变量

  ```
  var tmp = new Date();
  function f() {
      console.log(tmp);
      if(false){
          var tmp ='hello world';
      }
  }
  f(); //undefinded
  本来我们的意愿是输出 时间tmp
  ```

+ 用来计数的循环变量泄露为全局变量。

### 2.2 const

+ const一旦声明变量，就必须立即初始化。
+ 本质，保证变量指向的那个内存地址所保存的数据不得改动。对于简单类型的数据（数值、字符串、布尔值），值就保存在那，所以不能改，变量指向的内存地址，保存的只是一个指向实际数据的指针，const只能保证这个指针是固定的。

        ```
const foo = {};
foo.prop = 123;
foo.prop //123

foo = {}; // TypeError: "foo" is read-only

object.freeze()冻结对象。
​        ```

### 2.3顶层对象的属性

+ 浏览器环境指的是window
+ Node指的是global对象。

顶层对象的属性与全局变量挂钩，是javascript败笔之一

var 命令和function命令声明的全局变量，依旧是顶层对象的属性。

let命令、const命令、class命令声明的全局变量，不属于顶层对象的属性。

```
var a = 1;
window.a //1
let b = 1;
window.b // undefinded
```

# 第三章字符串扩展

### 1.1方法扩展

这三个方法都支持第二个参数，表示开始搜索的位置。

+ includes(): 是否找到了参数字符串

+ startsWith():字符串是否在原字符串的头部

+ endsWith():字符串是否在原字符串的尾部

  ```
  let s = 'Hello World';
  
  s.startsWith('Hello') // true
  s.endsWith('!') // true
  s.includes('o') // true
  ```

+ repeat():返回新字符串，将原字符串重复n次

```
'x'.repeat(3) // 'xxx'
'na'.repeat(0) // ''
```

+ padStart():头部开始补全长度，默认空格补全
+ padEnd():尾部补全

```
'x'.padStart(5,'ab') // 'ababx'
'x'.padEnd(4,'ab') // 'xaba'
```

另一个用途是提示字符串格式

```
'12'.padStart(10,'YYYY-MM-DD') 
// 'YyYY-MM-12'
'09-12'.padStart(10,'YYYY-MM-DD')
// 'yyy-09-12'
```

**模板字符串**

用反引号（`）标识，它会保留空格和缩进，可以再字符串中嵌入变量${}，${fn()}还能调用函数，就是能放表达式。

# 第四章 字符串扩展

### 1.1方法扩展与修正

+ Number.isFinite().检查一个数值是否为有限的
+ Number.isNaN(),检查一个值是否是NaN
+ Number.isInteger(),判断一个数值是否为整数。

将全局方法parseInt()和parseFloat()移植到Number对象上。

### 1.2Number.EPSILON

是一个极小的常量用于设置用户允许的最大误差

```
function withinErrorMargin (left, right) {
    return Math.abs(left- right)< Number.EPSILON*Math.pow(2,2);
}
0.1+0.2 === 0.3 // false
withinErrorMargin(0.1+0.2,0.3)
```

# 第四章函数扩展

# 1.1箭头函数

```
//箭头前面的是参数，可以设置默认值，后面的是返回值 多于一句语句，要用return返回
var f = v => v;

//等同于
var f = function (v) {
    return v;
}
this 指向外部的this对象
```

# 数组扩展

### 1.1 扩展运算符

```
console.log(...[1,2,3])
//1 2 3
function push(array, ...items) {
    array.push(...items);
}
```

+  Array.from()

将类似数组的对象（伪数组）和可遍历的对象转化成真正的数组（吧set转成数组）

+ Array.of()

将一组值转换为数组。

+ copyWithin()

将制定位置的成员赋值到其他位置，返回修改后的当前数组

```
[1,2,3,4,5].copyWidthin(0,3)
// [4,5,3,4,5]
```

+ find()

```
找出第一个符合条件的数组成员,所有数组成员依次执行该回调函数，直到找出第一个返回值为true的成员，然后返回该成员
[1,4,-5,-10].find((n) => n<0)
// -5
```

+ findIndex()

```
返回第一个符合条件的数组成员的位置，如果都不符合，-1

[1,5,10,15].findIndex(function(value, index,arr) {
    return value > 9;
}) // 2
```

**这两个方法都可以发现NaN**

### 1.2数组实例方法

```
entries(),keys(),values()
用于遍历数组，他们都返回一个遍历器对象

for(let index of['a','b'].key()) {
    console.log(index)
}
// 0 1

for(let elem of ['a','b'].value()) {
    console.log(elem);
}
// 'a'
// 'b'

for(let [index,elem] of ['a','b'].entries()) {
    console.log(index,elem)
}
// 0 'a'
// 1 'b'
```

遍历器对象的next 方法，遍历下一个元素

+ includes()

返回一个布尔值，标识某个数组是否包含给定的值，与字符串的includes方法类似。

```
[1,2,3].includes(2) //true
[1,2,3].includes(4) //false
[1,2,NaN].includes(NaN) // true
```

## 对象的新增方法

### 1.1Object.is()

```
ES5比较两个值是否相等，只有两个运算符：相等运算符（==）和严格相等运算符（===），前者会自动转换数据类型，后者的NaN不等于自身，以及+0等于-0.
Object.is用来比较两个值是否严格相等，与严格比较运算符（===）的行为基本一致
```

**不同之处**

+ +0不等于-0
+ NaN等于自身

### 1.2 Object.assign()

用于对象的合并，将源对象的所有可枚举属性，复制到目标对象。

```
cosnt target = {a:1};
const source1 = {b:2};
const source2 = {c:3};

Object.assign(target, source1, source2);
target // {a:1, b:2, c:3}
Object.assign方法的第一个参数是目标对象，后面的参数都是源对象。
同名属性后面的会覆盖前面的，参数不是对象，则会先转成对象，undefined和null无法转成对象，作为参数会报错
非对象参数出现在源对象的位置（即非首参数），不能转成对象的会跳过，字符串会以数组形式拷贝进目标对象
```

```
const v1 = 'abc';
const v2 = 'true';
const v3 = 10;

const obj = Object.assign({},v1,v2,v3);
console.log(obj)
//{'0','a','1',}
```

### 1.3深拷贝

第一种; var obj2 = JSON.parse(JSON.stringify(obj1))

```
第二种用递归实现
function copy(arr) {
    var obj=arr.constructor==Array?[]:{};
    //或者var obj = arr isntanceof Array?[]:{}
    for (var item in arr) {
        if(typeof arr[item]==='object') {
            obj[item]=copy(arr[item]);
        }else{
            obj[item]=arr[item];
        }
    }
    return obj;
}
```

# 第五章 Promise

介绍：

```
所谓promise，简单来说就是一个容器，里面保存着某个未来才会结束的时间（异步操作）
```

promise对象有两个特点。

+ 对象的状态不受外界影响，三种状态：pending 、rejected、resloved.只有异步操作的结果可以决定当前是哪一个状态，其他任何操作都无法改变这个状态
+ 一旦状态改变，就不会再变，任何时候都可以得到这个结果。这与事件完全不同，事件的特点是，如果你错过了，再去监听，是得不到结果的。

```
下面代码创造了一个promise实例

const promise = new Promise(function(resolve,reject) {
	// ... some code
    if(异步操作成功) {
        resolve(value);
    } else {
        reject(error);
    }
})
```

then 方法可以接受两个回调函数作为参数，第一个是resolved时调用，第二个rejected时调用。第二个可选

Promise新建就会立即执行，里面的console会立即打印



revolve函数的参数还可以是另一个Promise实例

```
const p1 = new Promise(function (resolve, reject) {
    // ...
})
const p2 = new Promise(function (resolve,reject) {
    // ...
    resolve(p1);
})
上面代码中p2的resolve方法将p1作为参数，
注意：这是p1的状态就会传递给p2，也就是说p1的状态决定了p2的状态
如果p1的状态是pending，那么p2的回调函数就会等待p1的状态改变；
如果p1的状态已经是resolved或者rejected，那么p2的回调函数将会立即执行。
```

### 5.1promise.prototype.then()

then方法返回的是一个新的Promise实例（注意，不是原来那个Promise实例）因此可以链式调用

promise.prototype.catch方法是.then(null,rejection)或.then(undefined,rejection)的别名，用于指定发生错误时的回调函数

```
getJSON('/jposts.json').then(function(posts) {
    // ...
}).catch(function(err) {
    //处理getJSON和前一个回调函数运行时发生的错误
    console.log('发生错误',error);
})
上面代码，getJSON方法返回一个Promise对象，==>resolved调用then方法。
如果异步操作抛出错误，状态就会变为rejected，就会调用catch方法指定的回调函数，处理这个错误。另外then方法指定的回调函数，如果运行中抛出错误，也会被catch方法捕获。
```

promise对象的错误具有冒泡想性质，会一直向后传递，直到被捕获为止。也就是说，之前的错误可以在一个catch语句中处理

```
一般来说，不要再then方法里面定义Reject状态的回调函数，（即then的第二个参数），总是使用catch方法。
promise
	.then(function(data) {
        //success
	})
	.catch(function(err) {
        // error
	})
	理由：第二种写法可以捕获前面then方法执行中的错误，更接近同步的写法(try/catch)
	更传统的try/catch代码块不同的是，如果没有使用catch方法指定错误处理的回调函数，Promise对象抛出的错误不会传递到外层代码。即不会有任何反应。
	通俗的说法就是"Promise 会吃掉错误"
```

### 5.2 Promise.prototype.finally()

finally方法用于指定不管Promise对象最后状态如何，都会执行的操作，ES2018引入

```
promise
	.then(result => {...})
	.catch(error => {...})
	.finally(() => {...});
```

### 5.3 Promise.all()

Promise.all()方法用于将多个Promise实例，包装成一个新的Promise实例

```
const p = Promise.all([p1,p2,p3]);
上面代码中，Promise.all方法接收一个数组作为参数，p1,p2.p3都是promise实例，如果不是就会调用promise.resolve方法，将参数转为Promise实例，再进一步处理。（参数可以不是数组，但必须是具有Iterator接口，且返回的每个成员都是Promise实例）

p的状态由p1,p2,p3决定，分成两种情况。
1，只有p1,p2,p3的状态都变成fulfilled，p的状态才会变成fulfilled，此时p1,p2,p3的返回值组成一个数组，传递给p的回调函数。
2，只要p1,p2.p3中有一个被rejected，p的状态就变成rejected，此时第一个被reject的实例的返回值，会传递给p的回调函数。
```

注意，如果作为参数的Promise实例，自己定义了catch方法，那么它一旦被rejected，并不会触发Promise.all()的catch方法。

### 5.4 Promise.race()

promise.race方法同样是将多个Promise实例，包装成一个新的Promise实例。

```
const p = Promise.race([p1,p2,p3]);
上面代码中，只要p1,p2,p3之中有一个实例率先改变状态，p的状态就跟着改变，那个率先改变的Promise实例的返回值，就传递给p的回调函数。
```

### 5.5 Promise.resolve()

有时需要将现有的对象转为Promise对象，Promise.resolve方法就起到这个作用。

```
const jsPromise = Promise.resolve($.ajax('/whatever.json'));
```

+ 参数是一个具有then方法的对象(thenable)

  ```
  let thenable = {
      then: function(resolve, reject) {
          resolve(42);
      }
  }
  let p1 = Promise.resolve(thenable);
  p1.then(function(value) {
      console.log(value); // 42
  });
  上面代码执行中，thenable对象的then方法执行后，对象p1的状态就变为resolved，从而立即执行最后那个then方法指定的回调函数，输出42.
  ```

+ 参数不是具有then方法的对象，或根本不是对象。

  ```
  const p = Promise.resolve('Hello');
  p.then(function (s) {
      console.log(s)
  });
  //Hello
  上面代码字符串Hello不属于异步操作，返货Promise实例的状态从一生成就是resolved，所以回调函数会立即执行。Promise.resolve方法的参数，会同时传给回调函数。
  ```

+ 不带任何参数

  ```
  promise.resolve方法允许调用时不带参数，直接返回一个resolved状态的Promise对象。
  所以如果希望得到一个Promise对象，比较方便的方法就是直接调用Promise.resolve方法。
  const p = Promise.resolve();
  
  p.then(function() {
      // ..
  })
  ```








