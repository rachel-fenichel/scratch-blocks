/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2012 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Methods for graphically rendering a block as SVG.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.BlockSvg.render');

goog.require('Blockly.BlockSvg');


// UI constants for rendering blocks.
/**
* Grid unit to pixels conversion
* @const
*/
Blockly.BlockSvg.GRID_UNIT = 4;

/**
 * Horizontal space between elements.
 * @const
 */
Blockly.BlockSvg.SEP_SPACE_X = 2 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Vertical space between elements.
 * @const
 */
Blockly.BlockSvg.SEP_SPACE_Y = 2 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Minimum width of a block.
 * @const
 */
Blockly.BlockSvg.MIN_BLOCK_X = 16 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Minimum width of a block with output (reporters).
 * @const
 */
Blockly.BlockSvg.MIN_BLOCK_X_OUTPUT = 12 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Minimum width of a shadow block with output (single fields).
 * @const
 */
Blockly.BlockSvg.MIN_BLOCK_X_SHADOW_OUTPUT = 10 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Minimum height of a block.
 * @const
 */
Blockly.BlockSvg.MIN_BLOCK_Y = 12 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Height of extra row after a statement input.
 * @const
 */
Blockly.BlockSvg.EXTRA_STATEMENT_ROW_Y = 8 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Minimum width of a C- or E-shaped block.
 * @const
 */
Blockly.BlockSvg.MIN_BLOCK_X_WITH_STATEMENT = 40 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Minimum height of a shadow block with output and a single field.
 * This is used for shadow blocks that only contain a field - which are smaller than even reporters.
 * @const
 */
Blockly.BlockSvg.MIN_BLOCK_Y_SINGLE_FIELD_OUTPUT = 8 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Minimum height of a non-shadow block with output, i.e. a reporter.
 * @const
 */
Blockly.BlockSvg.MIN_BLOCK_Y_REPORTER = 10 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Minimum space for a statement input height.
 * @const
 */
Blockly.BlockSvg.MIN_STATEMENT_INPUT_HEIGHT = 6 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Width of vertical notch.
 * @const
 */
Blockly.BlockSvg.NOTCH_WIDTH = 8 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Height of vertical notch.
 * @const
 */
Blockly.BlockSvg.NOTCH_HEIGHT = 2 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Rounded corner radius.
 * @const
 */
Blockly.BlockSvg.CORNER_RADIUS = 1 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Minimum width of statement input edge on the left, in px.
 * @const
 */
Blockly.BlockSvg.STATEMENT_INPUT_EDGE_WIDTH = 4 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Inner space between edge of statement input and notch.
 * @const
 */
Blockly.BlockSvg.STATEMENT_INPUT_INNER_SPACE = 2 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Height of the top hat.
 * @const
 */
Blockly.BlockSvg.START_HAT_HEIGHT = 16;

/**
 * Path of the top hat's curve.
 * @const
 */
Blockly.BlockSvg.START_HAT_PATH = 'c 25,-22 71,-22 96,0';

/**
 * SVG path for drawing next/previous notch from left to right.
 * @const
 */
Blockly.BlockSvg.NOTCH_PATH_LEFT = (
  'c 2,0 3,1 4,2 ' +
  'l 4,4 ' +
  'c 1,1 2,2 4,2 ' +
  'h 12 ' +
  'c 2,0 3,-1 4,-2 ' +
  'l 4,-4 ' +
  'c 1,-1 2,-2 4,-2'
);

/**
 * SVG path for drawing next/previous notch from right to left.
 * @const
 */
Blockly.BlockSvg.NOTCH_PATH_RIGHT = (
  'c -2,0 -3,1 -4,2 '+
  'l -4,4 ' +
  'c -1,1 -2,2 -4,2 ' +
  'h -12 ' +
  'c -2,0 -3,-1 -4,-2 ' +
  'l -4,-4 ' +
  'c -1,-1 -2,-2 -4,-2'
);

/**
 * Amount of padding before the notch.
 * @const
 */
Blockly.BlockSvg.NOTCH_START_PADDING = 3 * Blockly.BlockSvg.GRID_UNIT;

/**
 * SVG start point for drawing the top-left corner.
 * @const
 */
Blockly.BlockSvg.TOP_LEFT_CORNER_START =
    'm 0,' + Blockly.BlockSvg.CORNER_RADIUS;

/**
 * SVG path for drawing the rounded top-left corner.
 * @const
 */
Blockly.BlockSvg.TOP_LEFT_CORNER =
    'A ' + Blockly.BlockSvg.CORNER_RADIUS + ',' +
    Blockly.BlockSvg.CORNER_RADIUS + ' 0 0,1 ' +
    Blockly.BlockSvg.CORNER_RADIUS + ',0';


/**
 * SVG path for drawing the rounded top-right corner.
 * @const
 */
Blockly.BlockSvg.TOP_RIGHT_CORNER =
    'a ' + Blockly.BlockSvg.CORNER_RADIUS + ',' +
    Blockly.BlockSvg.CORNER_RADIUS + ' 0 0,1 ' +
    Blockly.BlockSvg.CORNER_RADIUS + ',' +
    Blockly.BlockSvg.CORNER_RADIUS;

Blockly.BlockSvg.FANCY_HAT_CORNER_RADIUS = 4 * Blockly.BlockSvg.CORNER_RADIUS;

/**
 * SVG path for drawing the rounded top-left corner.
 * @const
 */
Blockly.BlockSvg.TOP_LEFT_CORNER_FANCY_HAT =
    'a ' + Blockly.BlockSvg.FANCY_HAT_CORNER_RADIUS + ',' +
    Blockly.BlockSvg.FANCY_HAT_CORNER_RADIUS + ' 0 0,1 ' +
    Blockly.BlockSvg.FANCY_HAT_CORNER_RADIUS + ',-' +
    Blockly.BlockSvg.FANCY_HAT_CORNER_RADIUS;
/**
 * SVG path for drawing the rounded top-left corner.
 * @const
 */
Blockly.BlockSvg.TOP_RIGHT_CORNER_FANCY_HAT =
    'a ' + Blockly.BlockSvg.FANCY_HAT_CORNER_RADIUS + ',' +
    Blockly.BlockSvg.FANCY_HAT_CORNER_RADIUS + ' 0 0,1 ' +
    Blockly.BlockSvg.FANCY_HAT_CORNER_RADIUS + ',' +
    Blockly.BlockSvg.FANCY_HAT_CORNER_RADIUS;
/**
 * SVG path for drawing the rounded bottom-right corner.
 * @const
 */
Blockly.BlockSvg.BOTTOM_RIGHT_CORNER =
    ' a ' + Blockly.BlockSvg.CORNER_RADIUS + ',' +
    Blockly.BlockSvg.CORNER_RADIUS + ' 0 0,1 -' +
    Blockly.BlockSvg.CORNER_RADIUS + ',' +
    Blockly.BlockSvg.CORNER_RADIUS;

/**
 * SVG path for drawing the rounded bottom-left corner.
 * @const
 */
Blockly.BlockSvg.BOTTOM_LEFT_CORNER =
    'a ' + Blockly.BlockSvg.CORNER_RADIUS + ',' +
     Blockly.BlockSvg.CORNER_RADIUS + ' 0 0,1 -' +
     Blockly.BlockSvg.CORNER_RADIUS + ',-' +
     Blockly.BlockSvg.CORNER_RADIUS;

/**
 * SVG path for drawing the top-left corner of a statement input.
 * @const
 */
Blockly.BlockSvg.INNER_TOP_LEFT_CORNER =
    ' a ' + Blockly.BlockSvg.CORNER_RADIUS + ',' +
    Blockly.BlockSvg.CORNER_RADIUS + ' 0 0,0 -' +
    Blockly.BlockSvg.CORNER_RADIUS + ',' +
    Blockly.BlockSvg.CORNER_RADIUS;

/**
 * SVG path for drawing the bottom-left corner of a statement input.
 * Includes the rounded inside corner.
 * @const
 */
Blockly.BlockSvg.INNER_BOTTOM_LEFT_CORNER =
    'a ' + Blockly.BlockSvg.CORNER_RADIUS + ',' +
    Blockly.BlockSvg.CORNER_RADIUS + ' 0 0,0 ' +
    Blockly.BlockSvg.CORNER_RADIUS + ',' +
    Blockly.BlockSvg.CORNER_RADIUS;

