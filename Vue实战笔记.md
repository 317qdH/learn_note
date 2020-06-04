##　常用生命周期函数

+ **created**  实例创建完成后调用，此阶段完成了数据的观测等，但尚未挂载，$el还不可用。需要初始化处理一些数据时会比较有用，
+ **mounted** el挂载到实例上后调用，一般我们的第一个业务逻辑会从这里开始.
+ **beforeDestroy**  实例销毁之前调用。主要解绑一些使用addEventListener监听的事件等。

# 第二章 数据绑定和第一个Vue应用

## 2.1过滤器

过滤器可以串联，而且可以接收参数，接受的参数自动对应第二个开始，第一个是数据本身

ps：过滤器应当用于处理简单的文本转换，如果要实现更为复杂的数据变换，应该使用计算属性(computed)。

## 2.2指令与事件

+ **v-pre** 指令会跳过此元素及其所有子元素的编译，把标签里的数据都按普通文本解析(不编译)

+ **v-html**：如果有的时候就是想输出HTML，而不是将数据解释后的纯文本,可以使用v-html(html格式的文本解析)

```js
<span v-html="link"></span>
```

+ **v-cloak** 解决初始化慢导致页面闪动的最佳实践，对于简单的项目很实用，在工程化的项目里，webpack和vue-router时，项目的HTML结构只有一个空的div元素，剩余的内容都由路由去挂载不同组件完成。

```js
<div id="app" v-cloak>
	{{ message }}
</div>

[v-cloak] {
    display: none;
}
```

+ **v-once** 定义它的元素或组件只渲染一次，包括元素或组件的所有节点。首次渲染后，视为静态内容。
+ **v-if、v-else-if、v-else** 

```
<div id="app">
	<p v-if="status === 1">当status为1时显示该行</p>
	<p v-else-if="status === 2">当stusts为2时显示该行</p>
	<p v-else>否则显示该行</p>
</div>
```

**Vue在渲染元素时，出于效率考虑，会尽可能地复用已有的元素而非重新渲染。**

如果你不希望，可以用key属性，让你决定是否复用元素，key的值必须是唯一的。

```html
	<template v-if="type === 'name'">
        <label>用户名:</label>
        <input placeholder="输入用户名字" key="name-input">
    </template>
    <template v-else>
        <label>邮箱:</label>
        <input placeholder="输入邮箱" key="mail-input">
    </template>
    <button @click="handleToggleClick">切换输入类型</button>
```

+ **v-show** 改变元素的CSS属性display，隐藏也会加载

  ```
  v-show不能在<template>上使用
  ```

+ **v-for** 将一个数组遍历或枚举一个对象循环显示，它的表达式需结合in来使用，类似item in items的形式

```js
<div id="app">
	<ul>
		<li v-for="（book， index) in books">{{ index}} - {{ book.name }}</li>
		//遍历对象属性时，有两个可选参数，分别是键名和索引
		<li v-for="（value，key, index) in user">{{ index}} - {{ key }}: {{ book.name }}</li> 
	</ul>
</div>
<script>
	var app = new Vue({
        el:'#app',
        data: {
            books: [
                { name: '《Vue.js实战》' },
                { name: '《JavaScript语言精粹》' },
                { name: '《JavaScript 高级程序设计》' }
            ]
        }
	})
</script>
还可以迭代整数：
	<span v-for="n in 10">{{ n }} </span>
渲染后的结果为：
1 2 3 4 5 6 7 8 9 10
```





# 第三章 计算属性

## 3.1计算属性

**computed** 

+ 所有的计算属性都以函数的形式写在Vue实例内的computed选项内，最终返回计算后的结果
+ 计算属性还可以依赖多个Vue实例的数据，只要其中任一数据变化，计算属性就会重新执行，视图也会更新。
  + 计算属性可以依赖其他计算属性
  + 计算属性不仅可以依赖当前Vue实例的数据，还可以依赖其他实例的数据



**常用默认定义：**

```js
computed:{
  reversedText: function () {
	return this.text.split(',').reverse().join(',');
	}
}
```

**调用：**

`<div id="app"> {{ reversedText }} </div>`

**计算属性可以设置get（默认）、set**

```js
computed:{
    fullName: {
        //getter，用于读取
        get: function () {
            return this.firstName + ' ' + this.lastName;
        },
        // setter ,写入时触发
        set: function(newValue) {
            var names = newValue.split(' ');
            this.firstName = names[0];
            this.lastName = names[names.length - 1];
        }
    }
}
```

使用methods就可以实现，为什么还需要计算属性？

+ 计算属性是基于它的依赖缓存的。一个计算属性所依赖的数据发生变化时，它才会重新取值，所以只要text不改变，计算属性也就不更新。
+ 使用计算属性还是methods取决于你是否需要缓存，当遍历大数组和做大量计算时，应当使用计算属性，除非你不希望得到缓存。

# 第四章 v-bind及clsss绑定

## 4.2 绑定 class 的几种方式

+ **对象语法**

```js
<div :class="{ 'active': isActive }"></div>
<div :class="{ 'active': isActive, 'error': isError }"

data: {
  isActive: true,
  isError: false
}
```

****

+ **绑定一个计算属性**

```js
<div :class="classes"></div>

computed:{
    classes:function() {
	  return {
        active: this.isActive && !this.error,
        'text-fail':this.error && this.error.type === 'fail'
	  }
  }
}
```

​	除了计算属性，可以直接绑定一个Object类型的数据，或者使用类似计算属性的methods

+ 数组语法

```js
<div :class="[activeCls,errorCls]"></div>

data:{
    activeCls: 'active',
    errorCls: 'error'
}
```

+ 使用data、computed、methods三种方法绑定class，以计算属性为例

```js
<div id="app">
	<button :class="classes"></button>
</div>
<script>
	var app = new Vue({
		el:'#app',
		data: {
            size:'large',
            disabled:true
		},
		computed: {
            classes: function() {
                return [
                    'btn',
                    {
                        ['btn-'+this.size]: this.size !== ;;,
                        ['btn-disabled': this.disabled]
                    }
                ];
            }
		}
	})
</script>
最终渲染的结果为：

<button class="btn btn-large btn-disabled"></button>
```

