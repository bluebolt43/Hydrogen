/* Formal entry: only main-owned layouts and controls are accepted. */
window.viewReady=Promise.resolve().then(()=>{
 const theme=PLAYTEST_THEME==='norse'?'saga':PLAYTEST_THEME;
 const layout=window.MainRuntimeLayouts?.[theme];
 if(!layout||!window.AppControls)throw Error('Formal player requires main runtime');
 return preparePlayLayout(layout,PLAYTEST_THEME);
});
