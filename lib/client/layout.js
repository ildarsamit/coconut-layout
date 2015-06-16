var currentLayoutName = null;
var currentLayout = null;
var currentRegions = new ReactiveDict();
var currentData;

CoconutLayout.setRoot = function(root) {
  CoconutLayout._root = root;
};

CoconutLayout.render = function render(layout, regions) {
  Meteor.startup(function() {
    var rootDomNode = CoconutLayout._getRootDomNode();
    if(currentLayoutName != layout) {
      // remove old view
      CoconutLayout.reset();
      currentData = CoconutLayout._regionsToData(regions);

      currentLayout = Blaze._TemplateWith(currentData, function() {
        return Spacebars.include(Template[layout]);
      });

      Blaze.render(currentLayout, rootDomNode);
      currentLayoutName = layout;
    } else {
      CoconutLayout._updateRegions(regions);
    }
  });
};

CoconutLayout.reset = function reset() {
  var layout = currentLayout;
  if(layout) {
    if(layout._domrange) {
      // if it's rendered let's remove it right away
      Blaze.remove(layout);
    } else {
      // if not let's remove it when it rendered
      layout.onViewReady(function() {
        Blaze.remove(layout);
      });
    }
    
    currentLayout = null;
    currentLayoutName = null;
    currentRegions = new ReactiveDict();
  }
};

CoconutLayout._regionsToData = function _regionsToData(regions, data) {
  data = data || {};
  _.each(regions, function(value, key) {
    currentRegions.set(key, value);
    data[key] = CoconutLayout._buildRegionGetter(key);
  });

  return data;
};

CoconutLayout._updateRegions = function _updateRegions(regions) {
  var needsRerender = false;
  _.each(regions, function(value, key) {
    // if this key does not yet exist then blaze
    // has no idea about this key and it won't get the value of this key
    // so, we need to force a re-render
    if(currentData && currentData[key] === undefined) {
      needsRerender = true;
      // and, add the data function for this new key
      currentData[key] = CoconutLayout._buildRegionGetter(key);
    }
    currentRegions.set(key, value);
  });

  // force re-render if we need to
  if(currentLayout && needsRerender) {
    currentLayout.dataVar.dep.changed();
  }
};

CoconutLayout._getRootDomNode = function _getRootDomNode() {
  var root = CoconutLayout._root
  if(!root) {
    root = $('<div id="__coconut-root"></div>');
    $('body').append(root);
    CoconutLayout.setRoot(root);
  }

  // We need to use $(root) here because when calling CoconutLayout.setRoot(), 
  // there won't have any available DOM elements
  // So, we need to defer that.
  var domNode = $(root).get(0);
  if(!domNode) {
    throw new Error("Root element does not exist");
  }

  return domNode;
};

CoconutLayout._buildRegionGetter = function _buildRegionGetter(key) {
  return function() {
    return currentRegions.get(key);
  };
};
