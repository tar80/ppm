//!*script
/**
 * Returns link or entity paths
 *
 * @version 1.0
 * @return {string} Entity path of entries
 * NOTE: Returns space-delimited multiple paths
 */

var entries = PPx.Extract('%#;FDC').split(';');
var entity_path = [];
var thisEntry;

for (var entry in entries) {
  if (Object.prototype.hasOwnProperty.call(entries, entry)) {
    thisEntry = entries[entry];
    entity_path.push(
      (function () {
        return PPx.Extract('%*linkedpath(' + thisEntry + ')') || thisEntry;
      })()
    );
  }
}

PPx.Result = entity_path.join(' ');
