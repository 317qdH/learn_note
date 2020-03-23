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

less
less-loader 
node-sass
sass-loader

module:{
  rules:[
    {
      test:/\.less$/,
      use:[
        MiniCssExtractPlugin.loader,
        'css-loader',
        'less-loader'
      ]
    },
    {
      test:/\.(sass|scss)$/,
      use:[
        MiniCssExtractPlugin.loader,
        'css-loader',
        'sass-loader'
      ]
    },
    {
	  test:/\.(eot|ttf|svg|woff|woff2)/,
	  use:[
	    loader:'file-loader',
	    options:{
	      name:'[name]_[hash].[ext]',
	      outputPath:'font/'
	    }
	  ]
	}
  ]
}
```

### file-loader url-loader

处理图片，字体图标，将小的图片转成base格式插入到bundle.js文件中

```
module:{
  rules:[
    test:/\.(jpg|png|gif)$/,
    use:{
      loader:'url-loader',
      options:{
        name:'[name].[ext]',
        outputPath:'images/',
        limit:8192
      }
    }
  ]
}
```

### mini-css-extract-plugin

通过引入外部css文件进行样式引入

```
plugins:[
  //...
  new MiniCssExtractPlugin({
    filename:'css/[name].[hash].css',
    chunkFilename:'css/[id].[hash].css',
  }),
]

module:{
  rules:[
    {
      test:/\.css$/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader'
      ]
    }
  ]
}
```

### optimize-css-assets-webpack-plugin 

压缩打包出的css 文件

```
optimization:{
  minimizer:[
    new UglifyJsPlugin(),
    new OptimizeCssAssetsPlugin({
	  assetNameRegExp:/\.css$/g,//匹配需要优化或者压缩的资源名
	  cssProcessor:requier('cssnano'),//用于压缩和优化css的处理器
	  cssProcessorPluginOptions:{
	  //传递g给cssProcessor的插件选项，discardComments去除注释
        proset:['default',{ discardComments:{ removeAll:true } }]
      },
      canPrint:true//表示插件能够在console中打印信息，默认值是true
    })
  ]
}
```

## plugin

### html-webpack-plugin

```
new HtmlWebpackPlugin({
  filename:'index.html',//打包之后的html文件的名字
  template:'public/index.html',//以我们自己定义的html为模板生成
  inject:'body',//在body最底部引入js文件，如果是head，就是在head中引入js
  minify:{
    //压缩html文件
    removeComments:true,//去除注释
    collapseWhitespace:true//去除空格
  }
})

tip:
给打包出的js文件换个不确定的名字
  这个操作是为了防止因为浏览器缓存带来的业务代码更新，而页面缺没有变化的问题，
  加入客户端请求js文件的时候发现名字是一样的，那么他很有可能不发新的数据包，而直接用之前   缓存的文件，当然这和缓存策略有关。
  使用内存变量[name]或[chunkhash]

output:{
  filename:'js/[name].[chunkhash:8].bindle.js'
}
```

### clean-webpack-plugin

打包编译前清理dist目录

```
new CleanWebpackPlugin();
```

### uglifyjs-webpack-plugin

压缩js文件

```
optimization内配置minimizer参数

optimization:{
  minimizer:[ new UglifyJsPlugin ],
  splitChunks:{...}
}
```

### webpack-dev-server

自动编译打包，开发环境下使用

```
devServer:{
  contentBase:path.resolve(__dirname,'../dist'),
  open:true,
  port:9000,
  compress:true,
  hot:true
},
plugins:[
  new webpack.HotModuleReplacementPlugin()
]

"dev":"webpack-dev-server --inline --config ./config/webpack.dev.config.js"
```

