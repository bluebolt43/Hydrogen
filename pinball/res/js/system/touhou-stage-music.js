/* Canonical OST sources shared by chapter stories and the play presentation. */
(function(root){
'use strict';
const source=(theme,stage)=>{
 if(!Number.isInteger(stage)||stage<1||stage>8)return '';
 return theme==='touhou1'?`res/audio/touhou1/touhou-a${stage}-bgm.m4a`:theme==='touhou2'?`res/audio/touhou2-b${stage}.ogg`:'';
};
root.TouhouStageMusic={source};
})(typeof window!=='undefined'?window:globalThis);