/**
 * SVG path for an empty hexagonal input shape.
 * @const
 */
Blockly.BlockSvg.INPUT_SHAPE_HEXAGONAL =
    'M ' + 4 * Blockly.BlockSvg.GRID_UNIT + ',0 ' +
    ' h ' + 4 * Blockly.BlockSvg.GRID_UNIT +
    ' l ' + 4 * Blockly.BlockSvg.GRID_UNIT + ',' + 4 * Blockly.BlockSvg.GRID_UNIT +
    ' l ' + -4 * Blockly.BlockSvg.GRID_UNIT + ',' + 4 * Blockly.BlockSvg.GRID_UNIT +
    ' h ' + -4 * Blockly.BlockSvg.GRID_UNIT +
    ' l ' + -4 * Blockly.BlockSvg.GRID_UNIT + ',' + -4 * Blockly.BlockSvg.GRID_UNIT +
    ' l ' + 4 * Blockly.BlockSvg.GRID_UNIT + ',' + -4 * Blockly.BlockSvg.GRID_UNIT +
    ' z';

/**
 * Width of empty boolean input shape.
 * @const
 */
Blockly.BlockSvg.INPUT_SHAPE_HEXAGONAL_WIDTH = 12 * Blockly.BlockSvg.GRID_UNIT;

/**
 * SVG path for an empty square input shape.
 * @const
 */
Blockly.BlockSvg.INPUT_SHAPE_SQUARE =
    Blockly.BlockSvg.TOP_LEFT_CORNER_START +
    Blockly.BlockSvg.TOP_LEFT_CORNER +
    ' h ' + (12 * Blockly.BlockSvg.GRID_UNIT - 2 * Blockly.BlockSvg.CORNER_RADIUS) +
    Blockly.BlockSvg.TOP_RIGHT_CORNER +
    ' v ' + (8 * Blockly.BlockSvg.GRID_UNIT - 2 * Blockly.BlockSvg.CORNER_RADIUS) +
    Blockly.BlockSvg.BOTTOM_RIGHT_CORNER +
    ' h ' + (-12 * Blockly.BlockSvg.GRID_UNIT + 2 * Blockly.BlockSvg.CORNER_RADIUS) +
    Blockly.BlockSvg.BOTTOM_LEFT_CORNER +
    ' z';

/**
 * Width of empty square input shape.
 * @const
 */
Blockly.BlockSvg.INPUT_SHAPE_SQUARE_WIDTH = 10 * Blockly.BlockSvg.GRID_UNIT;

/**
 * SVG path for an empty round input shape.
 * @const
 */

Blockly.BlockSvg.INPUT_SHAPE_ROUND =
  'M ' + (4 * Blockly.BlockSvg.GRID_UNIT) + ',0' +
  ' h ' + (4 * Blockly.BlockSvg.GRID_UNIT) +
  ' a ' + (4 * Blockly.BlockSvg.GRID_UNIT) + ' ' +
      (4 * Blockly.BlockSvg.GRID_UNIT) + ' 0 0 1 0 ' + (8 * Blockly.BlockSvg.GRID_UNIT) +
  ' h ' + (-4 * Blockly.BlockSvg.GRID_UNIT) +
  ' a ' + (4 * Blockly.BlockSvg.GRID_UNIT) + ' ' +
      (4 * Blockly.BlockSvg.GRID_UNIT) + ' 0 0 1 0 -' + (8 * Blockly.BlockSvg.GRID_UNIT) +
  ' z';

/**
 * Width of empty round input shape.
 * @const
 */
Blockly.BlockSvg.INPUT_SHAPE_ROUND_WIDTH = 12 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Height of empty input shape.
 * @const
 */
Blockly.BlockSvg.INPUT_SHAPE_HEIGHT = 8 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Height of user inputs
 * @const
 */
Blockly.BlockSvg.FIELD_HEIGHT = 8 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Width of user inputs
 * @const
 */
Blockly.BlockSvg.FIELD_WIDTH = 6 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Editable field padding (left/right of the text).
 * @const
 */
Blockly.BlockSvg.EDITABLE_FIELD_PADDING = 6;

/**
 * Square box field padding (left/right of the text).
 * @const
 */
Blockly.BlockSvg.BOX_FIELD_PADDING = 2 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Drop-down arrow padding.
 * @const
 */
Blockly.BlockSvg.DROPDOWN_ARROW_PADDING = 2 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Minimum width of user inputs during editing
 * @const
 */
Blockly.BlockSvg.FIELD_WIDTH_MIN_EDIT = 8 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Maximum width of user inputs during editing
 * @const
 */
Blockly.BlockSvg.FIELD_WIDTH_MAX_EDIT = Infinity;

/**
 * Maximum height of user inputs during editing
 * @const
 */
Blockly.BlockSvg.FIELD_HEIGHT_MAX_EDIT = Blockly.BlockSvg.FIELD_HEIGHT;

/**
 * Top padding of user inputs
 * @const
 */
Blockly.BlockSvg.FIELD_TOP_PADDING = 0.5 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Corner radius of number inputs
 * @const
 */
Blockly.BlockSvg.NUMBER_FIELD_CORNER_RADIUS = 4 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Corner radius of text inputs
 * @const
 */
Blockly.BlockSvg.TEXT_FIELD_CORNER_RADIUS = 1 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Default radius for a field, in px.
 * @const
 */
Blockly.BlockSvg.FIELD_DEFAULT_CORNER_RADIUS = 4 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Max text display length for a field (per-horizontal/vertical)
 * @const
 */
Blockly.BlockSvg.MAX_DISPLAY_LENGTH = Infinity;

/**
 * Minimum X of inputs and fields for blocks with a previous connection.
 * Ensures that inputs will not overlap with the top notch of blocks.
 * @const
 */
Blockly.BlockSvg.INPUT_AND_FIELD_MIN_X = 12 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Vertical padding around inline elements.
 * @const
 */
Blockly.BlockSvg.INLINE_PADDING_Y = 1 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Point size of text field before animation. Must match size in CSS.
 * See implementation in field_textinput.
 */
Blockly.BlockSvg.FIELD_TEXTINPUT_FONTSIZE_INITIAL = 12;

/**
 * Point size of text field after animation.
 * See implementation in field_textinput.
 */
Blockly.BlockSvg.FIELD_TEXTINPUT_FONTSIZE_FINAL = 12;

/**
 * Whether text fields are allowed to expand past their truncated block size.
 * @const{boolean}
 */
Blockly.BlockSvg.FIELD_TEXTINPUT_EXPAND_PAST_TRUNCATION = false;

/**
 * Whether text fields should animate their positioning.
 * @const{boolean}
 */
Blockly.BlockSvg.FIELD_TEXTINPUT_ANIMATE_POSITIONING = false;

/**
 * Map of output/input shapes and the amount they should cause a block to be padded.
 * Outer key is the outer shape, inner key is the inner shape.
 * When a block with the outer shape contains an input block with the inner shape
 * on its left or right edge, that side is extended by the padding specified.
 * See also: `Blockly.BlockSvg.computeOutputPadding_`.
 */
Blockly.BlockSvg.SHAPE_IN_SHAPE_PADDING = {
  1: { // Outer shape: hexagon.
    0: 5 * Blockly.BlockSvg.GRID_UNIT, // Field in hexagon.
    1: 2 * Blockly.BlockSvg.GRID_UNIT, // Hexagon in hexagon.
    2: 5 * Blockly.BlockSvg.GRID_UNIT, // Round in hexagon.
    3: 5 * Blockly.BlockSvg.GRID_UNIT // Square in hexagon.
  },
  2: { // Outer shape: round.
    0: 3 * Blockly.BlockSvg.GRID_UNIT, // Field in round.
    1: 3 * Blockly.BlockSvg.GRID_UNIT, // Hexagon in round.
    2: 1 * Blockly.BlockSvg.GRID_UNIT, // Round in round.
    3: 2 * Blockly.BlockSvg.GRID_UNIT // Square in round.
  },
  3: { // Outer shape: square.
    0: 2 * Blockly.BlockSvg.GRID_UNIT, // Field in square.
    1: 2 * Blockly.BlockSvg.GRID_UNIT, // Hexagon in square.
    2: 2 * Blockly.BlockSvg.GRID_UNIT, // Round in square.
    3: 2 * Blockly.BlockSvg.GRID_UNIT // Square in square.
  }
};