# 第五章 内置指令

## 5.3.2 数组更新

使用下面的方法会改变数组也会触发视图更新

+ push()	末尾添加元素
+ pop()          删除并返回最后一个元素
+ shift()         删除并返回第一个元素
+ unshift()     开头添加一个元素
+ splice()       从数组里添加/删除项目
+ sort()          排序
+ reverse()    颠倒数组中元素的顺序

下面方法返回的是一个新数组，可以用新数组来替换原数组。Vue在检测到数组变化时，并不是直接重新渲染转增个列表，而是最大化地复用DOM元素，含有相同元素的项不会被重新渲染。

+ filter()        数组过滤器
+ concat()    连接两个数组并返回新数组
+ slice()        截取并返回一部分

**Tip：以下变动的数组，Vue是不能检测到的，也不会触发视图更新**

+ 通过索引直接设置项，比如app.books[3] = {...}

  + 第一种是使用Vue内置的 set 方法：

    ```
    Vue.set(app.books, 3, {
        name: '《CSS 揭秘》',
        author: '[希] Lea Verou'
    });
    ```

  + 在webpack中使用组件化的方式，默认是没有导入Vue的，这时可以使用$set

    ```
    this.$set(app.books, 3, {
        name: '《CSS 揭秘》',
        author: '[希] Lea Verou'
    })
    //这里的this指向的就是当前组件实例，即app，在feiwebpack模式下也可以用$set方法，例如app.$set(...)
    ```

    另一种方法：

    ```
    app.books.splice(3, 1, {
        name: '《CSS 揭秘》',
        author: '[希] Lea Verou'
    })
    ```

+ 修改数组长度，比如 app.books.length = 1.

    ```
      app.books.splice(0);
    ```
  ```

  

##　5.4　方法与事件

+ 在大部分业务场景中为了简单些可以不写括号
+ 因为通过HTML就可以知道调用的是哪个方法，将逻辑与DOM解耦，便于维护。
+ 最重要的是，当ViewModel销毁时，所有的事件处理器都会自动删除，无须自己清理

### 5.42修饰符

+ **.stop**
+ **.prevent**
+ **.capture**
+ **.self**
+ **.once**

  ```
<!-- 阻止单击事件冒泡 -->
<a @click.stop = 'handle'></a>
<!-- 提交事件不再重载页面（阻止默认事件） -->
<a @submit.prevent = 'handle'></a>
<!-- 修饰符可以串联 -->
<a @click.stop.prevent = 'handle'></a>
<!-- 只有修饰符 -->
<a @submit.prevent ></a>
<!-- 添加事件侦听器时使用事件捕获模式 -->
<a @click.capture = 'handle'></a>
<!-- 只当事件在该元素本身(而不是子元素)触发时触发回调 -->
<a @click.self = 'handle'></a>
<!-- 只触发一次 -->
<a @click.once = 'handle'></a>
<!-- 只有在keyCode是13时调用vm.submit() -->
<a @keyup.13 = 'submit'></a>
<!-- 也可以自己配置具体按键 -->
Vue.config.keyCodes.f1 = 112; //全局定义后，就可以使用@keyup.f1
```

除了具体的某个keyCode外，Vue还提供了一些快捷名称，以下是全部的别名：

+ **.enter**
+ **.tab**
+ **.delete **(捕获“删除” 和 “退格”键)
+ **.esc**
+ **.space**
+ **.up**
+ **.down**
+ **.left**
+ **.right**

这些按键修饰符也可以组合使用，或和鼠标一起配合使用：

+ **.ctrl**
+ **.alt**
+ **.shift**
+ **.meta**（Mac下是Command键，Windows下是窗口键）

例如:

```
<!-- Shift + S -->
<input @keyup.shift.83 = "handleSave"
<!-- Ctrl + Click -->
<div @click.ctrl = "doSomething">Do something</div>
```

## 5.5实战：利用计算属性、指令等知识开发购物车

+ 可以通过方法传值index锁定每件商品
+ 通过计算属性确定购物车总价

#  第六章 表单与v-model

## 6.1表单与v-model

+ 使用v-model后，表单控件显示的值只依赖所绑定的数据，不再关心初始化时的value属性，对于在`<textarea></textarea>`之间插入的值，也不会生效。
+ 使用v-model时，如果是使用中文输入法输入中文，在拼音阶段Vue是不会更新数据的，当敲下汉字时才会触发更新，如果希望总是实时更新，可以用@input来替代v-model

​```html
    <input type="text" v-model="message" placeholder="输入...">
    <input type="text" @input="handleInput" placeholder="输入...">
```

**单选按钮：**

```
<input type="raido" :checked="picked">
<label>单选按钮</label>
```

**复选按钮**

+ 单独使用也是用v-mode绑定一个布尔值
+ 组合使用，v-model和value一起，多个勾选框都绑定到同一个数组类型的数据，value的值在数组当中，就会选中这一项，这一过程也是双向的，在勾选时，value的值也会自动push到数组中

```html
<div id="app">
    <input type="checkbox" v-model="checked" value="闭嘴" id="html">
    <label for="html">HTML</label>
    <br>
    <input type="checkbox" v-model="checked" value="js" id="js">
    <label for="js">JavaScript</label>
    <br>
    <input type="checkbox" v-model="checked" value="css" id="css">
    <label for="css">CSS</label>
    <br>
    <p>选择的项是：{{ checked }}</p>
</div>
<script>
        var app = new Vue({
            el:'#app',
            data:{
                checked: ['css']
            }
        })
```

**选择列表：**

选择列表就是下拉选择器，也是常见的表单控件，同样也分为单选和多选两种方式。

  `<option>`是备选项，如果含有value属性，v-model就会优先匹配value的值：如果没有，就会直接匹配`<option`的text，比如选中第二项时，selected的值是js，而不是JavaScript。

  ## 6.3修饰符

+ **.lazy** 

  在输入框中，v-model默认是在input事件中同步输入框的数据（除了提示中介绍的中文输入法除外）,使用修饰符  .lazy会转变为在change事件中同步，

```html
<div id="app">
	<input type="text" v-model.lazy="message">
