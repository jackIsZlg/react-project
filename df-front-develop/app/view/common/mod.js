/**
 * @file: mod.js
 * @author fis
 * ver: 1.0.13
 * update: 2016/01/27
 * https://github.com/fex-team/mod
 */
let require

/* eslint-disable no-unused-vars */
let define;

(function (global) {
  // 避免重复加载而导致已定义模块丢失
  if (require) {
    return
  }

  let head = document.getElementsByTagName('head')[0]
  let loadingMap = {}
  let factoryMap = {}
  let modulesMap = {}
  let scriptsMap = {}
  let resMap = {}
  let pkgMap = {}

  let createScripts = function (queues, onerror) {
    let docFrag = document.createDocumentFragment()

    for (let i = 0, len = queues.length; i < len; i++) {
      let id = queues[i].id
      let url = queues[i].url

      if (url in scriptsMap) {
        continue
      }

      scriptsMap[url] = true

      let script = document.createElement('script')
      if (onerror) {
        (function (script, id) {
          let tid = setTimeout(() => {
            onerror(id)
          }, require.timeout)

          script.onerror = function () {
            clearTimeout(tid)
            onerror(id)
          }

          let onload = function () {
            clearTimeout(tid)
          }

          if ('onload' in script) {
            script.onload = onload
          } else {
            script.onreadystatechange = function () {
              if (this.readyState === 'loaded' || this.readyState === 'complete') {
                onload()
              }
            }
          }
        }(script, id))
      }
      script.type = 'text/javascript'
      script.src = url

      docFrag.appendChild(script)
    }

    head.appendChild(docFrag)
  }

  let loadScripts = function (ids, callback, onerror) {
    let queues = []
    for (let i = 0, len = ids.length; i < len; i++) {
      let id = ids[i]
      let queue = loadingMap[id] || (loadingMap[id] = [])
      queue.push(callback)

      //
      // resource map query
      //
      let res = resMap[id] || resMap[`${id}.js`] || {}
      let pkg = res.pkg
      var url

      if (pkg) {
        url = pkgMap[pkg].url || pkgMap[pkg].uri
      } else {
        url = res.url || res.uri || id
      }

      queues.push({
        id,
        url
      })
    }

    createScripts(queues, onerror)
  }

  define = function (id, factory) {
    id = id.replace(/\.js$/i, '')
    factoryMap[id] = factory

    let queue = loadingMap[id]
    if (queue) {
      for (let i = 0, n = queue.length; i < n; i++) {
        queue[i]()
      }
      delete loadingMap[id]
    }
  }

  require = function (id) {
    // compatible with require([dep, dep2...]) syntax.
    if (id && id.splice) {
      return require.async.apply(this, arguments)
    }

    id = require.alias(id)

    let mod = modulesMap[id]
    if (mod) {
      return mod.exports
    }

    //
    // init module
    //
    let factory = factoryMap[id]
    if (!factory) {
      throw `[ModJS] Cannot find module \`${id}\``
    }

    mod = modulesMap[id] = {
      exports: {}
    }

    //
    // factory: function OR value
    //
    let ret = (typeof factory === 'function') ? factory.apply(mod, [require, mod.exports, mod]) : factory

    if (ret) {
      mod.exports = ret
    }

    return mod.exports
  }

  require.async = function (names, onload, onerror) {
    if (typeof names === 'string') {
      names = [names]
    }

    let needMap = {}
    let needNum = 0
    let needLoad = []

    function findNeed(depArr) {
      let child

      for (let i = 0, n = depArr.length; i < n; i++) {
        //
        // skip loading or loaded
        //
        let dep = require.alias(depArr[i])

        if (dep in needMap) {
          continue
        }

        needMap[dep] = true

        if (dep in factoryMap) {
          // check whether loaded resource's deps is loaded or not
          child = resMap[dep] || resMap[`${dep}.js`]
          if (child && 'deps' in child) {
            findNeed(child.deps)
          }
          continue
        }

        needLoad.push(dep)
        needNum++

        child = resMap[dep] || resMap[`${dep}.js`]
        if (child && 'deps' in child) {
          findNeed(child.deps)
        }
      }
    }

    function updateNeed() {
      if (needNum-- === 0) {
        let args = []
        for (let i = 0, n = names.length; i < n; i++) {
          args[i] = require(names[i])
        }

        onload && onload.apply(global, args)
      }
    }

    findNeed(names)
    loadScripts(needLoad, updateNeed, onerror)
    updateNeed()
  }
    
  require.ensure = function (names, callback) {
    require.async(names, function () {
      callback && callback.call(this, require)
    })
  }

  require.resourceMap = function (obj) {
    let k
    let col

    // merge `res` & `pkg` fields
    col = obj.res
    for (k in col) {
      if (col.hasOwnProperty(k)) {
        resMap[k] = col[k]
      }
    }

    col = obj.pkg
    for (k in col) {
      if (col.hasOwnProperty(k)) {
        pkgMap[k] = col[k]
      }
    }
  }

  require.loadJs = function (url) {
    if (url in scriptsMap) {
      return
    }

    scriptsMap[url] = true

    let script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = url
    head.appendChild(script)
  }

  require.loadCss = function (cfg) {
    if (cfg.content) {
      let sty = document.createElement('style')
      sty.type = 'text/css'

      if (sty.styleSheet) { // IE
        sty.styleSheet.cssText = cfg.content
      } else {
        sty.innerHTML = cfg.content
      }
      head.appendChild(sty)
    } else if (cfg.url) {
      let link = document.createElement('link')
      link.href = cfg.url
      link.rel = 'stylesheet'
      link.type = 'text/css'
      head.appendChild(link)
    }
  }


  require.alias = function (id) {
    return id.replace(/\.js$/i, '')
  }

  require.timeout = 5000
}(this))