/**
 * Change the colour of a block.
 */
Blockly.BlockSvg.prototype.updateColour = function() {
  var strokeColour = this.getColourTertiary();
  if (this.isShadow() && this.parentBlock_) {
    // Pull shadow block stroke colour from parent block's tertiary if possible.
    strokeColour = this.parentBlock_.getColourTertiary();
    // Special case: if we contain a colour field, set to a special stroke colour.
    if (this.inputList[0] &&
        this.inputList[0].fieldRow[0] &&
        (this.inputList[0].fieldRow[0] instanceof Blockly.FieldColour ||
        this.inputList[0].fieldRow[0] instanceof Blockly.FieldColourSlider)) {
      strokeColour = Blockly.Colours.colourPickerStroke;
    }
  }

  // Render block stroke
  this.svgPath_.setAttribute('stroke', strokeColour);

  // Render block fill
  var fillColour = (this.isGlowingBlock_ || this.isShadow()) ?
      this.getColourSecondary() : this.getColour();
  this.svgPath_.setAttribute('fill', fillColour);

  // Render opacity
  this.svgPath_.setAttribute('fill-opacity', this.getOpacity());

  // Update colours of input shapes.
  for (var shape in this.inputShapes_) {
    this.inputShapes_[shape].setAttribute('fill', this.getColourTertiary());
  }

  // Render icon(s) if applicable
  var icons = this.getIcons();
  for (var i = 0; i < icons.length; i++) {
    icons[i].updateColour();
  }

  // Bump every dropdown to change its colour.
  for (var x = 0, input; input = this.inputList[x]; x++) {
    for (var y = 0, field; field = input.fieldRow[y]; y++) {
      field.setText(null);
    }
  }
};

/**
 * Visual effect to show that if the dragging block is dropped, this block will
 * be replaced.  If a shadow block it will disappear.  Otherwise it will bump.
 * @param {boolean} add True if highlighting should be added.
 */
Blockly.BlockSvg.prototype.highlightForReplacement = function(add) {
  if (add) {
    this.svgPath_.setAttribute('filter', 'url(#blocklyReplacementGlowFilter)');
    Blockly.utils.addClass(/** @type {!Element} */ (this.svgGroup_),
        'blocklyReplaceable');
  } else {
    this.svgPath_.removeAttribute('filter');
    Blockly.utils.removeClass(/** @type {!Element} */ (this.svgGroup_),
        'blocklyReplaceable');
  }
};

/**
 * Visual effect to show that if the dragging block is dropped it will connect
 * to this input.
 * @param {Blockly.Connection} conn The connection on the input to highlight.
 * @param {boolean} add True if highlighting should be added.
 */
Blockly.BlockSvg.prototype.highlightShapeForInput = function(conn, add) {
  var input = this.getInputWithConnection(conn);
  if (!input) {
    throw 'No input found for the connection';
  }
  var inputShape = this.inputShapes_[input.name];
  if (add) {
    inputShape.setAttribute('filter', 'url(#blocklyReplacementGlowFilter)');
    Blockly.utils.addClass(/** @type {!Element} */ (this.svgGroup_),
        'blocklyReplaceable');
  } else {
    inputShape.removeAttribute('filter');
    Blockly.utils.removeClass(/** @type {!Element} */ (this.svgGroup_),
        'blocklyReplaceable');
  }
};

/**
 * Returns a bounding box describing the dimensions of this block
 * and any blocks stacked below it.
 * @return {!{height: number, width: number}} Object with height and width properties.
 */
Blockly.BlockSvg.prototype.getHeightWidth = function() {
  var height = this.height;
  var width = this.width;
  // Recursively add size of subsequent blocks.
  var nextBlock = this.getNextBlock();
  if (nextBlock) {
    var nextHeightWidth = nextBlock.getHeightWidth();
    height += nextHeightWidth.height;
    height -= Blockly.BlockSvg.NOTCH_HEIGHT; // Exclude height of connected notch.
    width = Math.max(width, nextHeightWidth.width);
  }
  return {height: height, width: width};
};

/**
 * Render the block.
 * Lays out and reflows a block based on its contents and settings.
 * @param {boolean=} opt_bubble If false, just render this block.
 *   If true, also render block's parent, grandparent, etc.  Defaults to true.
 */
Blockly.BlockSvg.prototype.render = function(opt_bubble) {
  Blockly.Field.startCache();
  this.rendered = true;

  var cursorX = Blockly.BlockSvg.SEP_SPACE_X;
  if (this.RTL) {
    cursorX = -cursorX;
  }
  // Move the icons into position.
  var icons = this.getIcons();
  for (var i = 0; i < icons.length; i++) {
    cursorX = icons[i].renderIcon(cursorX);
  }
  cursorX += this.RTL ?
      Blockly.BlockSvg.SEP_SPACE_X : -Blockly.BlockSvg.SEP_SPACE_X;
  // If there are no icons, cursorX will be 0, otherwise it will be the
  // width that the first label needs to move over by.

  var inputRows = this.renderCompute_(cursorX);
  this.renderDraw_(cursorX, inputRows);

  this.renderClassify_();

  if (opt_bubble !== false) {
    // Render all blocks above this one (propagate a reflow).
    var parentBlock = this.getParent();
    if (parentBlock) {
      parentBlock.render(true);
    } else {
      // Top-most block.  Fire an event to allow scrollbars to resize.
      Blockly.resizeSvgContents(this.workspace);
    }
  }
  Blockly.Field.stopCache();
};

/**
 * Render a list of fields starting at the specified location.
 * @param {!Array.<!Blockly.Field>} fieldList List of fields.
 * @param {number} cursorX X-coordinate to start the fields.
 * @param {number} cursorY Y-coordinate around which fields are centered.
 * @return {number} X-coordinate of the end of the field row (plus a gap).
 * @private
 */
Blockly.BlockSvg.prototype.renderFields_ =
    function(fieldList, cursorX, cursorY) {
  /* eslint-disable indent */
  if (this.RTL) {
    cursorX = -cursorX;
  }
  for (var t = 0, field; field = fieldList[t]; t++) {
    var root = field.getSvgRoot();
    if (!root) {
      continue;
    }
    // In blocks with a notch, fields should be bumped to a min X,
    // to avoid overlapping with the notch. Label and image fields are
    // excluded.
    if (this.previousConnection && !(field instanceof Blockly.FieldLabel) &&
        !(field instanceof Blockly.FieldImage)) {
      cursorX = this.RTL ?
        Math.min(cursorX, -Blockly.BlockSvg.INPUT_AND_FIELD_MIN_X) :
        Math.max(cursorX, Blockly.BlockSvg.INPUT_AND_FIELD_MIN_X);
    }
    // Offset the field upward by half its height.
    // This vertically centers the fields around cursorY.
    var yOffset = -field.getSize().height / 2;
    var translateX, translateY;
    var scale = '';
    if (this.RTL) {
      cursorX -= field.renderSepBefore + field.renderWidth;
      translateX = cursorX;
      translateY = cursorY + yOffset;
      if (field.renderWidth) {
        cursorX -= field.renderSepAfter;
      }
    } else {
      translateX = cursorX + field.renderSepBefore;
      translateY = cursorY + yOffset;
      if (field.renderWidth) {
        cursorX += field.renderSepBefore + field.renderWidth +
            field.renderSepAfter;
      }
    }
    if (this.RTL &&
        field instanceof Blockly.FieldImage &&
        field.getFlipRTL()) {
      scale = 'scale(-1 1)';
      translateX += field.renderWidth;
    }
    root.setAttribute('transform',
      'translate(' + translateX + ', ' + translateY + ') ' + scale
    );
    // Fields are invisible on insertion marker.
    if (this.isInsertionMarker()) {
      root.setAttribute('display', 'none');
    }
  }
  return this.RTL ? -cursorX : cursorX;
}; /* eslint-enable indent */

/**
 * Computes the height and widths for each row and field.
 * @param {number} iconWidth Offset of first row due to icons.
 * @return {!Array.<!Array.<!Object>>} 2D array of objects, each containing
 *     position information.
 * @private
 */
