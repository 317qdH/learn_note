## 解决this指向问题

+ 使用箭头函数

  ```
  <button onClick={(event) => {
      console.log(this.state.number)
  }}></button>
  
  因为箭头函数中的this指向的是函数定义时的对象
  劣势：每次render调用时，都会重新创建一个新的事件处理函数，
  ```

+ 使用组件方法

  ```
  constructor(props){
    super(props)//调用父组件的构造函数初始化
    this.state = {number:0}
    this.handleClick = this.handleClick.bind(this)
  
  问题：存在多个时间处理函数需要绑定时，模板式的代码会显得繁琐
  
  <button onClick={this.handleClick.bind(this)}></button>
  ```

+ 属性初始化语法

  ```
  handleClick = (event) => {
    const number = ++this.state.number;
  }
  优势，既不需要在构造函数中手动绑定this,也不需要担心组件重复渲染导致的函数重复创建问题。
  劣势：特性支持度不高
  ```

### 受控组件

```
文本框
<input type="text" name="name" value={this.state.name} onChange={this.handleChange} />
列表
<select value={this.state.value} onChange={this.handleChange}>
  <option value="react">React</option>
  <option value="redux">redx</option>
  <option value="mobx">mobx</option>
</select>
复选框和单选
```

### 非受控组件

```
表单元素的状态由表单自己管理，通过ref属性引用react组件或DOM元素的实例，获取元素的值
使用defaultValue属性指定默认值
<input defaultValue="something" type="text" ref={(input) => this.input = input} />
```

### React16新特性

+ render支持两种新的返回类型
  - 数组
  - 字符串

+ 错误处理componentDidCatch

  ```
  conponentDidCatch(error,info){
      //显示错误UI
      this.setState({hasError:true});
      //同时输出错误日志
      console.log(error,info)
  }
  ```

+ Portals

  ```
  ReactDOM.createPortal(child,container)；
  child:React元素、由React元素组成的数组、字符串
  container:一个DOM元素，child将被挂载到这个DOM节点
  ```

  #### 使用protal创建一个弹窗

  ```
  class Modal extends Component{
      constructor(props) {
      super(props);
      //根节点下创建一个div节点
      this.container = document.createElement('div');
      document.body.appendChild(this.container);
    }
    componentWillUnmount(){
        document.body.removeChild(this.container);
    }
    render(){
        //创建的DOM树挂载到this.container指向的div节点下面
        return ReactDOM.createPortal(
          <div className="modal">
            <span className="close" onClick={this.props.onClose}>&times</span>
            <div className="content">
              {this.props.children}
            </div>
          </div>
        )
    }
  }
  ```

  ### React中的普通属性

  ```
  constructor(props){
      this.timer = null;//普通属性,props,state
      this.state = {
        date:new Date()
      }
  }
  ```

  ### setData合并

  ```
  this.setData({quantity:this.state.quantity + 1})
  this.setData({quantity:this.state.quantity + 1})
  最终的数量只增加1
  使用另一个接收函数作为参数的setState
  this.setState((preState, props) => {
      counter:preState.quantity +1
  })
  ```

  ### state‘与不可变对象

  + 状态的类型是基本数据类型
  + 状态的类型是对象(不包含字符串和数组)
    + ES6的Object.assgin方法
    + ES6扩展语法[...state,{name:'哈哈'}]
  + 状态的类型是数组
    + 使用concat创建新数组
    + [...state,books]ES6语法
    + array.slice()截取方法也会返回新数组

#### 为什么推荐state不可变对象

+ 不用担心原有对象被不小心修改，方便程序管理和调试
+ 性能考虑shouldComponentUpdate通过引用就可以判断状态是否改变

#### componentDidMount请求最佳理由

+ 钩子中可保证获取到数据时，组件已经处于挂载状态
+ 当组件在服务端渲染时，willMount会被调用两次

### context

