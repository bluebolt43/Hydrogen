/* Shared formal-layout preparation. Entrypoints own transport and controls. */
async function preparePlayLayout(layout,theme){
 layout=PinballRuntimeImages.toRuntime(layout);
 if(['touhou1','touhou2'].includes(theme))layout={...layout,gameplay:{...layout.gameplay,ballImage:'res/img/touhou/touhou-ball-yin-yang.png'}};
  const geometry=ConfiguredMechanisms.compile(layout,PIRATE_GEOMETRY,compileLayout);
  const theaterTheme=theme==='sci-fi'?'space':['norse','ragnarok'].includes(theme)?'saga':theme;
  // Decode referenced art before starting, so missing assets produce a useful error.
  const sources=new Set([geometry.gameplay?.ballImage||'res/img/top-ball.png']);
  sources.add('res/img/system-marker-muted.png');
  if(theme==='pirate'&&PirateTheaterCanvas.requested())PirateTheaterCanvas.initialSources.forEach(src=>sources.add(src));
  else if(theme!=='pirate')PlayTheaterCanvas.initialSources(theaterTheme).forEach(src=>sources.add(src));
  function collectImages(value){
   if(typeof value==='string'&&/^res\/(?:img|hd_img)\/.+\.(?:png|jpe?g|webp|svg)$/i.test(value))sources.add(value);
   else if(value&&typeof value==='object')Object.values(value).forEach(collectImages);
  }
  collectImages(geometry.gameplay);collectImages(geometry.artLayers);collectImages(PlayFrame.createArt(theme));
  if(theme==='steampunk')SteampunkArt.sources.forEach(src=>sources.add(src));
  const preparedImages=new Map();
  await Promise.all([...sources].map(async src=>{
   const image=new Image(),resolved=PinballRuntimeImages.resolve(src);
   // Local file images taint readback canvases. The build embeds the same
   // runtime bytes for authored alpha masks; HTTP(S) keeps normal image URLs.
   const local=typeof PLAY_LOCAL_IMAGES!=='undefined'&&PLAY_LOCAL_IMAGES;
   image.src=local?.[src]||resolved;
   if(local?.[src])PinballRuntimeImages.associate(image,resolved);
   try{await PinballRuntimeImages.decode(image);}catch{throw Error('圖片載入失敗：'+src);}
   preparedImages.set(src,image);
  }));
  await startPreview(geometry,preparedImages);
}