Blockly.BlockSvg.prototype.renderCompute_ = function(iconWidth) {
  var inputRows = [];
  var fieldValueWidth = 0;  // Width of longest external value field.
  var fieldStatementWidth = 0;  // Width of longest statement field.
  inputRows.hasValue = false;
  inputRows.hasStatement = false;
  inputRows.hasDummy = false;
  var lastType = undefined;

  var maxRowWidth = 0;

  // Previously created row, for special-casing row heights on C- and E- shaped blocks.
  var previousRow;
  for (var i = 0, input; input = this.inputList[i]; i++) {
    if (!input.isVisible()) {
      continue;
    }
    var row;
    if (!lastType ||
        lastType == Blockly.NEXT_STATEMENT ||
        input.type == Blockly.NEXT_STATEMENT) {
      // Create a new row.
      lastType = input.type;
      row = this.createRowWithInput_(input);
      inputRows.push(row);
    } else {
      // Add information to the current row (inline value inputs).
      row = inputRows[inputRows.length - 1];
      row.push(input);
    }

    // If the input is a statement input, determine if a notch
    // should be drawn at the inner bottom of the C.
    row.statementNotchAtBottom = Blockly.BlockSvg.hasNotchAtBottom_(input);

    this.computeInputDimensions_(input, row, previousRow);
    // Spacing after the input.
    input.renderWidth += Blockly.BlockSvg.SEP_SPACE_X;
    var isLastInputOnRow = !this.inputList[i + 1];
    if (isLastInputOnRow && input.type == Blockly.INPUT_VALUE) {
      input.renderWidth -= Blockly.BlockSvg.SEP_SPACE_X;
    }
    // Update the row height if this is an especially tall input.
    row.height = Math.max(row.height, input.renderHeight);
    row.width += input.renderWidth;

    Blockly.BlockSvg.measureFieldsOnInput_(input, row, iconWidth);

    if (inputRows.length == 1) {
      // Only the first row gets shifted to accommodate any icons.
      iconWidth = 0;
    }

    maxRowWidth = Math.max(maxRowWidth, row.width);

    if (row.type != Blockly.BlockSvg.INLINE) {
      if (row.type == Blockly.NEXT_STATEMENT) {
        inputRows.hasStatement = true;
        fieldStatementWidth = Math.max(fieldStatementWidth, input.fieldWidth);
      } else {
        if (row.type == Blockly.INPUT_VALUE) {
          inputRows.hasValue = true;
        } else if (row.type == Blockly.DUMMY_INPUT) {
          inputRows.hasDummy = true;
        }
        fieldValueWidth = Math.max(fieldValueWidth, input.fieldWidth);
      }
    }
    previousRow = row;
  }

  // Data is attached to the row.
  this.computeOutputPadding_(inputRows);
  inputRows.rightEdge = this.computeRightEdge_(inputRows.hasStatement);

  inputRows.bottomEdge = Blockly.BlockSvg.computeBottomEdge_(inputRows);
  // This is the width of a block where statements are nested.
  inputRows.statementEdge = Blockly.BlockSvg.STATEMENT_INPUT_EDGE_WIDTH +
      fieldStatementWidth;

  // YOLO THO
  inputRows.maxRowWidth = maxRowWidth;
  console.log(inputRows.maxRowWidth);
  return inputRows;
};

/**
 * Compute the minimum width of this input, not including fields, based on the
 * connection type and outputs.
 * @param {!Blockly.Input} input The input to measure.
 * @return {number} the computed width of this input.
 * @private
 */
Blockly.BlockSvg.computeMinimumInputWidth_ = function(input) {
  // Empty input shape widths.
  if (input.type == Blockly.INPUT_VALUE &&
      (!input.connection || !input.connection.isConnected())) {
    switch (input.connection.getOutputShape()) {
      case Blockly.OUTPUT_SHAPE_SQUARE:
        return Blockly.BlockSvg.INPUT_SHAPE_SQUARE_WIDTH;
      case Blockly.OUTPUT_SHAPE_ROUND:
        return Blockly.BlockSvg.INPUT_SHAPE_ROUND_WIDTH;
      case Blockly.OUTPUT_SHAPE_HEXAGONAL:
        return Blockly.BlockSvg.INPUT_SHAPE_HEXAGONAL_WIDTH;
      default:
        return 0;
    }
  // Minimum width of a statement input is apparently zero. Weird.
  } else {
    return 0;
  }
};

/**
 * Compute the minimum height of this input.
 * @param {!Blockly.Input} input The input to measure.
 * @param {!Object} row The row of the block that is currently being measured.
 * @param {!Object} previousRow The previous row of the block, which was just
 *     measured.
 * @return {number} the computed height of this input.
 * @private
 */
Blockly.BlockSvg.prototype.computeMinimumInputHeight_ = function(input, row,
    previousRow) {
  if (this.inputList.length === 1 && this.isShadow() && this.outputConnection) {
    // "Lone" field blocks are smaller.
    return Blockly.BlockSvg.MIN_BLOCK_Y_SINGLE_FIELD_OUTPUT;
  } else if (this.outputConnection) {
    // All other reporters.
    return Blockly.BlockSvg.MIN_BLOCK_Y_REPORTER;
  } else if (row.type == Blockly.NEXT_STATEMENT) {
    // Statement input.
    return Blockly.BlockSvg.MIN_STATEMENT_INPUT_HEIGHT;
  } else if (previousRow && previousRow.type == Blockly.NEXT_STATEMENT) {
    // Extra row for below statement input.
    return Blockly.BlockSvg.EXTRA_STATEMENT_ROW_Y;
  } else {
    // All other blocks.
    return Blockly.BlockSvg.MIN_BLOCK_Y;
  }
};

/**
 * Create a row for an input and associated fields.
 * @param {!Blockly.Input} input The input that the row is based on.
 * @return {!Object} The new row, with the correct type and default sizing info.
 */
Blockly.BlockSvg.prototype.createRowWithInput_ = function(input) {
  // Create new row containing just this input.
  var row = [input];
  if (input.type != Blockly.NEXT_STATEMENT) {
    row.type = Blockly.BlockSvg.INLINE;
  } else {
    row.type = input.type;
  }
  // Default padding for a block: same as separators between fields/inputs.
  row.paddingStart = Blockly.BlockSvg.SEP_SPACE_X;
  row.paddingEnd = Blockly.BlockSvg.SEP_SPACE_X;

  // Include padding in the width of the row.
  row.width = 2 * Blockly.BlockSvg.SEP_SPACE_X;
  row.height = 0;
  return row;
};

/**
 * This is really a computation of the minimum width, not that actual width.
 * Compute the preferred right edge of the block.
 * The block will be drawn from 0 (left edge) to rightEdge, in px.
 * @param {boolean} hasStatement Whether this block has a statement input.
 * @return {number} The preferred right edge of the block.
 */
Blockly.BlockSvg.prototype.computeRightEdge_ = function(hasStatement) {
  var edge = 0;
  if (this.previousConnection || this.nextConnection) {
    // Blocks with notches
    edge = Math.max(edge, Blockly.BlockSvg.MIN_BLOCK_X);
  } else if (this.outputConnection) {
    if (this.isShadow()) {
      // Single-fields
      edge = Math.max(edge, Blockly.BlockSvg.MIN_BLOCK_X_SHADOW_OUTPUT);
    } else {
      // Reporters
      edge = Math.max(edge, Blockly.BlockSvg.MIN_BLOCK_X_OUTPUT);
    }
  }
  if (hasStatement) {
    // Statement blocks (C- or E- shaped) have a longer minimum width.
    edge = Math.max(edge, Blockly.BlockSvg.MIN_BLOCK_X_WITH_STATEMENT);
  }

  // Ensure insertion markers are at least insertionMarkerMinWidth_ wide.
  if (this.insertionMarkerMinWidth_ > 0) {
    edge = Math.max(edge, this.insertionMarkerMinWidth_);
  }
  return edge;
};

/**
 * For a block with output,
 * determine start and end padding, based on connected inputs.
 * Padding will depend on the shape of the output, the shape of the input,
 * and possibly the size of the input.
 * @param {!Array.<!Array.<!Object>>} inputRows Partially calculated rows.
 */
