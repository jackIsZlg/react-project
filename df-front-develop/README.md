> 本地开发

```
终端一
npm run webpack

终端二
npm run dev
```

> 生产部署

- 构建
    ```
     npm run build
    ```
- 部署(解压(tar zxvf release.tgz)并进入release包)
    ```
     npm run start
    ```

> 说明


- 目录说明
    ```
    app/router.js 用于配置 URL 路由规则。
    app/controller/** 用于解析用户的输入，处理后返回相应的结果。
    app/service/** 用于编写业务逻辑层，可选，建议使用。
    app/middleware/** 用于编写中间件，可选。
    app/public/** 用于放置静态资源，可选。
    app/extend/** 用于框架的扩展，可选。
    config/config.{env}.js 用于编写配置文件，具体参见配置。
    config/plugin.js 用于配置需要加载的插件  
    ```
- 开发说明
    - fis3 release prod 
    该指令是结合egg框架和原有旧的打包工具，将修改的js、scss打包到public资源目录下，
    只修改jsp文件不用重新执行此指令。
    - npm run dev
    该指令是egg内置指令 会动态监听渲染模板文件的变化。
    - npm run build
    该指令是构建release包，构建成功后在包内执行npm run start即可
- 注意 
    - 在迁移过程中url必须和旧版本保持一致，但若遇到对应的pages名称或结构不合理可做调整
    - 一般来说每个页面（模块）对应一个文件夹，每个文件下对应着jsp、js、scss