Tinytest.addAsync("Integration - render to the dom", function(test, done) {
  CoconutLayout.reset();
  CoconutLayout.render('layout1', {aa: 200});
  Tracker.afterFlush(function() {
    test.isTrue(/200/.test($('#__coconut-root').text()));
    Meteor.setTimeout(done, 0);
  });
});

Tinytest.addAsync("Integration - do not re-render", function(test, done) {
  CoconutLayout.reset();
  ResetStats('layout1');
  CoconutLayout.render('layout1', {aa: 2000});

  Tracker.afterFlush(function() {
    CoconutLayout.render('layout1', {aa: 3000});
    Tracker.afterFlush(checkStatus);
  });

  function checkStatus() {
    test.isTrue(/3000/.test($('#__coconut-root').text()));
    test.equal(TemplateStats.layout1.rendered, 1);
    test.equal(TemplateStats.layout1.destroyed, 0);
    Meteor.setTimeout(done, 0);
  }
});

Tinytest.addAsync("Integration - re-render for the new layout", function(test, done) {
  CoconutLayout.reset();
  ResetStats('layout1');
  ResetStats('layout2');

  CoconutLayout.render('layout1');

  Tracker.afterFlush(function() {
    CoconutLayout.render('layout2', {aa: 899});
    Tracker.afterFlush(checkStatus);
  });

  function checkStatus() {
    test.isTrue(/899/.test($('#__coconut-root').text()));
    Meteor.setTimeout(done, 0);
  }
});

Tinytest.addAsync("Integration - render the new layout with data", function(test, done) {
  CoconutLayout.reset();
  ResetStats('layout1');
  ResetStats('layout2');

  CoconutLayout.render('layout1');

  Tracker.afterFlush(function() {
    CoconutLayout.render('layout2', {});
    Tracker.afterFlush(checkStatus);
  });

  function checkStatus() {
    test.isTrue(/layout2/.test($('#__coconut-root').text()));
    test.equal(TemplateStats.layout1.rendered, 1);
    test.equal(TemplateStats.layout1.destroyed, 1);
    Meteor.setTimeout(done, 0);
  }
});

Tinytest.addAsync("Integration - pick new data", function(test, done) {
  CoconutLayout.reset();

  CoconutLayout.render('layout3', {aa: 10});

  Tracker.afterFlush(function() {
    test.isTrue(/10/.test($('#__coconut-root').text()));
    CoconutLayout.render('layout3', {aa: 30, bb: 20});
    Tracker.afterFlush(checkStatus);
  });

  function checkStatus() {
    test.isTrue(/30/.test($('#__coconut-root').text()));
    test.isTrue(/20/.test($('#__coconut-root').text()));
    Meteor.setTimeout(done, 0);
  }
});

Tinytest.addAsync("Integration - do not re-render vars again", function(test, done) {
  CoconutLayout.reset();

  CoconutLayout.render('layout3', {aa: 10, bb: 20});

  Tracker.afterFlush(function() {
    test.isTrue(/10/.test($('#__coconut-root').text()));
    test.isTrue(/20/.test($('#__coconut-root').text()));
    $('#__coconut-root').html('');
    CoconutLayout.render('layout3', {aa: 10, bb: 20});
    Tracker.afterFlush(checkStatus);
  });

  function checkStatus() {
    test.equal($('#__coconut-root').html(), '');
    Meteor.setTimeout(done, 0);
  }
});

Tinytest.addAsync("Integration - using a different ROOT", function(test, done) {
  CoconutLayout.reset();
  var rootNode = $("<div id='iam-root'></div>");
  CoconutLayout.setRoot("#iam-root")
  $('body').append(rootNode);

  CoconutLayout.render('layout1', {aa: 200});
  Tracker.afterFlush(function() {
    test.isTrue(/200/.test($('#iam-root').text()));
    Meteor.setTimeout(done, 0);
    rootNode.remove();
  });
});