Blockly.BlockSvg.prototype.computeOutputPadding_ = function(inputRows) {
  // Only apply to blocks with outputs and not single fields (shadows).
  if (!this.getOutputShape() || !this.outputConnection || this.isShadow()) {
    return;
  }
  // Blocks with outputs must have single row to be padded.
  if (inputRows.length > 1) {
    return;
  }
  var row = inputRows[0];
  var shape = this.getOutputShape();
  // Reset any padding: it's about to be set.
  row.paddingStart = 0;
  row.paddingEnd = 0;
  // Start row padding: based on first input or first field.
  var firstInput = row[0];
  var firstField = firstInput.fieldRow[0];
  var otherShape;
  // In checking the left/start side, a field takes precedence over any input.
  // That's because a field will be rendered before any value input.
  if (firstField) {
    otherShape = 0; // Field comes first in the row.
  } else {
    // Value input comes first in the row.
    var inputConnection = firstInput.connection;
    if (!inputConnection.targetConnection) {
      // Not connected: use the drawn shape.
      otherShape = inputConnection.getOutputShape();
    } else {
      // Connected: use the connected block's output shape.
      otherShape = inputConnection.targetConnection.getSourceBlock().getOutputShape();
    }
    // Special case for hexagonal output: if the connection is larger height
    // than a standard reporter, add some start padding.
    // https://github.com/LLK/scratch-blocks/issues/376
    if (shape == Blockly.OUTPUT_SHAPE_HEXAGONAL &&
        otherShape != Blockly.OUTPUT_SHAPE_HEXAGONAL) {
      var deltaHeight = firstInput.renderHeight - Blockly.BlockSvg.MIN_BLOCK_Y_REPORTER;
      // One grid unit per level of nesting.
      row.paddingStart += deltaHeight / 2;
    }
  }
  row.paddingStart += Blockly.BlockSvg.SHAPE_IN_SHAPE_PADDING[shape][otherShape];
  // End row padding: based on last input or last field.
  var lastInput = row[row.length - 1];
  // In checking the right/end side, any value input takes precedence over any field.
  // That's because fields are rendered before inputs...the last item
  // in the row will be an input, if one exists.
  if (lastInput.connection) {
    // Value input last in the row.
    var inputConnection = lastInput.connection;
    if (!inputConnection.targetConnection) {
      // Not connected: use the drawn shape.
      otherShape = inputConnection.getOutputShape();
    } else {
      // Connected: use the connected block's output shape.
      otherShape = inputConnection.targetConnection.getSourceBlock().getOutputShape();
    }
    // Special case for hexagonal output: if the connection is larger height
    // than a standard reporter, add some end padding.
    // https://github.com/LLK/scratch-blocks/issues/376
    if (shape == Blockly.OUTPUT_SHAPE_HEXAGONAL &&
        otherShape != Blockly.OUTPUT_SHAPE_HEXAGONAL) {
      var deltaHeight = lastInput.renderHeight - Blockly.BlockSvg.MIN_BLOCK_Y_REPORTER;
      // One grid unit per level of nesting.
      row.paddingEnd += deltaHeight / 2;
    }
  } else {
    // No input in this row - mark as field.
    otherShape = 0;
  }
  row.paddingEnd += Blockly.BlockSvg.SHAPE_IN_SHAPE_PADDING[shape][otherShape];
};

/**
 * Draw the path of the block.
 * Move the fields to the correct locations.
 * @param {number} iconWidth Offset of first row due to icons.
 * @param {!Array.<!Array.<!Object>>} inputRows 2D array of objects, each
 *     containing position information.
 * @private
 */
Blockly.BlockSvg.prototype.renderDraw_ = function(iconWidth, inputRows) {
  this.startHat_ = false;
  // Should the top left corners be rounded or square?
  // Currently, it is squared only if it's a hat.
  this.squareTopLeftCorner_ = false;
  if (!this.outputConnection && !this.previousConnection) {
    // No output or previous connection.
    this.squareTopLeftCorner_ = true;
    this.startHat_ = true;
    inputRows.rightEdge = Math.max(inputRows.rightEdge, 100);
  }

  // Amount of space to skip drawing the top and bottom,
  // to make room for the left and right to draw shapes (curves or angles).
  this.edgeShapeWidth_ = 0;
  this.edgeShape_ = null;
  if (this.outputConnection) {
    // Width of the curve/pointy-curve
    var shape = this.getOutputShape();
    if (shape === Blockly.OUTPUT_SHAPE_HEXAGONAL || shape === Blockly.OUTPUT_SHAPE_ROUND) {
      this.edgeShapeWidth_ = inputRows.bottomEdge / 2;
      this.edgeShape_ = shape;
      this.squareTopLeftCorner_ = true;
    }
  }
  // Fetch the block's coordinates on the surface for use in anchoring
  // the connections.
  var connectionsXY = this.getRelativeToSurfaceXY();

  // Assemble the block's path.
  var steps = [];

  this.renderDrawTop_(steps, connectionsXY,
      inputRows.maxRowWidth);
  var cursorY = this.renderDrawRight_(steps,
      connectionsXY, inputRows, iconWidth);
  this.renderDrawBottom_(steps, connectionsXY, cursorY);
  this.renderDrawLeft_(steps, connectionsXY);

  var pathString = steps.join(' ');
  this.svgPath_.setAttribute('d', pathString);

  if (this.RTL) {
    // Mirror the block's path.
    // This is awesome.
    this.svgPath_.setAttribute('transform', 'scale(-1 1)');
  }
};

/**
 * Give the block an attribute 'data-shapes' that lists its shape[s], and an
 *     attribute 'data-category' with its category.
 * @private
 */
Blockly.BlockSvg.prototype.renderClassify_ = function() {
  var shapes = [];

  if (this.outputConnection) {
    if (this.isShadow_) {
      shapes.push('argument');
    } else {
      shapes.push('reporter');
    }
    if (this.edgeShape_ === Blockly.OUTPUT_SHAPE_HEXAGONAL) {
      shapes.push('boolean');
    } else if (this.edgeShape_ === Blockly.OUTPUT_SHAPE_ROUND) {
      shapes.push('round');
    }
  } else {
    // count the number of statement inputs
    var inputList = this.inputList;
    var statementCount = 0;
    for (var i = 0, input; input = inputList[i]; i++) {
      if (input.connection && input.connection.type === Blockly.NEXT_STATEMENT) {
        statementCount++;
      }
    }

    if (statementCount) {
      shapes.push('c-block');
      shapes.push('c-' + statementCount);
    }
    if (this.startHat_) {
      shapes.push('hat'); // c-block+hats are possible (e.x. reprter procedures)
    } else if (!statementCount) {
      shapes.push('stack'); //only call it "stack" if it's not a c-block
    }
    if (!this.nextConnection) {
      shapes.push('end');
    }
  }

  this.svgGroup_.setAttribute('data-shapes', shapes.join(' '));

  if (this.getCategory()) {
    this.svgGroup_.setAttribute('data-category', this.getCategory());
  }
};

/**
 * Render the top edge of the block.
 * @param {!Array.<string>} steps Path of block outline.
 * @param {!Object} connectionsXY Location of block.
 * @param {number} rightEdge Minimum width of block.
 * @private
 */
Blockly.BlockSvg.prototype.renderDrawTop_ =
    function(steps, connectionsXY, rightEdge) {
  /* eslint-disable indent */
  // Position the cursor at the top-left starting point.
  if (this.squareTopLeftCorner_) {
    steps.push('m 0,0');
    if (this.startHat_) {
      this.drawTheFanciestHat_(steps, rightEdge);
      //steps.push(Blockly.BlockSvg.START_HAT_PATH);
    }
    // Skip space for the output shape
    if (this.edgeShapeWidth_) {
      steps.push('m ' + this.edgeShapeWidth_ + ',0');
    }
  } else {
    steps.push(Blockly.BlockSvg.TOP_LEFT_CORNER_START);
    // Top-left rounded corner.
    steps.push(Blockly.BlockSvg.TOP_LEFT_CORNER);
  }

  // Top edge.
  if (this.previousConnection) {
    // Space before the notch
    steps.push('H', Blockly.BlockSvg.NOTCH_START_PADDING);
    steps.push(Blockly.BlockSvg.NOTCH_PATH_LEFT);
    // Create previous block connection.
    var connectionX = connectionsXY.x + (this.RTL ?
        -Blockly.BlockSvg.NOTCH_WIDTH : Blockly.BlockSvg.NOTCH_WIDTH);
    var connectionY = connectionsXY.y;
    this.previousConnection.moveTo(connectionX, connectionY);
    // This connection will be tightened when the parent renders.
  }

  this.width = rightEdge;
};  /* eslint-enable indent */

