const { constituencies } = require('./data/constituencies');

// Check all IDs follow pattern P{province}-{number}
const bad = constituencies.filter(c => {
  const expected = 'P' + c.province + '-';
  return !c.id.startsWith(expected);
});

if (bad.length === 0) {
  console.log('All IDs follow P{province}-{num} pattern!');
} else {
  console.log('Non-standard IDs:');
  bad.forEach(c => console.log(c.id, '-', c.name, '- Province', c.province));
}

// Check for duplicates
const idCount = {};
constituencies.forEach(c => { idCount[c.id] = (idCount[c.id] || 0) + 1; });
const dupes = Object.entries(idCount).filter(([id, count]) => count > 1);
console.log('Duplicate IDs:', dupes.length > 0 ? dupes : 'NONE');
console.log('Total constituencies:', constituencies.length);
