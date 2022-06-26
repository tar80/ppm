//!*script
/**
 * Returns link or entity paths
 *
 * @version 1.0
 * @return {string} Entity path of entries
 * NOTE: Returns space-delimited multiple paths
 */

'use strict';

const entries = PPx.Extract('%#;FDC').split(';');
const entity_path = [];
for (const entry of entries) {
  entity_path.push((() => PPx.Extract(`%*linkedpath(${entry})`) || entry)());
}

PPx.Result = entity_path.join(' ');
