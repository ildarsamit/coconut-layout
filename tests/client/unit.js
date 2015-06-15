Tinytest.add('Unit - CoconutLayout._regionsToData', function(test) {
  var data = CoconutLayout._regionsToData({aa: 10, bb: "hello"});
  test.equal(data.aa(), 10);
  test.equal(data.bb(), "hello");
});

Tinytest.addAsync('Unit - CoconutLayout._updateRegions', function(test, done) {
  var aa = null;
  var bb = null;

  var data = CoconutLayout._regionsToData({aa: 10, bb: "hello"});
  var c1 = Tracker.autorun(function(c) {
    aa = data.aa();
  });

  var c2 = Tracker.autorun(function(c) {
    bb = data.bb();
  });

  CoconutLayout._updateRegions({aa: 20});

  Meteor.setTimeout(function() {
    test.equal(aa, 20);
    test.equal(bb, "hello");
    done();
  }, 100);
});
