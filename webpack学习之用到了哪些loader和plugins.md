<=>意为等价于

```shell
npm install <=> npm i
--save <=> -S//发布到生产环境的依赖
--save-dev <=> -D//dev开发环境的依赖
npm run start <=> npm start
```

举个栗子：

​	你写ES6代码，需要babel转换成es5，上线的时候，我们只需要转换以后的代码，直接把转换后的代码部署上线，不需要babel了，这就是devDependencies。

​	如果你用了jquery，发布之后还是依赖jquery 这就是dependencies.

```javascript
"start":"webpack --config ./config/webpack.common.config.js"
"build":"webpack --config ./config/webpack.prod.config.js"
"dev":"webpack-dev-server --inline --config ./config/webpack.dev.config.js"
```

### 代码分割

  修改webpack.common.config.js入口

```
entry:{
	index:'./src/index.js',
	framework:['react','react-dom']
}
optimization:{
  splitChunks:{
	chunks:'all',
    minSize:30000,
    maxSize:0,
    minChunks:1,
    cacheGroups:{
	  framework:{
	  	test:"framework",
	  	name:"framework",
	  	enforce:true
	  },
	  vendors:{
	    priority:-10,
	    test:/node_modules/,
	    name:"vendor",
	    enforce:true,
	  }
	}
  }
}
```

配置source-map 

定位代码错误,

```
module.exports = {
  devtool:'cheap-module-eval-source-map',
}
```

# loader

### webpack-merge 

用于抽离公共的webpack配置文件

### babel

```
babel-loader:使用babel和webpack来转译javascript文件
@babel/preset-react:转译react的jsx
@babel/preset-env:转译ES2015+的语法
@babel/core:babel的核心模块

.babelrc文件
{
  "presets":[
    [
      "targets":{
	  	"edge":17,//大于相关浏览器版本无需用到preset-env
	  	"firefox":60,
	  	"chrome":67,
	  	"safari":11.1
	  },
	  //根据代码逻辑中用到的ES6+语法进行方法的导入，而不是全部导入
	  "useBuiltIns":"usage"
    ]
  ]
}

module:{
  rules:[
    {
      test:/\.(js|jsx)/,//作用域规则中匹配到的后缀结尾的文件
      use:'babel-loader',//使用babel-loader必须的属性
      exclude:/node_modules/,//告诉我们不需要去转译node_modules里面的文件
    }
  ]
}
```

### style-loader  css-loader  

style-loader生成一个style标签放到head标签里面，css-loader遇到.css文件解析，@import等语句就将相应样式引入（如果没有css-loader,就没法解析这类语句）

```
module:{
  rules:[
    {
      test:/\.css$/,
      use:["style-loader",'css-loader']
    }
  ]
}
```