/**
 * Render the right edge of the block.
 * @param {!Array.<string>} steps Path of block outline.
 * @param {!Object} connectionsXY Location of block.
 * @param {!Array.<!Array.<!Object>>} inputRows 2D array of objects, each
 *     containing position information.
 * @param {number} iconWidth Offset of first row due to icons.
 * @return {number} Height of block.
 * @private
 */
Blockly.BlockSvg.prototype.renderDrawRight_ = function(steps,
    connectionsXY, inputRows, iconWidth) {
  var cursorX = 0;
  var cursorY = 0;
  for (var y = 0, row; row = inputRows[y]; y++) {
    cursorX = row.paddingStart;
    if (y == 0) {
      cursorX += this.RTL ? -iconWidth : iconWidth;
    }

    if (row.type == Blockly.BlockSvg.INLINE) {
      // Inline inputs.
      var lastInput;
      for (var x = 0, input; input = row[x]; x++) {
        // Align fields vertically within the row.
        // Moves the field to half of the row's height.
        // In renderFields_, the field is further centered
        // by its own rendered height.
        var fieldY = cursorY + row.height / 2;
        var fieldX = Blockly.BlockSvg.alignFieldX_(inputRows.rightEdge, input, cursorX);

        cursorX = this.renderFields_(input.fieldRow, fieldX, fieldY);
        if (input.type == Blockly.INPUT_VALUE) {
          // Create inline input connection.
          // In blocks with a notch, inputs should be bumped to a min X,
          // to avoid overlapping with the notch.
          // This is already done in renderFields.
          // No, it's not, but renderFields claims it does it.  What?
          // The one in renderFields does it for fields.  This does it for inputs.
          if (this.previousConnection) {
            cursorX = Math.max(cursorX, Blockly.BlockSvg.INPUT_AND_FIELD_MIN_X);
          }

          var connectionYOffset = row.height / 2;
          this.updateValueConnectionPos_(cursorX, cursorY, connectionsXY, input,
              connectionYOffset);
          this.renderInputShape_(input, cursorX, cursorY + connectionYOffset);
          cursorX += input.renderWidth;// + Blockly.BlockSvg.SEP_SPACE_X;
        }
        lastInput = input;
      }
      // Remove final separator if it was a value input.
      // if (lastInput && lastInput.type == Blockly.INPUT_VALUE) {
      //   cursorX -= Blockly.BlockSvg.SEP_SPACE_X;
      // }
      // Add correct right-padding.
      //cursorX -= Blockly.BlockSvg.SEP_SPACE_X;
      cursorX += row.paddingEnd;
      // Update right edge for all inputs, such that all following rows
      // stretch to be at least the size of all previous rows.
      inputRows.rightEdge = Math.max(cursorX, inputRows.rightEdge);
      // Move to the right edge
      cursorX = Math.max(cursorX, inputRows.rightEdge);
      this.width = Math.max(this.width, cursorX);
      if (!this.edgeShape_) {
        // Include corner radius in drawing the horizontal line.
        steps.push('H', cursorX - Blockly.BlockSvg.CORNER_RADIUS - this.edgeShapeWidth_);
        steps.push(Blockly.BlockSvg.TOP_RIGHT_CORNER);
      } else {
        // Don't include corner radius - no corner (edge shape drawn).
        steps.push('H', cursorX - this.edgeShapeWidth_);
      }
      // Subtract CORNER_RADIUS * 2 to account for the top right corner
      // and also the bottom right corner. Only move vertically the non-corner length.
      if (!this.edgeShape_) {
        steps.push('v', row.height - Blockly.BlockSvg.CORNER_RADIUS * 2);
      }
    } else if (row.type == Blockly.NEXT_STATEMENT) {
      // Nested statement.
      var input = row[0];
      var hasShadow = input.connection.isConnected() &&
          input.connection.targetBlock().isShadow();
      var fieldX = cursorX;
      var fieldY = cursorY;
        // Align fields vertically within the row.
        // Moves the field to half of the row's height.
        // In renderFields_, the field is further centered
        // by its own rendered height.
        fieldY += Blockly.BlockSvg.MIN_STATEMENT_INPUT_HEIGHT / 2;
      this.renderFields_(input.fieldRow, fieldX, fieldY);

      var oldCursorX = cursorX;
      // Move to the start of the notch.
      cursorX = inputRows.statementEdge + Blockly.BlockSvg.NOTCH_WIDTH;
      // Shadow statements (on define blocks).
      if (hasShadow) {
        this.drawRightSideAroundStatement_(steps, input, row, cursorX, oldCursorX);
      } else {
        Blockly.BlockSvg.drawStatementInputFromTopRight_(steps, cursorX,
            inputRows.rightEdge, row);
      }

      this.updateStatementConnectionPos_(cursorX, cursorY, connectionsXY, input,
          inputRows.statementEdge);

      if (hasShadow) {
        steps.push('v', Blockly.BlockSvg.EXTRA_STATEMENT_ROW_Y / 2 -
            2 * Blockly.BlockSvg.CORNER_RADIUS);
        cursorY += Blockly.BlockSvg.EXTRA_STATEMENT_ROW_Y / 2;
      } else if ((y == inputRows.length - 1 ||
          inputRows[y + 1].type == Blockly.NEXT_STATEMENT)) {
        // If the final input is a statement stack, add a small row underneath.
        // Consecutive statement stacks are also separated by a small divider.
        steps.push(Blockly.BlockSvg.TOP_RIGHT_CORNER);
        steps.push('v', Blockly.BlockSvg.EXTRA_STATEMENT_ROW_Y -
            2 * Blockly.BlockSvg.CORNER_RADIUS);
        cursorY += Blockly.BlockSvg.EXTRA_STATEMENT_ROW_Y;
      }
    }
    cursorY += row.height;
  }
  this.drawEdgeShapeRight_(steps);
  if (!inputRows.length) {
    cursorY = Blockly.BlockSvg.MIN_BLOCK_Y;
    steps.push('V', cursorY);
  }
  return cursorY;
};

/**
 * Render the input shapes.
 * If there's a connected block, hide the input shape.
 * Otherwise, draw and set the position of the input shape.
 * @param {!Blockly.Input} input Input to be rendered.
 * @param {Number} x X offset of input.
 * @param {Number} y Y offset of input.
 */
Blockly.BlockSvg.prototype.renderInputShape_ = function(input, x, y) {
  var inputShape = this.inputShapes_[input.name];
  if (!inputShape) {
    // No input shape for this input - e.g., the block is an insertion marker.
    return;
  }
  var inputShapeWidth = 0;
  // Input shapes are only visibly rendered on non-connected slots.
  if (input.connection.targetConnection) {
    inputShape.setAttribute('style', 'visibility: hidden');
  } else {
    var inputShapeX = 0, inputShapeY = 0;
    // If the input connection is not connected, draw a hole shape.
    var inputShapePath = null;
    var inputShapeArgType = null;
    switch (input.connection.getOutputShape()) {
      case Blockly.OUTPUT_SHAPE_HEXAGONAL:
        inputShapePath = Blockly.BlockSvg.INPUT_SHAPE_HEXAGONAL;
        inputShapeWidth = Blockly.BlockSvg.INPUT_SHAPE_HEXAGONAL_WIDTH;
        inputShapeArgType = 'boolean';
        break;
      case Blockly.OUTPUT_SHAPE_ROUND:
        inputShapePath = Blockly.BlockSvg.INPUT_SHAPE_ROUND;
        inputShapeWidth = Blockly.BlockSvg.INPUT_SHAPE_ROUND_WIDTH;
        inputShapeArgType = 'round';
        break;
      case Blockly.OUTPUT_SHAPE_SQUARE:
      default:
        inputShapePath = Blockly.BlockSvg.INPUT_SHAPE_SQUARE;
        inputShapeWidth = Blockly.BlockSvg.INPUT_SHAPE_SQUARE_WIDTH;
        inputShapeArgType = 'square';
        break;
    }
    if (this.RTL) {
      inputShapeX = -x - inputShapeWidth;
    } else {
      inputShapeX = x;
    }
    inputShapeY = y - (Blockly.BlockSvg.INPUT_SHAPE_HEIGHT / 2);
    inputShape.setAttribute('d', inputShapePath);
    inputShape.setAttribute('transform',
      'translate(' + inputShapeX + ',' + inputShapeY + ')'
    );
    inputShape.setAttribute('data-argument-type', inputShapeArgType);
    inputShape.setAttribute('style', 'visibility: visible');
  }
};

