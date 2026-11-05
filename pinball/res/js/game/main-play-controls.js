/* Formal player controls are provided by the main screen. */
function createPlayControls(){
 return {art:true,screenMask:false,probe:false,settingsOpen:false,openSettings(){window.AppControls.openSettings();}};
}
