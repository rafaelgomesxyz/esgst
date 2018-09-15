_MODULES.push({
  endless: true,
  id: `endlessLoad`,
  load: endlessLoad
});

async function endlessLoad() {    
  if (!esgst.menuPath) {
    await endless_load(document, true);
  }
}