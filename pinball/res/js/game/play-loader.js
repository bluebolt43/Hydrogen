/* Shared formal-layout preparation. Entrypoints own transport and controls. */
async function preparePlayLayout(layout,theme){
 layout=PinballRuntimeImages.toRuntime(layout);
 if(['touhou1','touhou2'].includes(theme))layout={...layout,gameplay:{...layout.gameplay,ballImage:'res/img/touhou/touhou-ball-yin-yang.png'}};
  const geometry=ConfiguredMechanisms.compile(layout,PIRATE_GEOMETRY,compileLayout);
  // Decode referenced art before starting, so missing assets produce a useful error.
  const sources=new Set([geometry.gameplay?.ballImage||'res/img/top-ball.png']);
  function collectImages(value){
   if(typeof value==='string'&&/^res\/(?:img|hd_img)\/.+\.(?:png|jpe?g|webp|svg)$/i.test(value))sources.add(value);
   else if(value&&typeof value==='object')Object.values(value).forEach(collectImages);
  }
  collectImages(geometry.gameplay?.touhouBagua);collectImages(geometry.gameplay?.runicTurntable);collectImages(geometry.artLayers);collectImages(PlayFrame.createArt(theme));
  const preparedImages=new Map();
  await Promise.all([...sources].map(async src=>{
   const image=new Image();image.src=PinballRuntimeImages.resolve(src);
   try{await PinballRuntimeImages.decode(image);}catch{throw Error('圖片載入失敗：'+src);}
   preparedImages.set(src,image);
  }));
  await startPreview(geometry,preparedImages);
}
