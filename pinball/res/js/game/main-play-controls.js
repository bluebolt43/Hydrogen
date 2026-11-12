/* Formal player controls are provided by the main screen. */
function createPlayControls(){
 return {art:true,screenMask:true,probe:false,settingsOpen:false,openSettings(){window.AppControls.openSettings();}};
}
