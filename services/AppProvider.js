const Migration = require("../database/migration");

module.exports = class AppProvider {
  //بدنا نحولو سينغلتون
  /* static*/ #app = null;
  #migration = null;

  static #instance = null;

  static get instance() {
    //ممكن نعمل هان عمليات كتير مثلا انو نستدعي المايقريشنز
    return (this.#instance ??= new AppProvider());
  }
  //بدنا نعمل ملف لما نستدعيه ينفذ اكتر من اشي يعني ينفذ المايقريشنز واي اشي تاني
  syncDatabase() {
    this.migration = new Migration();
    this.migration.sync();
  }

  /* static*/ set app(app) {
    this.#app = app;
  }

  /*static*/ get router() {
    return this.#app._router.stack;
  }

  // static get app() {
  //   return this.#app;
  // }

  // static checkRoutes(oath) {
  //   let route = null;
  //   this.#app._router.stack.forEach((item) => {
  //     if (item.name === "router") {
  //       route = item.handle.stack.find((element) => {
  //         element.route.path == path;
  //       });
  //       // break ;//بنفعش بريك جوا قنكشن
  //       return;
  //     }
  //   });
  //   return route != null;
  // }
};