/**
 * Render the bottom edge of the block.
 * @param {!Array.<string>} steps Path of block outline.
 * @param {!Object} connectionsXY Location of block.
 * @param {number} cursorY Height of block.
 * @private
 */
Blockly.BlockSvg.prototype.renderDrawBottom_ = function(steps, connectionsXY,
    cursorY) {
  this.height = cursorY;
  if (!this.edgeShape_) {
    steps.push(Blockly.BlockSvg.BOTTOM_RIGHT_CORNER);
  }
  if (this.nextConnection) {
    // Move to the right-side of the notch.
    var notchStart = (
      Blockly.BlockSvg.NOTCH_WIDTH +
      Blockly.BlockSvg.NOTCH_START_PADDING +
      Blockly.BlockSvg.CORNER_RADIUS
    );
    steps.push('H', notchStart, ' ');
    steps.push(Blockly.BlockSvg.NOTCH_PATH_RIGHT);
    // Create next block connection.
    var connectionX;
    if (this.RTL) {
      connectionX = connectionsXY.x - Blockly.BlockSvg.NOTCH_WIDTH;
    } else {
      connectionX = connectionsXY.x + Blockly.BlockSvg.NOTCH_WIDTH;
    }
    var connectionY = connectionsXY.y + cursorY;
    this.nextConnection.moveTo(connectionX, connectionY);
    if (this.nextConnection.isConnected()) {
      this.nextConnection.tighten_();
    }
    // Include height of notch in block height.
    this.height += Blockly.BlockSvg.NOTCH_HEIGHT;
  }
  // Bottom horizontal line
  if (!this.edgeShape_) {
    steps.push('H', Blockly.BlockSvg.CORNER_RADIUS);
    // Bottom left corner
    steps.push(Blockly.BlockSvg.BOTTOM_LEFT_CORNER);
  } else {
    steps.push('H', this.edgeShapeWidth_);
  }
};

/**
 * Render the left edge of the block.
 * @param {!Array.<string>} steps Path of block outline.
 * @param {!Object} connectionsXY Location of block.
 * @param {number} cursorY Height of block.
 * @private
 */
Blockly.BlockSvg.prototype.renderDrawLeft_ = function(steps, connectionsXY) {
  if (this.outputConnection) {
    // Create output connection.
    // Scratch-style reporters have output connection y at half block height.
    this.outputConnection.moveTo(connectionsXY.x, connectionsXY.y + this.height / 2);
    // This connection will be tightened when the parent renders.
  }
  if (this.edgeShape_) {
    // Draw the left-side edge shape.
    if (this.edgeShape_ === Blockly.OUTPUT_SHAPE_ROUND) {
      // Draw a rounded arc.
      steps.push('a ' + this.edgeShapeWidth_ + ' ' + this.edgeShapeWidth_ +
          ' 0 0 1 0 -' + this.edgeShapeWidth_ * 2);
    } else if (this.edgeShape_ === Blockly.OUTPUT_SHAPE_HEXAGONAL) {
      // Draw a half-hexagon.
      steps.push('l ' + -this.edgeShapeWidth_ + ' ' + -this.edgeShapeWidth_ +
        ' l ' + this.edgeShapeWidth_ + ' ' + -this.edgeShapeWidth_);
    }
  }
  steps.push('z');
};

/**
 * Position an new block correctly, so that it doesn't move the existing block
 * when connected to it.
 * @param {!Blockly.Block} newBlock The block to position - either the first
 *     block in a dragged stack or an insertion marker.
 * @param {!Blockly.Connection} newConnection The connection on the new block's
 *     stack - either a connection on newBlock, or the last NEXT_STATEMENT
 *     connection on the stack if the stack's being dropped before another
 *     block.
 * @param {!Blockly.Connection} existingConnection The connection on the
 *     existing block, which newBlock should line up with.
 */
Blockly.BlockSvg.prototype.positionNewBlock =
    function(newBlock, newConnection, existingConnection) {
  /* eslint-disable indent */
  // We only need to position the new block if it's before the existing one,
  // otherwise its position is set by the previous block.
  if (newConnection.type == Blockly.NEXT_STATEMENT) {
    var dx = existingConnection.x_ - newConnection.x_;
    var dy = existingConnection.y_ - newConnection.y_;

    newBlock.moveBy(dx, dy);
  }
};  /* eslint-enable indent */


/**
 * If the input is a statement input, determine if a notch should be drawn at
 * the inner bottom of the C.
 * If the input is not a statement input, return false.
 * @param {!Blockly.Input} input The input to consider.
 * @return {boolean} whether a notch should be drawn at the inner bottom of this
 *     statement.
 * @private
 */
Blockly.BlockSvg.hasNotchAtBottom_ = function(input) {
  // If the input is a statement input, determine if a notch
  // should be drawn at the inner bottom of the C.
  var statementNotchAtBottom = true;
  if (input.connection && input.connection.type === Blockly.NEXT_STATEMENT) {
    var linkedBlock = input.connection.targetBlock();
    if (linkedBlock && !linkedBlock.lastConnectionInStack()) {
      statementNotchAtBottom = false;
    }
  }
  return statementNotchAtBottom;
};

/**
 * Compute the preferred bottom edge of the block, which is simply the sum of
 * the row heights.
 * The block will be drawn from 0 to bottomEdge vertically.
 * @param {!Array.<!Object>} inputRows An array of objects, each containing a
 *     height property.
 * @return {number} The preferred bottom edge of the block.
 * @private
 */
Blockly.BlockSvg.computeBottomEdge_ = function(inputRows) {
  var bottomEdge = 0;
  for (var i = 0; i < inputRows.length; i++) {
    bottomEdge += inputRows[i].height;
  }
  return bottomEdge;
};

Blockly.BlockSvg.drawStatementInputFromTopRight_ = function(steps, cursorX,
    rightEdge, row) {
  Blockly.BlockSvg.drawStatementInputTop_(steps, cursorX);
  steps.push('v', row.height - 2 * Blockly.BlockSvg.CORNER_RADIUS);
  Blockly.BlockSvg.drawStatementInputBottom_(steps, rightEdge, row);
};

Blockly.BlockSvg.drawStatementInputTop_ = function(steps, cursorX) {
  steps.push(Blockly.BlockSvg.BOTTOM_RIGHT_CORNER);
  steps.push('H', cursorX + Blockly.BlockSvg.STATEMENT_INPUT_INNER_SPACE +
    2 * Blockly.BlockSvg.CORNER_RADIUS);
  steps.push(Blockly.BlockSvg.NOTCH_PATH_RIGHT);
  steps.push('h', '-' + Blockly.BlockSvg.STATEMENT_INPUT_INNER_SPACE);
  steps.push(Blockly.BlockSvg.INNER_TOP_LEFT_CORNER);
};

Blockly.BlockSvg.drawStatementInputBottom_ = function(steps, rightEdge, row) {
  steps.push(Blockly.BlockSvg.INNER_BOTTOM_LEFT_CORNER);
  // Bottom notch
  if (row.statementNotchAtBottom) {
    steps.push('h ', Blockly.BlockSvg.STATEMENT_INPUT_INNER_SPACE);
    steps.push(Blockly.BlockSvg.NOTCH_PATH_LEFT);
  }
  steps.push('H', rightEdge - Blockly.BlockSvg.CORNER_RADIUS);
};

Blockly.BlockSvg.prototype.drawEdgeShapeRight_ = function(steps) {
  if (this.edgeShape_) {
    // Draw the right-side edge shape.
    if (this.edgeShape_ === Blockly.OUTPUT_SHAPE_ROUND) {
      // Draw a rounded arc.
      steps.push('a ' + this.edgeShapeWidth_ + ' ' + this.edgeShapeWidth_ +
          ' 0 0 1 0 ' + this.edgeShapeWidth_ * 2);
    } else if (this.edgeShape_ === Blockly.OUTPUT_SHAPE_HEXAGONAL) {
      // Draw an half-hexagon.
      steps.push('l ' + this.edgeShapeWidth_ + ' ' + this.edgeShapeWidth_ +
          ' l ' + -this.edgeShapeWidth_ + ' ' + this.edgeShapeWidth_);
    }
  }
};

