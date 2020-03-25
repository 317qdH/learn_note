## createStore

//传入一个reducer函数，返回一个包含 

getstate：获取store的值

dispatch：传入一个action（内部传入state）调用reducer和subscribe的回调

subscribe：传入回调，在store改变之后执行，实现组件更新

```react
function createStore(reducer){
  let state = null;
  let listeners = [];
  let subscribe = (listener)=>listenerList.push(listener)
  let getState = ()=> state;
  let dispatch = (action)=>{
	state = reducer(state,action);
	listeners.forEach((listener)=>{
	  listener();
	})
  }
  dispatch({});//初始化state
  return {getState,dispatch,subscribe}
}
```

## connect

把更新store 的操作包装起来，用户只需要按照格式 传入指定的 state和action

```react
export const connect = (mapStateToProps, mapDispatchToProps) => (WrappedComponent) => {
  class Connect extends Component {
    static contextTypes = {
      store: PropTypes.object
    }

    constructor () {
      super()
      this.state = {
        allProps: {}
      }
    }

    componentWillMount () {
      const { store } = this.context //获取挂载在Provider上面的store
      this._updateProps()	
      store.subscribe(() => this._updateProps())
      //数据流 store => subscribe => _updateProps => allProps ==> 更新组件
    }

    _updateProps () {
      const { store } = this.context
      let stateProps = mapStateToProps
        ? mapStateToProps(store.getState(), this.props)
        : {} // 防止 mapStateToProps 没有传入
      let dispatchProps = mapDispatchToProps
        ? mapDispatchToProps(store.dispatch, this.props)
        : {} // 防止 mapDispatchToProps 没有传入
      this.setState({
        allProps: {
          ...stateProps,
          ...dispatchProps,
          ...this.props
        }
      })
    }

    render () {
      return <WrappedComponent {...this.state.allProps} />
    }
  }
  return Connect
}

```

