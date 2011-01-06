/**
 * JGWhite Utils
 *
 * @version 1.0
 */

(function(window, $) {

/**
 * Top level namespce for jgwhiteUtils
 *
 * @namespace
 */
jgwhiteUtils = {};

/**
 * Proxies (or locks, if you like) the scope of an instance’s methods
 * Useful to avoid mistakes with scope and event handlers
 *
 * @param object {Object} obj whose methods we want to scope
 */
jgwhiteUtils.scope = function(object) {
  for (var property in object)
    if (property !== 'constructor' && typeof object[property] === 'function')
      object[property] = $.proxy(object[property], object);
}

/**
 * Signature for key events, useful for handing on to switch statements
 *
 * @example
 * jgwhiteUtils.keyEventSignature(event) => 'shift+alt+26'
 *
 * @param event {KeyEvent} a key event whose signature we want
 * @return {String} the signature
 */
jgwhiteUtils.keyEventSignature = function(event) {
  var signature = [];
  if (event.shiftKey) signature.push('shift');
  if (event.ctrlKey) signature.push('ctrl');
  if (event.altKey) signature.push('alt');
  signature.push(event.keyCode ? event.keyCode : event.which);
  signature = signature.join('+');
  return signature;
}

/**
 * Ensure something responds to console.log and console.error
 */
jgwhiteUtils.ensureConsole = function() {
  if (window.console && window.console.log && window.console.error) return;
  window.console = { log: function() {}, error: function() {} }
}

/**
 * Returns line height in pixels for the element
 *
 * @return {Number} element line height in px
 */
$.fn.calculateLineHeight = function() {
  var $lineHeightTest = $('<div>LineHeight</div>');
  $lineHeightTest.appendTo(this);
  var result = $lineHeightTest.height();
  $lineHeightTest.remove();
  return result;
}

/**
 * Toggle horizontal and baseline grid guides
 * Grid values are taken from data attributes of subject element
 * Specify either data-grid-unit-size or data-grid-unit-count, not both
 *
 * @param data-grid-unit-size {Number}
 * @param data-grid-unit-count {Number}
 * @param data-grid-gutter {Number} default 0
 */
$.fn.toggleGrid = function() {
  this.each(function() {
    var $this = $(this);
    var $grid = $this.find('.jgwhite-grid').first();
    
    if ($grid.length === 0) {
      var width = $this.width(),
          paddingLeft = parseInt($this.css('padding-left'), 10),
          gutter = parseInt($this.attr('data-grid-gutter'), 10),
          unitCount = parseInt($this.attr('data-grid-unit-count'), 10),
          unitSize = parseInt($this.attr('data-grid-unit-size'), 10),
          baseline = $this.calculateLineHeight(),
          baselineOffset = parseInt($this.attr('data-grid-baseline-offset'), 10);
      
      if (isNaN(unitCount) && isNaN(unitSize)) {
        console.error('Specify either data-grid-unit-size or data-grid-unit-count, not both');
        return;
      }
      
      if (isNaN(paddingLeft)) paddingLeft = 0;
      if (isNaN(gutter)) gutter = 1;
      if (isNaN(unitCount)) unitCount = Math.floor((width + gutter) / (unitSize + gutter));
      if (isNaN(unitSize)) unitSize = (width - (gutter * (unitCount - 1))) / unitCount;
      if (isNaN(baselineOffset)) baselineOffset = 0;
      
      // container
      $grid = $('<div class="jgwhite-grid" />');
      $grid.css({
        'position': 'absolute',
        'left': 0, 'right': 0,
        'top': 0, 'bottom': 0,
        'z-index': 500
      });
      $grid.appendTo($this);
      
      // unit guides
      var left = paddingLeft;
      for (var i = 0; i < unitCount; i++) {
        var $unit = $('<div class="jgwhite-grid-unit" />');
        $unit.css({
          'position': 'absolute',
          'left': left + 'px',
          'top': 0, 'bottom': 0,
          'width': unitSize + 'px',
          'background-color': 'rgba(255, 0, 0, 0.25)'
        });
        $unit.appendTo($grid);
        left += unitSize + gutter;
      }
      
      // baseline guides
      var top = baselineOffset;
      while (top + baseline < $grid.height()) {
        var $line = $('<div class="jgwhite-grid-baseline" />');
        $line.css({
          'position': 'absolute',
          'left': 0, 'right': 0,
          'top': top,
          'height': baseline + 'px',
          'border-bottom': '1px solid rgba(255, 0, 0, 0.25)'
        });
        $line.appendTo($grid);
        top += baseline;
      }
      
      $grid.hide();
    }
    
    $grid.toggle();
  });
  
  return this;
}

/**
 * Toggle guide graphic
 *
 * @param data-guide-url {String}
 */
$.fn.toggleGuide = function() {
  this.each(function() {
    var $this = $(this);
    var $guide = $this.find('.jgwhite-guide').first();
    if ($guide.length === 0) {
      var url = $this.attr('data-guide-url');
      if (!url) {
        console.error('Specify data-guide-url');
        return;
      }
      $guide = $('<img class="jgwhite-guide" />');
      $guide.css({
        'position': 'absolute',
        'left': 0, 'top': 0,
        'z-index': 400
      });
      $guide.bind('load', function() {
        $this.css('height', Math.max($this.height(), $(this).height()) + 'px');
      });
      $guide.attr('src', url);
      $guide.appendTo($this);
      $guide.hide();
    }
    $guide.toggle();
  });
  return this;
}

/**
 * Return a reversed version of a jQuery collection
 */
$.fn.reverse = function() {
  return $(this.get().reverse());
}

/**
 * Hotkeys
 */
jgwhiteUtils.bindHotKeys = function() {
  $(document).bind('keydown', function(event) {
    switch (jgwhiteUtils.keyEventSignature(event)) {
    case 'shift+ctrl+71': $('.has-grid').toggleGrid(); break;
    case 'shift+ctrl+alt+71': $('.has-guide').toggleGuide(); break;
    }
  });
}

// Automatically hook in some of this stuff
jgwhiteUtils.ensureConsole();
jgwhiteUtils.bindHotKeys();

})(window, jQuery);