</div>
<script>
	var app = new Vue({
        el:'#app',
        data: {
            message: ''
        }
	})
这时，message并不是实时改变的，而是在失焦或按回车时才更新。
```

+ **.number**

  使用修饰符.number可以将输入转换为Number类型，否则虽然你输入的是数字，但它的类型其实是String，比如在数字输入框时会比较有用。

```
<input type="number" v-model.number="message">
<p> {{ typeof message }}</p>
```

+ **.trim**

  修饰符  .trim可以自动过滤输入的首尾空格

从Vue.js 2.x开始， v-model还可以用于**自定义组件**，满足定制化的需求。

# 第七章 组件详解

##　7.1组件与复用

Vue组件的模板在某些情况下会受到HTML的限制，比如`<table>`内规定只允许是`<tr>、<td>、<th>`等这些表格元素，所以在`<table>`内直接使用组件是无效的，这种情况下，可以使用特殊的is属性来挂载组件

```
<div id="app">
	<table>
		<tbody is="my-component"></tbody>
	</table>
</div>
<script>
	Vue.component('my-component',{
        template: '<div>这里是组件的内容</div>'
	});
	var app = new Vue({
        el: '#app'
	})
</script>
```

tbody在渲染时，会被替换为组件的内容，常见的限制元素还有**`<ul>、<ol>、<select>`**

除了template选项外，组件中还可以像Vue实例那样使用其他的选项，比如data、computed、methods等。但是在使用data时，和实例稍有区别，data必须是函数，然后将数据return出去，

```
<div id="app">
	<my-component></my-component>
</div>

<script>
	Vue.component('my-component', {
        template: '<div>{{ message }}</div>',
        data: function () {
            return {
                message:'组件内容'
            }
        }
	})
	//自定义全局组件使用要定义在Vue实例前面
	var app = new Vue({
		el:'#app'
	})
</script>
```

##　7.2使用props传递数据

父组件要正向地向子组件传递数据或参数，子组件接收到后根据参数的不同来渲染不同的内容或执行操作。这个正向传递数据的过程就是通过props来实现的。

在组件中，使用选项props来声明需要从父级接收的数据，props的值可以是两种，一种是字符串数组，一种是对象，

+ **字符串数组**

```html
<div id="app">
	<my-component warning-text="提示信息"></my-component>
</div>
<script>
	Vue.component('my-component', {
        props: ['warningText'],
        template: '<div>{{ warningText }}</div>'
	})
	var app = new Vue({
		el:'#app'
	})
</script>

由于HTML特性不区分大小写，当使用DOM模板时i，驼峰命名(camelCase)的props名称要转为短横分割命名（kebab-case）
```

有时候传递的数据并不是写死的，而是来自父级的动态数据，这时可以使用指令v-bind来动态绑定props的值

```
<div id="app">
	<input type="text" v-model="parentMessage">
	<my-component :message="parentMessage"></my-component>
</div>
<script>
	Vue.component('my-component', {
        props: ['message'],
        template: '<div>{{ message }}</div>'
	})
	var app = new Vue({
		el:'#app',
		data: {
            parentMessage: ''
		}
	})
</script>

这里用v-model绑定了父级的数据parentMassage，当通过输入框任意输入时，子组件接收到的props“message”也会实时响应，并更新组件模板。
```

**注意：**如果你要直接传递数字、布尔值、数组、对象，而且不使用v-bind，传递的仅仅是字符串

+ **对象**

## 7.2.2单向数据流

业务中经常遇到两种需要改变prop的情况

+ 父组件传递初始值过来，子组件将它作为初始值保存起来，在自己的作用于下可以随意使用和修改。这种情况你可以在组件data内再声明一个数据，引用父组件的prop

```
<div id="app">
	<my-component :init-cout="1"></my-component>
</div>
<script>
	Vue.component('my-component', {
        props: ['initCount'],
        template: '<div>{{ count }}</div>',
        data: function() {
            return {
                count: this.initCount
            }
        }
	})
	var app = new Vue({
		el:'#app',
		data: {
            parentMessage: ''
		}
	})
</script>
```

**注意：**在JavaScript中对象和数组是引用类型，指向同一个内存空间，所有props是对象和数组时，在子组件内改变是会影响父组件的。

### 7.2.3数据验证

当prop需要验证时，就需要对象写法

```
Vue.component('my-component', {
    props: {
        //必须是数字类型
        propA: Number,
        //必须是字符串或数字类型
        propB； [String, Number],
        //布尔值，如果没有定义，默认值就是true
        propC: {
            type: Boolean,
            default: true
        },
        //数字，而且是必传
        propD: {
            type: Number,
            required: true
        },
        //自定义一个验证函数
        propF: {
            validator: function (value) {
                return value > 10;
            }
        } 
    }
});
```

验证的type类型可以是：

+ String
+ Number
+ Boolean
+ Object
+ Array
+ Function

type也可以是一个自定义构造器，使用`instanceof`检测。

## 7.3组件通信

![1551747060(1)](F:\胡一筒\书名：vue.js实战-学习\vue.js实战书上的小demo\noteImages\1551747060(1).png)

### 7.3.1自定义事件

当子组件需要向父组件传递数据时，就要用到自定义事件，v-on除了监听DOM事件外，还可以用于组件之间的自定义事件。子组件用$emit()来触发事件，父组件用$on()来监听子组件的事件。

### 7.3.2使用v-model

### 7.3.3非父子组件通信

创建一个名为bus的空Vue实例，全局定义组件component-a，在Vue实例app初始化时，在生命周期mounted钩子函数里监听来自bus的事件on-message，在组件component-a中，点击按钮会通过bus把事件on-message发出去，此时app就会接收来自bus的事件，进而在回调里完成自己的业务

可以扩展bus实例，给它添加data、methods、computed等选项，都是公用的

```js
<div id="app">
        {{ message }}
        <component-a></component-a>
    </div>
    <script>
        var bus = new Vue();

        Vue.component('component-a', {
            template: '<button @click="handleEvent">传递事件</button>',
            methods: {
                handleEvent: function () {
                    bus.$emit('on-message','来自组件component-a的内容');
                }
            }
        });

        var app = new Vue({
            el:'#app',
            data: {
                message: ''
            },
            mounted: function () {
                var _this = this;
                //在实例初始化时，监听来自bus实例的事件
                bus.$on('on-message', function (msg){
                    _this.message = msg;
                });
            }
        })
    </script>
