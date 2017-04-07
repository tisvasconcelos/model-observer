define('manager', ['doc'], function($){
  var data = {};
  var _getObserver = function(name) {
    return data[name].observer;
  };

  return {
    addModel: function(opts) {
      var observer = new PathObserver(opts.obj, opts.path, opts.defaultValue);
      data[opts.name] = {
        observer: observer,
        value: opts.obj
      };
      observer.open(function(newValue, oldValue) {
        $(window).trigger(opts.name, {
          newValue: newValue,
          oldValue: oldValue
        });
      });
    },
    getValue: function(opts) {
      return data[opts.name].value;
    },
    setValue: function(opts) {
      var observer = _getObserver(opts.name);
      observer.setValue(opts.value);
      observer.deliver();
    },
    observerModel: function(opts) {
      $(window).on(opts.name, function(e) {
        opts.callback(e.detail);
      });
    }
  };
});

define(['doc', 'manager'], function($, manager) {
  manager.observerModel({
    name: 'abc',
    callback: function(data){
      console.log('3', data.newValue, data.oldValue);
    }
  });
});

define(['doc', 'manager'], function($, manager) {
  //stub ajax com modelo inicial
  var obj = { foo: { bar: 'baz', leo: 'ueda' } };
  manager.addModel({
    obj: obj,
    path: 'foo',
    defaultValue: 42,
    name: 'abc'
  });

  manager.observerModel({
    name: 'abc',
    callback: function(data){
      console.log('1', data.newValue, data.oldValue);
      console.log(manager.getValue({name: 'abc'}));
    }
  });
});

define(['doc', 'manager'], function($, manager) {
  manager.observerModel({
    name: 'abc',
    callback: function(data){
      console.log('2', data.newValue, data.oldValue);
    }
  });

  console.log(manager.getValue({name: 'abc'}));

  setTimeout(function() {
    manager.setValue({name: 'abc', value: 'foo'});
  }, 5000);
});
