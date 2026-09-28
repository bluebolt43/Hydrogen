// 海鳥特寫拉遠 4 秒、停留 1 秒 → 浮標 5 秒 → 人物拉遠 5 秒。
const timing = { birds: 5000, buoy: 5000, pullback: 5000, bubbleDelay: 250 };
const scene2Start = timing.birds + timing.buoy + timing.pullback + timing.bubbleDelay + 3000;
// Stage 1-2～1-4：上鉤縮回 4 秒 → 斷線 2 秒 → 地板淡入 1.2 秒 → 魚旋轉飛入 2 秒 → 停留。
const scene3Start = scene2Start + 13000;
const scene4Start = scene3Start + 5000;
const scene5Start = scene4Start + 4000;
const stage2EndStart = scene5Start + 11800;
const sharkStart = stage2EndStart + 4000;
const ch3FirstStart = sharkStart + 4000;
const ch3SecondStart = ch3FirstStart + 4000;
const sharkEndStart = ch3SecondStart + 4000;
const bottleStart = sharkEndStart + 4000;
const nightStart = bottleStart + 6500;
const stage4FirstStart = nightStart + 7500;
const victoryStart = stage4FirstStart + 30000;
const end = victoryStart + 26000;
const ch5Start = end, ch5Stop = ch5Start + 16500;
const ch6Start = ch5Stop + 8000;
const ch6End = ch6Start + 12000;
const ch7Start = ch6End + 8000;
const ch7EndStart = ch7Start+44500;
const ch8Start = ch7EndStart+11200;
const ch8End = ch8Start+30000;
const ch8EndStop = ch8End+47200;
const ch7PreviewThird = false;
const chapters = {
 'ch1-start':[0,scene4Start], 'ch1-end':[scene4Start,scene5Start],
 'ch2-start':[scene5Start,stage2EndStart], 'ch2-end':[stage2EndStart,sharkStart],
 'ch3-start':[sharkStart,sharkEndStart], 'ch3-end':[sharkEndStart,nightStart],
 'ch4-start':[nightStart,victoryStart], 'ch4-end':[victoryStart,end],
 'ch5-start':[ch5Start,ch5Stop], 'ch5-end':[ch5Stop,ch6Start],
 'ch6-start':[ch6Start,ch6End], 'ch6-end':[ch6End,ch7Start],
 'ch7-start':[ch7Start+(ch7PreviewThird?33000:0),ch7EndStart], 'ch7-end':[ch7EndStart,ch8Start],
 'ch8-start':[ch8Start,ch8End], 'ch8-end':[ch8End,ch8EndStop]
};