```

除了中央事件总线bus外，还有两种方法可以实现组件间通信，父链和子组件索引

**父链**

```
//访问到父链后，可以做任何操作，比如直接修改数据
this.$parent.message = '来自组件component-a的内容';
注意：尽管Vue允许这样操作，但在业务中，应尽量避免依赖父组件的数据。
	 父子组件最好还是通过props和$emit来通信
```

**子组件索引**

```
当子组件较多时，通过this.$children来一一遍历出我们需要的一个组件实例是比较困难的，
Vue提供了子组件索引的方法，用特殊的属性ref来为子组件指定一个索引名称，示例代码如下：

<component-a ref="comA"></component-a>
var msg = this.$refs.comA.message;

$refs只在组件渲染完成后才填充，并且它是非响应式的，它仅仅作为一个直接访问子组件的应急方案，应当避免在模板或计算属性中使用$refs
```

## 7.4 使用slot分发内容

**props传递数据、events触发事件和slot内容分发就构成了Vue组件的三个API来源，再复杂的组件也是由这三部分构成的**

### 7.43 slot用法

+ 单个 Slot
+ 具名Slot

```html
<div id="app>
	<child-component>
		<h2 slot="header">标题</h2>
		<p>正文内容</p>
		<p>更多的正文内容</p>
		<div slot="footer">底部信息</div>
	</child-component>
</div>
```

```js
<script>
	Vue.component('child-component', {
        template: '\
        <div class="container">\
        	<slot name="header"></slot>\
        </div>\
        <div class="main">\
        	<slot></slot>\
        </div>\
        <div class="footer">\
        	<slot name="footer"></slot>\
        </div>'
	});
	var app = new Vue({
        el: '#app'
	})
</script>
```

```html
上面的最终渲染结果为：
<div id=”app”>
    <div class=”container ” >
        <div class=”header”>
        	<h2＞标题＜／h2>
        </div> 
        <div class=”main”>
        	<p ＞正文内容 Ip>
        	<p ＞更多的正文内容＜／p>
        </div> 
        <div class=” footer”>
        	<div＞底部信息＜／div>
        </div> 
    </div>
</div>
```

## 7.6其他

**异步更新队列** :Vue在观察到数据变化时并不是直接更新DOM，而是开启一个队列，并缓冲在同一事件循环中发生的所有数据改变。在缓冲时会去除重复数据，从而避免不必要的计算和DOM操作。然后，在下一个事件循环tick中，Vue刷新队列并执行实际（已去重的）工作。所以如果你用一个for循环来动态改变数据100次，其实它只会应用最后一次改变。

+ **$nextTick**用来知道什么时候DOM更新完成的。

### 7.62 X-Templates

提供了另一种定义模板的方式，在<script>标签里使用text/x-template类型，并且指定一个id。将这个id赋给template。示例代码如下：

```html
<div id="app">
	<my-component></my-component>
	<script type="text/x-template" id="my-component">
		<div>这是组件的内容</div>
	</script>
</div>
```

```
<script>
	Vue.component('my-component', {
        template: '#my-component'
	});
	
	var app = new Vue({
		el: '#app'
	})
</script>
```

+ 好处：在`<script>`标签里，可以愉快的写HTML代码，不用考虑换行等问题
+ 弊端：它将模板和组件的其他定义隔离开了

### 7.63 手动挂载实例

`Vue.extend和$mount`两个方法来手动挂载一个实例.

+ Vue.extend()是基础Vue构造器，创建一个‘’子类‘，参数是一个包含组件选项的对象。
+ 如果Vue实例在实例化时没有收到el选项，它就处于“为挂载”状态，没有关联的DOM元素。可以使用$mount()手动挂载一个未挂载的实例。这个方法返回实例自身，因而可以链式调用其他方法

```js
<div id="mount-div">
</div>

<script>
	var MyComponent = Vue.extend({
		template: '<div>Hello:{{ name }}</div>',
		data: function () {
            return {
                name: 'Aresn'
            }
		}
 	});
 	
 	new MyComponent().$mount('#mount-div');
</script>
运行后，id为mount-div的div元素会被替换为组件MyComponent的template的内容

以下两种写法也是可以的：
new MyComponent().$mount('#mount-div');
//同上
new MyComponent({
	el: '#mount-div'
})
或者，在文档之外渲染并且随后 挂载
var component = new MyComponent().$mouont();
document.getElementById('mount-div').appendChild(component.$el);

```

## 7.7 实战：两个常用组件的开发

### 7.7.1开发一个数字输入框组件

```

```

### 7.7.2开发一个切换的标签栏组件

```
//this.$parent可以获取父类的vue实例，然后调用父类的方法
this.$parent.updateNav()

//$children 也类似，filter过滤获取特定的dom元素，
//$options.name 可以获取自定义组件的名字
this.$children.filter(function(item) {
    return item.$options.name === 'pane'
})

注意：获取的子类或者父类实例的值 更改了，那里面的值也就更改了

wacth 检测属性变化，厉害哦
```

# 第八章 自定义指令

## 8.1基本用法

```js
//全局注册
Vue.directive('focus', {
    //指令选项
});