+ 旧的contextapi

  ```
  //返回一个对象暴露出去
  getChildContext(){
      return {onAddUser:this.handleAddUser}
  }
  //声明context的属性的类型信息
  componentName.childContextType = {
      onAddUser:PropTypes.func
  }
  //修改context中的数据，一定不能直接修改，而是要通过setState修改，
  组件state的变化会创建一个新的context。
  
  如何获取到传递出去的context?
  //声明要使用的context对象的属性
  conponentName.contextTypes = {
      onAddUser:PropTypes.func
  }
  内部就可以通过
  this.context.onAddUser访问onAddUser方法
  
  ```

  ### ref

  ```
  ref接收一个回调函数作为值
  在组件被挂载或卸载时回调函数会被调用
  在组件挂载时，回调函数会接收当前DOM元素作为参数(组件就是组件实例)；
  在组建被卸载时，回调函数会接受null作为参数
  
  函数式组件不能使用ref获取
  hook有useRef();
  ```

  ```
  class AutoFocusTextInput extends Reacts.Component{
      componentDidMount(){
          //通过ref让input自动获取焦点
          this.textInput.focus();
      }
      render(){
          return(
           <div>
             <input type="text" 
             ref = {(input) => { this.textInput = input }}/>
           </div>
          )
      }
  }
  ```

  ## 虚拟DOM

  ### 一个react元素的虚拟DOM表示方法

  ```
  <div className="foo">
    <h1>hello react</h1>
  </div>
  可以用这样一个javascript对象来表述
  {
   type:'div',
   props:{
       className:'foo',
       children:{
      type:'h1',
      props:{
          children:'hello react'
      }
    }
   }
  }
  ```

### 浅谈Diff算法思想

+ 永远只比较同层节点

+ 当根节点是不同类型时候

  ```
  吧整颗dom树拆掉调用componentWillUnmount,
  新的dom树调用componentwillmount和didmount
  ```

+ 当更节点是相同的元素类型时候

  - DOM元素时只更新变化了的属性

  - 组件类型时，实例不会被销毁，只执行更新操作

    ```
    调用componentWillReceiveProps和componentWillUpdate
    根据render函数返回的虚拟dom决定怎么更新真是DOM
    ```

+ 数组 渲染 key值 用来判断两个元素是不是相等的

## 性能优化

+ 避免不必要的组件渲染

  - PureComponent组件(浅比较)
  - React.memo()(浅比较)

  ```
  父组件的每一次render调用都会触发子组件的componentWillReceiveProps，有时候子组件的props可能并没有发生改变，改变的只是父组件的props或state。
  
  class MyComponent extends React.Component{
      shouldComponentUpdate(nextProps,nextState){
      //如果props没有改变，那么就不更新组件拉
      if(nextProps.item === this.props.item){
        return false
      }
      return true
    }
  } 
  ```

### HOC高阶组件使用场景

+ 操纵props

  ```
  在被包装组件接收props前，高阶组件可以先拦截到props，对props执行增加、删除、修改的操作，然后再将处理后的props传递给被包装组件
  ```

+ 通过ref访问组件实例

  ```
  高阶组件通过ref获取被包装组件实例的引用，然后高阶组件就具备了直接操作被包装组件的属性或方法的能力了
  ref = { (instance) => {this.wrapperInstance = instance} }
  ```

+ 组件状态提升

  ```
  高阶组件可以通过将被包装组件的状态及相应的状态处理方法提升到高阶组件自身内部实现被包装组件的无状态化，
  状态都在HOC中，包装组件和被包装组件都变成无状态组件了
  ```

+ 用其他元素包装组件

  ```
  在HOC添加额外的元素，通常用于增加布局或修改样式
  <wrappedComponent {...this.props} />
  <div>
    <wrappedComponent {...this.props}/>
  </div>
  ```

#### HOC中的参数传递

```\
withPersistenData('name')(MyComponent)
redux中的connect函数
connect(mapStateToProps,mapDispatchToProps)(WrappedComponent)
```

#### HOC使用注意事项

+ 在组件定义的外部调用，不在生命周期和render方法中调用，因为调用HOC每次都会返回一个新的组件，既影响效率有丢失了组件及其子组件的状态

+ 静态方法需要手动复制

+ refs不会被传递给被包装组件。不指定，再返回组件的中定义了ref指向的是返回的新组建，而不是内部被包装的组件.

+ 和父组件的区别

  ```
  如果逻辑和DOM直接相关的，是和放到父组件中实现。
  反之是和使用高阶组件。
  ```
