/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Handles serializing blocks to plain JavaScript objects only
 *     containing state.
 */
'use strict';

goog.module('Blockly.serialization.blocks');
goog.module.declareLegacyNamespace();


// TODO: Remove this once lint is fixed.
/* eslint-disable no-use-before-define */

/**
 * Represents the state of a given block.
 * @typedef {{
 *     type: string,
 *     id: string,
 *     x: (number|undefined),
 *     y: (number|undefined),
 *     collapsed: (boolean|undefined),
 *     disabled: (boolean|undefined),
 *     editable: (boolean|undefined),
 *     deletable: (boolean|undefined),
 *     movable: (boolean|undefined),
 *     inline: (boolean|undefined),
 *     data: (string|undefined),
 * }}
 */
var State;
exports.State = State;

/**
 * Returns the state of the given block as a plain JavaScript object.
 * @param {!Blockly.Block} block The block to serialize.
 * @param {{addCoordinates: (boolean|undefined)}=} param1
 *     addCoordinates: If true the coordinates of the block are added to the
 *       serialized state. False by default.
 * @return {?State} The serialized state of the
 *     block, or null if the block could not be serialied (eg it was an
 *     insertion marker).
 */
const save = function(block, {addCoordinates = false} = {}) {
  if (block.isInsertionMarker()) {
    return null;
  }

  const state = {
    'type': block.type,
    'id': block.id
  };

  if (addCoordinates) {
    addCoords(block, state);
  }
  addAttributes(block, state);

  return state;
};
exports.save = save;

/**
 * Adds attributes to the given state object based on the state of the block.
 * Eg collapsed, disabled, editable, etc.
 * @param {!Blockly.Block} block The block to base the attributes on.
 * @param {!State} state The state object to append
 *     to.
 */
const addAttributes = function(block, state) {
  if (block.isCollapsed()) {
    state['collapsed'] = true;
  }
  if (!block.isEnabled()) {
    state['enabled'] = false;
  }
  if (!block.isEditable()) {
    state['editable'] = false;
  }
  if (!block.isDeletable() && !block.isShadow()) {
    state['deletable'] = false;
  }
  if (!block.isMovable() && !block.isShadow()) {
    state['movable'] = false;
  }

  if (block.inputsInline !== undefined &&
      block.inputsInline !== block.inputsInlineDefault) {
    state['inline'] = block.inputsInline;
  }

  // Data is a nullable string, so we don't need to worry about falsy values.
  if (block.data) {
    state['data'] = block.data;
  }
};

/**
 * Adds the coordinates of the given block to the given state object.
 * @param {!Blockly.Block} block The block to base the coordinates on
 * @param {!State} state The state object to append
 *     to
 */
const addCoords = function(block, state) {
  const workspace = block.workspace;
  const xy = block.getRelativeToSurfaceXY();
  state['x'] = Math.round(workspace.RTL ? workspace.getWidth() - xy.x : xy.x);
  state['y'] = Math.round(xy.y);
};