//局部注册
var app = new Vue({
    el: '#app',
    directives: {
        focus: {
            //指令选项
        }
    }
})
```

**自定义指令的选项是由几个钩子函数（生命周期函数）组成的**

+ **bind：**只调用一次，指令第一次绑定到元素时调用，用这个钩子函数可以定义一个在绑定时执行一次的初始化动作
+ **inserted：**被绑定元素插入父节点时调用( 父节点存在即可调用，不必存在于document中)
+ **update：**被绑定元素所在的模板更新时调用，而不论绑定值是否变化。通过比较更新前后的绑定值，可以忽略不必要的模板更新
+ **componentUpdated：**被绑定元素所在模板完成一次更新周期时调用
+ **unbind：**只调用一次，指令与元素解绑时调用

**每个钩子函数都有几个参数可用**

+ **el：**指令所绑定的元素，可以用来直接操作DOM
+ **binding：**一个对象，包含
  + **name：**指令名，不包括v-前缀
  + **value：**指令的绑定值，例如v-my-directive="1+1"，value的值是2
  + **oldValue：**指令绑定的前一个值，仅在update和componentUpdated钩子中可用。无论值是否改变都可用
  + **expression：**绑定值的字符串形式。例如v-my-directive=“1+1”,expression的值是“1+1”。
  + **arg：**传给指令的参数。例如v-my-directive：foo，arg的值是foo
  + **modifiers：**一个包含修饰符的对象。例如v-my-directive.foo.bar，修饰符对象modifiers的值是{foo：true，bar：true}

+ **vnode：**Vue编译生成的虚拟节点，在进阶篇中介绍

## 8.2实战

### 8.2.1 开发一个可从外部关闭的下拉菜单

实现： 点击用户头像和名称，会弹出一个下拉菜单，然后点击页面中其他空白区域（除菜单本身外），菜单就关闭了

### 8.22开发一个实时时间转换指令

实现：一个 相对本机转换的相对时间。

**总结：**在编写自定义指令时，给DOM绑定一次性事件等初始动作，建议在bind钩子内完成，同时要在unbind内解除相关绑定。在自定义指令里，理论上可以任意操作DOM，但这又违背Vue.js的初衷，所以对于大幅度的DOM变动， 应该使用组件。

# 第九章Render函数

## 9.1什么是Virtual Dom(虚拟Dom)

Virtual Dom并不是真正意义上的Dom，而是一个轻量级的Javascript对象，在状态发生变化时，Virtual Dom会进行Diff运算，来更新只需要被替换的DOM，而不是全部重绘。

​	与DOM操作相比，Virtual Dom是基于JavaScript计算的，所以开销会小很多。

```
Object-->render(生成虚拟节点)-->createElement(h)基于虚拟节点创建dom节点
	-->diff(状态更新后，进行对比，生成补丁对象)-->patch（遍历补丁对象更新dom节点）
用Virtual Dom创建的JavaScript对象一般会是这样的：
var vNode = {
    tag: 'div',
    attributes: {
        id: 'main'
    },
    children: [
        //节点
    ]
}
vNode对象通过一些特定的选项描述了真实的DOM结构。
在Vue.js中，virtual Dom就是通过一种VNode类表达的，每个DOM元素或组件都对应一个VNode对象，在Vue.js源码中是这样定义的：
export interface VNode {
    tag?: string; //当前节点的标签名。
    data?: VNodeData; //当前节点的数据对象。
    children?: VNode[];//子节点，数组，也是VNode类型.
    text?: string; //当前节点的文本，一般文本节点或注释节点会有该属性。
    elm?: Node; //当前虚拟节点对应的真是的DOM节点。
    ns?: string; //节点的namespace
    context?: Vue; //编译作用域
    key?: string | number;//函数化组件的作用域
    componentOptions?: VNodeComponentOptions;//创建组件实例时会用到的选项信息
    componentInstance?: Vue;//节点的key属性，用于作为节点的标识，有利于patch的优化
    parent?:VNode;//组件的占位节点
    raw?: boolean;//原始html
    isStatic?: boolean;//静态节点的标识
    isRootInsert: boolean;//是否作为根节点插入，被<transition>包裹的节点，为false
    isComment: boolean;//当前节点是否为克隆节点。
}
```

## 9.2什么是Render函数

Render函数通过createElement参数来创建Virtual Dom,结构精简了很多。访问slot的用法，使用场景就是在Render函数。

## 9.3createElemet用法

### 9.3.1基本参数

createElement构成了Vue Virtual Dom的模板，他有3个参数：

createElement(

​	//{String | Object | Function}

​	//一个HTML标签，组件选项，或一个函数

​	//必须Return上述其中一个

​	'div'

​	// { Object }

​	//一个对应属性的数据对象，可选

)

# 第十章 使用webpack

**.vue单文件组件**就是一个后缀名为.vue的文件，在webpack中使用vue-loader就可以对.vue格式的文件进行处理

一个.vue文件一般包括3部分，即`<template> <script>和<style>`

记住，每个vue文件就代表一个组件，组件之间可以相互依赖。

本书所介绍和使用的都是单页面富文本应用（SPA）技术，这意味着最终只有一个html的文件，其余都是静态资源。实际部署到生产环境时，一般会将html挂在后端程序下，由后端路由渲染这个页面，将所有的静态资源（`css、js、image、iconfont等`）单独部署到CDN，当然也可以和后端程序部署在一起，这样就实现了前后端完全分离。

我们在webpack的ouput选项里已经指定了path和publicPath，打完包后，所有的资源都会保存在demo/dist目录下，

```

webpack-merge	用于合并两个webpack的配置文件
html-webpack-plugin	是用来生成html文件的，他通过template选项来读取指定的模板index.ejs，然后输出到filename指定的目录，也就是demo/index_prod.html。模板index.ejs动态设置了静态资源的路径和文件名。

在demo目录下新建一个用于生产环境的配置文件 webpack.prod.config.js
"scripts": {
	"dev": "webpack-dev-server" --open --config webpack.config.js",
	"build": "webpack --progress --hide-modules --config webpack.prod.config.js"
}
```

# 第十一章 插件

注册插件需要一个公开的方法install，它的第一个参数是Vue构造器，第二个参数是一个可选的选项对象。

```
MyPlugin.install = function (Vue, options) {
    //全局注册组件(指令等功能资源类似)
    Vue.component('component-name',{
        //组件内容
    })
    //添加实例方法
    Vue.prototype.$Notice = function () {
        //逻辑。。。
    }
    //添加全局方法或属性
    Vue.globalMethod = function () {
        //逻辑...
    }
    //添加全局混合
    Vue.mixin({
        mounted: function () {
            //逻辑...
        }
    })
}

