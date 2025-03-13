const AppProvider = require("./AppProvider");

module.exports = class Route {
    //   prefixes = [];
     static prefixes = [];

      static prefix(value){
        // prefixes.push(value)
        this.prefixes.push(value)
        return value;
      }

  static isRouteExists(path) {
    let route = null;
    for (const router of AppProvider.instance.router) {//app._router.stack جوا الراوت//وبعد السينغلتون
      if (router.name === "router") {
        route = router.handle.stack.find(
          // (element) => element.route.path.includes(path)//عشان لو كان في سي ام اس في الاول ميتاثرش بس لازم نعكس العملية
          // (element) =>path.includes(element.route.path)
          (element) =>path.endsWith(element.route.path)//داتا ستركتشر عشان لو في زيادات في الاخر يكون الرابط غلط       
        );
        // console.log(route);
        if (route) {
          break;
        }
      }
    }
    // AppProvider.app._router.stack.forEach(function (item) {
    //   if (item.name === "router") {
    //     route = item.handle.stack.find((element) =>
    //         element.route.path == path
    //         );
    //         console.log(route)
    //     // break ;//بنفعش بريك جوا قنكشن
    //     return route ;
    //   }
    // });
    return route != null;
  }
};
