# learn_note

一些笔记和学习资料

## 手动实现一个Promise

```javascript
class cutPromise{
    constructor(executor){
    	//如果传入的不是函数，抛出异常
        if(typeof(executor) !== 'function'){
            throw new Error('Executor must be a functoin') 
        }

        this.state = 'PEDDING';//设置promise的初始状态为Pedding
        this.asyncList = [];	//初始化一个数组，放置then方法的函数 

        const resolve = (value)=>{
            if(this.state !== 'PEDDING'){
                return
            }
            this.state = 'FULFILLED';
            this.resolveValue = value;//resolve函数传入的参数保存起来
            for(const {onFulfilled} of this.asyncList){
                onFulfilled(value)//吧resolve函数传入的参数，传给then中传入的函数
            }
        }

        const reject = (value)=>{
            if(this.state !== 'PEDDING'){
                return
            }
            this.state = 'REJECTED';
            this.rejectValue = value;
            for(const {onRejected} of this.asyncList){
                onRejected(value)
            }
        }
        executor(resolve,reject)//一定要执行一下executor函数,所以Promise函数里面是立即执行的.

    }

    then(onFulfilled,onRejected){
        if(this.state == 'PEDDING'){
            this.asyncList.push({onFulfilled,onRejected})
        }else if(this.state == 'FULFILLED'){
            onFulfilled(this.resolveValue)
        }else if(this.state == 'REJECTED'){
            onRejected(this.rejectValue)
        }
    }

    
}
```