通过Vue.use()来使用插件：
Vue.use(MyPlugin)
//或
Vue.use(MyPlugin, {
    //参数
})
```

### 11.1.1什么是前端路由

webpack的主要使用场景就是单页面富应用（SPA），而SPA的核心就是前端路由。

+ 什么是路由

  就是每次GET或者POST等请求在服务端有一个专门的正则配置列表，然后匹配到具体的一条路径后，分发到不同的Controller，进行各种操作，最终将html或数据返回给前端，这就完成了一次IO。

+ 后端路由的（多页面）好处
  - 可以在服务器渲染好直接返回给浏览器，不用等待前端加载任何js和css就可以直接显示网页内容
  - 对SEO的友好

+ 后端路由的缺点

  + 模板是由后端来维护或改写的，前端开发者需要安装整套的后端服务。html和数据、逻辑混为一谈

+ 前端路由，即由前端来维护一个路由规则。实现有两种，
  + 一种是利用url的hash，就是常说的锚点（#），JavaScript通过hashChange事件来监听url的改变，IE7以下需要用轮询
  + 另一种就是HTML5的History模式，它使url看起来像普通网站那样，以“/”分割，没有#，但页面并没有跳转，不过使用这种模式需要服务端支持，服务端在接收到所有的请求后，都指向同一个html文件，不然会出现404.因此，SPA只有一个html，整个网站所有的内容都在这一个html里，通过JavaScript来处理

+ 前端路由的优点
  + 页面持久性，像大部分音乐网站，你都可以在播放歌曲的同时跳转到别的页面，而音乐没有中断。
  + 再比如前后端彻底分离，前端陆游的框架通用的有Director。不过更多的还是结合具体框架来用，比如Angular的ngRouter，React的ReachRouter,,以及本节要介绍的Vue的vue-router.

###11.1.2 vue-router基本用法

vue-router，路由不同的页面事实上就是动态加载不同的组件。

回到main.js里，完成路由的剩余配置。创建一个数组来制定路由匹配列表，每个路由映射一个组件：

```
const Routers = [
    {
        path: '/index',
        component: (resolve) => require(['./views/index.vue'], resolve)
    },
    {
        path: '/about',
        component: (resolve) => require(['./views/about.vue'], resolve)
    }
]
	Routers 里每一项的path属性就是指定当前匹配的路径，component是映射的组件。上例的写法，webpack会把每一个路由都打包为一个js文件，在请求到该页面时，采取加载这个页面的js，也就是异步实现的懒加载（按需加载）
	使用了异步路由后，编译出的每个页面的js都叫做chunk（块）
	有了chunk后，在每个页面（.vue文件）里写的样式也需要配置后才会打包进main.css，否则仍然会通过JavaScript动态创建<style>标签的形式写入
```

### 11.1.3跳转

vue-router有两种跳转页面的方法，第一种是使用内置的`<router-link>`组件，默认它会被渲染为一个`<a>`标签

```
// index.vue
<template>
	<div>
		<h1>首页</h1>
		<router-link to="/about">跳转到about</router-link>
	</div>
</template>
它的用法与一般的组件一样，to是一个prop，指定需要跳转的路径，当然也可以用v-bind动态设置。使用<router-link>，在HTML5的Histroy模式下会拦截点击，避免浏览器重新加载页面。	
```

`<router-link>`还有其他的一些prop，常用的有：

+ tag 可以指定渲染成什么标签，比如`<router-link to="/about" tag="li">渲染结果是``<li>而不是<a>`
+ replace 使用relpace不会留下History记录，所以导航后不能用后退键返回上一个页面，如`<router-link to="/about" replace>`
+ active-class当对应的路由匹配成功时，会自动给当前元素设置一个名为`router-link-active`的class，设置prop：active-class可以修改默认的名称，在做类似导航栏时，可以使用该功能高亮显示当前页面对应的导航菜单项，一般不修改。

有时候跳转页面可能需要在javascript里进行，类似于window,location.href。这时可以用第二跳转方法，使用router实例的方法。比如在about.vue里，通过点击事件跳转：

//about.vue

```js
<template>
	<div>
		<h1>介绍页</h1>
		<button @click="handleRouter">跳转到user</button>
	</div>
</template>
<script>
	export default {
        methods: {
            handleRouter () {
                this.$router.push('/user/123');
            }
        }
	}
</script>
$router还有其他一些方法：
	replace 类似于<router-link>的replace功能，它不会向histor添加新纪录，而是替换掉当前的history记录，如this.$router.replace('/user/123')；
	go 类似于window.history.go(),在history记录中向前或者后退多少步，参数是整数，例如
	//后退 1 页
	this.$router.go(-1)
	//前进2页
	this.$router.go(2);
```

### 11.1.4 高级用法

****

**问题：**在SPA项目中，如何修改网页的标题？

网页标题是通过title来显示的，但是SPA只有一个固定的html，切换到不同页面时，标题并不会变化，但是可以通过JavaScript修改title的内容

```
window.document.title='要修改的网页标题'
```

vue-router提供了导航钩子beforeEach和afterEach,他们会在路由即将改变前和改变后触发，所以设置标题可以在beforeEach钩子完成

```
//main.js
const Routers = [
    {
        path: '/index',
        meta: {
            title: '首页'
        },
        component: (resolve) => require(['./views/index.vue']， resolve)
    },
    {
        path: '/about',
        meta: {
            eitle: '关于'
        },
        component: (resolve) => require(['./views/about.vue'], resolve)
    }
]；

const router = new VueRouter(RouterConfig);
router.beforeEach((to, from, next) => {
    window.document.title = to.meta.title;
    next();
})