Blockly.BlockSvg.prototype.updateStatementConnectionPos_ = function(cursorX,
    cursorY, connectionsXY, input, statementEdge) {
  var connectionX = connectionsXY.x + (this.RTL ? -cursorX : cursorX);
  var connectionY = connectionsXY.y + cursorY;
  input.connection.moveTo(connectionX, connectionY);
  if (input.connection.isConnected()) {
    input.connection.tighten_();
    var targetBlockSize = input.connection.targetBlock().getHeightWidth();
    this.width = Math.max(this.width, statementEdge + targetBlockSize.width);
  }
};

Blockly.BlockSvg.prototype.updateValueConnectionPos_ = function(cursorX,
    cursorY, connectionsXY, input, yOffset) {
  var connectionX = connectionsXY.x + (this.RTL ? -cursorX : cursorX);
  // Attempt to center the connection vertically.
  var connectionY = connectionsXY.y + cursorY + yOffset;
  input.connection.moveTo(connectionX, connectionY);
  if (input.connection.isConnected()) {
    input.connection.tighten_();
  }
};

Blockly.BlockSvg.prototype.drawRightSideAroundStatement_ = function(steps,
    input, row, cursorX, oldCursorX) {

  // Remove final separator and replace it with right-padding.
  // Move to the right edge
  //oldCursorX = Math.max(oldCursorX, input.renderWidth + cursorX);
  //this.width = Math.max(this.width, oldCursorX);
  // Include corner radius in drawing the horizontal line.
  //steps.push('H', oldCursorX - Blockly.BlockSvg.CORNER_RADIUS);
  //steps.push(Blockly.BlockSvg.TOP_RIGHT_CORNER);
  // Subtract CORNER_RADIUS * 2 to account for the top right corner
  // and also the bottom right corner. Only move vertically the non-corner length.
  //steps.push('v', row.height - Blockly.BlockSvg.CORNER_RADIUS * 2);

  //var statementSize = input.connection.targetBlock().getHeightWidth();
  steps.push('v', input.renderHeight);
};


Blockly.BlockSvg.prototype.drawTheFanciestHat_ = function(steps, rightEdge) {
  steps.push('v', - 2 * Blockly.BlockSvg.GRID_UNIT);
  steps.push(Blockly.BlockSvg.TOP_LEFT_CORNER_FANCY_HAT);
  steps.push('h', rightEdge - 2 * Blockly.BlockSvg.FANCY_HAT_CORNER_RADIUS);
  steps.push(Blockly.BlockSvg.TOP_RIGHT_CORNER_FANCY_HAT);
  steps.push('v', 2 * Blockly.BlockSvg.GRID_UNIT);
};

/**
 * Compute the dimensions of the given input and saves them on the input,
 * taking into account
 * - minimum sizes
 * - linked blocks
 * - relationships to the current and previous rows.
 * @param {!Blockly.Input} input The input to measure.
 * @param {!Object} row The row that is currently being measured.
 * @param {Object} previousRow The previous row on the block.
 * @private
 */
Blockly.BlockSvg.prototype.computeInputDimensions_ = function(input, row,
    previousRow) {
  var minHeight = this.computeMinimumInputHeight_(input, row, previousRow);
  var minWidth = Blockly.BlockSvg.computeMinimumInputWidth_(input);

  if (!input.connection) {
    input.renderWidth = minWidth;
    input.renderHeight = minHeight;
    return;
  }

  var dimensions = Blockly.BlockSvg.getLinkedBlockSize_(input);

  // Update the height.
  if (input.connection.type === Blockly.INPUT_VALUE) {
    dimensions.height += 2 * Blockly.BlockSvg.INLINE_PADDING_Y;
  }
  if (input.connection.type === Blockly.NEXT_STATEMENT) {
    // Subtract height of notch, only if the last block in the stack has a next connection.
    if (row.statementNotchAtBottom) {
      dimensions.height -= Blockly.BlockSvg.NOTCH_HEIGHT;
    }
  }
  input.renderHeight = Math.max(minHeight, dimensions.height);
  input.renderWidth = Math.max(minWidth, dimensions.width);
};

/**
 * Get the dimensions of the block connected to this input, for the purposes
 * of rendering.  If no block is attached, set height and width to zero.
 * @param {!Blockly.Input} input The input whose connected block should be
 *     measured.
 * @return {!Object} An object containing height and width.
 * TODO: consider using a goog.math.size.
 */
Blockly.BlockSvg.getLinkedBlockSize_ = function(input) {
  // Look at the size of the linked block.
  var linkedBlock = input.connection.targetBlock();
  var height = 0;
  var width = 0;
  if (linkedBlock) {
    // A block is connected to the input - use its size.
    var bBox = linkedBlock.getHeightWidth();
    height = bBox.height;
    width = bBox.width;
  } else {
    if (input.connection.type === Blockly.INPUT_VALUE) {
      // No block connected - use the size of the rendered empty input shape.
      height = Blockly.BlockSvg.INPUT_SHAPE_HEIGHT;
    }
    // What about no block connected on a statement input?
  }
  return {
    height: height,
    width: width
  };
};

/**
 * Update the row height and input width based on the dimensions of all of the
 * fields on this input.
 * @param {!Blockly.Input} input The input whose fields should be measured.
 * @param {!Object} row The current row on the block that is being measured.
 * @param {number} iconOffset How far to offset the fields to account for icons
 *     on this row.
 * @private
 */
Blockly.BlockSvg.measureFieldsOnInput_ = function(input, row, iconOffset) {
  var width = this.RTL ? -iconOffset : iconOffset;
  var maxHeight = row.height;


  var previousFieldEditable = false;
  var lastField;
  for (var j = 0, field; field = input.fieldRow[j]; j++) {

    // if (j != 0) {
    //   // separator space after the field?
    //   width += Blockly.BlockSvg.SEP_SPACE_X;
    // }

    Blockly.BlockSvg.computeFieldRenderSize_(field, previousFieldEditable);
    // Add the total width of the field.
    width += field.renderWidth + field.renderSepBefore + field.renderSepAfter;
    maxHeight = Math.max(maxHeight, field.renderHeight);

    previousFieldEditable = field.EDITABLE;
    lastField = field;
  }
  // The last field doesn't get a post-field separator.
  if (lastField) {
    width -= lastField.renderSepAfter;
    lastField.renderSepAfter = 0;
  }

  // Store the results.
  // Why does the input store the width and the row store the height?
  input.fieldWidth = width;
  row.width += width;
  row.height = maxHeight;
};

/**
 * Compute the rendered size of the given field, including separators between
 * editable fields, and store it on the field.
 * renderSepBefore is the separator space *before* this field.
 * @param {!Blockly.Field} field The field to measure.
 * @param {boolean} previousFieldEditable Whether the previous field in the input
 *     is editable.
 * @private
 */
Blockly.BlockSvg.computeFieldRenderSize_ = function(field, previousFieldEditable) {
  // Get the dimensions of the field.
  var fieldSize = field.getSize();
  field.renderWidth = fieldSize.width;
  // This seems highly suspicious.  Is this ever non-zero in scratch-blocks?
  // Are we adding SEP_SPACE_X multiple times in this code?
  // It's equally suspicious in Blockly.
  field.renderSepBefore = (previousFieldEditable && field.EDITABLE) ?
      Blockly.BlockSvg.SEP_SPACE_X : 0;

  field.renderSepAfter = Blockly.BlockSvg.SEP_SPACE_X;
  field.renderHeight = fieldSize.height;
};

/**
 * Align the field cursor horizontally according to the alignment of the input.
 * @param {number} blockWidth The width of the block.
 * @param {!Blockly.Input} input The input that contains the current field.
 * @param {number} cursorX The current x cursor, which is where the field will
 *     be placed by default.  The field may not be placed left of the cursor.
 * @return {number} A new cursor that aligns the field correctly.
 * @private
 */
Blockly.BlockSvg.alignFieldX_ = function(blockWidth, input, cursorX) {
  // Align inline field rows (left/right/centre).
  if (input.align === Blockly.ALIGN_RIGHT) {
    // minus two times the separator width because it'll be moved over by one no matter what?
    cursorX += blockWidth - input.fieldWidth - (2 * Blockly.BlockSvg.SEP_SPACE_X);
  } else if (input.align === Blockly.ALIGN_CENTRE) {
    cursorX = Math.max(cursorX, blockWidth / 2 - input.fieldWidth / 2);
  }
  return cursorX;
};