```

导航钩子有3个参数：

+ to 即将要进入的目标的路由对象
+ from 当前导航即将要离开的路由对象
+ next 调用该方法后，才能进入下一个钩子。

路由列表的meta字段可以自定义一些信息，比如我们将每个页面的title写入了meta来统一维护，beforeEach钩子可以从路由对象to里获取meta信息，从而改变标题。

有了这两个钩子，还能做很多事情来提升用户体验，比如一个页面较长，滚动到某个位置，再跳转到另一个页面，滚动条默认是在上一个页面停留的位置，而好的体验肯定是能返回顶端。通过钩子afterEach就可以实现

```
//main.js
router.afterEach((to, from, next) => {
    window.scrollTo(0, 0);
});
类似的需求还有，从一个页面过渡到另一个页面时，可以出现一个全局的Loading动画，等到新页面加载完后再结束动画。
```

next()方法还可以设置参数，比如下面的场景。

某些页面需要校验是否登录，如果登陆了就可以访问，否则跳转到登录页，这里我们通过localStorage来简易判断是否登录，示例代码如下

```js
router.beforeEach((to, from, next) =>{
    if (window.localStorage.getItem('token')){
        next();
    } else {
        next('/login');
    }
} );
next()的参数设置为false时，可以取消导航，设置为具体的路径可以导航到指定的页面。
正确的使用好导航钩子可以方便实现一些 全局的功能，而且便于维护。更多的可能需要在业务中不断探索。
```

## 11.2状态管理与Vuex

### 11.2.1状态管理与使用场景

message和handleClick只有在message.vue组件里可以访问和使用，其他的组件是无法读取和修改message的，但在实际业务中，经常有跨组件共享数据的需求，因此Vuex的设计就是用来统一管理组件状态的，它定义了一系列规范来使用和操作数据，使组件应用更加高效。

```
import Vue from 'vuex';
Vue.use(Vuex);
const store = new Vuex.Store({
    //vuex的配置
})；

new Vue({
    el: '#app',
    router: router,
    //使用vuex
    store: store,
    render: h => {
        return h(App)
    }
})
```

仓库store包含了应用的数据（状态）和操作过程，Vuex里的数据都是响应式的，任何组件使用统一store的数据时，只要store的数据变化，对应的组件也会立即更新

数据保存在Vuex选项的state字段内，比如要实现一个计数器，定义一个数据count，初始值为0：

```js
const store = new Vuex.Store({
    state: {
        count: 0
    }
});
在任何组件内，，可以直接通过$store.state.count读取：

// index.vue
<template>
	<div>
		<h1>首页</h1>
		{{ $store.state.count }}
	</div>
</template>
直接写在template里显得有点乱，可以用一个计算属性来显示：
<template>
	<div>
		<h1>首页</h1>
		{{ count }}
	</div>
</tempalte>
<script>
	export default{
        computed: {
            count () {
                return this.$store.state.count;
            }
        }
	}
</script>
现在访问首页，计数0已经可以显示出来了
在组件内，来自store的数据只能读取，不能手动改变，改变store中数据的唯一途径就是显式地提交mutations
mutations 是Vuex的第二个选项，用来直接修改state里的数据。我们给计数器增加2个Mutations，用来加1和减1：
// main.js
const store = new Vuex.Store({
    state: {
        count: 0
    },
    mutations: {
        increment (state) {
            state.count ++;
        },
        decrease (state) {
            state.count --;
        }
    }
});
在组件内，通过this.$store.commit方法来执行mutations。在index.vue中添加两个按钮用于加和减
<template>
	<div>
		<h1>首页</h1>
		{{ count }}
		<button @click="handleIncrement">+1</button>
		<button @click="handleDecrease">-1</button>
	</div>
</template>
<script>
	export default {
        computed: {
            count () {
                return this.$store.state.count;
            }
        },
        methods: {
            handleIncrement () {
                this.$store.commit('increment');
            },
            handleDecrease () {
                this.$store.commit('decreae');
            }
        }
	}
</script>
这看起来像JavaScript的观察者模式，组件只负责提交一个时间名，Vuex对应的mutations来完成业务逻辑.
mutations 还可以接受第二个参数，可以是数字、字符串或对象等类型。比如每次增加的不是1，而是指定的数量，可以这样改写：
mutations: {
    increment (state, n=1) {
        state.count += n;
    }
}
// index.vue
export default {
    methods: {
        handleIncrementMore () {
            this.$store.commit('increment', 5);
        }
    }
}
当一个参数不够用时，可以传入一个对象，无线扩展
提交mutation的另一种方式是直接使用包含type属性的对象，，比如：
//main.js
mutations: {
    increment (state, params) {
        state.count += params.count;
    }
}
// index.vue
this.$store.commit({
    type: 'increment',
    count: 10
});
```

**注意：**mutation里尽量不要异步操作数据。如果异步操作数据了，组件在commit后数据不能立即改变，而且不知道什么时候会改变，actions里处理异步

### 11.2.3 高级用法

Vuex还有其他3个选项可以使用： getters、actions、modules.

有这样的一个场景：Vuex定义了某个数据list,它是一个数组，比如：

```js
//main.js
const store =new Vuex.Store({
    state: {
        list: [1,5,8,10,30,50]
    }
})

```

如果只想得到小于10的数据，最容易想到的方法可能是在组件的计算属性里进行过滤

```
return this.$store.state.list.filter(item => item<10);
```

如果其他的组件也需要过滤后的数据，就得把computed的代码完全复制一份，而且需要修改过滤方法时，每个用到的组件都得修改，，这明显不是我们期望的结果。getters，能将computed的方法提取出来

```
//main.js 
const store = new Vuex.Store({
    state: {
        list: [1,5,8,10,30,50]
    },
    getters: {
        filteredList: state => {
            return state.list.filter (item =>> item<10);
        }
    }
});
//index.vue
export default {
    computed: {
        list () {
            return this.$store.getters.filteredList;
        }
    }
}
```

getter也可以依赖其他的getter,吧getter作为第二个参数。比如再写一个getter,计算出list 过滤后的结果的数量：

```
const store = new Vuex.Store({
    state: {
        list: [1,5,8,10,30,50]
    },
    getters: {
        filteredList: state => {
            return state.list.filter(item => item < 10);
        },
        listCount: (state, getters) => {
            return getters.filteredList.length;
        }
    }
})
```

上节提到，mutation里不应该异步操作数据，所以有了actions选项，action与mutation很像，不同的是action里面提交的是mutation，并且可以异步操作业务逻辑。

action 在组件内通过$store.dispatch 触发，例如使用action来加1;

```js
//main.js
const store = new Vuex.Store({
    state: {
        count: 0
    },
    mutations: {
        increment (state, n = 1) {
            state.count += n;
        }
    },
    actions: {
        increment (context) {
            context.commit('increment');
        }
    }
})
```

```
//index.html
<script>
	export default {
        computed: {
            count () {
                return this.$store.state.count;
            }
        },
        methods: {
            handleActionIncrement () {
                this.$store.dispatch('increment');
            }
        }
	}
</script>
```

是不是觉得有点多此一举，就目前示例来看是的，可以直接在mutation，没必要通过action中转一次，但是加了异步就不一样了，我们用一个Promise在1秒钟后提交mutation，

```js
//main.js
const store = new Vuex.Store({
    state: {
        count: 0
    },
    mutations: {
        increment (state, n=1) {
            state.count += n;
        }
    },
    actions: {
        asyncIncrement (context) {
            return new Promise(resolve => {
                setTimeout(() => {
                    context.commit('increment');
                    resolve();
                },1000)
            });
        }
    }
})
```

```
//index.vue
export default {
    computed: {
        count () {
            return this.$store.state.count;
        }
    },
    methods: {
        handleAsyncIncrement () {
            this.$store.dispatch('asyncIncrement').then(() => {
                console.log(this.$store.state.count);//1
            })
        }
    }
}
```

mutations、actions看起来很相似，可能会觉得不知道该用哪个，但是Vuex很像是一种与开发者的约定，所以涉及改变数据的，就使用mutations，存在业务逻辑的，就用actions。至于将业务逻辑放在action里还是Vue组件里完成，就需要根据实际场景拿捏了。

最后一个选项是Modules，它用来将store分割到不同模块，当你的项目足够大时，store里的state、getters、mutations、actions会非常多，都放在Main.js里显得不是很友好，使用modules可以把他们写到不同的文件中。每个module拥有自己的state、getters、mutations、actions，而且可以多层嵌套。

```
比如下面的示例： 
const moduleA = {
    state: {..},
    mutations: {..},
    actions: {..},
    getters: {..}
}
const moduleB = {
    state: {..},
    mutations: {..},
    actions: {..},
    getters: {..}
}
const store = new Vuex.Store({
	modules: {
        a: moduleA,
        b: moduleB
	} 
})
store.state.a //moduleA的状态
store.state.b //moduleB的状态
```

```
module 的 mutation和getter接收的第一个参数state是当前模块的状态。在actions 和 getters中，还可以接收一个参数rootState,来访问根节点的状态。比如getters中rootState将作为第3个参数

const moduleA = {
    state: {
        count: 0
    },
    getters: {
        sumCount (state, getters, rootState) {
            return state.count + rootState.count;
        }
    }
}
```

## 11.3实战：中央事件总线插件vue-bus

在vue-bus目录下新建vue-bus.js文件，vue-bus插件像vue-router和Vuex一样给Vue添加一个属性$bus,并代理$emit、$on、$off三个方法。

```
//vue-bus.js
const install = function (Vue) {
    const Bus = new Vue({
        methods: {
            emit (event, ...args) {
                this.$emit(event,...args);
            },
            on (event, callback) {
                this.$on(event, callback);
            },
            off (event, callback) {
                this.$off(event, callback);
            }
        }
    });
    Vue.prototype.$bus = Bus;
};
export default install;
```

```
//main.js部分代码省略
import VueBus from './vue-bus';
Vue.use(VueBus);
在views目录下新建一个组件Counter.vue:
//views/counter.vue

<template>
	<div>
		{{ number }}
		<button @click="handleAddRandom">随机增加</button>
	</div>
</template>
<script>
	export default {
        props: {
            number: {
                type: Number
            }
        },
        methods: {
            handleAddRandom () {
                //随机获取1~100中的数
                const num = Math.floor(Math.random () * 100+1);
                this.$bus.emit('add', num);
            }
        }
	};
</script>
```

在index.vue中使用Counter组件来监听来自counter.vue的自定义事件：

````
//index.vue 部分代码省略
<template>
	<div>
		随机增加：
		<Counter :number="number"></Counter>
	</div>
</template>
<script>
	import Counter from './counter.vue'
	export default {
        components: {
            Counter
        },
        data () {
            return {
                number: 0
            }
        },
        created () {
            this.$bus.on('add', num => {
                this.number += num;
            });
        }
	}
</script>
````

通过插件的形式使用后，所有组件都可以直接通过this.使用$bus,而无须每个组件都导入bus组件。

​	使用vue-bus有两点需要注意：

+ $bus.on应该在created钩子内使用，如果在Mounted使用，它可能接受不到其他组件来自created钩子内发出的事件；
+ 使用了$bus.on，在beforeDestroy钩子里应该再使用$bus.off解除，因为组件销毁后，就没必要监听的句柄存储在vue-bus里了

# 第12章 iview经典组件剖析

## 12.1级联选择组件 Cascader

级联选择是网页中常见的表单类控件，主要用于省市区、公司级别、事务分类等关联数据集合的选择。



**独立组件与业务组件最大的不同是，业务组件往往针对数据的获取、整理、可视化，逻辑清晰简单，可以使用vuex；而独立组件的复杂度更多集中在细节、交互、性能优化、API设计上，对原生javaScript有一定考验。在使用过程中，可能会有新功能的不断添加，也会发现隐藏的bug，所以独立组件一开始逻辑和代码量并不复杂，多次迭代后悔越来越冗长，当然功能也更丰富，使用更稳定。万事开头难，组价API的设计和可扩展性决定了组件迭代的复杂性。一开始不可能考虑到所有的细节，但是整体架构要清晰可扩展，否则很有可能重构。**



