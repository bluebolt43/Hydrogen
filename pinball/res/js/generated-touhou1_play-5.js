const PLAYTEST_THEME="touhou1";
const PLAYTEST_LAYOUT={"theme": "touhou1", "artLayers": [{"id": "art-001", "src": "res/img/plunger-rod.png", "x": 322, "y": 465, "width": 30, "height": 91, "angle": 0, "opacity": 1, "crop": [0.0, 0.0, 31.0, 91.0], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "plunger", "bind": "plunger", "layoutBind": "plunger-001", "layoutAnchor": [321.72, 422.76199999999994], "runtimeSource": "res/img/plunger-rod.png"}, {"id": "art-002", "src": "res/img/plunger-collar.png", "x": 323, "y": 457, "width": 50, "height": 38, "angle": 0, "opacity": 1, "crop": [0.0, 0.0, 51.0, 38.0], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "layoutBind": "plunger-001", "layoutAnchor": [321.72, 422.76199999999994], "runtimeSource": "res/img/plunger-collar.png"}, {"id": "art-085", "src": "res/img/touhou/touhou-yukari-gap-eyes-open.png", "x": 329, "y": 404, "width": 80, "height": 27, "angle": -32.37062964428847, "opacity": 1, "crop": [0.0, 0.0, 87.0, 29.0], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "indicator": {"off": "", "on": "res/img/touhou/touhou-yukari-gap-eyes-open.png", "defaultState": "off", "trigger": {"kind": "gap-launch", "source": "hole-008"}, "behavior": {"mode": "burst", "onSeconds": 0.15, "offSeconds": 0.15, "cycles": 10}, "impactFlash": false}, "runtimeSource": "res/img/touhou/touhou-yukari-gap-eyes-open.png"}, {"id": "art-046", "src": "res/img/touhou/touhou-torii-arrow-off.png", "x": 126, "y": 158, "width": 25, "height": 25, "angle": -7.654259059714306, "opacity": 1, "crop": [0.0, 0.0, 25.0, 25.0], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "indicator": {"group": "touhou1-attack-arrows", "off": "res/img/touhou/touhou-torii-arrow-off.png", "on": "res/img/touhou/touhou-torii-arrow-on.png", "defaultState": "off", "trigger": {"kind": "enemy-active"}, "behavior": {"mode": "repeat", "onSeconds": 0.3, "offSeconds": 0.3}}, "runtimeSource": "res/img/touhou/touhou-torii-arrow-off.png"}, {"id": "art-047", "src": "res/img/touhou/touhou-torii-arrow-off.png", "x": 164, "y": 155, "width": 25, "height": 25, "angle": 0, "opacity": 1, "crop": [0.0, 0.0, 25.0, 25.0], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "indicator": {"group": "touhou1-attack-arrows", "off": "res/img/touhou/touhou-torii-arrow-off.png", "on": "res/img/touhou/touhou-torii-arrow-on.png", "defaultState": "off", "trigger": {"kind": "enemy-active"}, "behavior": {"mode": "repeat", "onSeconds": 0.3, "offSeconds": 0.3}}, "runtimeSource": "res/img/touhou/touhou-torii-arrow-off.png"}, {"id": "art-048", "src": "res/img/touhou/touhou-torii-arrow-off.png", "x": 252, "y": 236, "width": 25, "height": 25, "angle": 28.148976327963737, "opacity": 1, "crop": [0.0, 0.0, 25.0, 25.0], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "indicator": {"group": "touhou1-attack-arrows", "off": "res/img/touhou/touhou-torii-arrow-off.png", "on": "res/img/touhou/touhou-torii-arrow-on.png", "defaultState": "off", "trigger": {"kind": "enemy-active"}, "behavior": {"mode": "repeat", "onSeconds": 0.3, "offSeconds": 0.3}}, "runtimeSource": "res/img/touhou/touhou-torii-arrow-off.png"}, {"id": "art-049", "src": "res/img/touhou/touhou-torii-arrow-off.png", "x": 215, "y": 219, "width": 25, "height": 25, "angle": 16.622027523020932, "opacity": 1, "crop": [0.0, 0.0, 25.0, 25.0], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "indicator": {"group": "touhou1-attack-arrows", "off": "res/img/touhou/touhou-torii-arrow-off.png", "on": "res/img/touhou/touhou-torii-arrow-on.png", "defaultState": "off", "trigger": {"kind": "enemy-active"}, "behavior": {"mode": "repeat", "onSeconds": 0.3, "offSeconds": 0.3}}, "runtimeSource": "res/img/touhou/touhou-torii-arrow-off.png"}, {"id": "art-050", "src": "res/img/touhou/touhou-torii-arrow-off.png", "x": 105, "y": 218, "width": 25, "height": 25, "angle": -9.991879396893992, "opacity": 1, "crop": [0.0, 0.0, 25.0, 25.0], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "indicator": {"group": "touhou1-attack-arrows", "off": "res/img/touhou/touhou-torii-arrow-off.png", "on": "res/img/touhou/touhou-torii-arrow-on.png", "defaultState": "off", "trigger": {"kind": "enemy-active"}, "behavior": {"mode": "repeat", "onSeconds": 0.3, "offSeconds": 0.3}}, "runtimeSource": "res/img/touhou/touhou-torii-arrow-off.png"}, {"id": "art-086", "src": "res/img/touhou/touhou-torii-arrow-off.png", "x": 275, "y": 22, "width": 25, "height": 25, "angle": 233.99105178548788, "opacity": 1, "crop": [0.0, 0.0, 25.0, 25.0], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "indicator": {"group": "touhou1-attack-arrows", "off": "res/img/touhou/touhou-torii-arrow-off.png", "on": "res/img/touhou/touhou-torii-arrow-on.png", "defaultState": "off", "trigger": {"kind": "enemy-active"}, "behavior": {"mode": "repeat", "onSeconds": 0.3, "offSeconds": 0.3}}, "runtimeSource": "res/img/touhou/touhou-torii-arrow-off.png"}, {"id": "art-051", "src": "res/img/touhou/touhou-sakura-star-off.png", "x": 144, "y": 151, "width": 22, "height": 22, "angle": 0, "opacity": 1, "crop": [0.0, 0.0, 22.0, 22.0], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "indicator": {"off": "res/img/touhou/touhou-sakura-star-off.png", "on": "res/img/touhou/touhou-sakura-star-on.png", "defaultState": "off", "trigger": {"kind": "enemy-target", "source": "target-004-1"}, "behavior": {"mode": "repeat", "onSeconds": 0.3, "offSeconds": 0.3}, "group": "touhou1-targets", "completion": {"mode": "burst", "onSeconds": 0.15, "offSeconds": 0.15, "cycles": 3}, "complete": ""}, "runtimeSource": "res/img/touhou/touhou-sakura-star-off.png"}, {"id": "art-052", "src": "res/img/touhou/touhou-sakura-star-off.png", "x": 270, "y": 248, "width": 22, "height": 22, "angle": 0, "opacity": 1, "crop": [0.0, 0.0, 22.0, 22.0], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "indicator": {"off": "res/img/touhou/touhou-sakura-star-off.png", "on": "res/img/touhou/touhou-sakura-star-on.png", "defaultState": "off", "trigger": {"kind": "enemy-target", "source": "target-007-1"}, "behavior": {"mode": "repeat", "onSeconds": 0.3, "offSeconds": 0.3}, "group": "touhou1-targets", "completion": {"mode": "burst", "onSeconds": 0.15, "offSeconds": 0.15, "cycles": 3}, "complete": ""}, "runtimeSource": "res/img/touhou/touhou-sakura-star-off.png"}, {"id": "art-053", "src": "res/img/touhou/touhou-sakura-star-off.png", "x": 184, "y": 150, "width": 22, "height": 22, "angle": 0, "opacity": 1, "crop": [0.0, 0.0, 22.0, 22.0], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "indicator": {"off": "res/img/touhou/touhou-sakura-star-off.png", "on": "res/img/touhou/touhou-sakura-star-on.png", "defaultState": "off", "trigger": {"kind": "enemy-target", "source": "target-005-1"}, "behavior": {"mode": "repeat", "onSeconds": 0.3, "offSeconds": 0.3}, "group": "touhou1-targets", "completion": {"mode": "burst", "onSeconds": 0.15, "offSeconds": 0.15, "cycles": 3}, "complete": ""}, "runtimeSource": "res/img/touhou/touhou-sakura-star-off.png"}, {"id": "art-054", "src": "res/img/touhou/touhou-sakura-star-off.png", "x": 229, "y": 238, "width": 22, "height": 22, "angle": 0, "opacity": 1, "crop": [0.0, 0.0, 22.0, 22.0], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "indicator": {"off": "res/img/touhou/touhou-sakura-star-off.png", "on": "res/img/touhou/touhou-sakura-star-on.png", "defaultState": "off", "trigger": {"kind": "enemy-target", "source": "target-008-1"}, "behavior": {"mode": "repeat", "onSeconds": 0.3, "offSeconds": 0.3}, "group": "touhou1-targets", "completion": {"mode": "burst", "onSeconds": 0.15, "offSeconds": 0.15, "cycles": 3}, "complete": ""}, "runtimeSource": "res/img/touhou/touhou-sakura-star-off.png"}, {"id": "art-055", "src": "res/img/touhou/touhou-magatama-off.png", "x": 264, "y": 41, "width": 24, "height": 24, "angle": 0, "opacity": 1, "crop": [0.0, 0.0, 24.0, 24.0], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "indicator": {"off": "res/img/touhou/touhou-magatama-off.png", "on": "res/img/touhou/touhou-magatama-on.png", "defaultState": "off", "trigger": {"kind": "rollover", "source": "rollover-004"}, "behavior": {"mode": "keep"}, "group": "touhou1-rollovers"}, "runtimeSource": "res/img/touhou/touhou-magatama-off.png"}, {"id": "art-056", "src": "res/img/touhou/touhou-magatama-off.png", "x": 239, "y": 41, "width": 24, "height": 24, "angle": 0, "opacity": 1, "crop": [0.0, 0.0, 24.0, 24.0], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "indicator": {"off": "res/img/touhou/touhou-magatama-off.png", "on": "res/img/touhou/touhou-magatama-on.png", "defaultState": "off", "trigger": {"kind": "rollover", "source": "rollover-003"}, "behavior": {"mode": "keep"}, "group": "touhou1-rollovers"}, "runtimeSource": "res/img/touhou/touhou-magatama-off.png"}, {"id": "art-006", "src": "res/img/touhou/touhou-ice-bumper-level-1.png", "x": 282, "y": 76, "width": 31, "height": 31, "angle": 0, "opacity": 1, "crop": [0.0, 0.0, 30.999999999999996, 30.999999999999996], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "indicator": {"type": "bumper", "group": "touhou1-bumpers", "defaultState": "lv1", "lv1": "res/img/touhou/touhou-ice-bumper-level-1.png", "lv2": "res/img/touhou/touhou-ice-bumper-level-2.png", "lv3": "res/img/touhou/touhou-ice-bumper-level-3.png", "trigger": {"kind": "level", "source": "circle-002"}, "keepLevelOnHit": true}, "runtimeSource": "res/img/touhou/touhou-ice-bumper-level-1.png"}, {"id": "art-007", "src": "res/img/touhou/touhou-ice-bumper-level-1.png", "x": 255, "y": 126, "width": 31, "height": 31, "angle": 0, "opacity": 1, "crop": [0.0, 0.0, 30.999999999999996, 30.999999999999996], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "indicator": {"type": "bumper", "group": "touhou1-bumpers", "defaultState": "lv1", "lv1": "res/img/touhou/touhou-ice-bumper-level-1.png", "lv2": "res/img/touhou/touhou-ice-bumper-level-2.png", "lv3": "res/img/touhou/touhou-ice-bumper-level-3.png", "trigger": {"kind": "level", "source": "circle-003"}, "keepLevelOnHit": true}, "runtimeSource": "res/img/touhou/touhou-ice-bumper-level-1.png"}, {"id": "art-008", "src": "res/img/touhou/touhou-ice-bumper-level-1.png", "x": 223, "y": 76, "width": 31, "height": 31, "angle": 0, "opacity": 1, "crop": [0.0, 0.0, 30.999999999999996, 30.999999999999996], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "indicator": {"type": "bumper", "group": "touhou1-bumpers", "defaultState": "lv1", "lv1": "res/img/touhou/touhou-ice-bumper-level-1.png", "lv2": "res/img/touhou/touhou-ice-bumper-level-2.png", "lv3": "res/img/touhou/touhou-ice-bumper-level-3.png", "trigger": {"kind": "level", "source": "circle-001"}, "keepLevelOnHit": true}, "runtimeSource": "res/img/touhou/touhou-ice-bumper-level-1.png"}, {"id": "art-014", "src": "res/img/touhou/touhou-moriya-main-hall.png", "x": 276, "y": 158, "width": 50, "height": 33, "angle": 0, "opacity": 1, "crop": [0.0, 0.0, 50.0, 34.0], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "animation": {"enabled": true, "effect": "shake", "duration": 0.75, "amplitude": 2.5, "trigger": {"kind": "hole-capture", "source": "hole-005"}}, "runtimeSource": "res/img/touhou/touhou-moriya-main-hall.png"}, {"id": "art-020", "src": "res/img/touhou/touhou-hakurei-main-hall.png", "x": 160, "y": 32, "width": 67, "height": 44, "angle": 0, "opacity": 1, "crop": [0.0, 0.0, 67.0, 45.0], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "animation": {"enabled": true, "effect": "shake", "duration": 0.75, "amplitude": 2.5, "trigger": {"kind": "hole-capture", "source": "hole-007"}}, "runtimeSource": "res/img/touhou/touhou-hakurei-main-hall.png"}, {"id": "art-021", "src": "res/img/touhou/touhou-lower-playfield-grass.png", "x": 180, "y": 244, "width": 360, "height": 504, "angle": 0, "opacity": 1, "crop": [0.0, 0.0, 360.0, 503.99999999999994], "plane": "background", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "runtimeSource": "res/img/touhou/touhou-lower-playfield-grass.png"}, {"id": "art-064", "src": "res/img/touhou/touhou-lower-perimeter-forest.png", "x": 180, "y": 229, "width": 360, "height": 477, "angle": 0, "opacity": 1, "crop": [0.0, 0.0, 360.0, 478.0], "plane": "background", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "runtimeSource": "res/img/touhou/touhou-lower-perimeter-forest.png"}, {"id": "art-022", "src": "res/img/touhou/touhou-lower-right-misty-lake.png", "x": 250, "y": 89, "width": 102, "height": 107, "angle": 0, "opacity": 1, "crop": [0.0, 0.0, 102.0, 108.00000000000001], "plane": "background", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "runtimeSource": "res/img/touhou/touhou-lower-right-misty-lake.png"}, {"id": "art-030", "src": "res/img/touhou/touhou-yin-yang-off.png", "x": 61, "y": 359, "width": 24, "height": 24, "angle": 0, "opacity": 1, "crop": [0.0, 0.0, 24.0, 24.0], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "indicator": {"off": "res/img/touhou/touhou-yin-yang-off.png", "on": "res/img/touhou/touhou-yin-yang-on.png", "defaultState": "off", "trigger": {"kind": "kickback", "source": "line-574"}, "behavior": {"mode": "keep"}, "group": "touhou1-rescue"}, "runtimeSource": "res/img/touhou/touhou-yin-yang-off.png"}, {"id": "art-031", "src": "res/img/touhou/touhou-yin-yang-off.png", "x": 300, "y": 362, "width": 24, "height": 24, "angle": 0, "opacity": 1, "crop": [0.0, 0.0, 24.0, 24.0], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "indicator": {"off": "res/img/touhou/touhou-yin-yang-off.png", "on": "res/img/touhou/touhou-yin-yang-on.png", "defaultState": "off", "trigger": {"kind": "kickback", "source": "line-575"}, "behavior": {"mode": "keep"}, "group": "touhou1-rescue"}, "runtimeSource": "res/img/touhou/touhou-yin-yang-off.png"}, {"id": "art-037", "src": "res/img/touhou/touhou-middle-right-cloud-road.png", "x": 268, "y": 144, "width": 150, "height": 163, "angle": 0, "opacity": 1, "crop": [0.0, 0.0, 150.0, 164.0], "plane": "upper", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "runtimeSource": "res/img/touhou/touhou-middle-right-cloud-road.png"}, {"id": "art-038", "src": "res/img/touhou/touhou-hakugyokurou-building.png", "x": 112, "y": 65, "width": 72, "height": 24, "angle": 0, "opacity": 1, "crop": [0.0, 0.0, 72.0, 24.0], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "animation": {"enabled": true, "effect": "shake", "duration": 0.75, "amplitude": 2.5, "trigger": {"kind": "hole-capture", "source": "hole-004"}}, "runtimeSource": "res/img/touhou/touhou-hakugyokurou-building.png"}, {"id": "art-041", "src": "res/img/touhou/touhou-slingshot-off.png", "x": 112, "y": 363, "width": 53, "height": 78, "angle": 0, "opacity": 1, "crop": [0.0, 0.0, 54.0, 81.0], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "indicator": {"off": "res/img/touhou/touhou-slingshot-off.png", "on": "res/img/touhou/touhou-slingshot-on.png", "defaultState": "off", "trigger": {"kind": "rebound", "source": "line-582"}, "behavior": {"mode": "once", "onSeconds": 0.28}, "group": "touhou1-slingshots"}, "runtimeSource": "res/img/touhou/touhou-slingshot-off.png"}, {"id": "art-042", "src": "res/img/touhou/touhou-slingshot-off.png", "x": 249, "y": 362, "width": 54, "height": 80, "angle": 0, "opacity": 1, "crop": [0.0, 0.0, 54.0, 81.0], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "flipX": true, "indicator": {"off": "res/img/touhou/touhou-slingshot-off.png", "on": "res/img/touhou/touhou-slingshot-on.png", "defaultState": "off", "trigger": {"kind": "rebound", "source": "line-583"}, "behavior": {"mode": "once", "onSeconds": 0.28}, "group": "touhou1-slingshots"}, "runtimeSource": "res/img/touhou/touhou-slingshot-off.png"}, {"id": "art-043", "src": "res/img/touhou/touhou-ofuda-off.png", "x": 86, "y": 360, "width": 25, "height": 25, "angle": 0, "opacity": 1, "crop": [0.0, 0.0, 25.0, 25.0], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "indicator": {"off": "res/img/touhou/touhou-ofuda-off.png", "on": "res/img/touhou/touhou-ofuda-on.png", "defaultState": "off", "trigger": {"kind": "rollover", "source": "rollover-001"}, "behavior": {"mode": "keep"}, "group": "touhou1-rollovers"}, "runtimeSource": "res/img/touhou/touhou-ofuda-off.png"}, {"id": "art-044", "src": "res/img/touhou/touhou-ofuda-off.png", "x": 277, "y": 360, "width": 25, "height": 25, "angle": 0, "opacity": 1, "crop": [0.0, 0.0, 25.0, 25.0], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "indicator": {"off": "res/img/touhou/touhou-ofuda-off.png", "on": "res/img/touhou/touhou-ofuda-on.png", "defaultState": "off", "trigger": {"kind": "rollover", "source": "rollover-002"}, "behavior": {"mode": "keep"}, "group": "touhou1-rollovers"}, "runtimeSource": "res/img/touhou/touhou-ofuda-off.png"}, {"id": "art-045", "src": "res/img/touhou/touhou-shrine-coin-off.png", "x": 182, "y": 463, "width": 19, "height": 19, "angle": 0, "opacity": 1, "crop": [0.0, 0.0, 19.0, 19.0], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "center-post", "indicator": {"off": "", "on": "res/img/touhou/touhou-shrine-coin-off.png", "defaultState": "off", "trigger": {"kind": "post", "source": "centerPost-001"}, "behavior": {"mode": "keep"}, "impactFlash": false}, "bind": "centerPost-001", "runtimeSource": "res/img/touhou/touhou-shrine-coin-off.png"}, {"id": "art-062", "src": "res/img/touhou/touhou-lower-left-cherry-grove.png", "x": 146, "y": 112, "width": 172, "height": 202, "angle": 0, "opacity": 1, "crop": [0.0, 0.0, 173.0, 202.0], "plane": "background", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "runtimeSource": "res/img/touhou/touhou-lower-left-cherry-grove.png"}, {"id": "art-063", "src": "res/img/touhou/touhou-lower-right-youkai-mountain.png", "x": 250, "y": 176, "width": 111, "height": 117, "angle": 0, "opacity": 1, "crop": [0.0, 0.0, 111.0, 118.0], "plane": "background", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "runtimeSource": "res/img/touhou/touhou-lower-right-youkai-mountain.png"}, {"id": "art-076", "src": "res/img/touhou/touhou-lower-bottom-forest.png", "x": 179, "y": 445, "width": 360, "height": 59, "angle": 0, "opacity": 1, "crop": [0.0, 0.0, 373.0, 59.0], "plane": "background", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "runtimeSource": "res/img/touhou/touhou-lower-bottom-forest.png"}, {"id": "art-068", "src": "res/img/touhou/touhou-lower-right-bamboo-trail-night.png", "x": 338, "y": 292, "width": 122, "height": 364, "angle": 0, "opacity": 1, "crop": [0.0, 0.0, 122.00000000000001, 366.00000000000006], "plane": "background", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "runtimeSource": "res/img/touhou/touhou-lower-right-bamboo-trail-night.png"}, {"id": "art-009", "src": "res/img/touhou/touhou-flipper.png", "x": 149, "y": 445, "width": 49, "height": 16, "angle": 30, "opacity": 1, "crop": [0.0, 0.0, 49.0, 17.0], "plane": "background", "frames": 1, "frameAxis": "x", "state": "static", "bind": "flipper-004", "runtimeSource": "res/img/touhou/touhou-flipper.png"}, {"id": "art-010", "src": "res/img/touhou/touhou-flipper.png", "x": 216, "y": 445, "width": 49, "height": 16, "angle": -30, "opacity": 1, "crop": [0.0, 0.0, 49.0, 17.0], "plane": "background", "frames": 1, "frameAxis": "x", "state": "static", "bind": "flipper-003", "flipX": true, "runtimeSource": "res/img/touhou/touhou-flipper.png"}, {"id": "art-011", "src": "res/img/touhou/touhou-hakugyokurou-cherry.png", "x": 33, "y": 32, "width": 125, "height": 83, "angle": 0, "opacity": 1, "crop": [0.0, 0.0, 125.0, 84.0], "plane": "background", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "runtimeSource": "res/img/touhou/touhou-hakugyokurou-cherry.png"}, {"id": "art-023", "src": "res/img/touhou/touhou-lower-right-lake-mountain.png", "x": 285, "y": 41, "width": 35, "height": 39, "angle": 0, "opacity": 1, "crop": [0.0, 0.0, 36.0, 39.0], "plane": "background", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "runtimeSource": "res/img/touhou/touhou-lower-right-lake-mountain.png"}, {"id": "art-069", "src": "res/img/touhou/touhou-wood-divider-short.png", "x": 252, "y": 38, "width": 5, "height": 30, "angle": 0, "opacity": 1, "crop": [0.0, 0.0, 6.0, 30.0], "plane": "background", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "runtimeSource": "res/img/touhou/touhou-wood-divider-short.png"}, {"id": "art-070", "src": "res/img/touhou/touhou-wood-divider-long.png", "x": 74, "y": 367, "width": 5, "height": 77, "angle": 0, "opacity": 1, "crop": [0.0, 0.0, 5.0, 77.0], "plane": "background", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "runtimeSource": "res/img/touhou/touhou-wood-divider-long.png"}, {"id": "art-071", "src": "res/img/touhou/touhou-wood-divider-long.png", "x": 288, "y": 363, "width": 5, "height": 77, "angle": 0, "opacity": 1, "crop": [0.0, 0.0, 5.0, 77.0], "plane": "background", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "runtimeSource": "res/img/touhou/touhou-wood-divider-long.png"}, {"id": "art-072", "src": "res/img/touhou/touhou-flipper-guide.png", "x": 262, "y": 409, "width": 63, "height": 69, "angle": 0, "opacity": 1, "crop": [0.0, 0.0, 64.0, 69.0], "plane": "background", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "runtimeSource": "res/img/touhou/touhou-flipper-guide.png"}, {"id": "art-073", "src": "res/img/touhou/touhou-flipper-guide.png", "x": 102, "y": 408, "width": 63, "height": 69, "angle": 0, "opacity": 1, "crop": [0.0, 0.0, 64.0, 69.0], "plane": "background", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "flipX": true, "runtimeSource": "res/img/touhou/touhou-flipper-guide.png"}, {"id": "art-059", "src": "res/img/touhou/touhou-yukari-gap-eyes-open.png", "x": 33, "y": 195, "width": 86, "height": 29, "angle": 47.9542077668131, "opacity": 1, "crop": [0.0, 0.0, 87.0, 29.0], "plane": "upper", "frames": 1, "frameAxis": "x", "state": "static", "indicator": {"off": "", "on": "res/img/touhou/touhou-yukari-gap-eyes-open.png", "defaultState": "off", "trigger": {"kind": "hole-active", "source": "hole-008"}, "behavior": {"mode": "keep"}, "impactFlash": false, "captureBehavior": {"mode": "repeat", "onSeconds": 0.2, "offSeconds": 0.2}}, "runtimeSource": "res/img/touhou/touhou-yukari-gap-eyes-open.png"}, {"id": "art-075", "src": "res/img/touhou/touhou-middle-left-cloud-road.png", "x": 73, "y": 115, "width": 112, "height": 200, "angle": 0, "opacity": 1, "crop": [0.0, 0.0, 113.0, 200.0], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "runtimeSource": "res/img/touhou/touhou-middle-left-cloud-road.png"}, {"id": "art-077", "src": "res/img/touhou/touhou-wood-divider-short.png", "x": 61, "y": 423, "width": 5, "height": 30, "angle": -56.927435710114224, "opacity": 1, "crop": [0.0, 0.0, 6.0, 30.0], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "return-gate", "bind": "oneway-008", "runtimeSource": "res/img/touhou/touhou-wood-divider-short.png"}, {"id": "art-078", "src": "res/img/touhou/touhou-wood-divider-short.png", "x": 297, "y": 421, "width": 5, "height": 30, "angle": 48.83386351380909, "opacity": 1, "crop": [0.0, 0.0, 6.0, 30.0], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "return-gate", "bind": "oneway-009", "runtimeSource": "res/img/touhou/touhou-wood-divider-short.png"}, {"id": "art-079", "src": "res/img/touhou/touhou-yin-yang-off.png", "x": 15, "y": 276, "width": 24, "height": 24, "angle": 0, "opacity": 1, "crop": [0.0, 0.0, 24.0, 24.0], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "indicator": {"off": "res/img/touhou/touhou-yin-yang-off.png", "on": "res/img/touhou/touhou-yin-yang-on.png", "defaultState": "off", "trigger": {"kind": "gap-count", "source": "hole-008", "threshold": 2}, "behavior": {"mode": "keep"}, "group": "touhou1-gap-counter", "impactFlash": false}, "runtimeSource": "res/img/touhou/touhou-yin-yang-off.png"}, {"id": "art-080", "src": "res/img/touhou/touhou-yin-yang-off.png", "x": 15, "y": 260, "width": 24, "height": 24, "angle": 0, "opacity": 1, "crop": [0.0, 0.0, 24.0, 24.0], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "indicator": {"off": "res/img/touhou/touhou-yin-yang-off.png", "on": "res/img/touhou/touhou-yin-yang-on.png", "defaultState": "off", "trigger": {"kind": "gap-count", "source": "hole-008", "threshold": 1}, "behavior": {"mode": "keep"}, "group": "touhou1-gap-counter", "impactFlash": false}, "runtimeSource": "res/img/touhou/touhou-yin-yang-off.png"}, {"id": "art-039", "src": "res/img/touhou/touhou-red-torii.png", "x": 163, "y": 102, "width": 49, "height": 50, "angle": 0, "opacity": 1, "crop": [0.0, 0.0, 50.0, 50.0], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "runtimeSource": "res/img/touhou/touhou-red-torii.png"}, {"id": "art-040", "src": "res/img/touhou/touhou-red-torii.png", "x": 260, "y": 199, "width": 44, "height": 45, "angle": 0, "opacity": 1, "crop": [0.0, 0.0, 50.0, 50.0], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "runtimeSource": "res/img/touhou/touhou-red-torii.png"}, {"id": "art-016", "src": "res/img/touhou/touhou-moriya-stone.png", "x": 276, "y": 225, "width": 50, "height": 50, "angle": 0, "opacity": 1, "crop": [0.0, 0.0, 50.0, 50.0], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "animation": {"enabled": true, "effect": "shake", "duration": 0.75, "amplitude": 2.5, "trigger": {"kind": "target", "source": "target-007-1"}}, "runtimeSource": "res/img/touhou/touhou-moriya-stone.png"}, {"id": "art-015", "src": "res/img/touhou/touhou-moriya-stone.png", "x": 240, "y": 216, "width": 50, "height": 50, "angle": 0, "opacity": 1, "crop": [0.0, 0.0, 50.0, 50.0], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "animation": {"enabled": true, "effect": "shake", "duration": 0.75, "amplitude": 2.5, "trigger": {"kind": "target", "source": "target-008-1"}}, "runtimeSource": "res/img/touhou/touhou-moriya-stone.png"}, {"id": "art-018", "src": "res/img/touhou/touhou-hakurei-stone.png", "x": 144, "y": 124, "width": 26, "height": 40, "angle": 0, "opacity": 1, "crop": [0.0, 0.0, 27.0, 40.0], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "animation": {"enabled": true, "effect": "shake", "duration": 0.75, "amplitude": 2.5, "trigger": {"kind": "target", "source": "target-004-1"}}, "runtimeSource": "res/img/touhou/touhou-hakurei-stone.png"}, {"id": "art-019", "src": "res/img/touhou/touhou-hakurei-stone.png", "x": 183, "y": 124, "width": 26, "height": 40, "angle": 0, "opacity": 1, "crop": [0.0, 0.0, 27.0, 40.0], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "flipX": true, "animation": {"enabled": true, "effect": "shake", "duration": 0.75, "amplitude": 2.5, "trigger": {"kind": "target", "source": "target-005-1"}}, "runtimeSource": "res/img/touhou/touhou-hakurei-stone.png"}, {"id": "art-057", "src": "res/img/touhou/touhou-a1-cirno-angry.png", "x": 197, "y": 105, "width": 40, "height": 71, "angle": 0, "opacity": 1, "crop": [0.0, 0.0, 362.0, 642.0], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "target", "bind": "target-002-1", "animation": {"enabled": true, "effect": "shake", "duration": 0.75, "amplitude": 2.5, "trigger": {"kind": "target", "source": "target-002"}}, "runtimeSource": "res/img/touhou/touhou-a1-cirno-angry.png"}, {"id": "art-025", "src": "res/img/touhou/touhou-yuyuko-soul-flame.png", "x": 14, "y": 3, "width": 19, "height": 28, "angle": 0, "opacity": 1, "crop": [0.0, 0.0, 19.0, 29.0], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "indicator": {"group": "touhou1-sensor-001-counter", "off": "", "on": "res/img/touhou/touhou-yuyuko-soul-flame.png", "complete": "", "defaultState": "off", "trigger": {"kind": "count", "source": "sensor-001", "threshold": 1}, "behavior": {"mode": "keep"}, "completion": {"mode": "burst", "onSeconds": 0.15, "offSeconds": 0.15, "cycles": 3}, "impactFlash": false}, "runtimeSource": "res/img/touhou/touhou-yuyuko-soul-flame.png"}, {"id": "art-081", "src": "res/img/touhou/touhou-yuyuko-soul-flame.png", "x": 29, "y": 14, "width": 19, "height": 28, "angle": 0, "opacity": 1, "crop": [0.0, 0.0, 19.0, 29.0], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "indicator": {"group": "touhou1-sensor-001-counter", "off": "", "on": "res/img/touhou/touhou-yuyuko-soul-flame.png", "complete": "", "defaultState": "off", "trigger": {"kind": "count", "source": "sensor-001", "threshold": 2}, "behavior": {"mode": "keep"}, "completion": {"mode": "burst", "onSeconds": 0.15, "offSeconds": 0.15, "cycles": 3}, "impactFlash": false}, "runtimeSource": "res/img/touhou/touhou-yuyuko-soul-flame.png"}, {"id": "art-082", "src": "res/img/touhou/touhou-yuyuko-soul-flame.png", "x": 46, "y": 3, "width": 19, "height": 28, "angle": 0, "opacity": 1, "crop": [0.0, 0.0, 19.0, 29.0], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "indicator": {"group": "touhou1-sensor-001-counter", "off": "", "on": "res/img/touhou/touhou-yuyuko-soul-flame.png", "complete": "", "defaultState": "off", "trigger": {"kind": "count", "source": "sensor-001", "threshold": 3}, "behavior": {"mode": "keep"}, "completion": {"mode": "burst", "onSeconds": 0.15, "offSeconds": 0.15, "cycles": 3}, "impactFlash": false}, "runtimeSource": "res/img/touhou/touhou-yuyuko-soul-flame.png"}, {"id": "art-033", "src": "res/img/touhou/touhou-fire-flame.png", "x": 336, "y": 141, "width": 15, "height": 23, "angle": 0, "opacity": 1, "crop": [0.0, 0.0, 16.0, 23.0], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "indicator": {"group": "touhou1-sensor-002-counter", "off": "", "on": "res/img/touhou/touhou-fire-flame.png", "complete": "", "defaultState": "off", "trigger": {"kind": "count", "source": "sensor-002", "threshold": 1}, "behavior": {"mode": "keep"}, "completion": {"mode": "burst", "onSeconds": 0.15, "offSeconds": 0.15, "cycles": 3}, "impactFlash": false}, "runtimeSource": "res/img/touhou/touhou-fire-flame.png"}, {"id": "art-083", "src": "res/img/touhou/touhou-fire-flame.png", "x": 337, "y": 169, "width": 15, "height": 23, "angle": 0, "opacity": 1, "crop": [0.0, 0.0, 16.0, 23.0], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "indicator": {"group": "touhou1-sensor-002-counter", "off": "", "on": "res/img/touhou/touhou-fire-flame.png", "complete": "", "defaultState": "off", "trigger": {"kind": "count", "source": "sensor-002", "threshold": 3}, "behavior": {"mode": "keep"}, "completion": {"mode": "burst", "onSeconds": 0.15, "offSeconds": 0.15, "cycles": 3}, "impactFlash": false}, "runtimeSource": "res/img/touhou/touhou-fire-flame.png"}, {"id": "art-084", "src": "res/img/touhou/touhou-fire-flame.png", "x": 352, "y": 154, "width": 15, "height": 23, "angle": 0, "opacity": 1, "crop": [0.0, 0.0, 16.0, 23.0], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "indicator": {"group": "touhou1-sensor-002-counter", "off": "", "on": "res/img/touhou/touhou-fire-flame.png", "complete": "", "defaultState": "off", "trigger": {"kind": "count", "source": "sensor-002", "threshold": 2}, "behavior": {"mode": "keep"}, "completion": {"mode": "burst", "onSeconds": 0.15, "offSeconds": 0.15, "cycles": 3}, "impactFlash": false}, "runtimeSource": "res/img/touhou/touhou-fire-flame.png"}, {"id": "art-087", "src": "res/img/touhou/touhou-shimenawa-flag-square.png", "x": 99, "y": 190, "width": 35, "height": 35, "angle": 0, "opacity": 1, "crop": [0.0, 0.0, 35.0, 35.0], "plane": "upper", "frames": 1, "frameAxis": "x", "state": "static", "bind": "flag-002", "runtimeSource": "res/img/touhou/touhou-shimenawa-flag-square.png"}, {"id": "art-088", "src": "res/img/touhou/touhou-shimenawa-flag-square.png", "x": 223, "y": 194, "width": 35, "height": 35, "angle": 0, "opacity": 1, "crop": [0.0, 0.0, 35.0, 35.0], "plane": "upper", "frames": 1, "frameAxis": "x", "state": "static", "bind": "flag-003", "runtimeSource": "res/img/touhou/touhou-shimenawa-flag-square.png"}, {"id": "art-089", "src": "res/img/touhou/touhou-shimenawa-flag-square.png", "x": 296, "y": 229, "width": 35, "height": 35, "angle": 0, "opacity": 1, "crop": [0.0, 0.0, 35.0, 35.0], "plane": "upper", "frames": 1, "frameAxis": "x", "state": "static", "bind": "flag-001", "runtimeSource": "res/img/touhou/touhou-shimenawa-flag-square.png"}, {"id": "art-090", "src": "", "needsAsset": true, "state": "ball-layer", "plane": "lower", "x": 0, "y": 0, "width": 1, "height": 1, "angle": 0, "opacity": 1, "crop": [0, 0, 1, 1], "frames": 1, "frameAxis": "x", "bind": ""}, {"id": "art-032", "src": "res/img/touhou/touhou-eientei.png", "x": 325, "y": 272, "width": 74, "height": 49, "angle": 0, "opacity": 1, "crop": [0.0, 0.0, 74.0, 50.0], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "runtimeSource": "res/img/touhou/touhou-eientei.png"}, {"id": "art-012", "src": "res/img/touhou/touhou-yakumo-residence.png", "x": 27, "y": 267, "width": 67, "height": 48, "angle": 0, "opacity": 1, "crop": [0.0, 0.0, 68.0, 48.0], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "animation": {"enabled": true, "effect": "shake", "duration": 0.75, "amplitude": 2.5, "trigger": {"kind": "hole-release", "source": "hole-006"}}, "runtimeSource": "res/img/touhou/touhou-yakumo-residence.png"}, {"id": "art-091", "src": "", "needsAsset": true, "state": "ball-layer", "plane": "upper", "x": 0, "y": 0, "width": 1, "height": 1, "angle": 0, "opacity": 1, "crop": [0, 0, 1, 1], "frames": 1, "frameAxis": "x", "bind": ""}, {"id": "art-092", "src": "", "needsAsset": true, "state": "ball-layer", "plane": "top", "x": 0, "y": 0, "width": 1, "height": 1, "angle": 0, "opacity": 1, "crop": [0, 0, 1, 1], "frames": 1, "frameAxis": "x", "bind": ""}, {"id": "art-093", "src": "res/img/touhou/touhou-youmu-half-phantom.png", "x": 45, "y": 30, "width": 29, "height": 27, "angle": 0, "opacity": 1, "crop": [0.0, 0.0, 33.0, 27.0], "plane": "foreground", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "animation": {"enabled": true, "effect": "shake", "duration": 0.75, "amplitude": 2.5, "trigger": {"kind": "sensor", "source": "sensor-001"}}, "runtimeSource": "res/img/touhou/touhou-youmu-half-phantom.png"}, {"id": "art-094", "src": "res/img/touhou/touhou-aya-maple-leaf.png", "x": 323, "y": 105, "width": 27, "height": 27, "angle": 0, "opacity": 1, "crop": [0.0, 0.0, 27.0, 27.0], "plane": "foreground", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "animation": {"enabled": true, "effect": "shake", "duration": 0.75, "amplitude": 2.5, "trigger": {"kind": "sensor", "source": "sensor-002"}}, "runtimeSource": "res/img/touhou/touhou-aya-maple-leaf.png"}, {"id": "art-095", "src": "res/img/touhou/touhou-torii-arrow-off.png", "x": 68, "y": 262, "width": 25, "height": 25, "angle": 95.90425180592496, "opacity": 1, "crop": [0.0, 0.0, 25.0, 25.0], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "bind": "hole-006", "indicator": {"off": "res/img/touhou/touhou-torii-arrow-off.png", "on": "res/img/touhou/touhou-torii-arrow-on.png", "defaultState": "off", "trigger": {"kind": "gap-output", "source": "hole-006"}, "behavior": {"mode": "repeat", "onSeconds": 0.4, "offSeconds": 0.4}, "releaseBehavior": {"mode": "repeat", "onSeconds": 0.1, "offSeconds": 0.1}, "impactFlash": false}, "runtimeSource": "res/img/touhou/touhou-torii-arrow-off.png"}], "gameplay": {"touhouGap": {"sensor": "sensor-003", "hole": "hole-008", "passes": 1, "locks": 3, "autoLaunch": true, "keepOpenUntilFull": true, "readySeconds": 3, "captureSeconds": 3}, "indicatorCounters": ["sensor-001"], "touhouBagua": {"object": "blockhole-001", "radius": 68, "threshold": 8, "spinSeconds": 4.5, "winFlashSeconds": 1.2, "rewards": [{"kind": "score", "value": 1000, "art": {"src": "res/img/steampunk/steampunk-bonus-score-1000.png", "crop": [0, 0, 20, 9]}}, {"kind": "score", "value": 2500, "art": {"src": "res/img/steampunk/steampunk-bonus-score-2500.png", "crop": [0, 0, 20, 7]}}, {"kind": "score", "value": 5000, "art": {"src": "res/img/steampunk/steampunk-bonus-score-5000.png", "crop": [0, 0, 20, 8]}}, {"kind": "multiplier", "value": 2, "art": {"src": "res/img/steampunk/steampunk-bonus-multiplier-2.png", "crop": [0, 0, 16, 12]}}, {"kind": "multiplier", "value": 3, "art": {"src": "res/img/steampunk/steampunk-bonus-multiplier-3.png", "crop": [0, 0, 14, 12]}}, {"kind": "ball", "value": 1, "art": {"src": "res/img/steampunk/steampunk-bonus-ball-plus-1.png", "crop": [0, 0, 18, 9]}}, {"kind": "multi", "value": 2, "art": {"src": "res/img/steampunk/steampunk-bonus-multiball.png", "crop": [0, 0, 19, 18]}}, {"kind": "enemy", "value": 0, "art": {"src": "res/img/steampunk/steampunk-bonus-enemy.png", "crop": [0, 0, 13, 13]}}], "yinYang": {"fadeSeconds": 0.8}, "attackArt": {"src": "res/img/touhou/touhou-attack-lv4-fantasy-seal.png", "duration": 1.55}}, "ballImage": "res/img/touhou/touhou-ball-yin-yang.png"}, "screenLayout": {"width": 360, "height": 640, "theaterHeight": 170.5, "playfieldHeight": 469.5, "top": -170.5, "bottom": 469.5}, "format": "pinball-layout-editor", "version": 6, "canvas": {"width": 360, "height": 469.5, "upperLimit": 469.5}, "objects": [{"id": "line-047", "type": "line", "layer": "lower", "x1": 237, "y1": 212, "x2": 244.181, "y2": 213.473}, {"id": "line-050", "type": "line", "layer": "lower", "x1": 282, "y1": 176, "x2": 276, "y2": 229}, {"id": "line-051", "type": "line", "layer": "lower", "x1": 275.528, "y1": 228.882, "x2": 280.908, "y2": 231.64600000000002}, {"id": "line-178", "type": "line", "layer": "lower", "x1": 296, "y1": 285, "x2": 298, "y2": 291}, {"id": "line-185", "type": "line", "layer": "lower", "x1": 312, "y1": 459, "x2": 314.07, "y2": 207.241}, {"id": "line-187", "type": "line", "layer": "lower", "x1": 313, "y1": 208, "x2": 296, "y2": 285}, {"id": "line-208", "type": "line", "layer": "lower", "x1": 179.642, "y1": 132.526, "x2": 190.73, "y2": 131.375}, {"id": "line-209", "type": "line", "layer": "lower", "x1": 191, "y1": 132, "x2": 211, "y2": 114}, {"id": "line-216", "type": "line", "layer": "lower", "x1": 225.622, "y1": 57.215999999999994, "x2": 225.412, "y2": 27.142000000000003}, {"id": "line-227", "type": "line", "layer": "lower", "x1": 211, "y1": 114, "x2": 217.411, "y2": 91.448}, {"id": "line-228", "type": "line", "layer": "lower", "x1": 217.411, "y1": 91.448, "x2": 208.845, "y2": 82.426}, {"id": "line-229", "type": "line", "layer": "lower", "x1": 208.845, "y1": 82.426, "x2": 208.469, "y2": 67.991}, {"id": "line-230", "type": "line", "layer": "lower", "x1": 208.469, "y1": 67.991, "x2": 216.367, "y2": 59.465}, {"id": "line-231", "type": "line", "layer": "lower", "x1": 216.367, "y1": 59.465, "x2": 225.579, "y2": 57.215999999999994}, {"id": "line-233", "type": "line", "layer": "lower", "x1": 276.551, "y1": 25.685000000000002, "x2": 277.27, "y2": 54.341}, {"id": "line-234", "type": "line", "layer": "lower", "x1": 277.27, "y1": 54.341, "x2": 278.574, "y2": 56.980000000000004}, {"id": "line-235", "type": "line", "layer": "lower", "x1": 278.574, "y1": 56.980000000000004, "x2": 288.521, "y2": 59.691}, {"id": "line-236", "type": "line", "layer": "lower", "x1": 288.521, "y1": 59.691, "x2": 299.419, "y2": 58.962}, {"id": "line-237", "type": "line", "layer": "lower", "x1": 299.419, "y1": 58.962, "x2": 302.137, "y2": 56.494}, {"id": "line-238", "type": "line", "layer": "lower", "x1": 302.137, "y1": 56.494, "x2": 289.805, "y2": 28.722}, {"id": "line-239", "type": "line", "layer": "lower", "x1": 289.805, "y1": 28.722, "x2": 284.802, "y2": 24.461}, {"id": "line-240", "type": "line", "layer": "lower", "x1": 284.802, "y1": 24.461, "x2": 276.551, "y2": 25.685000000000002}, {"id": "line-353", "type": "line", "layer": "lower", "x1": 245, "y1": 213, "x2": 264, "y2": 170}, {"id": "line-377", "type": "line", "layer": "lower", "x1": 247, "y1": 139, "x2": 226.746, "y2": 143.136}, {"id": "line-378", "type": "line", "layer": "lower", "x1": 226.746, "y1": 143.136, "x2": 219.324, "y2": 151.23}, {"id": "line-379", "type": "line", "layer": "lower", "x1": 219.324, "y1": 151.23, "x2": 212.837, "y2": 169.254}, {"id": "line-380", "type": "line", "layer": "lower", "x1": 212.837, "y1": 169.254, "x2": 203, "y2": 205}, {"id": "line-395", "type": "line", "layer": "lower", "x1": 139, "y1": 133, "x2": 125, "y2": 63}, {"id": "line-396", "type": "line", "layer": "lower", "x1": 124.705, "y1": 62.72999999999999, "x2": 104.911, "y2": 65.305}, {"id": "line-397", "type": "line", "layer": "lower", "x1": 103, "y1": 65, "x2": 116, "y2": 184}, {"id": "line-402", "type": "line", "layer": "lower", "x1": 139, "y1": 133, "x2": 150, "y2": 133}, {"id": "line-415", "type": "line", "layer": "upper", "x1": 236, "y1": 211, "x2": 255, "y2": 112}, {"id": "line-422", "type": "line", "layer": "upper", "x1": 300, "y1": 113, "x2": 305.115, "y2": 131.868}, {"id": "line-447", "type": "line", "layer": "upper", "x1": 225, "y1": 115, "x2": 207, "y2": 204}, {"id": "line-449", "type": "line", "layer": "lower", "x1": 179, "y1": 132, "x2": 170.102, "y2": 33.459}, {"id": "line-450", "type": "line", "layer": "lower", "x1": 170.102, "y1": 33.459, "x2": 145.237, "y2": 35.535}, {"id": "line-451", "type": "line", "layer": "lower", "x1": 145.237, "y1": 35.535, "x2": 150, "y2": 133}, {"id": "line-453", "type": "line", "layer": "lower", "x1": 116, "y1": 186, "x2": 96, "y2": 75}, {"id": "line-468", "type": "line", "layer": "upper", "x1": 61, "y1": 59, "x2": 73, "y2": 130}, {"id": "hole-004", "type": "hole", "layer": "lower", "x": 116.195, "y": 76.118, "angle": 0, "attack": "lv1"}, {"id": "hole-005", "type": "hole", "layer": "lower", "x": 273.153, "y": 172.285, "angle": 0, "attack": "lv1"}, {"id": "hole-006", "type": "hole", "layer": "lower", "x": 42.496, "y": 260.745, "angle": 0, "releaseMode": "fixed", "releaseAngle": 6.65}, {"id": "circle-001", "type": "circle", "layer": "lower", "cx": 225.088, "cy": 75.052, "r": 9.98}, {"id": "circle-002", "type": "circle", "layer": "lower", "cx": 281.868, "cy": 76.195, "r": 9.98}, {"id": "circle-003", "type": "circle", "layer": "lower", "cx": 257.184, "cy": 128.522, "r": 9.98, "bumperStrength": "strong"}, {"id": "target-002", "type": "target", "layer": "lower", "x": 204.899, "y": 124.01499999999999, "angle": -38.781, "targetGroup": {"id": "targetGroup-003", "members": ["target-002"], "action": "upgrade", "bumpers": ["circle-001", "circle-002", "circle-003"], "repeatExtraBall": true}}, {"id": "target-004", "type": "target", "layer": "lower", "x": 145.184, "y": 137.455, "angle": -1.343, "targetGroup": {"id": "targetGroup-002", "action": "boss", "members": ["target-004", "target-005"], "secondary": {"action": ""}}}, {"id": "target-005", "type": "target", "layer": "lower", "x": 185.697, "y": 135.726, "angle": -5}, {"id": "target-007", "type": "target", "layer": "lower", "x": 274.847, "y": 235.53500000000003, "angle": 20, "targetGroup": {"id": "targetGroup-001", "action": "boss", "members": ["target-007", "target-008"]}}, {"id": "target-008", "type": "target", "layer": "lower", "x": 240.683, "y": 216.61700000000002, "angle": 14.849}, {"id": "flag-001", "type": "flag", "layer": "lower", "x1": 282.91, "y1": 230.793, "x2": 304.794, "y2": 238.757}, {"id": "plunger-001", "type": "plunger", "layer": "lower", "x": 321.72, "y": 422.76199999999994, "angle": 0}, {"id": "circle-051", "type": "circle", "layer": "lower", "cx": 205, "cy": 206, "r": 3.162, "mechanic": "solid-circle"}, {"id": "thickline-001", "type": "thickline", "layer": "lower", "x1": 277, "y1": 28, "x2": 277, "y2": 51, "thickness": 5}, {"id": "thickline-002", "type": "thickline", "layer": "lower", "x1": 251, "y1": 28, "x2": 251, "y2": 51, "thickness": 5}, {"id": "thickline-003", "type": "thickline", "layer": "lower", "x1": 225, "y1": 27, "x2": 225, "y2": 49, "thickness": 5}, {"id": "arc-001", "type": "arc", "layer": "upper", "x1": 53, "y1": 23, "qx": 87, "qy": 18, "x2": 96, "y2": 76}, {"id": "arc-002", "type": "arc", "layer": "upper", "x1": 29, "y1": 104, "qx": 25, "qy": 29, "x2": 52, "y2": 23}, {"id": "arc-003", "type": "arc", "layer": "upper", "x1": 276, "y1": 74, "qx": 326, "qy": 76, "x2": 328, "y2": 130}, {"id": "arc-004", "type": "arc", "layer": "upper", "x1": 276, "y1": 74, "qx": 232, "qy": 76, "x2": 225, "y2": 115}, {"id": "line-536", "type": "line", "layer": "lower", "x1": 331, "y1": 122, "x2": 331, "y2": 467}, {"id": "oneway-001", "type": "oneway", "layer": "lower", "x1": 331, "y1": 172, "x2": 314, "y2": 206, "direction": 1}, {"id": "flag-002", "type": "flag", "layer": "lower", "x1": 90, "y1": 190, "x2": 113, "y2": 187}, {"id": "arc-005", "type": "arc", "layer": "lower", "x1": 298, "y1": 291, "qx": 314, "qy": 303, "x2": 313, "y2": 333}, {"id": "oneway-002", "type": "oneway", "layer": "lower", "x1": 81, "y1": 177, "x2": 113, "y2": 173, "direction": -1, "mechanic": "layer-transition", "fromLayer": "lower", "toLayer": "upper", "bidirectional": true}, {"id": "oneway-003", "type": "oneway", "layer": "lower", "x1": 216, "y1": 177, "x2": 239, "y2": 178, "direction": -1, "mechanic": "layer-transition", "fromLayer": "lower", "toLayer": "upper", "bidirectional": true}, {"id": "flag-003", "type": "flag", "layer": "lower", "x1": 210, "y1": 204, "x2": 233, "y2": 208}, {"id": "line-539", "type": "line", "layer": "lower", "x1": 68, "y1": 103, "x2": 84, "y2": 193}, {"id": "oneway-004", "type": "oneway", "layer": "upper", "x1": 267, "y1": 338, "x2": 289, "y2": 338, "direction": 1, "initialSpeed": 1, "stopOnEntry": false, "mechanic": "layer-transition", "fromLayer": "upper", "toLayer": "lower", "bidirectional": false}, {"id": "oneway-005", "type": "oneway", "layer": "upper", "x1": 95, "y1": 343, "x2": 75, "y2": 343, "direction": -1, "initialSpeed": 1, "stopOnEntry": false, "mechanic": "layer-transition", "fromLayer": "upper", "toLayer": "lower", "bidirectional": false}, {"id": "line-540", "type": "line", "layer": "upper", "x1": 50, "y1": 60, "x2": 48, "y2": 263}, {"id": "line-541", "type": "line", "layer": "upper", "x1": 28, "y1": 75, "x2": 28, "y2": 260}, {"id": "hole-007", "type": "hole", "layer": "lower", "x": 159, "y": 51, "angle": 0, "attack": "lv1"}, {"id": "oneway-006", "type": "oneway", "layer": "lower", "x1": 277, "y1": -6, "x2": 276, "y2": 30, "direction": 1}, {"id": "oneway-007", "type": "oneway", "layer": "lower", "x1": 225, "y1": 25, "x2": 225, "y2": -10, "direction": 1}, {"id": "ublock-002", "type": "ublock", "layer": "lower", "x": 277, "y": 164, "angle": 22.368}, {"id": "arc-007", "type": "arc", "layer": "lower", "x1": 301, "y1": 148, "qx": 293, "qy": 177, "x2": 281, "y2": 231}, {"id": "arc-008", "type": "arc", "layer": "lower", "x1": 68, "y1": 103, "qx": 67, "qy": -10, "x2": 225, "y2": 25}, {"id": "arc-010", "type": "arc", "layer": "lower", "x1": 225, "y1": -6, "qx": 67, "qy": -11, "x2": 46, "y2": 51}, {"id": "arc-011", "type": "arc", "layer": "lower", "x1": 46, "y1": 51, "qx": 31, "qy": 94, "x2": 43, "y2": 248}, {"id": "arc-012", "type": "arc", "layer": "lower", "x1": 225, "y1": -6, "qx": 318, "qy": -10, "x2": 322, "y2": 41}, {"id": "arc-013", "type": "arc", "layer": "lower", "x1": 322, "y1": 41, "qx": 327, "qy": 75, "x2": 331, "y2": 122}, {"id": "arc-014", "type": "arc", "layer": "lower", "x1": 269, "y1": 129, "qx": 305, "qy": 138, "x2": 301, "y2": 148}, {"id": "line-544", "type": "line", "layer": "lower", "x1": 236, "y1": 212, "x2": 249, "y2": 145}, {"id": "arc-015", "type": "arc", "layer": "upper", "x1": 61, "y1": 58, "qx": 54, "qy": 47, "x2": 50, "y2": 61}, {"id": "line-545", "type": "line", "layer": "upper", "x1": 73, "y1": 130, "x2": 84, "y2": 192}, {"id": "line-546", "type": "line", "layer": "upper", "x1": 96, "y1": 75, "x2": 116, "y2": 186}, {"id": "arc-016", "type": "arc", "layer": "lower", "x1": 225, "y1": -6, "qx": 142, "qy": -11, "x2": 84, "y2": 12}, {"id": "arc-017", "type": "arc", "layer": "lower", "x1": 92, "y1": 38, "qx": 132, "qy": 3, "x2": 225, "y2": 25}, {"id": "line-547", "type": "line", "mechanic": "guided-rail", "trackWidth": 18, "showAboveArt": true, "visualOnly": true, "layer": "upper", "x1": 38, "y1": 52, "x2": 38, "y2": 250}, {"id": "sensor-001", "type": "sensor", "layer": "upper", "x1": 30, "y1": 49, "x2": 48, "y2": 49, "attack": "lv3", "attackCount": 3}, {"id": "arc-018", "type": "arc", "mechanic": "guided-rail", "trackWidth": 18, "showAboveArt": true, "layer": "upper", "x1": 38, "y1": 249, "qx": 39.25, "qy": 275.25, "x2": 69, "y2": 290}, {"id": "arc-019", "type": "arc", "mechanic": "guided-rail", "trackWidth": 18, "showAboveArt": true, "layer": "upper", "x1": 69, "y1": 290, "qx": 85, "qy": 299, "x2": 86, "y2": 338}, {"id": "line-549", "type": "line", "mechanic": "guided-rail", "trackWidth": 18, "showAboveArt": true, "layer": "upper", "x1": 316, "y1": 131, "x2": 322, "y2": 227}, {"id": "arc-020", "type": "arc", "mechanic": "guided-rail", "trackWidth": 18, "showAboveArt": true, "layer": "upper", "x1": 321, "y1": 227, "qx": 321, "qy": 258, "x2": 301, "y2": 273}, {"id": "arc-021", "type": "arc", "mechanic": "guided-rail", "trackWidth": 18, "showAboveArt": true, "layer": "upper", "x1": 302, "y1": 273, "qx": 279, "qy": 284, "x2": 279, "y2": 336}, {"id": "arc-022", "type": "arc", "layer": "lower", "x1": 121.794, "y1": 436.35, "qx": 124.075, "qy": 436.922, "x2": 124.085, "y2": 434.242}, {"id": "arc-023", "type": "arc", "layer": "lower", "x1": 127.125, "y1": 429.417, "qx": 130.703, "qy": 428.479, "x2": 129.21699999999998, "y2": 425.924}, {"id": "arc-025", "type": "arc", "layer": "lower", "x1": 71.949, "y1": 407.059, "qx": 73.667, "qy": 408.966, "x2": 76.783, "y2": 408.295}, {"id": "line-555", "type": "line", "layer": "lower", "x1": 76.783, "y1": 408.295, "x2": 79.537, "y2": 408.685}, {"id": "line-556", "type": "line", "layer": "lower", "x1": 79.537, "y1": 408.685, "x2": 84.261, "y2": 410.467}, {"id": "line-557", "type": "line", "layer": "lower", "x1": 84.261, "y1": 410.467, "x2": 121, "y2": 436}, {"id": "arc-026", "type": "arc", "layer": "lower", "x1": 234.637, "y1": 426.043, "qx": 233.525, "qy": 428.5, "x2": 236.845, "y2": 429.325}, {"id": "arc-027", "type": "arc", "layer": "lower", "x1": 239.517, "y1": 432.954, "qx": 239.572, "qy": 437.336, "x2": 242.775, "y2": 435.942}, {"id": "line-558", "type": "line", "layer": "lower", "x1": 242, "y1": 436, "x2": 286, "y2": 405}, {"id": "arc-028", "type": "arc", "layer": "lower", "x1": 285.295, "y1": 406.194, "qx": 289.802, "qy": 401.604, "x2": 290.013, "y2": 395.047}, {"id": "arc-029", "type": "arc", "layer": "lower", "x1": 288, "y1": 375, "qx": 288, "qy": 389, "x2": 281, "y2": 394}, {"id": "line-559", "type": "line", "layer": "lower", "x1": 281, "y1": 394, "x2": 234.637, "y2": 426.043}, {"id": "line-568", "type": "line", "layer": "top", "x1": 308.055, "y1": 321.534, "x2": 309, "y2": 465}, {"id": "arc-030", "type": "arc", "layer": "top", "x1": 308, "y1": 322, "qx": 307, "qy": 303, "x2": 296, "y2": 294}, {"id": "line-569", "type": "line", "layer": "lower", "x1": 48, "y1": 465, "x2": 50, "y2": 275}, {"id": "flipper-003", "type": "flipper", "layer": "lower", "x": 217.222, "y": 444.985, "angle": -211.5}, {"id": "flipper-004", "type": "flipper", "layer": "lower", "x": 147.755, "y": 445.063, "angle": 31.5}, {"id": "centerPost-001", "type": "centerPost", "layer": "lower", "x": 182, "y": 463, "angle": 0, "triggerRollovers": ["rollover-002", "rollover-001"]}, {"id": "line-574", "type": "line", "layer": "lower", "mechanic": "rescue-kicker", "side": "left", "aim": [57, 412], "direction": [0, -1], "speed": 600, "x1": 44.5, "y1": 450, "x2": 69.5, "y2": 450}, {"id": "oneway-008", "type": "oneway", "layer": "lower", "mechanic": "rescue-return", "side": "left", "x1": 50, "y1": 416, "x2": 68.5, "y2": 429.5, "direction": -1}, {"id": "oneway-009", "type": "oneway", "layer": "lower", "mechanic": "rescue-return", "side": "right", "x1": 291, "y1": 429, "x2": 307, "y2": 418, "direction": -1}, {"id": "thickline-006", "type": "thickline", "layer": "lower", "x1": 287, "y1": 435, "x2": 292, "y2": 455, "thickness": 5}, {"id": "thickline-007", "type": "thickline", "layer": "lower", "x1": 111, "y1": 460, "x2": 71, "y2": 435, "thickness": 5}, {"id": "thickline-008", "type": "thickline", "layer": "lower", "x1": 71, "y1": 455, "x2": 71, "y2": 435, "thickness": 5}, {"id": "thickline-009", "type": "thickline", "layer": "lower", "x1": 287, "y1": 435, "x2": 247, "y2": 460, "thickness": 5}, {"id": "rollover-001", "type": "rollover", "layer": "lower", "x1": 93, "y1": 370, "x2": 77, "y2": 370, "rolloverGroup": {"id": "rolloverGroup-001", "members": ["rollover-001", "rollover-002"], "attack": "none", "attackCount": 1}}, {"id": "rollover-002", "type": "rollover", "layer": "lower", "x1": 269, "y1": 369, "x2": 285, "y2": 369}, {"id": "rollover-003", "type": "rollover", "layer": "lower", "x1": 224, "y1": 38, "x2": 251, "y2": 38}, {"id": "rollover-004", "type": "rollover", "layer": "lower", "x1": 252, "y1": 38, "x2": 279, "y2": 38, "rolloverGroup": {"id": "rolloverGroup-002", "members": ["rollover-004", "rollover-003"], "attack": "lv2", "attackCount": 1, "laneChange": true}}, {"id": "line-575", "type": "line", "layer": "lower", "mechanic": "rescue-kicker", "side": "right", "aim": [299, 411], "direction": [0, -1], "speed": 600, "x1": 286.5, "y1": 449, "x2": 311.5, "y2": 449}, {"id": "thickline-010", "type": "thickline", "layer": "lower", "x1": 289, "y1": 326, "x2": 288, "y2": 398, "thickness": 5}, {"id": "thickline-011", "type": "thickline", "layer": "lower", "x1": 74, "y1": 330, "x2": 74, "y2": 406, "thickness": 5}, {"id": "line-576", "type": "line", "layer": "lower", "x1": 207, "y1": 204, "x2": 214, "y2": 168}, {"id": "blockhole-001", "type": "blockhole", "layer": "lower", "x": 183, "y": 308, "angle": 0, "attractionRadius": 68}, {"id": "arc-031", "type": "arc", "layer": "upper", "x1": 255, "y1": 112, "qx": 278, "qy": 87, "x2": 300, "y2": 113}, {"id": "ublock-003", "type": "ublock", "layer": "lower", "x": 32, "y": 265, "angle": 251.67}, {"id": "hole-008", "type": "hole", "layer": "upper", "x": 38, "y": 198, "angle": 0, "attractionRadius": 24, "exitHole": "hole-006"}, {"id": "line-577", "type": "line", "layer": "upper", "x1": 106, "y1": 128, "x2": 95, "y2": 67}, {"id": "sensor-002", "type": "sensor", "layer": "upper", "x1": 325, "y1": 123, "x2": 307, "y2": 125, "attack": "lv3", "attackCount": 3}, {"id": "line-578", "type": "line", "layer": "top", "x1": 129, "y1": 469, "x2": 49, "y2": 416}, {"id": "line-579", "type": "line", "layer": "top", "x1": 48, "y1": 415, "x2": 0, "y2": 415}, {"id": "line-580", "type": "line", "layer": "top", "x1": 226, "y1": 468, "x2": 309, "y2": 416}, {"id": "line-581", "type": "line", "layer": "top", "x1": 309, "y1": 416, "x2": 360, "y2": 416}, {"id": "circle-056", "type": "circle", "layer": "top", "cx": 300, "cy": 436, "r": 7.28, "mechanic": "solid-circle"}, {"id": "circle-057", "type": "circle", "layer": "top", "cx": 57, "cy": 436, "r": 7.28, "mechanic": "solid-circle"}, {"id": "triangleLeft-001", "type": "triangleLeft", "layer": "lower", "x": 112, "y": 362, "angle": 0}, {"id": "triangleRight-001", "type": "triangleRight", "layer": "lower", "x": 249, "y": 360, "angle": 0}, {"id": "line-582", "type": "line", "layer": "lower", "x1": 103, "y1": 331, "x2": 128, "y2": 390, "reboundStrength": "strong", "mechanic": "active-rebound"}, {"id": "line-583", "type": "line", "layer": "lower", "x1": 258, "y1": 328, "x2": 233, "y2": 389, "reboundStrength": "strong", "mechanic": "active-rebound"}, {"id": "sensor-003", "type": "sensor", "layer": "upper", "x1": 27, "y1": 231, "x2": 50, "y2": 231}, {"id": "line-584", "type": "line", "layer": "lower", "x1": 129.21699999999998, "y1": 425.924, "x2": 87, "y2": 398}, {"id": "arc-032", "type": "arc", "layer": "lower", "x1": 87, "y1": 398, "qx": 78.226, "qy": 392.834, "x2": 75.32900000000001, "y2": 381.609}], "gravityRegions": [{"id": "gravityZone-002", "type": "gravityZone", "layer": "lower", "x": 154.5, "y": 15.553935860058308, "angle": 0, "width": 141, "height": 44.89212827988338, "outline": [[0.5, -0.4801272892583453], [0.4880051456101328, -0.48233536822964024], [0.47604721436989894, -0.48441356020262366], [0.4641262062792984, -0.4863618651772957], [0.45224212133833114, -0.4881802831536563], [0.4403949595469974, -0.4898688141317054], [0.4285847209052966, -0.49142745811144306], [0.4168114054132291, -0.4928562150928692], [0.4050750130707951, -0.49415508507598394], [0.393375543877994, -0.4953240680607871], [0.38171299783482665, -0.4963631640472789], [0.3700873749412922, -0.4972723730354591], [0.3584986751973908, -0.498051695025328], [0.3469468986031234, -0.49870113001688526], [0.33543204515848923, -0.49922067801013126], [0.32395411486348763, -0.4996103390050656], [0.3125131077181199, -0.49987011300168854], [0.30110902372238535, -0.5], [0.28974186287628384, -0.5], [0.2784116251798159, -0.49987011300168854], [0.267118310632981, -0.4996103390050656], [0.2558619192357795, -0.49922067801013115], [0.24464245098821127, -0.49870113001688526], [0.23345990589027615, -0.498051695025328], [0.22231428394197453, -0.4972723730354591], [0.21120558514330623, -0.4963631640472789], [0.20013380949427084, -0.4953240680607871], [0.18909895699486937, -0.49415508507598394], [0.1781010276451006, -0.4928562150928692], [0.16714002144496537, -0.49142745811144306], [0.1562159383944632, -0.4898688141317054], [0.1453287784935946, -0.4881802831536563], [0.1344785417423593, -0.4863618651772958], [0.12366522814075707, -0.48441356020262366], [0.11288883768878819, -0.48233536822964024], [0.1021493703864522, -0.4801272892583452], [0.09144682623375035, -0.47778932328873874], [0.08078120523068119, -0.47532147032082084], [0.07015250737724534, -0.47272373035459153], [0.05956073267344281, -0.46999610339005066], [0.049005881119273384, -0.4671385894271983], [0.03848795271473768, -0.4641511884660346], [0.02800694745983488, -0.46103390050655924], [0.017562865354565593, -0.4577867255487726], [0.007155706398929217, -0.4544096635926743], [-0.00321452940707304, -0.4509027146382647], [-0.013547842063442993, -0.4472658786855435], [-0.02384423157017903, -0.443499155734511], [-0.034103697927282156, -0.43960254578516694], [-0.044326241134751775, -0.4355760488375114], [-0.05451186119258828, -0.4314196648915443], [-0.06466055810079147, -0.42713339394726585], [-0.07477233185936115, -0.4227172360046759], [-0.08484718246829792, -0.41817119106377454], [-0.09488510992760117, -0.41349525912456164], [-0.10488611423727112, -0.4086894401870373], [-0.11485019539730774, -0.4037537342512014], [-0.12477735340771128, -0.39868814131705416], [-0.1346675882684815, -0.39349266138459543], [-0.14452089997961837, -0.3881672944538252], [-0.15433728854112197, -0.38271204052474345], [-0.16411675395299244, -0.3771268995973503], [-0.1738592962152294, -0.3714118716716456], [-0.18356491532783326, -0.3655669567476295], [-0.1932336112908038, -0.35959215482530205], [-0.2028653841041409, -0.35348746590466296], [-0.21246023376784492, -0.3472528899857124], [-0.22201816028191573, -0.34088842706845046], [-0.23153916364635302, -0.334394077152877], [-0.24102324386115712, -0.3277698402389921], [-0.250470400926328, -0.32101571632679565], [-0.2598806348418654, -0.3141317054162878], [-0.2692539456077699, -0.3071178075074685], [-0.2785903332240408, -0.2999740226003377], [-0.2878897976906784, -0.2927003506948955], [-0.29715233900768295, -0.28529679179114176], [-0.3063779571750541, -0.27776334588907653], [-0.315566652192792, -0.27010001298869984], [-0.32471842406089657, -0.2623067930900117], [-0.33383327277936786, -0.2543836861930121], [-0.342911198348206, -0.24633069229770096], [-0.35195220076741074, -0.2381478114040784], [-0.36095628003698216, -0.2298350435121444], [-0.36992343615692036, -0.22139238862189886], [-0.3788536691272253, -0.21281984673334203], [-0.387746978947897, -0.20411741784647358], [-0.39660336561893533, -0.19528510196129367], [-0.4054228291403405, -0.1863228990778023], [-0.4142053695121123, -0.17723080919599948], [-0.42295098673425086, -0.16800883231588515], [-0.431659680806756, -0.15865696843745938], [-0.44033145172962807, -0.14917521756072213], [-0.4489662995028667, -0.1395635796856734], [-0.4575642241264722, -0.12982205481231324], [-0.46612522560044417, -0.11995064294064166], [-0.47464930392478305, -0.10994934407065857], [-0.4831364590994887, -0.09981815820236395], [-0.49158669112456094, -0.08955708533575787], [-0.5, -0.07916612547084036], [-0.4432624113475177, 0.5], [-0.4375510638297872, 0.4845340368879074], [-0.43176453900709216, 0.46932201584621375], [-0.42590283687943264, 0.4543639368749187], [-0.4199659574468085, 0.43965979997402266], [-0.4139539007092198, 0.42520960514352507], [-0.4078666666666667, 0.41101335238342646], [-0.4017042553191489, 0.3970710416937265], [-0.3954666666666666, 0.38338267307442525], [-0.38915390070921974, 0.3699482465255229], [-0.3827659574468084, 0.3567677620470191], [-0.3763028368794326, 0.3438412196389142], [-0.3697645390070923, 0.331168619301208], [-0.36315106382978724, 0.3187499610339005], [-0.35646241134751777, 0.3065852448369918], [-0.3496985815602837, 0.29467447071048186], [-0.3428595744680852, 0.28301763865437063], [-0.335945390070922, 0.2716147486686582], [-0.32895602836879423, 0.2604658007533447], [-0.3218914893617021, 0.24957079490842984], [-0.31475177304964524, 0.23892973113391364], [-0.30753687943262414, 0.2285426094297962], [-0.30024680851063823, 0.2184094297960775], [-0.29288156028368795, 0.20853019223275757], [-0.2854411347517731, 0.19890489673983638], [-0.2779255319148936, 0.18953354331731395], [-0.2703347517730496, 0.18041613196519027], [-0.26266879432624124, 0.17155266268346536], [-0.2549276595744681, 0.16294313547213926], [-0.24711134751773056, 0.1545875503312118], [-0.2392198581560285, 0.1464859072606832], [-0.23125319148936183, 0.13863820626055326], [-0.22321134751773053, 0.1310444473308221], [-0.21509432624113484, 0.12370463047148972], [-0.20690212765957453, 0.11661875568255606], [-0.1986347517730496, 0.10978682296402137], [-0.19029219858156024, 0.10320883231588514], [-0.1818744680851063, 0.09688478373814786], [-0.17338156028368792, 0.09081467723080923], [-0.16481347517730494, 0.0849985127938694], [-0.15617021276595752, 0.07943629042732826], [-0.1474517730496453, 0.07412801013118593], [-0.13865815602836887, 0.06907367190544232], [-0.1297893617021276, 0.0642732757500975], [-0.12084539007092195, 0.0597268216651514], [-0.11182624113475166, 0.055434309650604], [-0.10273191489361697, 0.05139573970645541], [-0.09356241134751785, 0.04761111183270561], [-0.08431773049645393, 0.04408042602935452], [-0.07499787234042558, 0.04080368229640215], [-0.06560283687943262, 0.037780880633848574], [-0.05613262411347505, 0.03501202104169371], [-0.046587234042553265, 0.032497103519937724], [-0.03696666666666666, 0.03023612806858037], [-0.02727092198581564, 0.028229094687621734], [-0.017499999999999807, 0.02647600337706197], [-0.007653900709219758, 0.02497685413690092], [0.0022673758865249054, 0.02373164696713859], [0.012263829787233983, 0.02274038186777513], [0.022335460992907678, 0.022003058838810225], [0.032482269503545984, 0.021519677880244278], [0.04270425531914891, 0.021290238992076962], [0.05300141843971645, 0.021314742174308364], [0.06337375886524821, 0.02159318742693856], [0.07382127659574478, 0.022125574749967552], [0.08434397163120576, 0.022911904143395334], [0.09494184397163116, 0.023952175607221755], [0.10561489361702138, 0.02524638914144697], [0.11636312056737601, 0.02679454474607098], [0.12718652482269485, 0.028596642421093627], [0.13808510638297872, 0.030652682166515146], [0.14905886524822698, 0.03296266398233538], [0.1601078014184397, 0.03552658786855441], [0.171231914893617, 0.03834445382517207], [0.18243120567375892, 0.041416261852188614], [0.19370567375886524, 0.044742011949603866], [0.2050553191489362, 0.04832170411741783], [0.21648014184397157, 0.0521553383556306], [0.22798014184397156, 0.05624291466424215], [0.23955531914893635, 0.06058443304325243], [0.2512056737588654, 0.0651798934926615], [0.262931205673759, 0.0700292960124692], [0.2747319148936168, 0.0751326406026757], [0.28660780141843967, 0.08048992726328098], [0.2985588652482268, 0.08610115599428492], [0.3105851063829784, 0.09196632679568771], [0.32268652482269516, 0.09808543966748931], [0.33486312056737605, 0.10445849460968955], [0.3471148936170214, 0.11108549162228865], [0.35944184397163115, 0.11796643070528647], [0.37184397163120575, 0.12510131185868292], [0.3843212765957447, 0.13249013508247826], [0.3968737588652481, 0.1401329003766723], [0.4095014184397165, 0.14802960774126514], [0.42220425531914896, 0.1561802571762567], [0.4349822695035462, 0.16458484868164697], [0.44783546099290783, 0.17324338225743605], [0.4607638297872339, 0.18215585790362382], [0.4737673758865248, 0.1913222756202104], [0.4868460992907801, 0.20074263540719567], [0.5, 0.21041693726457986]], "bridges": [[[-0.5, -0.07916612547084036], [-0.4432624113475177, 0.5]], [[0.5, 0.21041693726457986], [0.5, -0.4801272892583453]]], "gravityDirection": "right", "gravityStrength": 50}, {"id": "gravityZone-003", "type": "gravityZone", "layer": "upper", "x": 79.5, "y": 76.3015873015873, "angle": 0, "width": 53, "height": 107.39682539682539, "outline": [[-0.3490566037735849, -0.1610996157256873], [-0.12264150943396226, 0.5], [0.5, 0.4813774756133609], [0.29245283018867924, -0.08660951817913097], [0.3113207547169811, -0.002808158439255122], [0.30581107355590736, -0.019804906887378196], [0.30006370123171544, -0.03650605971031633], [0.2940786377444061, -0.052911616908069774], [0.28785588309397836, -0.06902157848063854], [0.2813954372804329, -0.0848359444280225], [0.2746973003037696, -0.10035471475022177], [0.2677614721639881, -0.11557788944723624], [0.26058795286108866, -0.13050546851906597], [0.25317674239507104, -0.14513745196571098], [0.24552784076593606, -0.15947383978717122], [0.2376412479736829, -0.1735146319834467], [0.22951696401831156, -0.18725982855453743], [0.22115498889982257, -0.2007094295004435], [0.21255532261821566, -0.21386343482116466], [0.20371796517349058, -0.22672184451670122], [0.19464291656564786, -0.23928465858705297], [0.18533017679468694, -0.25155187703222004], [0.17577974586060838, -0.26352349985220225], [0.16599162376341164, -0.27519952704699974], [0.15596581050309727, -0.2865799586166125], [0.1457023060796647, -0.2976647945610405], [0.1352011104931142, -0.3084540348802838], [0.12446222374344555, -0.3189476795743424], [0.11348564583065925, -0.3291457286432162], [0.10227137675475476, -0.3390481820869052], [0.09081941651573262, -0.34865503990540947], [0.07912976511359258, -0.357966302098729], [0.06720242254833463, -0.3669819686668638], [0.05503738881995848, -0.37570203960981385], [0.04263466392846443, -0.3841265149275791], [0.029994247873852457, -0.3922553946201597], [0.01711614065612231, -0.4000886786875555], [0.004000342275274784, -0.4076263671297665], [-0.009353147268690654, -0.41486845994679283], [-0.02294432797577454, -0.42181495713863437], [-0.036773199845976344, -0.4284658587052913], [-0.05083976287929579, -0.4348211646467633], [-0.06514401707573315, -0.4408808749630506], [-0.07968596243528869, -0.4466449896541531], [-0.09446559895796215, -0.452113508720071], [-0.10948292664375325, -0.45728643216080406], [-0.12473794549266226, -0.46216375997635234], [-0.14023065550468972, -0.46674549216671596], [-0.15596105667983512, -0.47103162873189486], [-0.17192914901809786, -0.4750221696718889], [-0.1881349325194788, -0.4787171149866982], [-0.20457840718397766, -0.4821164646763229], [-0.22125957301159468, -0.4852202187407627], [-0.2381784300023296, -0.4880283771800178], [-0.25533497815618195, -0.4905409399940881], [-0.2727292174731527, -0.49275790718297374], [-0.29036114795324164, -0.4946792787466746], [-0.30823076959644785, -0.4963050546851907], [-0.32633808240277234, -0.497635234998522], [-0.3446830863722148, -0.4986698196866687], [-0.3632657815047753, -0.49940880874963056], [-0.3820861678004535, -0.49985220218740767], [-0.4011442452592495, -0.5], [-0.42044001388116375, -0.49985220218740767], [-0.43997347366619616, -0.49940880874963056], [-0.4597446246143462, -0.4986698196866687], [-0.479753466725614, -0.497635234998522], [-0.5, -0.4963050546851907]], "bridges": [[[-0.12264150943396226, 0.5], [0.5, 0.4813774756133609]], [[0.29245283018867924, -0.08660951817913097], [0.3113207547169811, -0.002808158439255122]], [[-0.5, -0.4963050546851907], [-0.3490566037735849, -0.1610996157256873]]], "gravityDirection": "up", "gravityStrength": 50}], "lockedLayout": [], "upperLayout": [], "topLayout": [], "templates": {"hole": {"label": "Hole", "width": 12, "height": 12, "markup": "<circle r=\"5.5\" fill=\"#08121d\"/><circle r=\"3.4\" stroke-dasharray=\"1 1\"/>"}, "target": {"label": "單顆 target", "width": 13, "height": 3, "markup": "<polygon points=\"-6.0000,0.6000 -6.0000,-0.6000 -5.9991,-0.6273 -5.9963,-0.6545 -5.9916,-0.6814 -5.9852,-0.7079 -5.9769,-0.7340 -5.9669,-0.7594 -5.9552,-0.7840 -5.9418,-0.8078 -5.9268,-0.8307 -5.9103,-0.8524 -5.8923,-0.8730 -5.8730,-0.8923 -5.8524,-0.9103 -5.8307,-0.9268 -5.8078,-0.9418 -5.7840,-0.9552 -5.7594,-0.9669 -5.7340,-0.9769 -5.7079,-0.9852 -5.6814,-0.9916 -5.6545,-0.9963 -5.6273,-0.9991 -5.6000,-1.0000 5.6000,-1.0000 5.6273,-0.9991 5.6545,-0.9963 5.6814,-0.9916 5.7079,-0.9852 5.7340,-0.9769 5.7594,-0.9669 5.7840,-0.9552 5.8078,-0.9418 5.8307,-0.9268 5.8524,-0.9103 5.8730,-0.8923 5.8923,-0.8730 5.9103,-0.8524 5.9268,-0.8307 5.9418,-0.8078 5.9552,-0.7840 5.9669,-0.7594 5.9769,-0.7340 5.9852,-0.7079 5.9916,-0.6814 5.9963,-0.6545 5.9991,-0.6273 6.0000,-0.6000 6.0000,0.6000 5.9991,0.6273 5.9963,0.6545 5.9916,0.6814 5.9852,0.7079 5.9769,0.7340 5.9669,0.7594 5.9552,0.7840 5.9418,0.8078 5.9268,0.8307 5.9103,0.8524 5.8923,0.8730 5.8730,0.8923 5.8524,0.9103 5.8307,0.9268 5.8078,0.9418 5.7840,0.9552 5.7594,0.9669 5.7340,0.9769 5.7079,0.9852 5.6814,0.9916 5.6545,0.9963 5.6273,0.9991 5.6000,1.0000 -5.6000,1.0000 -5.6273,0.9991 -5.6545,0.9963 -5.6814,0.9916 -5.7079,0.9852 -5.7340,0.9769 -5.7594,0.9669 -5.7840,0.9552 -5.8078,0.9418 -5.8307,0.9268 -5.8524,0.9103 -5.8730,0.8923 -5.8923,0.8730 -5.9103,0.8524 -5.9268,0.8307 -5.9418,0.8078 -5.9552,0.7840 -5.9669,0.7594 -5.9769,0.7340 -5.9852,0.7079 -5.9916,0.6814 -5.9963,0.6545 -5.9991,0.6273 -6.0000,0.6000\" fill=\"#3e6373\"/>"}, "flag": {"label": "旗幟線", "width": 14, "height": 2, "markup": "<line x1=\"-7\" y1=\"0\" x2=\"7\" y2=\"0\" fill=\"none\" stroke=\"#e6a5ea\" stroke-width=\"1.8\" stroke-linecap=\"round\"/>"}, "plunger": {"label": "發球區", "width": 20, "height": 8, "markup": "<rect x=\"-10\" y=\"-4\" width=\"20\" height=\"8\" fill=\"#b78a43\"/><path d=\"M0 3V-3M-2 -1L0 -3L2 -1\" fill=\"none\"/>"}, "ublock": {"label": "ㄇ形阻擋物", "width": 25, "height": 23, "markup": "<path d=\"M-12 11V-11H12V11H9V-8H-9V11Z\" fill=\"#455e6b\"/>"}, "flipper": {"label": "Flipper", "width": 50.72938359896286, "height": 14.061202228069305, "markup": "<path d=\"M-18.33409068544678 -6.530601114034653 L20.805223887761155 -4.059467911720276 A4.059467911720276 4.059467911720276 0 0 1 20.805223887761155 4.059467911720276 L-18.33409068544678 6.530601114034653 A6.530601114034653 6.530601114034653 0 0 1 -18.33409068544678 -6.530601114034653 Z\" fill=\"#355b73\"/><circle cx=\"-18.33409068544678\" cy=\"0\" r=\"1.8\" fill=\"#79cafa\"/>"}, "centerPost": {"label": "Center post", "width": 10, "height": 10, "markup": "<circle r=\"5\" fill=\"#263945\"/><circle r=\"3.3\" fill=\"none\"/><path d=\"M-2 0H2M0 -2V2\"/>"}, "blockhole": {"label": "Blockhole（水渦中心）", "width": 12, "height": 12, "markup": "<circle r=\"5.5\" fill=\"#08121d\"/><path d=\"M-4 0a4 4 0 1 1 4 4a2.5 2.5 0 1 1 2.5-2.5a1 1 0 1 1-1-1\" fill=\"none\"/>"}, "triangleLeft": {"label": "左三角反彈板", "width": 35.08249580091237, "height": 72.41790906161242, "markup": "<polygon points=\"10.61278,26.39388 -10.35096,-24.57421 -10.39177,-24.68335 -10.42544,-24.79490 -10.45182,-24.90839 -10.47079,-25.02336 -10.48230,-25.13931 -10.48627,-25.25576 -10.48270,-25.37222 -10.47161,-25.48821 -10.45304,-25.60324 -10.42706,-25.71682 -10.39378,-25.82849 -10.35335,-25.93777 -10.30594,-26.04421 -8.17578,-30.43768 -8.12648,-30.54878 -8.08478,-30.66295 -8.05089,-30.77967 -8.02495,-30.89841 -8.00708,-31.01863 -7.99737,-31.13979 -7.99585,-31.26132 -8.00255,-31.38268 -8.01741,-31.50331 -8.04038,-31.62267 -8.07136,-31.74020 -8.66894,-33.73214 -8.70830,-33.84871 -8.75553,-33.96232 -8.81041,-34.07243 -8.87268,-34.17854 -8.94206,-34.28014 -9.01821,-34.37677 -9.10079,-34.46797 -9.18940,-34.55332 -9.28364,-34.63241 -9.38306,-34.70488 -9.48720,-34.77039 -9.59557,-34.82864 -9.70767,-34.87934 -11.39358,-35.57354 -11.49940,-35.61328 -11.60751,-35.64630 -11.71748,-35.67246 -11.82887,-35.69167 -11.94125,-35.70385 -12.05417,-35.70895 -12.16719,-35.70696 -12.27987,-35.69787 -12.39175,-35.68173 -14.11435,-35.37774 -14.22823,-35.35383 -14.34033,-35.32261 -14.45017,-35.28420 -14.55730,-35.23879 -14.66127,-35.18654 -14.76165,-35.12769 -14.85802,-35.06247 -14.94998,-34.99117 -15.03713,-34.91407 -15.11912,-34.83150 -15.19561,-34.74381 -15.26626,-34.65136 -16.25131,-33.27227 -16.31885,-33.17060 -16.37934,-33.06458 -16.43251,-32.95471 -16.47811,-32.84149 -16.51593,-32.72543 -16.54580,-32.60708 -16.56758,-32.48698 -16.58116,-32.36568 -16.58650,-32.24373 -17.04125,14.05051 -17.03816,14.17503 -17.02647,14.29903 -17.00624,14.42192 -16.97755,14.54312 -16.94055,14.66205 -16.89542,14.77814 -16.84236,14.89082 -16.78164,14.99957 -14.84945,18.19503 -14.78951,18.28762 -14.72401,18.37637 -14.65320,18.46095 -14.57734,18.54102 -14.49672,18.61630 -14.41164,18.68650 -14.32242,18.75136 9.21820,34.78485 9.32053,34.84962 9.42698,34.90736 9.53707,34.95781 9.65030,35.00074 9.76617,35.03596 9.88414,35.06332 12.99505,35.67512 13.11063,35.69397 13.22718,35.70526 13.34423,35.70895 13.46127,35.70503 13.57780,35.69350 13.69334,35.67441 13.80739,35.64786 13.91948,35.61394 14.02912,35.57281 14.13586,35.52463 14.23923,35.46962 14.33882,35.40800 14.43418,35.34004 14.52492,35.26602 15.83137,34.12760 15.92091,34.04405 16.00457,33.95460 16.08194,33.85967 16.15269,33.75970 16.21647,33.65515 16.27299,33.54651 16.32200,33.43427 16.36326,33.31896 16.39658,33.20111 16.98971,30.79362 17.01475,30.67486 17.03173,30.55468 17.04058,30.43364 17.04125,30.31226 17.03374,30.19113 17.01808,30.07077 16.99434,29.95174 16.96264,29.83458 16.92312,29.71982 16.87595,29.60799 16.82135,29.49959 16.75957,29.39512 16.69089,29.29505 16.61563,29.19983 15.65098,28.06065 15.57229,27.97365 15.48810,27.89195 15.39877,27.81591 15.30468,27.74585 15.20622,27.68207 15.10382,27.62484 14.99791,27.57440 14.88894,27.53096 14.77737,27.49472 14.66367,27.46582 14.54834,27.44438 14.43185,27.43051 14.31471,27.42425 14.19740,27.42564 12.35738,27.50741 12.23491,27.50868 12.11264,27.50162 11.99113,27.48626 11.87095,27.46267 11.75264,27.43097 11.63677,27.39130 11.52387,27.34383 11.41445,27.28880 11.30903,27.22646 11.20810,27.15709 11.11211,27.08102 11.02152,26.99860 10.93674,26.91021 10.85817,26.81625 10.78618,26.71718 10.72108,26.61343 10.66319,26.50550 10.61278,26.39388\" fill=\"#694d49\"/>"}, "triangleRight": {"label": "右三角反彈板", "width": 35.082495800912426, "height": 72.41790906161242, "markup": "<polygon points=\"10.35096,-24.57421 -10.61278,26.39388 -10.66319,26.50550 -10.72108,26.61343 -10.78618,26.71718 -10.85817,26.81625 -10.93674,26.91021 -11.02152,26.99860 -11.11211,27.08102 -11.20810,27.15709 -11.30903,27.22646 -11.41445,27.28880 -11.52387,27.34383 -11.63677,27.39130 -11.75264,27.43097 -11.87095,27.46267 -11.99113,27.48626 -12.11264,27.50162 -12.23491,27.50868 -12.35738,27.50741 -14.19740,27.42564 -14.31471,27.42425 -14.43185,27.43051 -14.54834,27.44438 -14.66367,27.46582 -14.77737,27.49472 -14.88894,27.53096 -14.99791,27.57440 -15.10382,27.62484 -15.20622,27.68207 -15.30468,27.74585 -15.39877,27.81591 -15.48810,27.89195 -15.57229,27.97365 -15.65098,28.06065 -16.61563,29.19983 -16.69089,29.29505 -16.75957,29.39512 -16.82135,29.49959 -16.87595,29.60799 -16.92312,29.71982 -16.96264,29.83458 -16.99434,29.95174 -17.01808,30.07077 -17.03374,30.19113 -17.04125,30.31226 -17.04058,30.43364 -17.03173,30.55468 -17.01475,30.67486 -16.98971,30.79362 -16.39658,33.20111 -16.36326,33.31896 -16.32200,33.43427 -16.27299,33.54651 -16.21647,33.65515 -16.15269,33.75970 -16.08194,33.85967 -16.00457,33.95460 -15.92091,34.04405 -15.83137,34.12760 -14.52492,35.26602 -14.43418,35.34004 -14.33882,35.40800 -14.23923,35.46962 -14.13586,35.52463 -14.02912,35.57281 -13.91948,35.61394 -13.80739,35.64786 -13.69334,35.67441 -13.57780,35.69350 -13.46127,35.70503 -13.34423,35.70895 -13.22718,35.70526 -13.11063,35.69397 -12.99505,35.67512 -9.88414,35.06332 -9.76617,35.03596 -9.65030,35.00074 -9.53707,34.95781 -9.42698,34.90736 -9.32053,34.84962 -9.21820,34.78485 14.32242,18.75136 14.41164,18.68650 14.49672,18.61630 14.57734,18.54102 14.65320,18.46095 14.72401,18.37637 14.78951,18.28762 14.84945,18.19503 16.78164,14.99957 16.84236,14.89082 16.89542,14.77814 16.94055,14.66205 16.97755,14.54312 17.00624,14.42192 17.02647,14.29903 17.03816,14.17503 17.04125,14.05051 16.58650,-32.24373 16.58116,-32.36568 16.56758,-32.48698 16.54580,-32.60708 16.51593,-32.72543 16.47811,-32.84149 16.43251,-32.95471 16.37934,-33.06458 16.31885,-33.17060 16.25131,-33.27227 15.26626,-34.65136 15.19561,-34.74381 15.11912,-34.83150 15.03713,-34.91407 14.94998,-34.99117 14.85802,-35.06247 14.76165,-35.12769 14.66127,-35.18654 14.55730,-35.23879 14.45017,-35.28420 14.34033,-35.32261 14.22823,-35.35383 14.11435,-35.37774 12.39175,-35.68173 12.27987,-35.69787 12.16719,-35.70696 12.05417,-35.70895 11.94125,-35.70385 11.82887,-35.69167 11.71748,-35.67246 11.60751,-35.64630 11.49940,-35.61328 11.39358,-35.57354 9.70767,-34.87934 9.59557,-34.82864 9.48720,-34.77039 9.38306,-34.70488 9.28364,-34.63241 9.18940,-34.55332 9.10079,-34.46797 9.01821,-34.37677 8.94206,-34.28014 8.87268,-34.17854 8.81041,-34.07243 8.75553,-33.96232 8.70830,-33.84871 8.66894,-33.73214 8.07136,-31.74020 8.04038,-31.62267 8.01741,-31.50331 8.00255,-31.38268 7.99585,-31.26132 7.99737,-31.13979 8.00708,-31.01863 8.02495,-30.89841 8.05089,-30.77967 8.08478,-30.66295 8.12648,-30.54878 8.17578,-30.43768 10.30594,-26.04421 10.35335,-25.93777 10.39378,-25.82849 10.42706,-25.71682 10.45304,-25.60324 10.47161,-25.48821 10.48270,-25.37222 10.48627,-25.25576 10.48230,-25.13931 10.47079,-25.02336 10.45182,-24.90839 10.42544,-24.79490 10.39177,-24.68335 10.35096,-24.57421\" fill=\"#694d49\"/>"}}};
const PirateTutorial={
 describe(G,artLayers){
  const objects=[...G.lower,...G.upper_parts,...(G.top_parts||[])],rules=G.mechanisms;
  const bounds=(o,padding=12)=>{if(!o)return null;const points=o.points||[o.center];if(!points[0])return null;const r=o.radius||0,xs=points.map(p=>p[0]),ys=points.map(p=>p[1]);return [Math.min(...xs)-padding-r,Math.min(...ys)-padding-r,Math.max(...xs)-Math.min(...xs)+2*(padding+r),Math.max(...ys)-Math.min(...ys)+2*(padding+r)];};
  const artBounds=a=>{const angle=(a.angle||0)*Math.PI/180,w=Math.abs(a.width*Math.cos(angle))+Math.abs(a.height*Math.sin(angle)),h=Math.abs(a.width*Math.sin(angle))+Math.abs(a.height*Math.cos(angle));return [a.x-w/2-5,a.y-h/2-5,w+10,h+10];};
  const regions=ids=>{
   const found=new Set(),result=[];
   for(const id of new Set(ids)){
    const matches=artLayers.filter(a=>!a.hidden&&(a.bind===id||[a.indicator?.trigger,...(a.indicator?.extraTriggers||[])].some(t=>t?.source===id&&['count','count-complete','rollover'].includes(t.kind))));
    if(matches.length){for(const a of matches)if(!found.has(a.id)){found.add(a.id);result.push(artBounds(a));}}
    else {const b=bounds(objects.find(o=>o.id===id));if(b)result.push(b);}
   }return result;
  };
  const groupRules=action=>rules.groups.filter(r=>r.action===({enemy:'boss',vortex:'blackHole'}[action]||action));
  const targets=action=>regions(groupRules(action).flatMap(r=>r.targets));
  const attackIds=level=>[...Object.keys(rules.attacks).filter(id=>rules.attacks[id]===level),...rules.groups.filter(r=>r.action==='attack'&&r.attack===level).flatMap(r=>r.targets),...rules.rolloverGroups.filter(r=>r.attack===level).flatMap(r=>r.members)];
  const rollover=rules.rolloverGroups.filter(r=>r.attack==='lv3'),counts=[...new Set(Object.keys(rules.attacks).filter(id=>rules.attacks[id]==='lv4').map(id=>rules.attackCounts[id]||1))];
  const postCounts=[...new Set(rules.posts.map(p=>p.sensors.length))];
  return {bounds,artBounds,targets,attack:level=>regions(attackIds(level)),
   get barrelText(){return rules.groups.some(r=>r.action==='attack'&&r.attack==='lv2')?PinballI18n.t('tutorial.barrel.group'):PinballI18n.t('tutorial.barrel.hole');},
   get rolloverText(){return PinballI18n.t('tutorial.rollover.text')+(rollover.some(r=>r.laneChange)?PinballI18n.t('tutorial.rollover.switch'):'');},
   get krakenText(){return counts.length===1?PinballI18n.t('tutorial.kraken.count',{count:counts[0]}):PinballI18n.t('tutorial.kraken.text');},
   get postText(){return PinballI18n.t(postCounts.length===1?'tutorial.post.count':'tutorial.post.text',{count:postCounts[0]});},
   posts:()=>regions(rules.posts.flatMap(p=>[p.id,...p.sensors])),
   vortex:()=>regions(groupRules('vortex').map(r=>r.hole))};
 },
 start({game,theater,canvas,G,P,artLayers,view,getView=()=>view,soundBank,controls,clearTouchControls,launch,notice,onFinish,lesson=null}){
 const replay=new URLSearchParams(location.search).get('tutorial')==='1';
 const tutorialMode=replay&&!lesson;
 const $=id=>document.getElementById(id);
 let guide=null;
 if(replay)game.paused=true;
 clearTouchControls();
 const overlay=document.createElement('div');overlay.id='tableTutorial';overlay.style.pointerEvents='none';
 overlay.innerHTML='<canvas id="tutorialSpotlight" aria-hidden="true"></canvas><section id="tutorialPanel"><h2 id="tutorialTitle"></h2><p id="tutorialText"></p><p id="tutorialHint" hidden>點擊進入下一步</p></section>';
 document.body.append(overlay);
 const text=value=>typeof value==='function'?value():PinballI18n.t(value);
 let flightTime=0,step=0,waiting=false,pointer=null,heldKey=null,heartOnly=false,narrationReady=replay,demo=null,demoElapsed=0;
 const info=PirateTutorial.describe(G,artLayers),{bounds,artBounds}=info;
 function flipper(side){const f=game.flippers.find(f=>(f.control||f.side)===side&&(f.layer||'lower')==='lower')||game.flippers.filter(f=>(f.control||f.side)===side).sort((a,b)=>b.pivot[1]-a.pivot[1])[0]||game.flippers[side==='left'?0:1];return bounds({points:[f.pivot,P.add(f.pivot,[Math.cos(f.rest)*f.length,Math.sin(f.rest)*f.length])]});}
 const holes=attack=>info.attack({ball:'lv1',barrel:'lv2'}[attack]);
 const steps=[
  ['tutorial.left.title','tutorial.left.text',()=>[flipper('left')]],
  ['tutorial.right.title','tutorial.right.text',()=>[flipper('right')]],
  ['tutorial.launch.title',controls.launchMode==='drag'?'tutorial.launch.drag':'tutorial.launch.hold',()=>{const p=G.plunger,view=getView();return [[p.left-5,p.rest_y-32,p.right-p.left+10,Math.min(view[1]+view[3],p.base_y+15)-(p.rest_y-32)]];}],
  ['tutorial.health.title','tutorial.health.text',()=>[]],
  ['tutorial.ball.title','tutorial.ball.text',()=>holes('ball')],
  ['tutorial.barrel.title',()=>info.barrelText,()=>holes('barrel')],
  ['tutorial.rollover.title',()=>info.rolloverText,()=>info.attack('lv3')],
  ['tutorial.kraken.title',()=>info.krakenText,()=>info.attack('lv4')]
 ];
 if(lesson&&!tutorialMode)steps.splice(4,steps.length-4,...(!replay&&lesson.firstPlaySteps||lesson.steps));
 const targets=info.targets;
 if(tutorialMode)steps.splice(3,5,
  ['tutorial.enemy.title','tutorial.enemy.text',()=>targets('enemy')],
  ['tutorial.ball.title','tutorial.ball.text',()=>holes('ball')],
  ['tutorial.barrel.title',()=>info.barrelText,()=>holes('barrel')],
  ['tutorial.rollover.title',()=>info.rolloverText,()=>info.attack('lv3')],
  ['tutorial.kraken.title',()=>info.krakenText,()=>info.attack('lv4')],
  ['table.vortex','tutorial.vortex.text',()=>demo==='vortex'?info.vortex():targets('vortex')],
  ['tutorial.post.title',()=>info.postText,info.posts]
 );
 function hitTargets(action){for(const rule of G.mechanisms.groups.filter(r=>r.action===({enemy:'boss',vortex:'blackHole'}[action]||action)))for(const id of rule.targets){game.cooldowns.delete(id);game.scoreHit(id,500);}}
 function demoDone(){if(!demo)return;demo=null;guide.demoFrozen=false;game.paused=true;theater.update(0,game);if(step===steps.length-1){finish();return;}step++;render();}
 function playDemo(){
  demo=['enemy','ball','barrel','airdrop','kraken','vortex','post'][step-3];demoElapsed=0;game.hasLaunchedOnce=true;clearTouchControls();guide.demoFrozen=true;game.paused=false;theater.update(0,game);render();
  if(demo==='enemy')hitTargets('enemy');
  else if(['ball','barrel','airdrop','kraken'].includes(demo))game.emit('configured-attack',{kind:{ball:'lv1',barrel:'lv2',airdrop:'lv3',kraken:'lv4'}[demo],id:'demo',position:[...game.ball.p]});
  else if(demo==='vortex'){
   hitTargets('vortex');const id=G.mechanisms.groups.find(r=>r.action==='blackHole')?.hole;const well=[...G.lower,...G.upper_parts,...(G.top_parts||[])].find(o=>o.id===id);if(well){const layer=G.lower.includes(well)?'lower':G.upper_parts.includes(well)?'tavern':'top';game.setBall(well.center,[0,0],layer);}
  }else if(demo==='post'){
   game.ball.state='ready';game.ball.p=[G.plunger.x,G.plunger.rest_y-game.config.ballRadius];for(const post of game.configuredPosts.values())game.raiseCenterPost(post.id);
  }
 }

 function rects(){const view=getView(),r=canvas.getBoundingClientRect(),root=overlay.getBoundingClientRect(),scale=r.width/view[2];
  if(step===3&&!tutorialMode){const t=theater.frame.getBoundingClientRect(),b=theater.tutorialBounds;if(!b)return [];return [b.hearts].filter(Boolean).map(q=>({x:t.left-root.left+q.x*t.width-3,y:t.top-root.top+q.y*t.height-3,w:q.w*t.width+6,h:q.h*t.height+6}));}
  const result=steps[step][2]().filter(Boolean).map(([x,y,w,h])=>({x:r.left-root.left+(x-view[0])*scale,y:r.top-root.top+(y-view[1])*scale,w:w*scale,h:h*scale}));
  let merge=true;while(merge){merge=false;for(let i=0;i<result.length&&!merge;i++)for(let j=i+1;j<result.length;j++){const a=result[i],b=result[j];if(a.x<=b.x+b.w&&a.x+a.w>=b.x&&a.y<=b.y+b.h&&a.y+a.h>=b.y){const x=Math.min(a.x,b.x),y=Math.min(a.y,b.y);result[i]={x,y,w:Math.max(a.x+a.w,b.x+b.w)-x,h:Math.max(a.y+a.h,b.y+b.h)-y};result.splice(j,1);merge=true;break;}}}return result;
 }
 function position(){if(waiting)return;const root=overlay.getBoundingClientRect(),rs=rects(),mask=$('tutorialSpotlight');
  const ratio=window.devicePixelRatio||1;mask.width=Math.max(1,Math.round(root.width*ratio));mask.height=Math.max(1,Math.round(root.height*ratio));
  const context=mask.getContext('2d');context.setTransform(ratio,0,0,ratio,0,0);context.globalAlpha=.6;context.globalCompositeOperation='source-over';context.fillStyle='#000';context.fillRect(0,0,root.width,root.height);context.globalAlpha=1;
  for(const q of rs)context.clearRect(q.x,q.y,q.w,q.h);
  const panel=$('tutorialPanel'),table=canvas.getBoundingClientRect();
  const left=Math.max(0,table.left-root.left),right=Math.min(root.width,table.right-root.left),top=Math.max(0,table.top-root.top),bottom=Math.min(root.height,table.bottom-root.top);
  panel.style.left=(left+right)/2+'px';panel.style.width=Math.max(1,Math.min(310,right-left-24))+'px';
  const h=panel.offsetHeight,minY=rs.length?Math.min(...rs.map(q=>q.y)):0,maxY=rs.length?Math.max(...rs.map(q=>q.y+q.h)):0;
  const preferred=rs.length?(steps[step][3]==='below'?maxY+16:minY-top>=h+24?minY-h-16:maxY+16):(top+bottom-h)/2;
  panel.style.top=Math.max(top+12,Math.min(bottom-h-12,preferred))+'px';
 }
 function render(){overlay.hidden=waiting||tutorialMode&&['enemy','ball','barrel','airdrop','kraken'].includes(demo);overlay.dataset.demo=demo||'';overlay.dataset.step=String(step+1);overlay.dataset.heartOnly=String(heartOnly);$('tutorialTitle').hidden=step>=4;$('tutorialHint').hidden=!!demo||!replay&&step<3;$('tutorialHint').textContent=PinballI18n.t(window.matchMedia?.('(pointer: fine)').matches?'tutorial.nextKeyboard':'tutorial.next');$('tutorialTitle').textContent=text(step===3&&heartOnly?'tutorial.health.title':steps[step][0]);$('tutorialText').textContent=text(step===3&&heartOnly?'tutorial.health.text':steps[step][1]);position();}
 function used(control){if(waiting||step>1||control!==['left','right'][step])return;step++;render();}
 function allowed(control){return waiting||step<3&&control===['left','right','launch'][step];}
 function stop(e){e.preventDefault();e.stopImmediatePropagation();}
 function down(e){if(tutorialMode&&demo){stop(e);return;}if(waiting)return;if(replay||step>=3){stop(e);if((step<3||narrationReady)&&pointer===null){pointer={id:e.pointerId,control:'next'};canvas.setPointerCapture(e.pointerId);}return;}const r=overlay.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;const inside=x>=0&&x<=r.width&&y>=0&&y<=r.height;const hit=inside&&(step===0?x<r.width/2:step===1?x>=r.width/2:rects().some(q=>x>=q.x&&x<=q.x+q.w&&y>=q.y&&y<=q.y+q.h));if(pointer!==null||!hit){stop(e);return;}
  stop(e);if(game.paused||game.theaterFrozen||game.enemyIntroPending)return;const control=['left','right','launch'][step];pointer={id:e.pointerId,control};canvas.setPointerCapture(e.pointerId);soundBank.unlock();if(control==='launch'){if(controls.launchMode==='drag'){controls.launchDrag={pointerId:e.pointerId,y:e.clientY};game.launchAiming=true;}else launch(true);}else game.input[control]=true;
 }
 function move(e){if(!pointer||pointer.id!==e.pointerId)return;stop(e);if(controls.launchDrag){game.charge=Math.max(0,Math.min(1,(e.clientY-controls.launchDrag.y)/100));game.chargeElapsed=game.charge;game.ball.p[1]=G.plunger.rest_y-G.ball_radius+G.plunger.stroke*game.charge;}}
 function next(){if(waiting||demo||!(replay||step>=3)||!(step<3||narrationReady))return;if(tutorialMode&&step>=3){playDemo();}else if(step<steps.length-1){step++;if(step===3&&!tutorialMode){heartOnly=true;narrationReady=false;theater.tutorialBounds=null;theater.send({command:'tutorial-bounds'});}render();}else finish();}
 function up(e){if(!pointer||pointer.id!==e.pointerId)return;stop(e);const control=pointer.control;pointer=null;if(control==='next'){if(e.type==='pointerup')next();return;}if(control==='launch'){if(controls.launchDrag){const charge=game.charge;controls.launchDrag=null;game.launchAiming=false;if(e.type==='pointerup')game.launch(charge);}else if(e.type==='pointerup')launch(false);else clearTouchControls();}else{game.input[control]=false;if(e.type==='pointerup')used(control);}}
 // Require a fresh keypress for each tutorial step.
 function keyboard(e){if(waiting)return;const k=e.key.toLowerCase();if(replay||step>=3){stop(e);if(e.type==='keyup'){if(heldKey?.k===k){heldKey=null;next();}}else if(!e.repeat&&!heldKey&&!['shift','control','alt','meta','capslock','numlock','scrolllock'].includes(k)&&!demo&&(step<3||narrationReady))heldKey={k,control:'next'};return;}const control=['arrowleft','z'].includes(k)?'left':['arrowright','c'].includes(k)?'right':[' ','arrowdown'].includes(k)?'launch':null;stop(e);if(!allowed(control)||game.paused||game.theaterFrozen)return;if(e.type==='keydown'){if(e.repeat||heldKey)return;heldKey={k,control};if(control==='launch')launch(true);else game.input[control]=true;}else if(heldKey?.k===k){heldKey=null;if(control==='launch')launch(false);else{game.input[control]=false;used(control);}}}
 const listeners=[['pointerdown',down],['pointermove',move],['pointerup',up],['pointercancel',up],['keydown',keyboard],['keyup',keyboard]];for(const [name,fn]of listeners)addEventListener(name,fn,{capture:true});
 const observer=new ResizeObserver(position);observer.observe(canvas);
 guide={refresh:render,allowed,used,demoFrozen:false,onEvent(e){if(tutorialMode){if(demo==='vortex'&&e.type==='release')demoDone();return;}if(e.type==='launch'&&step===2){flightTime=0;waiting=true;render();}else if(waiting&&['ready','ball-save-ready'].includes(e.type)){waiting=false;step=2;render();}else if(waiting&&(e.type==='rollover'||!lesson&&e.type==='sensor')){waiting=false;step=3;heartOnly=true;game.paused=true;clearTouchControls();theater.update(0,game);narrationReady=false;theater.tutorialBounds=null;theater.send({command:'tutorial-bounds'});render();}}};
 if(!tutorialMode){guide.tick=dt=>{if(!waiting||game.paused||game.theaterFrozen||game.enemyIntroPending)return;flightTime+=dt;if(flightTime>=2)guide.onEvent({type:'rollover'});};}
 function finish(){if(!replay){if(window.AppProgress)window.AppProgress.completeTutorial();else localStorage.setItem(lesson?.storageKey||'pinball-pirate-first-play-tutorial-v1','1');}onFinish();theater.onTutorialBounds=null;theater.onCommandComplete=null;observer.disconnect();for(const [name,fn]of listeners)removeEventListener(name,fn,{capture:true});overlay.remove();canvas.tabIndex=0;canvas.focus();clearTouchControls();if(replay){if(window.AppControls?.exitGame)window.AppControls.exitGame();else location.href=new URL('res/main.html',document.baseURI).href;return;}game.paused=false;theater.update(0,game);}
 function theaterBounds(){if(step!==3||waiting)return;narrationReady=true;render();}
 theater.onTutorialBounds=theaterBounds;
 if(tutorialMode){
  theater.onCommandComplete=e=>{if(demo&&e.id?.split(':')[1]===demo){if(e.type==='complete')demoDone();else{game.paused=true;notice(PinballI18n.t('tutorial.demoError'));}}};
  guide.tick=dt=>{if(!demo)return;game.time+=dt;demoElapsed+=dt;if(demo==='vortex'){if(game.ball.state==='playing')game.sensors(dt);else if(game.ball.state==='captured'&&demoElapsed>=1.5)game.release();}else if(demo==='post'&&game.centerPostRaised&&demoElapsed>=2)demoDone();};
 }



 render();
 return guide;
 }
};

/* Touhou1 lessons follow the current table's rules and artwork associations. */
const Touhou1Tutorial={
 describe(G,artLayers){
  const info=PirateTutorial.describe(G,artLayers),objects=[...G.lower,...G.upper_parts,...(G.top_parts||[])],rules=G.mechanisms;
  const related=a=>[a.indicator?.trigger,...(a.indicator?.extraTriggers||[]),a.animation?.trigger,...(a.animation?.extraTriggers||[])].filter(Boolean);
  const regions=(ids,geometry=false)=>{
   const result=[],seen=new Set();
   for(const id of new Set(ids)){
    const matches=artLayers.filter(a=>!a.hidden&&(a.bind===id||related(a).some(t=>t.source===id)));
    for(const a of matches)if(!seen.has(a.id)){seen.add(a.id);result.push(info.artBounds(a));}
    if(geometry||!matches.length){const raw=G.art_layout_objects?.find(o=>o.id===id),object=objects.find(o=>o.id===id)||(raw?.type==='blockhole'?{center:[raw.x,raw.y],radius:G.gameplay?.touhouBagua?.radius||raw.attractionRadius}:null),bounds=info.bounds(object);if(bounds)result.push(bounds);}
   }return result;
  };
  const groups=action=>rules.groups.filter(r=>r.action===action);
  const bossRegions=()=>groups('boss').map(group=>{
   const boxes=regions(group.targets);if(!boxes.length)return null;
   const x=Math.min(...boxes.map(b=>b[0])),y=Math.min(...boxes.map(b=>b[1]));
   return [x,y,Math.max(...boxes.map(b=>b[0]+b[2]))-x,Math.max(...boxes.map(b=>b[1]+b[3]))-y];
  }).filter(Boolean);
  const attackIds=level=>[...Object.keys(rules.attacks).filter(id=>rules.attacks[id]===level),...rules.rolloverGroups.filter(r=>r.attack===level).flatMap(r=>r.members)];
  const attack=level=>regions(attackIds(level));
  const bagua=G.gameplay?.touhouBagua;
  const counters=attackIds('lv3').filter(id=>rules.attackCounts[id]>1),counts=[...new Set(counters.map(id=>rules.attackCounts[id]))];
  const t=(key,params)=>()=>PinballI18n.t(key,params());
  const firstPlaySteps=[
   ['tutorial.touhou1.enemy.title','tutorial.touhou1.enemy.text',bossRegions],
   ['tutorial.touhou1.lv1.title','tutorial.touhou1.lv1.text',()=>attack('lv1')],
   ['tutorial.touhou1.lv2.title','tutorial.touhou1.lv2.text',()=>attack('lv2')],
   ['tutorial.touhou1.lv3.title',t('tutorial.touhou1.lv3.text',()=>({count:counts.join('／')||1})),()=>attack('lv3')],
   ['tutorial.touhou1.lv4.title',t('tutorial.touhou1.lv4.text',()=>({count:bagua?.threshold||8})),()=>attack('lv1')]
  ];
  const gap=G.gameplay?.touhouGap;
  return {firstPlaySteps,steps:[...firstPlaySteps,
   ['tutorial.touhou1.bagua.title',t('tutorial.touhou1.bagua.text',()=>({count:bagua?.threshold||8})),()=>regions(bagua?[bagua.object]:[])],
   ['tutorial.touhou1.upgrade.title','tutorial.touhou1.upgrade.text',()=>regions(groups('upgrade').flatMap(r=>[...r.targets,...r.bumpers]))],
   ['tutorial.touhou1.gap.title',t('tutorial.touhou1.gap.text',()=>({count:gap?.locks||3})),()=>regions(gap?[gap.sensor,gap.hole]:[])],
   ['tutorial.touhou1.rescue.title','tutorial.touhou1.rescue.text',()=>regions([...(G.rescue_kickers||[]).map(k=>k.id),...rules.posts.flatMap(p=>[p.id,...p.sensors])])]
  ]};
 },
 start(options){return PirateTutorial.start({...options,lesson:{storageKey:'pinball-touhou1-first-play-tutorial-v1',...this.describe(options.G,options.artLayers)}});}
};

const TableTutorial=Touhou1Tutorial;
const TOUHOU_GAMEPLAY_DEFAULTS={"touhouGap": {"sensor": "sensor-003", "hole": "hole-008", "passes": 1, "locks": 3, "autoLaunch": true, "keepOpenUntilFull": true, "readySeconds": 3, "captureSeconds": 3}, "indicatorCounters": ["sensor-001"], "touhouBagua": {"object": "blockhole-001", "radius": 68, "threshold": 8, "spinSeconds": 4.5, "winFlashSeconds": 1.2, "rewards": [{"kind": "score", "value": 1000, "art": {"src": "res/img/steampunk/steampunk-bonus-score-1000.png", "crop": [0, 0, 20, 9]}}, {"kind": "score", "value": 2500, "art": {"src": "res/img/steampunk/steampunk-bonus-score-2500.png", "crop": [0, 0, 20, 7]}}, {"kind": "score", "value": 5000, "art": {"src": "res/img/steampunk/steampunk-bonus-score-5000.png", "crop": [0, 0, 20, 8]}}, {"kind": "multiplier", "value": 2, "art": {"src": "res/img/steampunk/steampunk-bonus-multiplier-2.png", "crop": [0, 0, 16, 12]}}, {"kind": "multiplier", "value": 3, "art": {"src": "res/img/steampunk/steampunk-bonus-multiplier-3.png", "crop": [0, 0, 14, 12]}}, {"kind": "ball", "value": 1, "art": {"src": "res/img/steampunk/steampunk-bonus-ball-plus-1.png", "crop": [0, 0, 18, 9]}}, {"kind": "multi", "value": 2, "art": {"src": "res/img/steampunk/steampunk-bonus-multiball.png", "crop": [0, 0, 19, 18]}}, {"kind": "enemy", "value": 0, "art": {"src": "res/img/steampunk/steampunk-bonus-enemy.png", "crop": [0, 0, 13, 13]}}], "yinYang": {"fadeSeconds": 0.8}, "attackArt": {"src": "res/img/touhou/touhou-attack-lv4-fantasy-seal.png", "duration": 1.55}}, "ballImage": "res/img/touhou/touhou-ball-yin-yang.png"};
/* Editor JSON -> physics geometry. Shared by editor previews and built games. */
(function(root){
'use strict';
const SlopeRegions=typeof module!=='undefined'&&module.exports?require('./slope-regions.js'):root.SlopeRegions;
// Shared shape references for main, editor previews and Node tests.
const FLIPPER_REFERENCE={"left":{"pivot":[127.73488354682922,407.82425594329834],"tip":[159.8123854994774,430.25012969970703],"raised":[159.8123854994774,385.6379671096802],"radii":[6.530601114034653,4.059467911720276]},"right":{"pivot":[232.26900172233582,407.82425594329834],"tip":[200.18100053071976,430.25012969970703],"raised":[200.18100053071976,385.6379671096802],"radii":[6.530601114034653,4.059467911720276]}};
const SHOOTER_FLOOR_ORIGIN=[316.5,448];
const LEGACY_CENTER_POST={"id":"test-post-center","kind":"test-post","center":[180,435],"radius":6.5,"layer":"lower","mechanic":"rollover_post"};
function compileLayout(layout,base){
 const copy=v=>JSON.parse(JSON.stringify(v)),rad=v=>(v||0)*Math.PI/180,dist=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
 if(layout?.format!=='pinball-layout-editor'||!Array.isArray(layout.objects)||!Array.isArray(layout.lockedLayout))throw Error('不是有效的布局 JSON');
 for(const art of layout.artLayers||[])if(art.state!=='ball-layer'&&(!/^res\/(?:img|hd_img)\/(?:(?:pirate|steampunk|space|touhou|saga)\/)?[^/\\?#]+\.(png|webp|jpg|jpeg)$/i.test(art.src||'')||art.src.includes('..')))throw Error('請指定 res/img 或 res/hd_img 中的圖片：'+art.id);
 const g=copy(base);
 g.layout_preview=true;g.artLayers=copy(layout.artLayers||[]);g.art_layout_objects=copy(layout.objects);g.art_layout_templates=copy(layout.templates||{});g.gameplay=copy(layout.gameplay||{});
 if(g.gameplay.ballImage!==undefined&&(typeof g.gameplay.ballImage!=='string'||!/^res\/(?:img|hd_img)\/(?:[\w-]+\/)*[\w.-]+\.(?:png|webp|jpe?g)$/i.test(g.gameplay.ballImage)||g.gameplay.ballImage.includes('..')))throw Error('球圖片必須指定 res/img 或 res/hd_img 中的圖片');
 for(const art of g.artLayers)if((art.src||'').endsWith('/plunger-rod.png')&&(art.state||'static')==='static')Object.assign(art,{state:'plunger',bind:'plunger'});
 const rescueGates=new Set(layout.objects.filter(o=>o.mechanic==='rescue-return').map(o=>o.id));
 for(const art of g.artLayers)if(rescueGates.has(art.bind)&&art.state!=='guide-arrow')art.state='return-gate';
 const wells=layout.objects.filter(o=>o.mechanic==='gravity-well');
 for(const art of g.artLayers)if((art.src||'').endsWith('/pirate-whirlpool.png')&&wells.length){const w=wells.find(w=>w.id===art.bind)||wells.reduce((a,b)=>Math.hypot(a.cx-art.x,a.cy-art.y)<=Math.hypot(b.cx-art.x,b.cy-art.y)?a:b);Object.assign(art,{state:'vortex',bind:w.id})}
 const rules={};for(const rule of g.gameplay.target_rules||[])for(const id of rule.objects)rules[id]=rule.id;
 const center=copy(LEGACY_CENTER_POST);
 g.lower=copy(layout.lockedLayout.filter(o=>!['main-perimeter','left-approach-outer-wall','shooter-divider'].includes(o.id)));
 if((layout.version||1)<6&&!g.lower.some(o=>o.id===center.id))g.lower.push(center);
 const topParts=copy(layout.topLayout||[]);
 let destination=g.lower;
 function poly(id,points,kind='wall',closed=false,extra={}){if(closed&&JSON.stringify(points[0])!==JSON.stringify(points.at(-1)))points=[...points,points[0]];const o={id,kind,points,closed,...extra};destination.push(o);return o}
 const transform=(o,[x,y])=>{const a=rad(o.angle);return[o.x+x*Math.cos(a)-y*Math.sin(a),o.y+x*Math.sin(a)+y*Math.cos(a)]};
 const floor=layout.lockedLayout.find(o=>o.id==='shooter-floor'),offset=floor?floor.points[0].map((v,i)=>v-SHOOTER_FLOOR_ORIGIN[i]):[0,0];g.lower_offset=offset;
 Object.assign(g.plunger,{launch_min:0,charge_seconds:2.5,charge_step_seconds:.025,launch_max:2100});
 for(const k of ['x','left','right'])g.plunger[k]+=offset[0];for(const k of ['rest_y','base_y'])g.plunger[k]+=offset[1];
 const rod=g.artLayers.find(o=>o.state==='plunger'&&!o.hidden);
 if(rod){const a=rad(rod.angle),dx=rod.x+Math.sin(a)*rod.height/2-g.plunger.x;for(const k of ['x','left','right'])g.plunger[k]+=dx;g.plunger.rest_y=rod.y-Math.cos(a)*rod.height/2}
 const launcher=layout.objects.find(o=>o.type==='plunger');if(launcher){const dx=launcher.x-g.plunger.x;for(const k of ['x','left','right'])g.plunger[k]+=dx;g.plunger.rest_y=launcher.y-4}
 g.plunger.layer=({lower:'lower',upper:'tavern',top:'top'}[launcher?.layer]||'lower');
 g.plunger.enabled=(layout.version||1)<6||!!(launcher||rod||floor);
 const collar=g.artLayers.find(o=>(o.src||'').endsWith('/plunger-collar.png')&&!o.hidden);if(collar)g.plunger.stroke=Math.max(0,collar.y-Math.cos(rad(collar.angle))*collar.height/2-g.plunger.rest_y);
 if((layout.version||1)<6)poly('shooter-divider-lower',[[311,300],[311,448],[316,448],[316,300]]);
 if((layout.version||1)>=6){const upper=copy(layout.upperLayout||[]);g.deck=upper.find(o=>o.kind==='deck')||{points:[]};g.ramp_triangles=upper.filter(o=>o.kind==='ramp-floor').map(o=>o.points);g.upper_parts=upper.filter(o=>!['deck','ramp-floor','portal','drop'].includes(o.kind));g.deck_exit=upper.find(o=>o.kind==='drop')||null;g.portals=g.portals.map(o=>upper.find(u=>u.kind==='portal'&&u.id===o.id)||o)}
 g.guided_tracks=[];g.visual_tracks=[];
 g.editor_transitions=[];g.oneway_speeds=[];g.gravity_zones=[];
 if(layout.gravityRegions!==undefined&&(!Array.isArray(layout.gravityRegions)||!layout.gravityRegions.every(o=>['gravityZone','slopeZone'].includes(o.type))))throw Error('區域資料不合法');
 for(const o of [...layout.objects,...(layout.gravityRegions||[])]){
  const t=o.type,key=o.id;if(o.slingshot!==undefined&&typeof o.slingshot!=='boolean')throw Error('Slingshot 設定不合法：'+key);if(o.bumperStrength!==undefined&&!['weak','strong'].includes(o.bumperStrength))throw Error('Bumper 強度不合法：'+key);if(o.reboundStrength!==undefined&&!['weak','strong'].includes(o.reboundStrength))throw Error('反彈強度不合法：'+key);if(t.startsWith('original_'))continue;destination=o.layer==='top'?topParts:o.layer==='upper'?g.upper_parts:g.lower;
  if(['rescue-kicker','rescue-return'].includes(o.mechanic))continue;
  if(o.stopOnEntry!==undefined&&typeof o.stopOnEntry!=='boolean')throw Error('跨層停球設定不合法：'+o.id);
   if(o.initialSpeed!==undefined&&(!Number.isFinite(o.initialSpeed)||o.initialSpeed<0))throw Error('單向線初速不合法：'+key);
  const points=()=>[[o.x1,o.y1],[o.x2,o.y2]],layer=o.layer||'lower';
  if(t==='slopeZone'){
   const vectors={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]};
   if(!Object.hasOwn(vectors,o.gravityDirection)||![o.x,o.y,o.width,o.height,o.slopeAngle].every(Number.isFinite)||o.width<1||o.height<1||o.slopeAngle<0||o.slopeAngle>=90||o.angle!==0||!['lower','upper','top'].includes(layer)||!SlopeRegions.valid(o.outline)||o.outline.some(p=>p.some(v=>Math.abs(v)>.500001)))throw Error('坡面區域設定不合法：'+key);
   g.gravity_zones.push({id:key,layer:layer==='upper'?'tavern':layer,x:o.x,y:o.y,width:o.width,height:o.height,points:SlopeRegions.worldPoints(o),direction:o.gravityDirection,slopeAngle:o.slopeAngle,acceleration:vectors[o.gravityDirection]});
  }else if(t==='gravityZone'){
   const vectors={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]};
   if(o.outline&&(!SlopeRegions.valid(o.outline)||o.outline.some(p=>p.some(v=>Math.abs(v)>.500001))))throw Error('重力區塊輪廓不合法：'+key);
   if(!Object.hasOwn(vectors,o.gravityDirection)||![o.x,o.y,o.width,o.height,o.gravityStrength].every(Number.isFinite)||o.width<1||o.height<1||o.gravityStrength<0||o.angle!==0||!['lower','upper','top'].includes(layer))throw Error('重力區塊設定不合法：'+key);
   g.gravity_zones.push({id:key,layer:layer==='upper'?'tavern':layer,x:o.x,y:o.y,width:o.width,height:o.height,...(o.outline?{points:SlopeRegions.worldPoints(o)}:{}),direction:o.gravityDirection,acceleration:vectors[o.gravityDirection].map(v=>v*o.gravityStrength)});
  }else if(o.mechanic==='layer-transition'){
   const layers={lower:'lower',upper:'tavern',top:'top'};
   if(t!=='oneway'||!Object.hasOwn(layers,o.fromLayer)||!Object.hasOwn(layers,o.toLayer)||o.fromLayer===o.toLayer||typeof o.bidirectional!=='boolean'||![1,-1].includes(o.direction)||![o.x1,o.y1,o.x2,o.y2].every(Number.isFinite)||dist(...points())<.5)throw Error('跨層入口線設定不合法：'+key);
   const length=dist(...points()),n=[-(o.y2-o.y1)/length*o.direction,(o.x2-o.x1)/length*o.direction];
   g.editor_transitions.push({id:key,points:points(),n,from:layers[o.fromLayer],to:layers[o.toLayer],stopOnEntry:o.stopOnEntry,initialSpeed:o.initialSpeed});
   if(o.bidirectional)g.editor_transitions.push({id:key,points:points(),n:n.map(v=>-v),from:layers[o.toLayer],to:layers[o.fromLayer],stopOnEntry:o.stopOnEntry,initialSpeed:o.initialSpeed});
  }else if(o.mechanic==='active-rebound'){
   if(t!=='line'||![o.x1,o.y1,o.x2,o.y2].every(Number.isFinite)||dist(...points())<.5)throw Error('彈片線尺寸不合法：'+key);
   poly(key,points(),'rebound',false,{mechanic:'active_rebound',reboundStrength:o.reboundStrength||'weak',slingshot:o.slingshot!==false,vpxSlingshot:o.slingshot!==false});
  }else if(o.mechanic==='guided-rail'){
   if(!['line','arc'].includes(t)||!['x1','y1','x2','y2',...(t==='arc'?['qx','qy']:[])].every(k=>Number.isFinite(o[k]))||dist(...points())<.5||!Number.isFinite(o.trackWidth)||o.trackWidth<14||o.trackWidth>60)throw Error('高架軌道尺寸不合法：'+key);
   const n=t==='arc'?Math.max(8,Math.ceil((Math.hypot(o.qx-o.x1,o.qy-o.y1)+Math.hypot(o.x2-o.qx,o.y2-o.qy))/1.5)):1;
   const ps=t==='arc'?Array.from({length:n+1},(_,i)=>{const u=i/n;return[(1-u)**2*o.x1+2*(1-u)*u*o.qx+u*u*o.x2,(1-u)**2*o.y1+2*(1-u)*u*o.qy+u*u*o.y2]}):points();
   if(o.ballSpeed!==undefined&&(!Number.isFinite(o.ballSpeed)||o.ballSpeed<0))throw Error('滑軌球速不合法：'+key);
   (o.visualOnly?g.visual_tracks:g.guided_tracks).push({id:key,points:ps,width:o.trackWidth,railMaterial:o.railMaterial,ballSpeed:o.ballSpeed,layer:layer==='upper'?'tavern':layer,showAboveArt:o.showAboveArt===true});
  }else if(t==='line'&&o.mechanic==='airdrop-rollover')poly(key,points(),'airdrop-rollover',false,{layer,collision:false});
  else if(t==='circle'&&o.mechanic==='gravity-well')destination.push({id:key,kind:'field',mechanic:'gravity-well',center:[o.cx,o.cy],radius:o.r,layer,collision:false});
  else if(t==='circle'&&o.mechanic==='solid-circle'){
   const n=Math.max(32,Math.ceil(2*Math.PI*o.r/2));
   poly(key,Array.from({length:n},(_,i)=>[o.cx+o.r*Math.cos(i*2*Math.PI/n),o.cy+o.r*Math.sin(i*2*Math.PI/n)]),'wall',true,{mechanic:o.mechanic});
  }
  else if(t==='circle'&&o.mechanic==='pachinko-pin')destination.push({id:key,kind:'wall',mechanic:o.mechanic,center:[o.cx,o.cy],radius:2});
  else if(t==='circle')destination.push({id:key,kind:'bumper',center:[o.cx,o.cy],radius:o.r,bumperStrength:o.bumperStrength||'weak'});
  else if(t==='rect')poly(key,[[-o.width/2,-o.height/2],[o.width/2,-o.height/2],[o.width/2,o.height/2],[-o.width/2,o.height/2]].map(p=>transform(o,p)),'wall',true);
  else if(t==='line')poly(key,points(),'rail');
  else if(t==='plunger')continue;
  else if(t==='sensor')poly(key,points(),'sensor',false,{layer,collision:false});
  else if(t==='thickline'){if(o.thickness!==5)throw Error('Invalid thick line: '+key);poly(key,points(),'rail',false,{thickness:5})}
  else if(t==='flipper'){
   const original=FLIPPER_REFERENCE.left,[ra,rb]=original.radii,length=dist(original.pivot,original.tip),local=-(length+ra+rb)/2+ra,pivot=transform(o,[local,0]),tip=transform(o,[local+length,0]),side=tip[0]>pivot[0]?'left':'right',src=FLIPPER_REFERENCE[side];
   const rest=Math.atan2(src.tip[1]-src.pivot[1],src.tip[0]-src.pivot[0]),raised=Math.atan2(src.raised[1]-src.pivot[1],src.raised[0]-src.pivot[0]),a=rad(o.angle)+Math.atan2(Math.sin(raised-rest),Math.cos(raised-rest));destination.push({id:key,kind:'flipper',pivot,tip,raised:[pivot[0]+length*Math.cos(a),pivot[1]+length*Math.sin(a)],radii:[ra,rb],control:side,profile:'tapered'});
  }else if(t==='oneway'){const dx=o.x2-o.x1,dy=o.y2-o.y1,length=Math.hypot(dx,dy);if(length<.5||![-1,1].includes(o.direction))throw Error('Invalid one-way line: '+key);const n=[-dy/length*o.direction,dx/length*o.direction];poly(key,points(),'rail',false,{pass_normal:n});if(o.initialSpeed>0)g.oneway_speeds.push({id:key,points:points(),n,layer:layer==='upper'?'tavern':layer,stopOnEntry:o.stopOnEntry,initialSpeed:o.initialSpeed});}
  else if(t==='arc'){const n=Math.max(8,Math.ceil((Math.hypot(o.qx-o.x1,o.qy-o.y1)+Math.hypot(o.x2-o.qx,o.y2-o.qy))/1.5));poly(key,Array.from({length:n+1},(_,i)=>{const t=i/n;return[(1-t)**2*o.x1+2*(1-t)*t*o.qx+t*t*o.x2,(1-t)**2*o.y1+2*(1-t)*t*o.qy+t*t*o.y2]}),'rail')}
  else if(t==='rebound'){const length=layout.templates[t].width-1;poly(key,[transform(o,[-length/2,0]),transform(o,[length/2,0])],'rebound',false,{mechanic:'active_rebound',reboundStrength:o.reboundStrength||'weak',slingshot:o.slingshot!==false,vpxSlingshot:o.slingshot!==false})}
  else if(t==='targets'||t==='target'){let i=0;for(const m of layout.templates[t].markup.matchAll(/<polygon points="([^"]+)"/g)){const ps=m[1].trim().split(/\s+/).map(p=>transform(o,p.split(',').map(Number)));poly(key+'-'+(++i),ps,'target',true,{target_group:rules[key]||key})}}
  else if(t==='triangleLeft'||t==='triangleRight'){
   const match=layout.templates?.[t]?.markup.match(/<polygon points="([^"]+)"/);
   if(!match)throw Error('三角擋板缺少輪廓：'+key);
   poly(key,match[1].trim().split(/\s+/).map(p=>transform(o,p.split(',').map(Number))),'rebound',true,{mechanic:'active_rebound',reboundStrength:o.reboundStrength||'weak',slingshot:o.slingshot!==false,vpxSlingshot:o.slingshot!==false});
  }
  else if(t==='ublock')poly(key,[[-12,11],[-12,-11],[12,-11],[12,11],[9,11],[9,-8],[-9,-8],[-9,11]].map(p=>transform(o,p)),'wall',true);
  else if(t==='blockhole'||t==='hole'&&o.mechanic==='vortex-center')destination.push({id:key,kind:'field',mechanic:'vortex-center',center:[o.x,o.y],radius:5.5,layer,collision:false});
  else if(t==='hole'){const nearby=layout.objects.filter(u=>u.type==='ublock'&&Math.hypot(u.x-o.x,u.y-o.y)<20).sort((a,b)=>Math.hypot(a.x-o.x,a.y-o.y)-Math.hypot(b.x-o.x,b.y-o.y)),a=nearby.length?rad(nearby[0].angle):0,direction=o.releaseMode==='fixed'?[Math.cos(rad(o.releaseAngle)),Math.sin(rad(o.releaseAngle))]:o.releaseMode==='cadet'?[-Math.sin(a),Math.cos(a)]:o.release_direction||[-Math.sin(a),Math.cos(a)],mag=Math.hypot(...direction);if(mag<=0)throw Error('Invalid socket release direction: '+key);const v=direction.map(v=>v/mag);destination.push({id:key,kind:'socket',center:[o.x,o.y],radius:5.5,release:o.release_point||[o.x+v[0]*14,o.y+v[1]*14],release_direction:v,release_mode:o.releaseMode||(o.release_direction?'fixed':'cadet'),...(o.release_point?{remote_release:true}:{}),...(o.mechanic==='shark-inlet'?{mechanic:o.mechanic}:{})})}
  else if(t==='flag')poly(key,'x1'in o?points():[transform(o,[-7,0]),transform(o,[7,0])],'flag',false,{layer,collision:false});
  else throw Error('Unsupported editor type: '+t);
 }
 function segmentDistance(p,a,b){const dx=b[0]-a[0],dy=b[1]-a[1],t=Math.max(0,Math.min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dy)/(dx*dx+dy*dy||1)));return Math.hypot(p[0]-a[0]-t*dx,p[1]-a[1]-t*dy)}
 const solids=g.lower.filter(o=>['wall','rail','active','rebound','bumper','target'].includes(o.kind));
 for(const socket of g.lower.filter(o=>o.kind==='socket'&&o.release)){
  // A teleport-only entrance never ejects here; destinations still need clearance.
  if(layout.objects.some(o=>o.id===socket.id&&o.exitHole)&&!layout.objects.some(o=>o.exitHole===socket.id))continue;
  const center=socket.remote_release?socket.release:socket.center,edges=[],circles=[];
  for(const solid of solids)if(solid.center)circles.push([solid.center,solid.radius]);else for(let i=1;i<solid.points.length;i++){const a=solid.points[i-1],b=solid.points[i];if(segmentDistance(center,a,b)<30)edges.push([a,b,(solid.thickness||0)/2])}
  function clearance(v){let result=Infinity;const required=g.ball_radius+1;for(let i=0;i<49;i++){const p=[center[0]+v[0]*i*.5,center[1]+v[1]*i*.5],fade=socket.remote_release?0:Math.max(0,1-i*.5/14);for(const [a,b,r] of edges)result=Math.min(result,segmentDistance(p,a,b)-r+Math.max(0,required-segmentDistance(center,a,b)+r)*fade);for(const [c,r] of circles)result=Math.min(result,dist(p,c)-r+Math.max(0,required-dist(center,c)+r)*fade)}return result}
  const preferred=socket.release_direction;if(clearance(preferred)<g.ball_radius+1-1e-7){if(socket.release_mode==='fixed')throw Error('指定射出角度被阻擋：'+socket.id);if(socket.remote_release)throw Error('Remote socket exit is obstructed: '+socket.id);const candidates=Array.from({length:72},(_,i)=>[Math.cos(rad(i*5)),Math.sin(rad(i*5))]).sort((a,b)=>(b[0]*preferred[0]+b[1]*preferred[1])-(a[0]*preferred[0]+a[1]*preferred[1])),v=candidates.find(v=>clearance(v)>=g.ball_radius+1-1e-7);if(!v)throw Error('Socket has no ball-width exit: '+socket.id);socket.release_direction=v;socket.release=[center[0]+v[0]*14,center[1]+v[1]*14]}
 }
 g.one_way_gates=g.one_way_gates.filter(o=>Math.min(...o.points.map(p=>p[1]))>=300);for(const gate of g.one_way_gates)gate.points=gate.points.map(p=>[p[0]+offset[0],p[1]+offset[1]]);
 const rescueLayer=o=>o.layer==='upper'?'tavern':o.layer||'lower';
 if((layout.version||1)>=6||g.gameplay.rescueGatesFromObjects||layout.objects.some(o=>o.mechanic==='rescue-return'))g.one_way_gates=layout.objects.filter(o=>o.mechanic==='rescue-return').map(o=>({id:o.id,mechanic:'rescue-return',side:o.side??null,layer:rescueLayer(o),points:[[o.x1,o.y1],[o.x2,o.y2]],normal:[-(o.y2-o.y1)*o.direction,(o.x2-o.x1)*o.direction]}));
 g.rescue_kickers=layout.objects.filter(o=>o.mechanic==='rescue-kicker').map(o=>({id:o.id,side:o.side,layer:rescueLayer(o),points:[[o.x1,o.y1],[o.x2,o.y2]],aim:o.aim,launch_point:o.launch_point??null,direction:o.direction??null,speed:o.speed??600}));
 g.extra_transitions=[];
 for(const o of layout.objects.filter(o=>o.layer==='upper'&&['enter','exit'].includes(o.transition))){const gate=g.upper_parts.find(p=>p.id===o.id);if(gate)g.extra_transitions.push({id:o.id,layer:gate.collision_layer||'tavern',points:gate.points,n:o.transition==='enter'?gate.pass_normal:gate.pass_normal.map(v=>-v),mode:o.transition,lip_clearance:g.ball_radius+1})}
 if(topParts.length){
  g.top_parts=topParts;
  g.top_transitions=layout.objects.filter(o=>o.layer==='top'&&['enter-top','exit-top'].includes(o.transition)).map(o=>{
   const gate=topParts.find(p=>p.id===o.id);return {id:o.id,points:gate.points,n:gate.pass_normal,from:o.transition==='enter-top'?'tavern':'top',to:o.transition==='enter-top'?'top':'tavern'};
  });
 }
 const adjacency=new Map(),pointMap=new Map();const key=p=>JSON.stringify(p.map(v=>Math.round(v*1e6)/1e6));
 for(const o of layout.objects.filter(o=>o.type==='line'&&(o.layer||'lower')==='lower'&&!o.mechanic)){const a=key([o.x1,o.y1]),b=key([o.x2,o.y2]);for(const [p,q] of [[a,b],[b,a]]){if(!adjacency.has(p))adjacency.set(p,[]);adjacency.get(p).push(q);pointMap.set(p,JSON.parse(p))}}
 g.preview_islands=[];const visited=new Set();for(const start of adjacency.keys()){if(visited.has(start))continue;const component=new Set(),stack=[start];while(stack.length){const p=stack.pop();if(component.has(p))continue;component.add(p);stack.push(...adjacency.get(p))}for(const p of component)visited.add(p);if(component.size<3||[...component].some(p=>adjacency.get(p).length!==2))continue;const path=[start];let previous=null,current=start;while(true){const next=adjacency.get(current).find(p=>p!==previous);if(next===start)break;path.push(next);previous=current;current=next}g.preview_islands.push(path.map(p=>pointMap.get(p)))}
 const launchOnly=new Set(layout.objects.filter(o=>o.collisionMode==='launch-only').map(o=>o.id));for(const p of [...g.lower,...g.upper_parts,...topParts])if(launchOnly.has(p.id))p.collisionMode='launch-only';
 g.view_box=[-7,-11,374,464];if(layout.screenLayout){const s=layout.screenLayout;g.view_box=[0,s.top,s.width,s.bottom-s.top];g.drain_top=s.top-40}
 return g;
}
root.compileLayout=compileLayout;
if(typeof module!=='undefined')module.exports=compileLayout;
})(globalThis);

/* Editor-only third floor. Existing Pirate maps keep their original game class. */
(function(root){
'use strict';
function createGame(core){
 const {Grid,sub,dot,add,mul,len,nearest}=core;
 return class EditorLayerGame extends core.Game {
  build(){
   super.build();
   const parts=this.g.top_parts||[],edges=[];
   for(const o of parts){
    if(['wall','rail','active','rebound','bumper','test-post','target'].includes(o.kind)){
     if(o.center)edges.push({id:o.id,c:o.center,r:o.radius,kind:o.kind,bumperStrength:o.bumperStrength});
     else {let slingEdge=1;const ps=o.points||[];const area=o.closed===true?ps.reduce((sum,p,i)=>{const q=ps[(i+1)%ps.length];return sum+p[0]*q[1]-q[0]*p[1];},0):0,vpxSide=area>0?-1:area<0?1:0;if((o.slingshot||o.vpxSlingshot||o.kind==='active'||o.kind==='rebound'||o.mechanic==='active_rebound')&&ps.length>2)for(let i=2;i<ps.length;i++)if(len(sub(ps[i],ps[i-1]))>len(sub(ps[slingEdge],ps[slingEdge-1])))slingEdge=i;for(let i=1;i<(o.points||[]).length;i++)edges.push({id:o.id,a:o.points[i-1],b:o.points[i],kind:o.kind,n:o.pass_normal,thickness:o.thickness||0,mechanic:o.mechanic,reboundStrength:o.reboundStrength,slingshot:o.slingshot===true,vpxSlingshot:o.vpxSlingshot??(o.kind==='active'||o.kind==='rebound'||o.mechanic==='active_rebound'),slingshotFace:i===slingEdge,vpxSide,launchOnly:o.collisionMode==='launch-only'});}
    }
   }
   this.edges.top=edges;this.grids.top=new Grid(edges);
   for(const o of parts)if(o.kind==='rebound'||o.kind==='active'||o.mechanic==='active_rebound')this.reboundIds.add(o.id);
   // Flippers use the same engine on each floor; old ones default to lower.
   for(const [layer,objects] of [['tavern',this.g.upper_parts],['top',parts]])for(const o of objects.filter(o=>o.kind==='flipper')){
    const rest=Math.atan2(o.tip[1]-o.pivot[1],o.tip[0]-o.pivot[0]),up=Math.atan2(o.raised[1]-o.pivot[1],o.raised[0]-o.pivot[0]);
    this.flippers.push({...o,layer,angle:rest,rest,up:rest+Math.atan2(Math.sin(up-rest),Math.cos(up-rest)),length:len(sub(o.tip,o.pivot)),omega:0});
   }
  }
  syncRegion(){} // Legacy Pirate occupancy regions are not editor entrances.
  portalHit(p,d){
   let best=null; // Only explicit editor layer-entry objects may change floors.
   for(const t of (this.g.editor_transitions||[])){
    if(this.ball.layer!==t.from)continue;
    const from=dot(sub(p,t.points[0]),t.n),speed=dot(d,t.n);
    if(speed<=0||from>0||from+speed<0)continue;
    const time=-from/speed,q=add(p,mul(d,time)),near=nearest(q,...t.points);
    // An entrance is a crossing sensor; adjacent walls determine physical clearance.
    if(len(sub(q,near.p))>.01)continue;
    if(!best||time<best.t)best={t:time,editorPortal:t,n:t.n};
   }
   return best;
  }
  transition(hit){
   if(!hit.editorPortal)return super.transition(hit);
   this.ball.layer=hit.editorPortal.to;this.lastPortal=this.time;
   // A line sensor may enter with the ball already overlapping a destination wall.
   // Restore clearance so the next sweep can resolve that wall using normal physics.
   if(hit.editorPortal.points)for(const edge of this.edges[this.ball.layer]||[]){
    if(!['wall','rail'].includes(edge.kind)||edge.n||!edge.a||!this.edgeEnabled(edge))continue;
    const offset=sub(this.ball.p,nearest(this.ball.p,edge.a,edge.b).p),distance=len(offset),radius=this.physics.ballRadius+(edge.thickness||0)/2;
    if(distance>=radius)continue;
    let normal;
    if(distance>1e-9)normal=mul(offset,1/distance);
    else {
     const segment=sub(edge.b,edge.a),length=len(segment);if(!length)continue;
     normal=[-segment[1]/length,segment[0]/length];
     if(dot(normal,this.ball.v)>0)normal=mul(normal,-1);
    }
    this.ball.p=add(this.ball.p,mul(normal,radius-distance+.012));
   }
   if(hit.editorPortal.initialSpeed>0)this.ball.v=mul(this.ball.v,hit.editorPortal.initialSpeed/(len(this.ball.v)||1));
   if(hit.editorPortal.stopOnEntry){this.ball.v=[0,0];this.ball.state='layer-paused';this.ball.layerResumeAt=this.time+.5;this.ball.trail=[];}
   this.emit('layer',{id:hit.editorPortal.id,to:this.ball.layer});
  }
  handleBallState(dt){
   if(this.ball.state==='layer-paused'){
    if(this.time>=this.ball.layerResumeAt){this.ball.state='playing';delete this.ball.layerResumeAt;}
    return true;
   }
   return super.handleBallState(dt);
  }
  applyOneWaySpeed(previous,layer){
   const b=this.ball;if(b.state!=='playing'||b.layer!==layer)return;
   for(const line of this.g.oneway_speeds||[]){
    if(line.layer!==layer||!this.edgeEnabled({id:line.id,kind:'rail'}))continue;
    const from=dot(sub(previous,line.points[0]),line.n),to=dot(sub(b.p,line.points[0]),line.n);
    if(from>=0||to<0)continue;
    const q=add(previous,mul(sub(b.p,previous),-from/(to-from)));
    if(len(sub(q,nearest(q,...line.points).p))>.01)continue;
    b.v=mul(b.v,line.initialSpeed/(len(b.v)||1));
   }
  }
  visualPlane(ball){return ball.layer==='top'?'top':super.visualPlane(ball);}
  field(){const result=super.field();if(this.ball.layer==='top')this.ball.z=this.physics.rampHeight*2;return result;}
  resetTargets(){
   super.resetTargets();
   for(const o of this.g.top_parts||[]){
    if(!o.target_group)continue;
    let group=this.targetGroups.find(g=>g.id===o.target_group);
    if(!group){group={id:o.target_group,targets:[],hits:new Set(),complete:false,completions:0,resetAt:0};this.targetGroups.push(group);}
    group.targets.push(o.id);
   }
  }
  sensors(dt){
   super.sensors(dt);
   const b=this.ball;if(b.layer!=='top'||b.state!=='playing'||this.time<=b.immunity)return;
   for(const socket of (this.g.top_parts||[]).filter(o=>o.kind==='socket'))if(len(sub(socket.center,b.p))<socket.radius){this.capture(socket.id,socket.center,socket.release,'top',socket.release_direction,250);return;}
  }
 };
}
const api={createGame};
if(typeof module!=='undefined')module.exports=api;else root.EditorLayers=api;
})(globalThis);

/* Compile and validate object-owned rules from editor layouts. */
(function(root){
"use strict";
const floor=o=>o.layer==='upper'?'tavern':o.layer||'lower',parts=g=>[...g.lower,...g.upper_parts,...(g.top_parts||[])];
function prepare(layout,g){
 g.top_parts??=[];
 g.drain_y=(layout.screenLayout?.bottom??469.5)+20;
 const objects=layout.objects,posts=objects.filter(o=>o.type==='centerPost');
 // Transitions come only from editor objects.
 for(const key of ['right_upper_region','right_upper_ramp','upper_feeder_floor','upper_route_floor'])delete g[key];
 g.deck_exit=null;
 g.extra_transitions=[];
 g.top_transitions=[];
 for(const part of parts(g))if(part.collision_layer==='right_upper')delete part.collision_layer;

 for(const t of [...(g.guided_tracks||[]),...(g.visual_tracks||[])]){const o=objects.find(o=>o.id===t.id);
 t.layer=floor(o);
 t.showAboveArt=o.showAboveArt===true;
 }
 {
  const layerNames={lower:'lower',upper:'tavern',top:'top'};
  g.circle_entries=objects.filter(o=>o.type==='circle'&&o.mechanic==='layer-transition').map(o=>{
   if(!layerNames[o.fromLayer]||!layerNames[o.toLayer]||o.fromLayer===o.toLayer||!Number.isFinite(o.r)||o.r<.5)throw Error('跨層入口圓設定不合法：'+o.id);
   if(o.stopOnEntry!==undefined&&typeof o.stopOnEntry!=='boolean')throw Error('跨層停球設定不合法：'+o.id);
   if(o.initialSpeed!==undefined&&(!Number.isFinite(o.initialSpeed)||o.initialSpeed<0))throw Error('跨層圓初速不合法：'+o.id);
   return {id:o.id,stopOnEntry:o.stopOnEntry,initialSpeed:o.initialSpeed,center:[o.cx,o.cy],radius:o.r,from:layerNames[o.fromLayer],to:layerNames[o.toLayer],bidirectional:o.bidirectional};
  });
  for(const e of g.circle_entries)g[e.from==='lower'?'lower':e.from==='top'?'top_parts':'upper_parts'].push({...e,kind:'layer-circle',collision:false});
  for(const o of objects.filter(o=>o.type==='targets'&&o.spacing!==undefined)){
   if(!Number.isFinite(o.spacing)||o.spacing<13||o.spacing>100)throw Error('Target 間距不合法');
   const a=o.angle*Math.PI/180;
 for(let i=1;i<=3;i++){const t=parts(g).find(t=>t.id===o.id+'-'+i),delta=(i-2)*(o.spacing-15);
 if(t)t.points=t.points.map(p=>[p[0]+Math.cos(a)*delta,p[1]+Math.sin(a)*delta]);
 }
  }
 }
 for(const o of objects.filter(o=>o.type==='rollover')){const part=parts(g).find(p=>p.id===o.id);
 if(part)part.kind='rollover-line';
 }
 const holeMulti=layout.gameplay?.holeMultiball;
 if(layout.gameplay?.multiballHole!==undefined&&!objects.some(o=>o.id===layout.gameplay.multiballHole&&o.type==='hole'))throw Error('Multiball 出球需要有效洞口');
 if(holeMulti&&(!objects.some(o=>o.id===holeMulti.hole&&o.type==='hole')||!Number.isInteger(holeMulti.hits)||holeMulti.hits<1||holeMulti.hits>99))throw Error('Multiball 需要有效洞口及 1～99 次進洞');
 const gap=layout.gameplay?.touhouGap;
 if(gap){
  const sensor=objects.find(o=>o.id===gap.sensor&&o.type==='sensor'),hole=objects.find(o=>o.id===gap.hole&&o.type==='hole');
  if(!sensor||!hole||floor(sensor)!==floor(hole)||!hole.exitHole||!objects.some(o=>o.id===hole.exitHole&&o.type==='hole'))throw Error('隙間需要同層偵測線、收球洞與有效出口洞');
  if(!Number.isInteger(gap.passes??2)||(gap.passes??2)<1)throw Error('隙間偵測次數設定不合法');
  if((gap.passes??2)>1&&!objects.some(o=>o.id===gap.routeExit&&o.mechanic==='layer-transition'&&o.fromLayer===sensor.layer&&o.toLayer!==sensor.layer))throw Error('隙間需要指定完成軌道的出口線');
  if(gap.locks!==3)throw Error('隙間需要累積三次收球');
  if(gap.readySeconds!==undefined&&(!Number.isFinite(gap.readySeconds)||gap.readySeconds<0))throw Error('隙間準備時間不合法');
  if(gap.captureSeconds!==undefined&&(!Number.isFinite(gap.captureSeconds)||gap.captureSeconds<=0))throw Error('隙間收球時間必須大於零');
 }
 const runic=layout.gameplay?.runicTurntable;
 const bagua=layout.gameplay?.touhouBagua||runic;
 if(runic){
  const art=a=>a?.src&&Array.isArray(a.uv)&&a.uv.length===4&&a.uv.every(Number.isFinite)&&a.uv[0]>=0&&a.uv[1]>=0&&a.uv[2]>0&&a.uv[3]>0&&a.uv[0]+a.uv[2]<=1.000001&&a.uv[1]+a.uv[3]<=1.000001;
  const fixed=(runic.rewards||[]).filter(r=>r.probability!==undefined);
  if(fixed.some(r=>!Number.isFinite(r.probability)||r.probability<0||r.probability>1)||fixed.reduce((sum,r)=>sum+r.probability,0)>=1||!runic.rewards?.some(r=>r.probability===undefined&&!['enemy','multi'].includes(r.kind)))throw Error('盧恩石盤固定機率設定不合法');
  if(!['background','lower','upper','top'].includes(runic.displayPlane)||!['lower','upper','top'].includes(runic.countLayer)||runic.trigger!=='circle-entry'||!art(runic.ringArt)||!art(runic.rotorArt)||!runic.rewards?.every(r=>art(r.art)))throw Error('盧恩石盤需要通過計數與有效石刻圖片');
 }
 if(bagua){
  const marker=objects.find(o=>o.id===bagua.object&&o.type===(runic?'circle':'blockhole'));
  if(!marker||!Number.isInteger(bagua.threshold)||bagua.threshold<1||bagua.threshold>99||!Number.isFinite(bagua.radius)||bagua.radius<=0||!(bagua.spinSeconds>0)||!(bagua.winFlashSeconds>0)||!Array.isArray(bagua.rewards)||bagua.rewards.length!==8||bagua.rewards.every(r=>r.kind==='enemy'))throw Error('八卦需要位置物件、累積門檻與八個獎項');
  for(const r of bagua.rewards)if(!['score','multiplier','ball','multi','enemy'].includes(r.kind)||!Number.isInteger(r.value)||(r.kind==='enemy'?r.value!==0:r.value<=0)||!r.art?.src)throw Error('八卦獎項設定不合法');
  for(const key of ['lower','upper_parts','top_parts'])g[key]=g[key].filter(p=>p.id!==bagua.object);
 }
 // Compile object-owned rules.
 for(const part of parts(g))if(part.kind==='target')delete part.target_group;
 delete g.gameplay.target_rules;
 delete g.gameplay.hole_attacks;
 const objectEffects=objects.filter(o=>o.objectEffect).map(o=>{const effect=o.objectEffect,target=parts(g).find(p=>p.id===effect.object);if(!['target','targets','hole','blockhole','sensor'].includes(o.type)||!['hide','restore','toggle','rotate90'].includes(effect.action)||!target||!['wall','rail','bumper','rebound','active'].includes(target.kind)||target.mechanic==='guided-rail'||o.id===effect.object)throw Error('控制物件設定不合法：'+o.id);return {source:o.id,...effect};});
 g.objectEffects=objectEffects;
 const groups=objects.filter(o=>o.targetGroup).map(o=>JSON.parse(JSON.stringify(o.targetGroup))),used=new Set();
 for(const r of groups){
  const bank=Array.isArray(r.members)&&r.members.length===1&&objects.some(o=>o.id===r.members[0]&&o.type==='targets');
  if(!Array.isArray(r.members)||(!bank&&(![1,2,3].includes(r.members.length)||new Set(r.members).size!==r.members.length))||r.members.some(id=>!objects.some(o=>o.id===id&&(bank?o.type==='targets':o.type==='target'))||used.has(id)))throw Error('Target 群組需要一至三顆不重複的單個 target');
  r.members.forEach(id=>used.add(id));
  if(!r.action&&!r.secondary?.action)throw Error('請設定 Target 群組事件');
  if(r.secondary)r.secondary.id=r.id+':secondary';
  for(const event of [r,r.secondary]){if(!event?.action)continue;const r=event;
  if(!['upgrade','boss','blackHole','unblock','objectControl','attack'].includes(r.action))throw Error('請設定 Target 群組事件');
  if(r.action==='objectControl'){const target=parts(g).find(p=>p.id===r.object);if(!target||!['wall','rail','bumper','rebound','active'].includes(target.kind)||!['hide','restore','toggle','rotate90'].includes(r.effect||'hide'))throw Error('Target 群組控制物件設定不合法：'+r.id);g.objectEffects.push({source:'group:'+r.id,object:r.object,action:r.effect||'hide'});}
  if(r.action==='upgrade'&&(!Array.isArray(r.bumpers)||r.bumpers.length<1||new Set(r.bumpers).size!==r.bumpers.length||r.bumpers.some(id=>!parts(g).some(o=>o.id===id&&o.kind==='bumper'))))throw Error('升級事件需指定至少一個不重複的 Bumper');
  if(r.action==='blackHole'&&!objects.some(o=>o.id===r.hole&&['hole','blockhole'].includes(o.type)))throw Error('請指定黑洞');
  if(r.action==='unblock'){
   if(!Array.isArray(r.blockers)||r.blockers.length!==2||new Set(r.blockers).size!==2||r.blockers.some(id=>!parts(g).some(p=>p.id===id&&['wall','rail','active','rebound','bumper'].includes(p.kind))))throw Error('依序解除阻擋需指定兩個不同的碰撞物件：'+r.id);
   if(!Array.isArray(r.resetSensors)||!r.resetSensors.length||new Set(r.resetSensors).size!==r.resetSensors.length||r.resetSensors.some(id=>!objects.some(o=>o.id===id&&['sensor','rollover'].includes(o.type))))throw Error('請指定重置用的偵測線或 Rollover：'+r.id);
  }
  if(r.action==='attack'&&(!['lv1','lv2','lv3','lv4'].includes(r.attack||'lv1')||!Number.isInteger(r.attackCount??1)||(r.attackCount??1)<1||(r.attackCount??1)>99))throw Error('Target 攻擊設定不合法：'+r.id);
  if(r.spawnEnemyWhenIdle!==undefined&&typeof r.spawnEnemyWhenIdle!=='boolean')throw Error('Target 無敵人時登場設定不合法：'+r.id);
  }
  r.targets=r.members.flatMap(id=>parts(g).filter(o=>o.kind==='target'&&(o.id===id||o.id.startsWith(id+'-'))).map(o=>o.id));
  if(r.targets.length!==(bank?3:r.members.length))throw Error('Target 群組編譯後數量不符');
  for(const part of parts(g))if(r.targets.includes(part.id))part.target_group=r.id;
 }
 // Unassigned targets keep hit/reset feedback.
 for(const o of objects.filter(o=>['target','targets'].includes(o.type)&&!used.has(o.id))){
  const targets=parts(g).filter(p=>p.kind==='target'&&(p.id===o.id||p.id.startsWith(o.id+'-'))).map(p=>p.id);
  if(!targets.length)continue;
  const rule={id:'passive-'+o.id,members:[o.id],targets,action:'none'};
 groups.push(rule);
  for(const p of parts(g))if(targets.includes(p.id))p.target_group=rule.id;
 }
 // Compile black holes as controlled sockets.
 for(const r of groups.filter(r=>r.action==='blackHole'))for(const list of [g.lower,g.upper_parts,g.top_parts||[]]){
  const hole=list.find(o=>o.id===r.hole);
 if(hole?.kind==='field')Object.assign(hole,{kind:'socket',release:[...hole.center],release_direction:[0,-1]});
 }
 for(const o of objects.filter(o=>['hole','blockhole'].includes(o.type))){
  if(o.releaseMode!==undefined&&!['fixed','cadet'].includes(o.releaseMode)||o.releaseMode==='fixed'&&!Number.isFinite(o.releaseAngle))throw Error('Hole 彈射設定不合法：'+o.id);
  const socket=parts(g).find(p=>p.id===o.id&&p.kind==='socket');
 if(!socket)continue;
  if(o.ballSpeed!==undefined&&(!Number.isFinite(o.ballSpeed)||o.ballSpeed<0))throw Error('洞球速不合法：'+o.id);
  socket.ballSpeed=o.ballSpeed;
  socket.layer=floor(o);
  socket.release_mode=o.releaseMode||(o.release_direction?'fixed':'cadet');
  if(o.releaseMode==='fixed'){const a=o.releaseAngle*Math.PI/180;
 socket.release_direction=[Math.cos(a),Math.sin(a)];
 socket.release=socket.mechanic==='vortex-center'?[...socket.center]:o.release_point||socket.center.map((v,i)=>v+14*socket.release_direction[i]);
 }
 }
 for(const o of objects.filter(o=>['hole','blockhole'].includes(o.type)&&o.exitHole)){
  const entrance=parts(g).find(p=>p.id===o.id&&p.kind==='socket'),exit=parts(g).find(p=>p.id===o.exitHole&&p.kind==='socket');
  if(!entrance||!exit||o.id===o.exitHole)throw Error('出口洞設定不合法：'+o.id);
  entrance.exit_hole=o.exitHole;
 }
 for(const o of objects.filter(o=>['hole','blockhole'].includes(o.type)&&o.attractionRadius!==undefined&&o.id!==bagua?.object)){
  if(!Number.isFinite(o.attractionRadius)||o.attractionRadius<0)throw Error('吸引範圍不合法：'+o.id);
  if(o.attractionRadius>0)g[o.layer==='top'?'top_parts':o.layer==='upper'?'upper_parts':'lower'].push({id:o.id+':attraction',kind:'field',mechanic:'gravity-well',owner:o.id,center:[o.x,o.y],radius:o.attractionRadius,layer:floor(o),collision:false});
 }
 const configs=posts.map(o=>{
  const sensors=o.triggerRollovers??[],hits=o.hitCount??3;
  if(!Array.isArray(sensors)||new Set(sensors).size!==sensors.length||sensors.some(id=>!objects.some(o=>o.id===id&&o.type==='rollover')))throw Error('Center post Rollover 線不存在或重複：'+o.id);
  if(!Number.isInteger(hits)||hits<1||hits>99)throw Error('Center post 碰撞次數需為 1～99');
  const radius=o.radius??5;if(!Number.isFinite(radius)||radius<.5||radius>100)throw Error('Center post 半徑需為 0.5～100：'+o.id);
  const part={id:o.id,kind:'wall',mechanic:'center-post',center:[o.x,o.y],radius};
  for(const key of ['lower','upper_parts','top_parts'])g[key]=(g[key]||[]).filter(p=>p.id!==o.id&&p.id!=='test-post-center');
  g[o.layer==='top'?'top_parts':o.layer==='upper'?'upper_parts':'lower'].push(part);
  return {...part,layer:floor(o),sensors,hits};
 });
 const attacks={};
 for(const o of objects)if(o.attack!==undefined){if(!['hole','blockhole','rollover','sensor','target'].includes(o.type)||!['none','lv1','lv2','lv3','lv4'].includes(o.attack))throw Error('攻擊設定不合法：'+o.id);
 attacks[o.id]=o.attack;
 }
 const rolloverGroups=objects.filter(o=>o.rolloverGroup).map(o=>JSON.parse(JSON.stringify(o.rolloverGroup))),rolloverMembers=new Set();
 for(const r of rolloverGroups){if(!Array.isArray(r.members)||r.members.length<2||new Set(r.members).size!==r.members.length||r.members.some(id=>rolloverMembers.has(id)||!objects.some(o=>o.id===id&&o.type==='rollover'))||!['none','lv1','lv2','lv3','lv4'].includes(r.attack))throw Error('Rollover 群組設定不合法：'+r.id);
 r.members.forEach(id=>rolloverMembers.add(id));
 }
 const attackCounts={};
 for(const o of objects.filter(o=>['rollover','sensor','target'].includes(o.type)))attackCounts[o.id]=o.attackCount??1;
 for(const r of rolloverGroups)attackCounts[r.id]=r.attackCount??1;
 for(const [id,count] of Object.entries(attackCounts))if(!Number.isInteger(count)||count<1||count>99)throw Error('攻擊倒數需為 1～99：'+id);
 const targetAttackSources={};for(const o of objects.filter(o=>o.type==='target'&&o.attack&&o.attack!=='none'))for(const p of parts(g).filter(p=>p.kind==='target'&&(p.id===o.id||p.id.startsWith(o.id+'-'))))targetAttackSources[p.id]=o.id;
 g.mechanisms={posts:configs,groups,attacks,rolloverGroups,attackCounts,targetAttackSources};
 return g;
}
function compile(layout,base,compiler){const copy=JSON.parse(JSON.stringify(layout));
 copy.objects=copy.objects.filter(o=>o.type!=='centerPost'&&!(o.type==='circle'&&o.mechanic==='layer-transition'));
 copy.objects=copy.objects.map(o=>o.type==='rollover'?{...o,type:'sensor'}:o);
 return prepare(layout,compiler(copy,base));
 }

const api={prepare,compile};
 if(typeof module!=='undefined')module.exports=api;
 else root.MechanismLayout=api;
})(globalThis);

/* Layout guides and debug text; no gameplay mutations. */
(function(root){
"use strict";
function draw(o,game,ctx,circle){if(!o)return false;if(game.hiddenObjects?.has(o.id))return true;
 if(game.isBlockerDisabled?.(o.id)){ctx.save();
 ctx.globalAlpha*=.25;
 ctx.setLineDash([2,2]);
 if(o.center)circle(o.center,o.radius,null,'#83bdd0');
 else if(o.points?.length){ctx.beginPath();
 ctx.moveTo(...o.points[0]);
 for(const p of o.points.slice(1))ctx.lineTo(...p);
 ctx.strokeStyle='#83bdd0';
 ctx.lineWidth=.9;
 ctx.stroke();
 }ctx.restore();
 return true;
 }if(o.kind==='rollover-line'){ctx.save();
 const lit=game.rolloverLit?.(o.id);
 ctx.strokeStyle=lit?'#fff4a0':'#98deb8';
 ctx.lineWidth=lit?2.5:1.4;
 ctx.beginPath();
 ctx.moveTo(...o.points[0]);
 ctx.lineTo(...o.points[1]);
 ctx.stroke();
 ctx.restore();
 return true;
 }if(o.kind==='layer-circle'){ctx.save();
 ctx.setLineDash([2,2]);
 circle(o.center,o.radius,null,'#77e8d1');
 ctx.restore();
 return true;
 }const p=game.configuredPosts?.get(o.id);
 if(!p)return false;
 circle(p.center,p.radius,p.raised?'#ffd477':'#263945',p.raised?'#fff1b9':'#667986');
 ctx.save();
 ctx.fillStyle='#fff';
 ctx.font='4px sans-serif';
 ctx.textAlign='center';
 if(!p.raised)ctx.fillText(p.collected.size+'/'+p.sensors.length,p.center[0],p.center[1]+1.5);
 ctx.restore();
 return true;
 }
function drawPostCounts(game,ctx,plane,color='#fff5bb'){
 for(const post of game.configuredPosts?.values()||[]){
  if(!post.raised||(post.layer==='tavern'?'upper':post.layer)!==plane)continue;
  ctx.save();
  ctx.globalAlpha=1;ctx.setLineDash([]);
  ctx.font='bold '+Math.max(7,Math.min(12,post.radius*1.3))+'px sans-serif';
  ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.lineWidth=1.5;ctx.strokeStyle=color==='#000'?'#fff5bb':'#21180e';ctx.fillStyle=color;
  ctx.strokeText(String(post.left),...post.center);
  ctx.fillText(String(post.left),...post.center);
  ctx.restore();
 }
}
function status(game){const items=[...(game.configuredPosts?.values()||[])].map(p=>'Center post '+p.id+'：'+(p.raised?'剩 '+p.left+' 次':p.collected.size+'/'+p.sensors.length));
 if(game.gapLock){const gap=game.gapLock;items.push('隙間 '+(gap.active?'多球中':gap.count+'/3 · '+(gap.armed?'開啟':gap.routePending?'首趟進行中':gap.passes?'首趟完成，待再次進入':'待首趟完成')));}
 return items.join(' · ');
 }
function groupStatus(game){return [...[...(game.attackRemaining||[])].filter(([id])=>game.g.mechanisms.attacks[id]&&game.g.mechanisms.attacks[id]!=='none'||game.rolloverGroups?.some(g=>g.id===id&&g.attack!=='none')).map(([id,n])=>id+' 攻擊倒數 '+n),...(game.configuredGroups||[]).map(g=>g.id+' '+(g.action==='unblock'?'解除阻擋 '+g.unlocked+'/'+g.blockers.length+' · Target '+g.collected.size+'/'+g.targets.length:g.collected.size+'/'+g.targets.length)),...(game.rolloverGroups||[]).map(g=>g.id+' '+g.collected.size+'/'+g.members.length)].join(' · ');
 }

const api={draw,drawPostCounts,status,groupStatus};
 if(typeof module!=='undefined')module.exports=api;
 else root.MechanismView=api;
})(globalThis);

/* Shared gameplay rules. */
(function(root){
'use strict';
const layout=typeof module!=='undefined'?require('./mechanism-layout.js'):root.MechanismLayout;
const view=typeof module!=='undefined'?require('./mechanism-view.js'):root.MechanismView;
function createGame(Base,P){return class ConfiguredGame extends Base{
  reset(){this.gapLock=null;super.reset();}
  gapBusy(){return this.gapLock?.active||this.freeBallQueue>0||this.balls.filter(b=>b.state!=='drained').length>1;}
  spawnFreeBall(){
   const entrance=this.socketsById.get(this.g.gameplay?.multiballHole);
   if(!entrance)return super.spawnFreeBall();
   if(!this.freeBallQueue)return;
   if(this.balls.filter(b=>b.state!=='drained').length>=3){this.freeBallQueue--;this.awardExtraLife('multiball',this.freeBallRewardPositions.shift()||this.ball.p);return;}
   const exit=this.socketsById.get(entrance.exit_hole)||entrance;
   if(this.time<(this.holeMultiballNextAt||0)||this.balls.some(b=>b.state==='captured'&&b.held?.id===exit.id||b.state!=='drained'&&b.layer===exit.layer&&P.len(P.sub(b.p,exit.release))<this.physics.ballRadius*2+3))return;
   const previous=this.ball,b={p:[...exit.center],v:[0,0],layer:exit.layer,z:0,state:'captured',immunity:0,trail:[],free:true};
   this.balls.push(b);this.ball=b;this.held={id:exit.id,remaining:0,speed:0,release:[...exit.release],layer:exit.layer,direction:exit.release_direction};
   this.release();this.freeBallQueue--;this.freeBallRewardPositions.shift();this.holeMultiballNextAt=this.time+.5;
   this.emit('free-ball-launch',{id:exit.id,position:[...b.p],layer:b.layer});this.ball=previous;
  }
  awardGapMultiball(count){
   const gap=this.g.gameplay.touhouGap,state=this.gapLock;
   const room=Math.max(0,3-this.balls.filter(b=>b.state!=='drained').length-this.freeBallQueue-state.pending),added=Math.min(count,room);
   if(!added)return;
   if(!state.active){
    const delay=gap.readySeconds??1.5;
    Object.assign(state,{count:0,active:true,readyAt:this.time,releaseStartedAt:null,nextReleaseAt:this.time+delay});
    if(this.held?.id===gap.hole)this.held.remaining=delay;
   }
   state.pending+=added;this.multiballAwards+=added;
   this.emit('multiball-awarded',{count:this.multiballAwards});
   this.emit('gap-multiball',{id:gap.hole,balls:this.balls.filter(b=>b.state!=='drained').length+state.pending});
  }
  releaseGapBall(){
   const state=this.gapLock,gap=this.g.gameplay?.touhouGap;
   if(!state?.pending||this.time<state.nextReleaseAt||this.balls.some(b=>b.state==='captured'&&b.held?.id===gap.hole))return;
   const entrance=this.socketsById.get(gap.hole),exit=this.socketsById.get(entrance.exit_hole),p=exit.release;
   if(this.balls.filter(b=>b.state!=='drained').length+this.freeBallQueue>=3)return;
   if(this.balls.some(b=>b.state!=='drained'&&b.layer===exit.layer&&P.len(P.sub(b.p,p))<this.physics.ballRadius*2+3))return;
   const previous=this.ball,b={p:[...exit.center],v:[0,0],layer:exit.layer,z:0,state:'captured',immunity:0,trail:[],free:true};
   this.balls.push(b);this.ball=b;this.held={id:exit.id,remaining:0,speed:0,release:[...exit.release],layer:exit.layer,direction:exit.release_direction};
   this.release();state.releaseStartedAt??=this.time;state.pending--;state.nextReleaseAt=this.time+.5;
   this.emit('free-ball-launch',{id:exit.id,position:[...b.p],layer:b.layer});this.ball=previous;
  }
  // Physics integration: flippers, portals and guided tracks.
  enterGuidedTrack(track){
   const previous=[...this.ball.p],layer=this.ball.layer;
   super.enterGuidedTrack(track);
   // Snapping to an entrance can cross a sensor before guided motion skips afterBallStep.
   // Connected guided segments have no free-ball entrance movement to count.
   if(layer!=='guided')this.crossConfiguredSensors(previous,layer);
  }
  collide(dt){
   if(this.config.physicsModel!=='legacy'){super.collide(dt);return;}
   const Cadet=typeof module!=='undefined'?require('./game/space-cadet-flipper.js'):root.SpaceCadetFlipper;
   for(const f of this.flippers){
    if(!f.cadet)f.cadet=new Cadet(f,this.config);
    if(f.cadet.configuredWallGuard)continue;
    const find=f.cadet.find.bind(f.cadet);
    f.cadet.find=(p,v,time,remaining)=>{
     const hit=find(p,v,time,remaining);
 if(!hit?.position)return hit;
     const d=P.sub(hit.position,p),r=this.physics.ballRadius;
     // Sweep depenetration against walls to prevent tunneling.
     for(const edge of [...this.grids[this.ball.layer].query(p,d,Math.max(5,r)),...this.dynamicEdges()]){
      if(!['wall','rail','gate'].includes(edge.kind)||!this.edgeEnabled(edge))continue;
      if(edge.n&&(P.dot(d,edge.n)>=-P.EPS||P.dot(P.sub(p,edge.a),edge.n)<r-.08))continue;
      const blocked=edge.c?P.circleHit(p,d,edge.c,r+edge.r):P.segmentHit(p,d,edge.a,edge.b,r+(edge.thickness||0)/2);
      if(blocked&&blocked.t<1-1e-6)return null;
     }
     return hit;
    };
    f.cadet.configuredWallGuard=true;
   }
   super.collide(dt);
  }
 emit(type,data={}){
  const gap=this.g.gameplay?.touhouGap,state=this.gapLock;
  if(gap&&state&&type==='multiball-awarded'&&(!gap.keepOpenUntilFull||state.active)){state.armed=false;state.passes=0;state.routePending=false;this.armedHoles.delete(gap.hole);}
  if(gap&&state&&type==='drain'){
   state.routePending=false;
   if(!this.storyMode&&!this.preserveTableOnDrain&&!this.freeBallQueue&&!state.pending&&this.balls.every(b=>b.state==='drained')){
    Object.assign(state,{count:0,passes:0,routePending:false,armed:false,active:false,pending:0,readyAt:0,releaseStartedAt:null,nextReleaseAt:0});
    this.armedHoles.delete(gap.hole);this.gapLaunchAt?.delete(gap.hole);this.holeCapturedAt?.delete(gap.hole);
   }
  }
  if(gap&&state&&type==='layer'&&data.id===gap.routeExit&&state.routePending&&!this.gapBusy()){
   state.routePending=false;state.passes++;super.emit('gap-route-completed',{id:gap.routeExit,passes:state.passes});
  }
  if(gap&&state&&type==='sensor'&&data.id===gap.sensor&&!state.armed&&!state.routePending&&!this.gapBusy()){
   if(state.passes>=(gap.passes??2)-1){state.passes=0;state.armed=true;this.armedHoles.add(gap.hole);super.emit('gap-opened',{id:gap.hole,locked:state.count});}
   else state.routePending=true;
  }
  if(type==='gap-ball-ready'){this.gapLaunchAt??=new Map();this.gapLaunchAt.set(data.id,this.time);}
  if(type==='configured-attack'){this.attackVisualAt??=new Map();
 this.attackVisualAt.set(data.kind,this.time);
 }return super.emit(type,data);
 }
 portalHit(p,d){let best=super.portalHit(p,d);
 const b=this.ball,entries=this.g.circle_entries||[];
  if(b.circleEntryBlocked){if(entries.some(e=>P.len(P.sub(p,e.center))<=e.radius+.05))return best;
 b.circleEntryBlocked=false;
 }
  for(const e of entries){const to=b.layer===e.from?e.to:e.bidirectional&&b.layer===e.to?e.from:null;
 if(!to)continue;
 const h=P.len(P.sub(p,e.center))<=e.radius?{t:0}:P.circleHit(p,d,e.center,e.radius);
 if(h&&(!best||h.t<best.t))best={t:h.t,editorPortal:{id:e.id,to,stopOnEntry:e.stopOnEntry,initialSpeed:e.initialSpeed},circleEntry:true,center:e.center};
 }return best;
 }
 transition(hit){
 if(!hit.circleEntry)return super.transition(hit);
 const b=this.ball;
 b.circleEntryBlocked=true;
 b.entryCapture={hit,start:[...b.p],incoming:[...b.v],elapsed:0};
 b.v=[0,0];b.state='entry-capture';b.trail=[];
 }
 handleBallState(dt){
 const b=this.ball;
 if(b.state!=='entry-capture')return super.handleBallState(dt);
 const capture=b.entryCapture;
 capture.elapsed+=dt;
 const t=Math.min(1,capture.elapsed/.15);
 b.p=P.add(capture.start,P.mul(P.sub(capture.hit.center,capture.start),t));
 if(t===1){
  b.p=[...capture.hit.center];b.v=capture.incoming;b.state='playing';delete b.entryCapture;
  super.transition(capture.hit);
 }
 return true;
 }
 guidedTrackHit(p,d){const layer=this.ball.layer,tracks=this.guidedTracks;
 if(!['lower','tavern','top'].includes(layer))return null;
 try{this.guidedTracks=tracks.filter(t=>t.layer===layer);
 this.ball.layer='lower';
 return super.guidedTrackHit(p,d);
 }finally{this.guidedTracks=tracks;
 this.ball.layer=layer;
 }}
 advanceGuidedTrack(dt){const tracks=this.guidedTracks,layer=tracks.find(t=>t.id===this.ball.track.id).layer,previous=[...this.ball.p];
 try{this.guidedTracks=tracks.filter(t=>t.layer===layer);
 const remaining=super.advanceGuidedTrack(dt);
 this.crossConfiguredSensors(previous,layer);
 if(this.ball.state==='playing')this.ball.layer=layer;
 return remaining;
 }finally{this.guidedTracks=tracks;
 }}
 rebuildObjectGrids(){for(const layer of ['lower','tavern','top'])if(this.edges[layer])this.grids[layer]=new P.Grid(this.edges[layer]);}
 restoreObjectGeometry(part){const original=this.objectGeometryOriginal?.get(part);if(!original)return;for(const [point,value] of original){point[0]=value[0];point[1]=value[1];}this.objectGeometryOriginal.delete(part);this.rebuildObjectGrids();}
 applyObjectEffect(source){
  for(const rule of this.g.objectEffects||[]){if(rule.source!==source||(!['restore','toggle'].includes(rule.action)&&this.objectEffectsDone.has(source))||(rule.action==='rotate90'&&this.rotatedObjects.has(rule.object)))continue;
   this.objectEffectsDone.add(source);
   const part=[...this.g.lower,...this.g.upper_parts,...(this.g.top_parts||[])].find(o=>o.id===rule.object);
   if(rule.action==='toggle'){if(this.hiddenObjects.has(part.id))this.hiddenObjects.delete(part.id);else this.hiddenObjects.add(part.id);}
   else if(rule.action==='hide')this.hiddenObjects.add(part.id);
   else if(rule.action==='restore'){this.hiddenObjects.delete(part.id);this.restoreObjectGeometry(part);this.rotatedObjects.delete(part.id);for(const related of this.g.objectEffects||[])if(related.object===part.id)this.objectEffectsDone.delete(related.source);}
   else if(part.points?.length){
    this.rotatedObjects.add(part.id);
    const points=[...new Set(part.points)],normal=part.pass_normal;
    if(!this.objectGeometryOriginal.has(part))this.objectGeometryOriginal.set(part,new Map([...points,...(normal?[normal]:[])].map(p=>[p,[...p]])));
    const center=[(Math.min(...points.map(p=>p[0]))+Math.max(...points.map(p=>p[0])))/2,(Math.min(...points.map(p=>p[1]))+Math.max(...points.map(p=>p[1])))/2];
    for(const p of points){const x=p[0]-center[0],y=p[1]-center[1];p[0]=center[0]-y;p[1]=center[1]+x;}
    if(normal){const x=normal[0];normal[0]=-normal[1];normal[1]=x;}
    this.rebuildObjectGrids();
   }
   this.emit('object-effect',{source,object:rule.object,action:rule.action});
  }
 }
 capture(...args){if(args[0]===this.g.gameplay?.touhouGap?.hole&&(!this.gapLock?.armed||this.gapBusy()))return;const playing=this.ball.state==='playing',start=this.events.length;super.capture(...args);if(playing&&this.ball.state==='captured'&&this.held?.id===args[0]&&!this.events.slice(start).some(e=>e.type==='object-effect'&&e.source===args[0]))this.applyObjectEffect(args[0]);}
 // Rule state.
 resetTargets(){
 for(const part of this.objectGeometryOriginal?.keys()||[])this.restoreObjectGeometry(part);
 this.objectGeometryOriginal=new Map();
 this.objectEffectsDone=new Set();this.hiddenObjects=new Set();this.rotatedObjects=new Set();
 super.resetTargets();
 this.configuredPosts=new Map((this.g.mechanisms?.posts||[]).map(p=>[p.id,{...p,collected:new Set(),raised:false,left:0,contacts:new Set()}]));
 this.configuredGroups=(this.g.mechanisms?.groups||[]).map(r=>({...r,secondary:r.secondary?{...r.secondary,unlocked:0}:undefined,collected:new Set(),last:-Infinity,unlocked:0}));
 for(const r of this.configuredGroups){if(r.secondary)r.secondary.groupState=r;let group=this.targetGroups.find(g=>g.id===r.id);
 if(!group){group={id:r.id,hits:new Set(),complete:false,completions:0,resetAt:0};
 this.targetGroups.push(group);
 }group.targets=[...r.targets];
 }this.configuredBumpers=new Map();
 this.armedHoles=new Set();this.gapLaunchAt=new Map();
 this.holeExpiresAt=new Map();
 this.holeMultiballHits=0;
 this.holeMultiballNextAt=0;
 if(this.configuredGroups.some(r=>r.action==='blackHole')){this.vortexActive=false;
 this.vortexActivatedAt=null;
 }this.attackVisualAt=new Map();
 this.attackCompletedAt=new Map();
 this.bumperRewardAt=new Map();
 this.objectAttackAt=new Map();
 this.attackRemaining=new Map(Object.entries(this.g.mechanisms?.attackCounts||{}));
 this.rolloverFlipperInput={left:false,right:false};
 this.rolloverFlashUntil=new Map();
 this.rolloverVisualGroups=new Map();
 this.rolloverCompletedAt=new Map();
 this.rolloverGroups=(this.g.mechanisms?.rolloverGroups||[]).map(r=>({...r,collected:new Set()}));
 // Rebuild event indexes on reset.
 this.rolloverByMember=new Map();
 for(const group of this.rolloverGroups)for(const id of group.members)this.rolloverByMember.set(id,group);
 this.targetRuleById=new Map();
 this.targetDisplayById=new Map(this.targetGroups.map(group=>[group.id,group]));
 this.blockerOwners=new Map();this.blockerResets=new Map();this.controlledHoles=new Set();
 const add=(map,id,value)=>{if(!map.has(id))map.set(id,[]);map.get(id).push(value)};
 for(const rule of this.configuredGroups.flatMap(r=>[r,...(r.secondary?[r.secondary]:[])])){
  for(const id of rule.targets||[])this.targetRuleById.set(id,rule);
  if(rule.action==='blackHole')this.controlledHoles.add(rule.hole);
  if(rule.action==='unblock'){
   rule.blockers.forEach((id,index)=>add(this.blockerOwners,id,{rule,index}));
   for(const id of rule.resetSensors)add(this.blockerResets,id,rule);
  }
 }
 this.postsByRollover=new Map();
 for(const post of this.configuredPosts.values())for(const id of post.sensors)add(this.postsByRollover,id,post);
 this.rescueById=new Map((this.g.rescue_kickers||[]).map(kicker=>[kicker.id,kicker]));
 this.socketsById=new Map();this.socketsByLayer=new Map();this.sensorsByLayer=new Map();
 for(const [layer,list] of [['lower',this.g.lower],['tavern',this.g.upper_parts],['top',this.g.top_parts||[]]]){
  const sockets=list.filter(part=>part.kind==='socket');this.socketsByLayer.set(layer,sockets);
  for(const socket of sockets)this.socketsById.set(socket.id,socket);
  this.sensorsByLayer.set(layer,list.filter(part=>['sensor','rollover-line'].includes(part.kind)));
 }

 const gap=this.g.gameplay?.touhouGap;
 if(gap){const armed=!!gap.keepOpenUntilFull&&!!this.gapLock?.armed;this.gapLock??={count:0,passes:0,routePending:false,armed:false,active:false,pending:0,nextReleaseAt:0};this.gapLock.armed=armed;if(armed)this.armedHoles.add(gap.hole);this.gapLock.passes=0;this.gapLock.routePending=false;this.controlledHoles.add(gap.hole);}

 }
 // Attack counters and grouped rollover completion.
 fireObjectAttack(objectId){
  const group=this.rolloverByMember.get(objectId);
  const id=group?.id||objectId;
  const kind=group?group.attack:this.g.mechanisms?.attacks?.[id];
  if(!kind||kind==='none'&&!this.g.gameplay?.indicatorCounters?.includes(id))return;
  if(this.time-(this.objectAttackAt.get(id)??-Infinity)<.3)return;

  if(group){
   group.collected.add(objectId);
   if(group.collected.size<group.members.length)return;
   group.collected.clear();
  }

  this.objectAttackAt.set(id,this.time);
  const count=this.g.mechanisms.attackCounts[id]??1;
  const remaining=(this.attackRemaining.get(id)??count)-1;
  this.attackRemaining.set(id,remaining>0?remaining:count);
  this.emit('attack-countdown',{id,remaining});
  if(remaining>0)return;

  this.attackCompletedAt.set(id,this.time);
  // Table feedback is independent of enemy presence; the theater guards damage.
  if(kind!=='none')this.emit('configured-attack',{kind,id,position:[...this.ball.p]});
 }
 // Hole release, activation and expiry.
 release(){
   const gap=this.g.gameplay?.touhouGap,state=this.gapLock;
   if(gap&&this.held?.id===gap.hole&&state.count>0&&!state.active){
    const b=this.ball,p=this.g.plunger;
    Object.assign(b,{p:[p.x,p.rest_y-this.physics.ballRadius],v:[0,0],layer:this.launchLayer(),z:this.launchHeight(),state:'ready',immunity:0,trail:[],launchGuard:false});
    delete b.held;delete b.track;this.charge=this.chargeElapsed=0;this.input.launch=false;
    const gate=this.gates.find(g=>g.id==='shooter-return');if(gate){gate.closed=false;gate.pending=false;gate.pendingBall=null;}
    this.emit('gap-ball-ready',{id:gap.hole,locked:state.count});if(gap.autoLaunch)this.launch(1);return;
   }
  const h=this.held,entrance=this.socketsById.get(h?.id),socket=this.socketsById.get(entrance?.exit_hole)||entrance,releaseStart=[...this.ball.p],remote=socket!==entrance;
 if(!socket?.release_mode)return super.release();
  // Space Cadet angular and speed variation.
  // https://github.com/k4zmu2a/SpaceCadetPinball/blob/master/SpaceCadetPinball/TBall.cpp
  const spread=socket.mechanic==='vortex-center'?45:5;
  const random=this.random||Math.random,angle=this.config.physicsModel!=='legacy'||socket.release_mode==='fixed'?0:(1-2*random())*spread*Math.PI/180;
  const d=socket.release_direction||h.direction,c=Math.cos(angle),s=Math.sin(angle),speed=socket.ballSpeed>0?socket.ballSpeed:this.config.physicsModel!=='legacy'?this.physics.kickbackSpeed:260*this.physics.speedScale*(1+(1-2*random())*.1),b=this.ball;
  b.p=[...(remote?socket.release:h.release)];
 b.layer=remote?socket.layer:h.layer;
 b.z=b.layer==='top'?this.physics.rampHeight*2:b.layer==='tavern'?this.physics.rampHeight:0;
 b.v=P.mul(P.unit([d[0]*c-d[1]*s,d[0]*s+d[1]*c]),speed);
  b.state='playing';
 b.immunity=this.time+.5;
 this.held=null;
 this.limitSpeed();
 if(gap&&h.id===gap.hole&&state.active&&state.pending>0){state.releaseStartedAt=this.time;state.nextReleaseAt=this.time+.5;}
 this.emit('release',{id:h.id,speed:P.len(b.v)});
 // Scan only the exit's local ejection segment, never the teleport between holes.
 if(!socket.remote_release)this.crossConfiguredSensors(remote?socket.center:releaseStart,b.layer);
 }
 syncHoleActivation(){this.vortexActive=this.armedHoles.size>0;
 }
 activateHole(id){this.armedHoles.add(id);
 this.holeExpiresAt.set(id,this.time+15);
 this.vortexActivatedAt=this.time;
 this.syncHoleActivation();
 }
 consumeHole(id){if(this.armedHoles.has(id)){this.armedHoles.delete(id);
 this.holeExpiresAt.delete(id);
 this.syncHoleActivation();
 this.emit('vortex-deactivated',{id});
 }}
 expireHoles(){for(const [id,until] of this.holeExpiresAt)if(this.time>=until){this.holeExpiresAt.delete(id);
 this.armedHoles.delete(id);
 this.syncHoleActivation();
 this.emit('vortex-expired',{id});
 }}
 tickRules(){this.updateTargetGroups();
 this.expireHoles();
 this.releaseGapBall();
 }
 onCapture(id){
 const multi=this.g.gameplay?.holeMultiball;
 if(multi&&id===multi.hole){this.holeMultiballHits++;if(this.holeMultiballHits>=multi.hits){this.holeMultiballHits=0;this.awardMultiball();}}
 const gap=this.g.gameplay?.touhouGap,state=this.gapLock;
 if(gap&&id===gap.hole){
  if(gap.captureSeconds>0&&this.held)this.held.remaining=gap.captureSeconds;
  state.count++;state.armed=!!gap.keepOpenUntilFull&&state.count<gap.locks;if(!state.armed)this.armedHoles.delete(id);
  this.emit('gap-ball-locked',{id,locked:state.count});
  if(state.count===gap.locks){const delay=gap.readySeconds??1.5;state.count=0;state.active=true;state.pending=2;state.readyAt=this.time;state.releaseStartedAt=null;state.nextReleaseAt=this.time+delay;if(this.held)this.held.remaining=delay;this.multiballAwards++;this.emit('multiball-awarded',{count:this.multiballAwards});this.emit('gap-multiball',{id,balls:3});}
 }
 this.fireObjectAttack(id);
 if(!gap?.keepOpenUntilFull||id!==gap.hole||!state.armed)this.consumeHole(id);
 }
 // Rollover display and center-post collection.
 recordRolloverLight(id){
  const group=this.rolloverByMember.get(id);
  if(!group){this.rolloverFlashUntil.set(id,this.time+.65);
 return;
 }
  let hits=this.rolloverVisualGroups.get(group.id);
 if(!hits){hits=new Set();
 this.rolloverVisualGroups.set(group.id,hits);
 }hits.add(id);
  if(group.members.every(id=>hits.has(id))){this.rolloverCompletedAt.set(group.id,this.time);for(const member of group.members)this.rolloverFlashUntil.set(member,this.time+.65);
 hits.clear();
 }
 }
 rolloverLit(id){
  const group=this.rolloverByMember.get(id);
  return (this.rolloverFlashUntil.get(id)||0)>this.time||!!this.rolloverVisualGroups.get(group?.id)?.has(id)||(this.postsByRollover.get(id)||[]).some(post=>post.collected.has(id));
 }
 syncPost(){const p=this.configuredPosts.values().next().value;
 if(p){this.centerPostRaised=p.raised;
 this.centerPostHitsLeft=p.left;
 }}
 raiseCenterPost(id){if(id){const post=this.configuredPosts?.get(id);
 if(post)this.activatePost(post);
 return;
 }for(const post of this.configuredPosts?.values()||[])if(post.sensors.length&&post.sensors.every(id=>post.collected.has(id)))this.activatePost(post);
 }
 activatePost(p){if(p.raised)return;
 p.raised=true;
 p.left=p.hits;
 p.collected.clear();
 p.contacts.clear();
 this.syncPost();
 this.emit('center-post-up',{id:p.id});
 }
 // Target-controlled blockers and per-ball collision hooks.
 isBlockerDisabled(id){return (this.blockerOwners?.get(id)||[]).some(({rule,index})=>index<rule.unlocked);
 }
 resetBlockers(sensorId){for(const r of this.blockerResets.get(sensorId)||[]){r.unlocked=0;
 const state=r.groupState||r;state.last=this.time;
 state.collected.clear();
 for(const id of state.targets){this.targetHits.delete(id);
 this.targetHitAt.delete(id);
 }const display=this.targetDisplayById.get(state.id);
 display.hits.clear();
 display.complete=false;
 display.resetAt=0;
 this.emit('blockers-reset',{id:r.id,objects:[...r.blockers]});
 }}
 edgeEnabled(e,b=this.ball){if(this.hiddenObjects?.has(e.id)||this.isBlockerDisabled(e.id))return false;
 const p=this.configuredPosts?.get(e.id);
 return p?p.raised:super.edgeEnabled(e,b);
 }
 collisionEffect(e,approach){const p=this.configuredPosts?.get(e.id);
 if(!p)return super.collisionEffect(e,approach);
 if(!p.raised||approach<=0||p.contacts.has(this.ball))return;
 p.contacts.add(this.ball);
 p.hitUntil=this.time+.12;
 p.left--;
 this.emit('center-post-hit',{id:p.id,remaining:p.left});
 if(!p.left){p.raised=false;
 this.emit('center-post-down',{id:p.id});
 }this.syncPost();
 }
 updateRolloverLaneChange(){
  const previous=this.rolloverFlipperInput||{left:false,right:false},left=!!this.input.left,right=!!this.input.right;
  this.rolloverFlipperInput={left,right};
  const shift=(right&&!previous.right?1:0)-(left&&!previous.left?1:0);
  if(!shift)return;
  const parts=[...(this.g.lower||[]),...(this.g.upper_parts||[]),...(this.g.top_parts||[])];
  const x=id=>{const p=parts.find(p=>p.id===id);return p?.points?.length?p.points.reduce((sum,point)=>sum+point[0],0)/p.points.length:p?.a&&p?.b?(p.a[0]+p.b[0])/2:(p?.c?.[0]??p?.p?.[0]??0);};
  for(const group of this.rolloverGroups||[]){
   if(group.laneChange!==true)continue;
   const members=[...group.members].sort((a,b)=>x(a)-x(b)),rotate=set=>new Set([...set].map(id=>{const index=members.indexOf(id);return index<0?id:members[(index+shift+members.length)%members.length];}));
   const hits=this.rolloverVisualGroups.get(group.id);if(hits)this.rolloverVisualGroups.set(group.id,rotate(hits));
   group.collected=rotate(group.collected);
  }
 }
 afterSubstep(){this.updateRolloverLaneChange();this.spawnFreeBall();
 if(this.gapLock?.active&&!this.gapLock.pending&&!this.freeBallQueue&&this.balls.filter(b=>b.state!=='drained').length<=1)this.gapLock.active=false;
 for(const p of this.configuredPosts.values())for(const b of p.contacts)if(b.state!=='playing'||b.layer!==p.layer||P.len(P.sub(b.p,p.center))>p.radius+this.physics.ballRadius+.3)p.contacts.delete(b);
 }
 afterBallStep(previous,layer,dt){
  this.applyOneWaySpeed?.(previous,layer);
  if(this.ball.launchGuard&&this.ball.v[1]>=0&&this.ball.p[1]>this.launchGateExitY+this.physics.ballRadius)this.ball.launchGuard=false;
  this.flagSensors(previous,layer);
  this.sensors(dt);
  if(this.ball.state!=='playing')return;

  this.crossConfiguredSensors(previous,layer);
 }
 crossConfiguredSensors(previous,layer){
  const movement=P.sub(this.ball.p,previous);
  const floorParts=this.sensorsByLayer.get(layer)||[];
  const crossedRollovers=new Set();
  for(const sensor of floorParts||[]){
   const axis=P.sub(sensor.points[1],sensor.points[0]);
   const denominator=P.cross(movement,axis);
   if(Math.abs(denominator)<1e-8)continue;
   const delta=P.sub(sensor.points[0],previous);
   const alongMovement=P.cross(delta,axis)/denominator;
   const alongSensor=P.cross(delta,movement)/denominator;
   // Count arrival at the line, excluding departure from a shared step endpoint.
   if(alongMovement<=0||alongMovement>1||alongSensor<0||alongSensor>1)continue;

   if(sensor.kind==='sensor'){this.sensorHitAt.set(sensor.id,this.time);this.emit('sensor',{id:sensor.id,layer,position:[...this.ball.p]});}
   else{
    crossedRollovers.add(sensor.id);
    this.recordRolloverLight(sensor.id);
    this.emit('rollover',{id:sensor.id,layer});
   }
   this.applyObjectEffect(sensor.id);
   this.fireObjectAttack(sensor.id);
   this.resetBlockers(sensor.id);
  }

  const touchedPosts=new Set();
  for(const id of crossedRollovers)for(const post of this.postsByRollover.get(id)||[]){
   if(post.raised)continue;
   post.collected.add(id);touchedPosts.add(post);
  }
  for(const post of touchedPosts)if(post.sensors.every(id=>post.collected.has(id)))this.activatePost(post);
 }
 bumperLevel(id){return this.configuredBumpers?.get(id)??1;
 }
 // Target-bank completion actions.
 recordTarget(id){const attackSource=this.g.mechanisms?.targetAttackSources?.[id];if(attackSource)this.fireObjectAttack(attackSource);this.applyObjectEffect(id);const bank=(this.g.objectEffects||[]).find(r=>id.startsWith(r.source+'-'));if(bank)this.applyObjectEffect(bank.source);const r=this.targetRuleById.get(id);
 if(!r)return;
  if(r.action==='unblock'&&r.unlocked>=r.blockers.length&&!r.secondary?.action)return;
 this.updateTargetGroups();
 if(this.time-r.last<.4||r.collected.has(id))return;
 this.targetHitAt.set(id,this.time);
 this.targetHits.add(id);
 r.collected.add(id);
  const display=this.targetDisplayById.get(r.id);
 display.hits.add(id);
 this.emit('target-hit',{id,group:r.id,count:r.collected.size});
  if(r.collected.size!==r.targets.length)return;
 r.collected.clear();
 r.last=this.time;
 display.complete=true;
 display.resetAt=this.time+.4;
 display.completions++;
  for(const event of [r,r.secondary].filter(e=>e?.action).sort((a,b)=>(b.action==='boss')-(a.action==='boss')))this.runTargetEvent(event);
  this.emit('target-group-complete',{id:r.id});
 }
 runTargetEvent(r){
  if(r.action==='objectControl')this.applyObjectEffect('group:'+r.id);
  if(r.action==='unblock'&&r.unlocked<r.blockers.length){const object=r.blockers[r.unlocked++];
 this.emit('blocker-unlocked',{id:r.id,object,count:r.unlocked,total:r.blockers.length});
 }
  if(r.action==='upgrade'){const max=r.bumpers.every(id=>this.bumperLevel(id)>=3);
 for(const id of r.bumpers)this.configuredBumpers.set(id,Math.min(3,this.bumperLevel(id)+1));
 if(max&&r.repeatExtraBall&&this.awardExtraLife('bumper-max'))for(const id of r.bumpers)this.bumperRewardAt.set(id,this.time);
 this.emit('bumper-upgraded',{level:Math.max(...r.bumpers.map(id=>this.bumperLevel(id)))});
 }
  if(r.action==='boss'){if(this.enemyActive){if(!this.disableBossTargetLife&&!this.spaceEndlessMode)this.awardExtraLife('boss-target');
 }else{this.enemyActive=true;
 this.emit('enemy-spawn-requested',{group:r.id});
 }}
  if(r.action==='blackHole'){this.activateHole(r.hole);
 this.emit('vortex-activated',{id:r.hole});
 }
  if(r.action==='attack'){
   if(r.spawnEnemyWhenIdle){if(this.enemyIntroPending)return;if(!this.enemyActive){this.enemyActive=true;this.emit('enemy-spawn-requested',{group:r.id});return;}}
   r.attackRemaining=(r.attackRemaining??r.attackCount??1)-1;if(r.attackRemaining<=0){r.attackRemaining=r.attackCount??1;this.emit('configured-attack',{kind:r.attack||'lv1',id:r.id,position:[...this.ball.p]});}
  }
 }
 sensors(){
  this.expireHoles();
  const ball=this.ball;
  if(ball.state!=='playing')return;
  const floorParts=this.socketsByLayer.get(ball.layer)||[];
  if(this.time>=ball.immunity){
   for(const socket of floorParts||[]){
    const controlled=this.controlledHoles.has(socket.id);
    if(controlled&&!this.armedHoles.has(socket.id))continue;
    if(P.len(P.sub(ball.p,socket.center))>=socket.radius)continue;
    this.capture(socket.id,socket.center,socket.release,ball.layer,socket.release_direction,250);
    return;
   }
  }
  const outside=ball.p[1]>this.g.drain_y||ball.p[1]<(this.g.drain_top??-210)||ball.p[0]<-25||ball.p[0]>385;
  if(outside)this.drain();
 }

};
 }
const api={...layout,createGame,...view};
 if(typeof module!=='undefined')module.exports=api;
 else root.ConfiguredMechanisms=api;
})(globalThis);

/* Indicator triggers and playback. */
(function(root){
'use strict';
function attractLight(game,o){
 if(!game||game.ball.state!=='ready'||game.input?.launch||game.launchAiming||game.charge>0||game.paused||(game.preserveTableOnDrain&&game.hasLaunchedOnce))return null;
 const group=o.indicator?.group;if(!group)return null;
 let show=game.configuredAttractVisual;
 if(!show||show.ball!==game.ball){
  const members=(game.g.artLayers||[]).filter(a=>!a.hidden&&a.indicator?.group);
  const xs=members.map(a=>a.x),ys=members.map(a=>a.y);
  const bandWidth=Math.max(12,...members.map(a=>a.height));
  show=game.configuredAttractVisual={ball:game.ball,start:game.time,
   left:Math.min(...xs),right:Math.max(...xs),top:Math.min(...ys),bottom:Math.max(...ys),bandWidth};
 }
 // Fixed loop: up, down, left-to-right, right-to-left, all on.
 const sweepDuration=3,allOnDuration=1.2;
 const verticalDuration=sweepDuration*2;
 const horizontalStart=verticalDuration,horizontalEnd=horizontalStart+sweepDuration*2;
 const elapsed=Math.max(0,game.time-show.start)%(horizontalEnd+allOnDuration);
 if(elapsed<horizontalEnd){
  const vertical=elapsed<verticalDuration,sweepTime=vertical?elapsed:elapsed-horizontalStart;
  const first=sweepTime<sweepDuration,progress=(first?sweepTime:sweepTime-sweepDuration)/sweepDuration;
  const min=vertical?(first?-show.bottom:show.top):(first?show.left:-show.right);
  const max=vertical?(first?-show.top:show.bottom):(first?show.right:-show.left);
  const value=vertical?(first?-o.y:o.y):(first?o.x:-o.x);
  // Let the whole band pass the final lamp before switching modes.
  const width=show.bandWidth,front=min+progress*(max-min+width);
  return value<=front&&value>=front-width;
 }
 return true;
}


const {signal}=typeof module!=='undefined'&&module.exports?require('./art-events.js'):root.ArtEvents;
const visualStates=new WeakMap();
function presentation(o,g){
 const c=o.indicator,initial=c.defaultState||(c.type==='bumper'?'lv1':'off');
 if(!g)return {state:initial,alpha:1,on:initial==='on'};
 const attract=attractLight(g,o);if(attract!==null)return {state:c.type==='bumper'?(attract?'lv3':'lv1'):(attract?(c.attractState||'on'):'off'),alpha:1,on:false,attract:true};
 if(c.trigger?.kind==='hole-count'){const count=g.holeCaptureCounts?.get(c.trigger.source)||0,state=count>=(c.trigger.threshold||2)?'complete':count>0?'on':'off';return {state,alpha:1,on:state!=='off'};}
 if(c.trigger?.kind==='hole-active'&&c.captureBehavior&&g.balls.some(ball=>ball.state==='captured'&&ball.held?.id===c.trigger.source)){
  const b=c.captureBehavior,on=b.onSeconds||.2,off=b.offSeconds||.2,age=Math.max(0,g.time-(g.holeCapturedAt.get(c.trigger.source)??g.time)),lit=age%(on+off)<on;
  return {state:lit?'on':'off',alpha:1,on:lit};
 }
 if(c.trigger?.kind==='gap-output'){
  const gap=g.g.gameplay?.touhouGap,lock=g.gapLock,exit=gap&&g.socketsById?.get(gap.hole)?.exit_hole;
  if(c.trigger.source!==exit||!lock?.active||!lock.pending)return {state:'off',alpha:1,on:false};
  const releasing=Number.isFinite(lock.releaseStartedAt),b=(releasing?c.releaseBehavior:c.behavior)||{};
  const on=b.onSeconds||(releasing?.1:.6),off=b.offSeconds||(releasing?.1:.6),age=Math.max(0,g.time-(releasing?lock.releaseStartedAt:lock.readyAt));
  const lit=age%(on+off)<on;return {state:lit?'on':'off',alpha:1,on:lit};
 }
 if(c.trigger?.kind==='enemy-target'){
  const id=c.trigger.source,rule=g.targetRuleById?.get(id),completed=rule?.last;
  const b=c.behavior||{},on=b.onSeconds||.3,off=b.offSeconds||.3;
  const finish=c.completion||{},flashOn=finish.onSeconds||.15,flashOff=finish.offSeconds||.15;
  const age=g.time-completed,duration=(flashOn+flashOff)*(finish.cycles||3);
  const lit=Number.isFinite(completed)&&age<duration?age%(flashOn+flashOff)<flashOn:
   g.targetHits?.has(id)||(!g.enemyActive&&!g.enemyIntroPending&&g.time%(on+off)<on);
  return {state:lit?'on':'off',alpha:1,on:!!lit};
 }
 if(c.type==='bumper'){const id=c.trigger?.source||o.bind;let n=g.bumperLevel(id);if(!c.keepLevelOnHit&&(g.bumperHitUntil?.get(id)||0)>g.time)n=n%3+1;return {state:'lv'+n,alpha:1,on:false};}
 let cache=visualStates.get(g);if(!cache||cache.epoch!==g.attackRemaining){cache={epoch:g.attackRemaining,items:new Map()};visualStates.set(g,cache)}
 let v=cache.items.get(o);if(!v){v={active:false,start:null,stamp:undefined,lastOn:false,alpha:0,time:g.time};cache.items.set(o,v)}
 const triggers=[c.trigger||{},...(c.extraTriggers||[])],inputs=triggers.map(t=>signal(o,g,t));
 let completion=null;
 if(c.completion)for(let i=0;i<triggers.length;i++){
  const t=triggers[i],id=t.source;let stamp,rest;
  if(t.kind==='count'){
   const n=g.g.mechanisms.attackCounts[id];stamp=g.attackCompletedAt.get(id);rest=(g.attackRemaining.get(id)??n)===n;
   inputs[i].stamp=undefined;
  }else if(t.kind==='level'){stamp=g.bumperRewardAt?.get(id);
  }else if(t.kind==='kickback'){
   const kicker=g.rescueById?.get(id);stamp=kicker?g.rescueCompletedAt?.get(kicker.layer||'lower'):undefined;rest=!inputs[i].active;
  }else if(t.kind==='rollover'){
   const group=g.rolloverByMember.get(id);stamp=g.rolloverCompletedAt.get(group?.id);rest=!g.rolloverVisualGroups.get(group?.id)?.has(id);
  }else continue;
  if(stamp!=null&&(!completion||stamp>completion.stamp))completion={stamp};
  if(stamp!=null&&rest)inputs[i].active=false;
 }
 const stamp=Math.max(...inputs.map(input=>Number.isFinite(input.stamp)?input.stamp:-Infinity)),event=Number.isFinite(stamp);
 const active=inputs.some(input=>input.active),rising=inputs.some((input,i)=>input.active&&!v.inputs?.[i]);v.inputs=inputs.map(input=>!!input.active);
 const b=c.behavior||{mode:'keep'},on=b.onSeconds||.6,off=b.offSeconds||2.4;
 if(event&&v.stamp!==stamp){v.start=stamp;v.stamp=stamp;}
 if(rising)v.start=g.time;
 if(completion&&completion.stamp>=stamp){
  const b=c.completion,on=b.onSeconds||.6,off=b.offSeconds||2.4,age=Math.max(0,g.time-completion.stamp);
  const duration=b.mode==='once'?on:b.mode==='burst'?(on+off)*(b.cycles||3):Infinity;
  if(age<duration){const state=['repeat','burst'].includes(b.mode)?(age%(on+off)<on?'on':'complete'):'complete';return {state,alpha:1,on:true};}
  if(!active&&!event)return {state:'off',alpha:1,on:false};
 }
 let lit=false,age=v.start===null?Infinity:Math.max(0,g.time-v.start),duration=Infinity;
 if(b.mode==='once')duration=on;
 if(b.mode==='burst')duration=(on+off)*Math.max(1,b.cycles||3);
 if(age<duration&&(event||active))lit=['repeat','burst'].includes(b.mode)?age%(on+off)<on:true;
 const dt=Math.max(0,g.time-v.time);v.time=g.time;
 const fade=c.fade,fadeTime=lit?Math.min(fade?.inSeconds||0,on):Math.min(fade?.outSeconds||0,off);
 if(!fade?.enabled||fadeTime<=0)v.alpha=lit?1:0;else v.alpha=Math.max(0,Math.min(1,v.alpha+(lit?1:-1)*dt/fadeTime));
 v.lastOn=lit;
 return {state:lit||v.alpha>0?'on':'off',alpha:lit||v.alpha>0?v.alpha:1,on:lit};
}
function configuredState(o,g){return presentation(o,g).state;}
function maskActive(o,g){return !!o.indicator?.screenMask&&presentation(o,g).on;}
function basicState(o,g){
 if(g&&o.state==='return-gate'&&!g.gates.some(p=>p.id===o.bind&&p.closed&&!p.unlocked))return null;
 if(g&&o.state==='center-post'&&!g.configuredPosts?.get(o.bind)?.raised)return null;
 const active=!!(g&&o.state==='vortex'&&(g.armedHoles?.has(o.bind)||g.balls?.some(b=>b.state==='captured'&&b.held?.id===o.bind)));
 return {src:o.src,baseSrc:o.src,frame:Math.min(active?1:0,(o.frames||1)-1),active};
}
function artMap(base={}){return {...base,artState(o,g,renderer){
 if(g&&o.state==='return-gate'&&!g.gates.some(p=>p.id===o.bind&&p.closed&&!p.unlocked))return null;
 if(!o.indicator)return (base.artState||basicState)(o,g,renderer);
 const p=presentation(o,g),src=o.indicator[p.attract&&o.indicator.glow?.attractUseOff?'off':p.state];if(!src)return null;
 const glow=o.indicator.glow,preview=glow?.preview;
 let color=glow?.[p.state],period=p.attract?null:glow?.pulse?.[p.state];
 // Preview light never changes the collected state; collected progress stays steady.
 if(!p.attract&&p.state==='off'&&g&&preview&&signal(o,g,preview.trigger).active){color=preview.color;period=preview.pulseSeconds;}
 const alpha=period&&g?.time!=null?((g.time%period+period)%period<period/2?1:0):1;
 renderer.image(src);return {src,baseSrc:src,frame:0,alpha:p.alpha,glow:color?{color,alpha}:null};
}};}
const api={attractLight,artMap,configuredState,maskActive,presentation};if(typeof module!=='undefined')module.exports=api;else root.IndicatorLights=api;
})(globalThis);

/* Visual-only spring face, sparks and bumper light pulses. Does not alter collision geometry. */
function createReboundEffects(game,sound){
 const hits=new Map(),original=game.collisionEffect.bind(game);
 game.collisionEffect=(edge,approach)=>{
  original(edge,approach);
  const bumper=edge.kind==='bumper'&&edge.c;
  if(approach<=0||(!bumper&&(!(edge.kind==='rebound'||edge.kind==='active'||edge.mechanic==='active_rebound')||!edge.a||!edge.b)))return;
  const previous=hits.get(edge.id);if(previous&&game.time-previous.at<.12)return;
  if(bumper){hits.set(edge.id,{kind:'bumper',plane:game.visualPlane(game.ball),at:game.time,center:[...edge.c],radius:edge.r});return;}
  const [a,b]=[edge.a,edge.b],dx=b[0]-a[0],dy=b[1]-a[1],length=Math.hypot(dx,dy);if(!length)return;
  let n=[-dy/length,dx/length];if((game.ball.p[0]-a[0])*n[0]+(game.ball.p[1]-a[1])*n[1]<0)n=n.map(v=>-v);
  const t=Math.max(0,Math.min(1,((game.ball.p[0]-a[0])*dx+(game.ball.p[1]-a[1])*dy)/(length*length)));
  hits.set(edge.id,{plane:game.visualPlane(game.ball),at:game.time,a:[...a],b:[...b],n,p:[a[0]+dx*t,a[1]+dy*t]});
  // The existing collision plays metal above this threshold; avoid doubling it.
  if(approach<8)sound.play('metal');
 };
 const event=game.onEvent;game.onEvent=e=>{if(e.type==='new-game'||e.type==='ready')hits.clear();event?.(e);};
 return {draw(ctx,plane){
  for(const [id,h] of hits){const age=game.time-h.at;if(age<0||age>.24){hits.delete(id);continue;}
   if(h.plane!==plane)continue;
   if(h.kind==='bumper'){
    const fade=1-age/.24;ctx.save();ctx.globalAlpha*=fade;ctx.shadowColor='#83eaff';ctx.shadowBlur=18*fade;
    ctx.beginPath();ctx.arc(...h.center,h.radius,0,Math.PI*2);ctx.strokeStyle='#edffff';ctx.lineWidth=2.2;ctx.stroke();
    ctx.shadowBlur=8*fade;ctx.beginPath();ctx.arc(...h.center,h.radius+age*20,0,Math.PI*2);ctx.strokeStyle='#62dfff';ctx.lineWidth=1.2;ctx.stroke();ctx.restore();continue;
   }
   const fade=1-age/.24,push=2.5*Math.sin(Math.PI*Math.min(1,age/.14));
   ctx.save();ctx.globalAlpha*=fade;ctx.lineCap='round';ctx.shadowColor='#ffae42';ctx.shadowBlur=12*fade;
   ctx.beginPath();ctx.moveTo(h.a[0]+h.n[0]*push,h.a[1]+h.n[1]*push);ctx.lineTo(h.b[0]+h.n[0]*push,h.b[1]+h.n[1]*push);
   ctx.strokeStyle='#ffad42';ctx.lineWidth=3.2;ctx.stroke();ctx.strokeStyle='#fff3bf';ctx.lineWidth=1.1;ctx.stroke();ctx.shadowBlur=0;
   for(let i=0;i<5;i++){const angle=Math.atan2(h.n[1],h.n[0])+(i-2)*.35,r=age*(30+i*7),x=h.p[0]+Math.cos(angle)*r,y=h.p[1]+Math.sin(angle)*r;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(angle)*1.7,y+Math.sin(angle)*1.7);ctx.stroke();}
   ctx.restore();
  }
 }};
}
if(typeof module!=='undefined')module.exports=createReboundEffects;

/* Event-driven paper fragments, light echoes and combo scoring. Physics stays unchanged. */
function createImpactPresentation(game,artLayers,renderer){
 const artById=new Map(artLayers.map(a=>[a.id,a]));
 const particles=[],rings=[],swings=[],lampPulses=new Map(),recent=new Map();
 let cannonAt=-Infinity;
 let combo=0,lastHit=-10,popAt=-10,shakeAt=-10,shakePower=0;
 const multiplier=n=>n>=30?4:n>=20?3:n>=10?2:n>=5?1.5:1;
 const plane=()=>game.visualPlane(game.ball),position=e=>e.position||game.ball.p;
 const cap=(list,n)=>{if(list.length>n)list.splice(0,list.length-n);};
 function burst(p,color,strength=1,direction=null){
  const count=Math.round(8+strength*5),at=game.time,floor=plane();
  for(let i=0;i<count;i++){const angle=direction===null?i/count*Math.PI*2:direction+(i/count-.5)*1.8,speed=25+((i*17)%53)*strength;
   particles.push({p:[...p],v:[Math.cos(angle)*speed,Math.sin(angle)*speed],color,at,plane:floor,life:.28+(i%4)*.08,size:1.1+(i%3)*.55,angle});}
  rings.push({p:[...p],color,at,plane:floor,strength});cap(particles,240);cap(rings,32);
 }
 function pulse(source,all=false){
  for(const a of artLayers){if(a.hidden||!a.indicator||a.indicator.impactFlash===false)continue;
   const triggers=[a.indicator.trigger,...(a.indicator.extraTriggers||[])];
   if(all||triggers.some(t=>t?.source===source||t?.source&&source?.startsWith(t.source+'-')))
    lampPulses.set(a.id,{at:game.time+(all?(a.x%7)*.018:0),color:all?'#ffe59b':'#b9f9ff'});
  }
 }
 function hit(id){
  if(!id||(recent.get(id)??-10)>game.time-.12)return false;
  recent.set(id,game.time);if(game.time-lastHit>2)combo=0;
  combo++;lastHit=popAt=game.time;
  game.combo={count:combo,multiplier:multiplier(combo),expiresAt:lastHit+2};
  if([5,10,20,30].includes(combo)){burst(game.ball.p,'#ffd36d',1.4);pulse(null,true);shakeAt=game.time;shakePower=.7;}
  return true;
 }
 const originalCollision=game.collisionEffect.bind(game);
 game.collisionEffect=(edge,approach)=>{
  originalCollision(edge,approach);
  // Passive rebound faces still count when Boss mode disables score events.
  if(approach>0&&['rebound','active'].includes(edge.kind))hit(edge.id);
  if(approach<=8||!['bumper','rebound','active','target'].includes(edge.kind))return;
  const key='fx:'+edge.id;if((recent.get(key)??-10)>game.time-.12)return;recent.set(key,game.time);
  const bumper=edge.kind==='bumper',p=[...game.ball.p],level=bumper?game.bumperLevel(edge.id):1;
  burst(p,bumper?'#a9edff':edge.kind==='target'?'#ffe69c':'#e9b575',bumper?.8+level*.3:.8,bumper?null:Math.atan2(game.ball.v[1],game.ball.v[0]));
  pulse(edge.id);
 };
 const onEvent=game.onEvent;
 game.onEvent=e=>{
  if(['new-game','ready','drain','game-over'].includes(e.type)){
   combo=0;lastHit=-10;game.combo={count:0,multiplier:1,expiresAt:0};recent.clear();
   if(e.type==='new-game'){cannonAt=-Infinity;shakeAt=-10;particles.length=rings.length=swings.length=0;lampPulses.clear();}
  }
  if(e.type==='score'||e.type==='score-hit'){
   hit(e.id);
   // scoreHit has already awarded base points. Add only the combo delta, before HUD/reward listeners.
   if(e.type==='score'&&game.scoringEnabled!==false&&e.points>0){const base=e.points,total=Math.round(base*multiplier(combo));game.score+=total-base;e.basePoints=base;e.points=total;e.multiplier=multiplier(combo);}
   pulse(e.id);
  }
  if(e.type==='rollover'||e.type==='sensor'){hit(e.id);pulse(e.id);burst(position(e),'#a1f3de',.45);}
  if(e.type==='slingshot-hit'){hit(e.id);pulse(e.id);}
  if(e.type==='flipper-hit'){
   const key='swing:'+e.id;if((recent.get(key)??-10)<=game.time-.1){recent.set(key,game.time);swings.push({p:[...game.ball.p],angle:Math.atan2(game.ball.v[1],game.ball.v[0]),at:game.time,plane:plane()});cap(swings,12);}
  }
  if(['target-group-complete','configured-attack','bumper-upgraded','multiball-awarded','center-post-up','vortex-activated'].includes(e.type)){
   burst(position(e),e.type==='configured-attack'?'#fff0bb':'#ffe49b',e.type==='configured-attack'?2:1.4);pulse(null,true);shakeAt=game.time;shakePower=e.type==='configured-attack'?1.3:.7;
  }
  onEvent?.(e);
 };
 function clean(){
  if(game.time-lastHit>2&&combo){combo=0;game.combo={count:0,multiplier:1,expiresAt:0};}
  for(const list of [particles,rings,swings])for(let i=list.length-1;i>=0;i--)if(game.time-list[i].at>(list[i].life||.4))list.splice(i,1);
  for(const [id,p] of lampPulses)if(game.time-p.at>.35)lampPulses.delete(id);
  for(const [id,at] of recent)if(game.time-at>2)recent.delete(id);
 }
 function draw(ctx,floor,bounds=game.g.view_box){
  clean();ctx.save();ctx.lineCap='round';
  // Effects may surround the ball but must not paint over its silver surface.
  for(const b of game.balls){
   if(b.state==='drained')continue;
   ctx.beginPath();ctx.rect(...bounds);ctx.moveTo(b.p[0]+game.physics.ballRadius,b.p[1]);
   ctx.arc(...b.p,game.physics.ballRadius,0,Math.PI*2);ctx.clip('evenodd');
  }
  for(const b of game.balls){if(game.g.gameplay?.ballEffects===false||game.visualPlane(b)!==floor||b.state!=='playing')continue;const speed=Math.hypot(...b.v);if(speed<180)continue;
   const trail=(b.trail||[]).filter(t=>t.layer===b.layer).slice(-10);ctx.strokeStyle=combo>=10?'#ffe597':'#a9eaff';
   for(let i=1;i<trail.length;i++){ctx.globalAlpha=(i/trail.length)*Math.min(.48,speed/1800);ctx.lineWidth=.5+i/trail.length*2;ctx.beginPath();ctx.moveTo(...trail[i-1].p);ctx.lineTo(...trail[i].p);ctx.stroke();}
  }
  for(const r of rings){if(r.plane!==floor)continue;const age=game.time-r.at,t=age/.4;ctx.globalAlpha=(1-t)*.85;ctx.strokeStyle=r.color;ctx.lineWidth=2.2*(1-t)+.3;ctx.beginPath();ctx.arc(...r.p,3+age*42*r.strength,0,Math.PI*2);ctx.stroke();}
  for(const q of particles){if(q.plane!==floor)continue;const age=game.time-q.at;ctx.save();ctx.globalAlpha=1-age/q.life;ctx.translate(q.p[0]+q.v[0]*age,q.p[1]+q.v[1]*age+18*age*age);ctx.rotate(q.angle+age*5);ctx.fillStyle=q.color;ctx.fillRect(-q.size,-q.size*.4,q.size*2,q.size*.8);ctx.restore();}
  for(const s of swings){if(s.plane!==floor)continue;const age=game.time-s.at;if(age>.18)continue;ctx.globalAlpha=1-age/.18;ctx.strokeStyle='#fff0bb';ctx.lineWidth=2*(1-age/.18);ctx.beginPath();ctx.arc(...s.p,5+age*45,s.angle+Math.PI-.9,s.angle+Math.PI+.9);ctx.stroke();}
  for(const [id,q] of lampPulses){const a=artById.get(id);if(!a||a.hidden||a.plane!==floor)continue;const age=game.time-q.at;if(age<0)continue;
   const c=a.indicator,src=c.type==='bumper'&&c.keepLevelOnHit?c['lv'+game.bumperLevel(c.trigger?.source||a.bind)]:c.on||c.lv3||c.complete||a.src,img=renderer.image(src),fade=Math.sin(Math.PI*age/.35);
   ctx.save();ctx.translate(a.x,a.y);ctx.rotate((a.angle||0)*Math.PI/180);ctx.scale(a.flipX?-1:1,a.flipY?-1:1);ctx.globalAlpha=.65*fade;ctx.shadowColor=q.color;ctx.shadowBlur=6;
   if(img.complete&&img.naturalWidth)ctx.drawImage(img,...a.crop,-a.width/2,-a.height/2,a.width,a.height);
   ctx.restore();
  }
  ctx.restore();
 }
 return {draw,update:clean,onTheaterSound(name,now=performance.now()){
  if(name==='explosion')cannonAt=now;
 },screenShake(now=performance.now()){
  const age=(now-cannonAt)/1000;
  if(game.paused||age<0||age>=.3)return [0,0];
  const amplitude=5*(1-age/.3)**2;
  return [Math.cos(age*135)*amplitude,Math.sin(age*170)*amplitude*.7];
 },preview(kind){
  const p=[180,230];
  if(kind==='flipper')swings.push({p,angle:-Math.PI/2,at:game.time,plane:plane()});
  else burst(p,kind==='bumper'?'#a9edff':kind==='slingshot'?'#e9b575':'#ffe49b',kind==='complete'?2:1,kind==='slingshot'?-Math.PI/2:null);
  if(kind==='combo'){combo=19;lastHit=game.time;recent.clear();hit('preview-combo');}
  pulse(null,true);
 },drawBallGlow(ctx,ball){
  if(game.g.gameplay?.ballEffects===false||combo<2||game.time-lastHit>2||['ready','drained'].includes(ball.state))return;
  const strength=Math.min(1,(combo-1)/29),r=game.physics.ballRadius,radius=r*(1.25+strength*1.25);
  const glow=ctx.createRadialGradient(...ball.p,r*.65,...ball.p,radius);
  glow.addColorStop(0,'rgba(255,250,220,.8)');glow.addColorStop(.45,'rgba(255,219,135,.45)');glow.addColorStop(1,'rgba(255,219,135,0)');
  ctx.save();ctx.globalAlpha*=(.45+.55*strength)*Math.min(1,(lastHit+2-game.time)/.25);ctx.fillStyle=glow;
  ctx.beginPath();ctx.arc(...ball.p,radius,0,Math.PI*2);ctx.moveTo(ball.p[0]+r,ball.p[1]);ctx.arc(...ball.p,r,0,Math.PI*2);ctx.fill('evenodd');ctx.restore();
 },get combo(){return {count:combo,multiplier:multiplier(combo),expiresAt:lastHit+2};},shake(){const t=game.time-shakeAt;if(t<0||t>.16)return [0,0];const fade=1-t/.16;return [Math.sin(t*150)*shakePower*fade,Math.cos(t*170)*shakePower*fade];},drawHud(ctx,bounds){
  clean();if(combo<2)return;const [x,y,w,h]=bounds;
  // Use the bottommost flipper on each side, excluding higher auxiliary flippers.
  const floorFlippers=game.flippers.filter(f=>(f.layer||'lower')==='lower');
  const lower=(floorFlippers.length?floorFlippers:[...game.flippers]).sort((a,b)=>b.pivot[1]-a.pivot[1]);
  const pair=['left','right'].map(side=>lower.find(f=>(f.control||f.side)===side));
  const anchors=pair.every(Boolean)?pair:lower.slice(0,2);
  const cx=anchors.length?anchors.reduce((sum,f)=>sum+f.pivot[0],0)/anchors.length:x+w/2;
  const cy=anchors.length?anchors.reduce((sum,f)=>sum+f.pivot[1],0)/anchors.length-75:y+h-100;
  const size=Math.min(28,13+Math.log2(combo)*2.5),pop=1+.18*Math.exp(-Math.max(0,game.time-popAt)*18);
  const hud=game.g.gameplay?.comboHud||{};
  ctx.save();ctx.translate(cx,cy);ctx.scale(pop,pop);ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='bold '+size+'px sans-serif';ctx.lineWidth=3;ctx.strokeStyle=hud.outline||'#142735';ctx.fillStyle=hud.color||(combo>=10?'#ffe39a':'#c6f5ff');ctx.strokeText(String(combo),0,0);ctx.fillText(String(combo),0,0);ctx.scale(1/pop,1/pop);ctx.font='bold 9px sans-serif';ctx.strokeText('COMBO',0,-25);ctx.fillText('COMBO',0,-25);
  ctx.font='bold 9px sans-serif';ctx.fillText('×'+multiplier(combo),0,size*.85);ctx.globalAlpha=.8;ctx.fillStyle=hud.barColor||ctx.fillStyle;ctx.fillRect(-28,size*1.4,56*Math.max(0,(lastHit+2-game.time)/2),hud.barHeight??1.5);ctx.restore();
 }};
}
if(typeof module!=='undefined')module.exports=createImpactPresentation;

function startPreview(PIRATE_GEOMETRY){
'use strict';
const tutorialMode=!!TableTutorial&&new URLSearchParams(location.search).get('tutorial')==='1';
const requestedBossStage=Number(new URLSearchParams(location.search).get('bossStage'));
const bossStage=Number.isInteger(requestedBossStage)&&requestedBossStage>=1&&requestedBossStage<=8?requestedBossStage:0;
const G=PIRATE_GEOMETRY,P=PiratePhysics,Game=ConfiguredMechanisms.createGame(EditorLayers.createGame(P),P),game=new (PLAYTEST_THEME==='steampunk'?SteampunkBonus.createGame(Game):G.gameplay?.spaceConstellation?SpaceConstellation.createGame(Game):(G.gameplay?.touhouBagua||G.gameplay?.runicTurntable)?TouhouBagua.createGame(Game):Game)(G),canvas=document.getElementById('table'),ctx=canvas.getContext('2d'),$=id=>document.getElementById(id);
try{localStorage.setItem('pinball-physics-model','legacy');}catch{}
game.config.physicsModel='legacy';
game.storyMode=!!bossStage&&!tutorialMode;
game.spaceEndlessMode=['sci-fi','space','cosmic-dessert'].includes(PLAYTEST_THEME)&&!bossStage&&!tutorialMode&&!new URLSearchParams(location.search).has('editor');
game.disableBossTargetLife=['touhou1','touhou2','norse'].includes(PLAYTEST_THEME);
game.targetRehitRequiresExit=PLAYTEST_THEME==='touhou1';
game.preserveTableOnDrain=!!bossStage;
game.scoringEnabled=!bossStage;
window.layoutGame=game;
const theater=new LayoutTheater(PLAYTEST_THEME);theater.bossStage=bossStage;theater.tutorialPreview=false;window.layoutTheater=theater;
let firstPlayGuide=null;
let firstPlayGuidePending=!!TableTutorial&&(tutorialMode||bossStage===1&&new URLSearchParams(location.search).get('firstPlayTutorial')==='1'&&!(window.AppProgress?window.AppProgress.tutorialComplete:localStorage.getItem(`pinball-${PLAYTEST_THEME}-first-play-tutorial-v1`)==='1'));
const touchControls=new Map();let launchMode=localStorage.getItem('pinball-launch-mode')||'hold',launchDrag=null;
const artRenderer=new (PLAYTEST_THEME==='steampunk'?SteampunkArt.Renderer:PinballArt.Renderer)("",IndicatorLights.artMap(PirateMap));let artLayers=[],artWarning='';
artRenderer.rasterCacheEnabled=true;
artRenderer.backgroundCacheEnabled=['norse','touhou1'].includes(PLAYTEST_THEME);
artRenderer.staticCacheEnabled=['pirate','steampunk'].includes(PLAYTEST_THEME);
try{artLayers=PinballArt.validate(G.artLayers||[]);
 if(new URLSearchParams(location.search).get('art')==='preview'){
  const preview=JSON.parse(localStorage.getItem('pinball-art-preview-res')||'null');
  if(preview&&JSON.stringify(preview.objects)===JSON.stringify(G.art_layout_objects))artLayers=PinballArt.validate(preview.artLayers);
  else artWarning='美術預覽與試玩布局不同：請匯出 JSON 並重新建置。';
 }
}catch(e){artWarning='美術載入失敗：'+e.message}
$('geometryToggle').checked=!window.AppControls;
// Ignore legacy frame entries in saved drafts; the chrome has one shared owner.
artLayers=artLayers.filter(a=>!PlayFrame.isFrameArt(a));
const [topArt,soundArt,settingsArt,backArt]=PinballArt.validate(PlayFrame.createArt(PLAYTEST_THEME));
const topBallImage=artRenderer.image(G.gameplay?.ballImage||(['touhou1','touhou2','touhou-horrors','touhou-black-knight-2000'].includes(PLAYTEST_THEME)?'res/img/touhou/touhou-ball-yin-yang.png':['sci-fi','space','cosmic-dessert'].includes(PLAYTEST_THEME)?'res/img/space/space-ball-cookie.png':'res/img/top-ball.png'));
const topLayers=[topArt,soundArt,settingsArt,backArt],topItems=new Set(topLayers);
const artByPlane=new Map(PinballArt.planes.map(plane=>[plane,artLayers.filter(o=>o.plane===plane&&!topItems.has(o))]));
const artDrawPlans=new Map([...artByPlane].map(([plane,items])=>[plane,PinballArt.createDrawPlan(items)]));
const backgroundLayers=artByPlane.get('background'),rightBoundaryIndex=backgroundLayers.findIndex(o=>o.src.endsWith('/pirate-wall-right.png'));
const ballIndex=rightBoundaryIndex<0?backgroundLayers.length:rightBoundaryIndex;
const backgroundBelowBall=backgroundLayers.slice(0,ballIndex),backgroundAboveBall=backgroundLayers.slice(ballIndex);
const maskCandidates=[...PinballArt.planes.flatMap(plane=>artByPlane.get(plane)),...PinballArt.planes.flatMap(plane=>topLayers.filter(o=>o.plane===plane))].filter(o=>!o.hidden&&o.indicator?.screenMask);

let topVisibleInset=null;
function topOffset(){
 if(!topArt)return 0;
 if(topVisibleInset===null){const img=artRenderer.image(topArt.src);if(img.complete&&img.naturalWidth){
  const c=document.createElement('canvas');c.width=topArt.crop[2];c.height=topArt.crop[3];const brush=c.getContext('2d');brush.drawImage(img,...topArt.crop,0,0,c.width,c.height);
  try{const pixels=brush.getImageData(0,0,c.width,c.height).data;let first=0;for(;first<c.height;first++){let found=false;for(let x=0;x<c.width;x++)if(pixels[(first*c.width+x)*4+3]>32){found=true;break;}if(found)break;}topVisibleInset=first/c.height;}catch{topVisibleInset=.3812;}
 }}
 return view[1]+2-(topArt.y-topArt.height/2+topArt.height*(topVisibleInset??.3812));
}
const spaceTheme=['sci-fi','space','cosmic-dessert'].includes(PLAYTEST_THEME);
const soundBank=new PinballSound({...PirateMap.sounds,...(G.gameplay?.runicTurntable?.spinSound?{'runic-spin':{src:G.gameplay.runicTurntable.spinSound,volume:.4,voices:1}}:{}),...(spaceTheme?{'space-magic':{src:'res/audio/space/space-magic.ogg',volume:1,voices:3}}:{}),...(PLAYTEST_THEME==='steampunk'?SteampunkSounds:{})},{synth:theater.theme==='space'});theater.soundBank=soundBank;
const bossPresentation=['touhou1','touhou2'].includes(theater.theme)?new TouhouBossPresentation(game,theater.theme):null;
if(bossPresentation){bossPresentation.choose(bossStage);theater.bossPresentation=bossPresentation;theater.onBossChanged=stage=>bossPresentation.choose(stage||bossStage);theater.onBossDefeated=()=>bossPresentation.defeat();bossPresentation.requestOrigin=()=>theater.send({command:'boss-origin'});theater.onBossOrigin=(stage,origin)=>bossPresentation.cast(stage,origin);addEventListener('pagehide',()=>bossPresentation.destroy(),{once:true});}
for(const event of ['pointerdown','keydown'])addEventListener(event,()=>{soundBank.unlock();bossPresentation?.syncMusic(soundBank,true);},{capture:true});
let soundEnabled=localStorage.getItem('pinball-sound')!=='off';
function syncSound(){soundBank.setEnabled(soundEnabled);document.querySelectorAll('audio,video').forEach(a=>a.muted=!soundEnabled);}
syncSound();
const settings=document.createElement('dialog');settings.style.cssText='background:#30251e;color:#fff0cc;border:2px solid #b89051;border-radius:12px;padding:24px';
settings.innerHTML='<p><label><span data-i18n="settings.language">語言</span> <select id="tableLanguage"><option value="zh-Hant">繁體中文</option><option value="en">English</option><option value="ja">日本語</option></select></label></p><h2 data-i18n="settings.title">設定</h2><p><label><span data-i18n="settings.physics">球物理</span> <select id="physicsModel"><option value="legacy" data-i18n="settings.legacy">原本物理</option></select></label></p>'+[['geometryToggle','table.geometry']].map(([id,label])=>`<p><label><input type="checkbox" data-setting="${id}"> <span data-i18n="${label}">${PinballI18n.t(label)}</span></label></p>`).join('')+'<p><label><input id="artToggle" type="checkbox" checked> <span data-i18n="table.art">美術圖層</span></label></p><p hidden><label>畫面比例 <select id="playAspect"><option value="portrait">直向（原布局）</option><option value="landscape">16:9 橫向</option></select></label></p><p><label><span data-i18n="settings.launch">發射模式</span> <select id="launchMode"><option value="hold" data-i18n="settings.holdCharge">按住蓄力</option><option value="drag" data-i18n="settings.dragDown">向下拖曳</option></select></label></p><button id="testImpactSound" data-i18n="table.testSound">測試碰撞音效</button><button id="closeSettings" data-i18n="common.close">關閉</button><button id="mobileRestart" data-i18n="common.restart">重新開始</button>';
document.body.append(settings);$('physicsModel').value=game.config.physicsModel;$('physicsModel').onchange=()=>applyPhysicsModel($('physicsModel').value);$('launchMode').value=launchMode;$('launchMode').onchange=()=>{clearTouchControls();launchMode=$('launchMode').value;localStorage.setItem('pinball-launch-mode',launchMode);};let settingsWasPaused=false;
settings.onchange=e=>{const id=e.target.dataset.setting;if(id)$(id).checked=e.target.checked;if(id||e.target.id==='artToggle')draw();};
$('closeSettings').onclick=()=>settings.close();$('testImpactSound').onclick=()=>{soundEnabled=true;localStorage.setItem('pinball-sound','on');syncSound();soundBank.unlock();soundBank.setPaused(false);soundBank.play('metal');};$('mobileRestart').onclick=()=>{settings.close();reset();};settings.onclose=()=>{game.paused=settingsWasPaused;};
function openSettings(){if(window.AppControls){window.AppControls.openSettings();return;}if(settings.open)return;clearTouchControls();settingsWasPaused=game.paused;game.paused=true;launchStartedAt=null;game.input.launch=game.input.left=game.input.right=false;settings.querySelectorAll('[data-setting]').forEach(e=>e.checked=$(e.dataset.setting).checked);settings.showModal();}
const leaveDialog=document.createElement('dialog');leaveDialog.id='leaveGameDialog';leaveDialog.style.cssText='background:#30251e;color:#fff0cc;border:2px solid #b89051;border-radius:12px;padding:24px';
leaveDialog.innerHTML='<h2 data-i18n="table.leaveTitle">離開球台？</h2><button id="continueGame" data-i18n="table.continue">繼續遊玩</button> <button id="leaveGame" data-i18n="table.leave">離開球台</button>';document.body.append(leaveDialog);
function applyLocale(){
 document.documentElement.lang=PinballI18n.locale;PinballI18n.apply(document);$('tableLanguage').value=PinballI18n.locale;firstPlayGuide?.refresh();
}
$('tableLanguage').onchange=()=>PinballI18n.setLocale($('tableLanguage').value);
const stopLanguageUpdates=PinballI18n.onChange(applyLocale);addEventListener('pagehide',stopLanguageUpdates,{once:true});applyLocale();
let leaveWasPaused=false;
function requestLeaveGame(){if(leaveDialog.open)return;clearTouchControls();leaveWasPaused=game.paused;game.paused=true;game.input.left=game.input.right=game.input.launch=false;launchStartedAt=null;leaveDialog.showModal();$('continueGame').focus();}
leaveDialog.onclose=()=>{game.paused=leaveWasPaused;};
$('continueGame').onclick=()=>leaveDialog.close();
$('leaveGame').onclick=()=>{leaveDialog.close();if(window.AppControls?.exitGame)window.AppControls.exitGame();else location.href=new URL('../res/main.html',location.href).href;};
function topHit(a,x,y){if(!a||a.hidden||!$('artToggle').checked)return false;const angle=-a.angle*Math.PI/180,dx=x-a.x,dy=y-a.y-(topItems.has(a)?topOffset():0);return Math.abs(dx*Math.cos(angle)-dy*Math.sin(angle))<=a.width/2&&Math.abs(dx*Math.sin(angle)+dy*Math.cos(angle))<=a.height/2;}

function art(plane,layers=artByPlane.get(plane)){if($('artToggle').checked){artRenderer.brightness=.82;try{artRenderer.draw(ctx,layers,plane,game);}finally{artRenderer.brightness=1;}}}
const spaceNeon=SpaceNeonBorders.createRenderer(SpaceNeonBorders.entries(G.art_layout_objects||[],G.art_layout_templates));
function bonusArt(plane){if($('artToggle').checked&&game.bonus?.config.object&&plane===(game.bonus.config.displayPlane||game.bonus.geometry?.layer||'lower'))game.bonus.draw(ctx,artRenderer);}
function artWithBalls(plane){
 const plan=artDrawPlans.get(plane);
 if($('artToggle').checked&&SpaceNeonBorders.enabled(PLAYTEST_THEME,G.gameplay))spaceNeon.draw(ctx,game,G.gameplay,plane);
 bonusArt(plane);
 // Right ramp balls are drawn separately, just below the right boundary art.
 const drawBalls=()=>{reboundEffects.draw(ctx,plane);for(const b of game.balls){if(b.layer==='right_upper')continue;const track=b.state==='guided'?game.guidedTracks.find(t=>t.id===b.track.id):null;const visualPlane=track?(track.layer==='tavern'?'upper':track.layer||'lower'):game.visualPlane(b);if(visualPlane===plane)drawBall(b);}};
 if(!plan.hasBallMarker)drawBalls();
 let drawn=false;for(const batch of plan.batches){if(batch)art(plane,batch);else if(!drawn){drawBalls();drawn=true;}}
 GuidedTrackGeometry.drawRails(ctx,trackOverlay,plane);
 if(!spaceTheme)ConfiguredMechanisms.drawPostCounts(game,ctx,plane);
}

const reservePreview=Math.max(0,Math.min(99,Number(new URLSearchParams(location.search).get('previewLives'))||0));
function tableObjectBounds(g,art,flippers){
 const xs=[],ys=[],add=(p,r=0)=>{if(p?.every(Number.isFinite)){xs.push(p[0]-r,p[0]+r);ys.push(p[1]-r,p[1]+r);}};
 for(const o of [...g.lower,...(g.upper_parts||[]),...(g.top_parts||[]),g.deck,...(g.guided_tracks||[]),...(g.visual_tracks||[])]){
  if(!o||o.kind==='field')continue;
  for(const p of o.points||[])add(p,(o.width||0)/2);
  if(o.center)add(o.center,o.radius||0);
 }
 for(const f of flippers)add(f.pivot,f.length+Math.max(...f.radii));
 for(const o of art){if(o.hidden||o.state==='ball-layer')continue;const a=o.angle*Math.PI/180,c=Math.abs(Math.cos(a)),t=Math.abs(Math.sin(a)),w=(o.width*c+o.height*t)/2,h=(o.width*t+o.height*c)/2;xs.push(o.x-w,o.x+w);ys.push(o.y-h,o.y+h);}
 const p=g.plunger;if(p){xs.push(p.left,p.right);ys.push(p.top??0,p.rest_y+p.stroke);}
 if(!xs.length)return [g.view_box[0],0,g.view_box[2],g.view_box[1]+g.view_box[3]];
 const y=Math.min(0,Math.min(...ys)-2);return [g.view_box[0],y,g.view_box[2],g.view_box[1]+g.view_box[3]-y];
}
const view=[...G.view_box],portraitView=[...G.view_box],tableView=tableObjectBounds(G,artLayers,game.flippers);
let playAspect='portrait';
function applyPlayAspect(value){
 playAspect=value==='landscape'?'landscape':'portrait';localStorage.setItem('pinball-play-aspect',playAspect);$('playAspect').value=playAspect;
 document.documentElement.dataset.playAspect=playAspect;$('playLayout').dataset.aspect=playAspect;$('landscapePanel').hidden=playAspect!=='landscape';theater.panelElement=playAspect==='landscape'?$('landscapeTheater'):null;
 view.splice(0,4,...(playAspect==='landscape'?tableView:portraitView));
 clearTouchControls();resize();
}
$('playAspect').onchange=()=>applyPlayAspect($('playAspect').value);
$('wideBack').onclick=()=>requestLeaveGame();
$('wideSettings').onclick=()=>openSettings();$('wideRestart').onclick=()=>reset();$('wideSound').onclick=()=>{soundEnabled=!soundEnabled;localStorage.setItem('pinball-sound',soundEnabled?'on':'off');syncSound();};
$('wideTitle').textContent=({pirate:'PIRATE PINBALL',steampunk:'STEAMPUNK PINBALL','sci-fi':'SPACE PINBALL',norse:'SAGA PINBALL'}[PLAYTEST_THEME]||'PINBALL');
function resize(){
 const stage=$('playLayout');
 if(playAspect==='landscape'){const host=stage.parentElement.getBoundingClientRect(),padding=getComputedStyle(stage.parentElement),aw=Math.max(1,host.width-parseFloat(padding.paddingLeft)-parseFloat(padding.paddingRight)),ah=host.height-parseFloat(padding.paddingTop)-parseFloat(padding.paddingBottom),width=Math.min(aw,ah*16/9);stage.style.width=width+'px';stage.style.height=width*9/16+'px';stage.style.setProperty('--table-width',Math.max((width-4)*.6,Math.min(width-5,(width*9/16-4)*view[2]/view[3]))+'px');}else{stage.style.width='';stage.style.height='';}
 const parent=canvas.parentElement,r=parent.getBoundingClientRect(),style=getComputedStyle(parent);
 const availableW=Math.max(1,r.width-parseFloat(style.paddingLeft)-parseFloat(style.paddingRight)),availableH=Math.max(1,r.height-parseFloat(style.paddingTop)-parseFloat(style.paddingBottom));
 const w=Math.min(availableW,playAspect==='landscape'?Infinity:600,availableH*view[2]/view[3]),h=w*view[3]/view[2];
 const pixelWidth=Math.max(1,Math.round(w)),pixelHeight=Math.max(1,Math.round(h));
 if(canvas.width!==pixelWidth)canvas.width=pixelWidth;if(canvas.height!==pixelHeight)canvas.height=pixelHeight;
 canvas.style.width=w+'px';canvas.style.height=h+'px';requestAnimationFrame(()=>draw());
}
new ResizeObserver(resize).observe($('playLayout').parentElement);new ResizeObserver(resize).observe(canvas.parentElement);
let previous=performance.now(),accumulator=0,noticeUntil=0;
const notice=text=>{$('notice').textContent=text;noticeUntil=game.time+2};
let floatingRewards=[];
let screenDimAlpha=0,screenDimTime=null,screenDimAnchor=null,screenDimDrawn=false;
function updateScreenDimEvent(e){if(['new-game','drain','ball-saved','ready','game-over'].includes(e.type)){screenDimAlpha=0;screenDimTime=null;screenDimAnchor=null;}}
function updateScreenDim(){
 const effect=$('artToggle').checked?maskCandidates.find(o=>IndicatorLights.maskActive(o,game)):null;
 const now=game.time,dt=screenDimTime===null?0:Math.max(0,now-screenDimTime);screenDimTime=now;
 screenDimAlpha=effect?Math.min(.2,screenDimAlpha+dt*.2/.4):Math.max(0,screenDimAlpha-dt*.2/.6);
 if(effect)screenDimAnchor=effect;
 screenDimDrawn=false;
}
artRenderer.beforeDraw=(ctx,o)=>{
 if(screenDimDrawn||screenDimAlpha<=0||o!==screenDimAnchor)return;
 screenDimDrawn=true;
 ctx.save();
 const scale=canvas.width/view[2];ctx.setTransform(scale,0,0,scale,-view[0]*scale,-view[1]*scale);
 ctx.globalAlpha=1;ctx.fillStyle=`rgba(0,0,0,${screenDimAlpha})`;ctx.fillRect(...view);ctx.restore();
};
function showFloatingReward(position,text,ballIcon=false,delay=0){
 if(!position)return;
 floatingRewards.push({position:[...position],text,ballIcon,start:game.time+delay});
 if(floatingRewards.length>24)floatingRewards.shift();
}
function drawFloatingRewards(){
 floatingRewards=floatingRewards.filter(reward=>game.time-reward.start<1.3);
 for(const reward of floatingRewards){
  const age=game.time-reward.start;if(age<0)continue;
  const [x,y]=reward.position;
  ctx.save();ctx.globalAlpha=Math.min(1,(1.3-age)/.35);ctx.translate(x,y-9-age*15);
  ctx.font='bold 12px system-ui, sans-serif';ctx.textBaseline='middle';ctx.textAlign='center';
  ctx.lineWidth=3;ctx.strokeStyle='#1e1309';ctx.fillStyle='#fff2af';
  if(reward.ballIcon&&topBallImage.complete&&topBallImage.naturalWidth){ctx.drawImage(topBallImage,-24,-7,14,14);ctx.strokeText(reward.text,2,0);ctx.fillText(reward.text,2,0);}
  else{ctx.strokeText(reward.ballIcon?PinballI18n.t('table.oneBall'):reward.text,0,0);ctx.fillText(reward.ballIcon?PinballI18n.t('table.oneBall'):reward.text,0,0);}
  ctx.restore();
 }
}
let ballStartedAt=null,ballElapsed=0;
const formatBallTime=seconds=>{
 const tenths=Math.max(0,Math.floor(seconds*10)),minutes=Math.floor(tenths/600),remainder=tenths%600;
 return String(minutes).padStart(2,'0')+':'+String(Math.floor(remainder/10)).padStart(2,'0')+'.'+remainder%10;
};
let gameOverOverlay=null;
function endGame(){
 if(gameOverOverlay)return;clearTouchControls();launchStartedAt=null;game.paused=true;soundBank.stop();
 if(bossStage){window.dispatchEvent(new CustomEvent('pinball:boss-exit',{detail:{stage:bossStage}}));return;}
 let rows=[];try{const saved=JSON.parse(localStorage.getItem('pinball-high-scores-v1')||'[]');if(Array.isArray(saved))rows=saved.filter(r=>r&&Number.isSafeInteger(r.score)&&r.score>=0).slice(0,10);}catch{}
 const id=Date.now().toString(36)+'-'+Math.random().toString(36).slice(2);rows.push({id,score:game.score,endedAt:new Date().toISOString()});rows.sort((a,b)=>b.score-a.score);rows=rows.slice(0,10);
 try{localStorage.setItem('pinball-high-scores-v1',JSON.stringify(rows));}catch{}
 gameOverOverlay=PirateMap.showGameOver(document,game.score,rows,id,()=>{gameOverOverlay=null;if(bossStage)window.dispatchEvent(new CustomEvent('pinball:boss-exit',{detail:{stage:bossStage}}));else reset();},bossStage?PinballI18n.t('table.leave'):'重新開始');
}
game.onEvent=e=>{bossPresentation?.onEvent(e);artRenderer.onEvent?.(e);firstPlayGuide?.onEvent(e);updateScreenDimEvent(e);if(e.type==='new-game')floatingRewards=[];if((e.type==='score'||e.type==='target-bonus')&&e.points>0)showFloatingReward(e.position,'+'+e.points);if(e.type==='extra-life-awarded')showFloatingReward(e.position||game.ball.p,'+1',true);if(e.type==='launch'){ballStartedAt=game.time;ballElapsed=0;soundBank.play('explosion');}if(e.type==='drain'&&ballStartedAt!==null){ballElapsed=game.time-ballStartedAt;ballStartedAt=null;}if(e.type==='new-game'){ballStartedAt=null;ballElapsed=0;}if(e.type==='ball-saved')notice(PinballI18n.t('table.ballSaved'));if(e.type==='ball-save-ready'){launchStartedAt=null;notice(PinballI18n.t('table.relaunch'));}if(e.type==='sound'&&e.name!=='runic-spin')soundBank.play(e.name);if(e.type==='release'||e.type==='kickback')soundBank.play('explosion');if(e.type==='new-game'||e.type==='ready')soundBank.stop();theater.onEvent(e);if(e.type==='enemy-spawn-requested'){launchStartedAt=null;game.input.launch=false;game.charge=game.chargeElapsed=0;notice(PinballI18n.t('table.enemyWait'));window.dispatchEvent(new CustomEvent('pinball:enemy-spawn',{detail:e}));}if(e.type==='extra-life-awarded')notice(PinballI18n.t('table.extraBall',{source:e.source==='multiball'?'Multiball':e.source==='boss-target'?'Boss target':PinballI18n.t('table.vortex')}));if(e.type==='vortex-activated')notice(PinballI18n.t('table.vortexActive'));if(e.type==='target-bonus')notice(PinballI18n.t('table.targetBonus'));if(e.type==='bumper-upgraded')notice(PinballI18n.t('table.bumperLevel',{level:e.level}));if(e.type==='center-post-up')notice(PinballI18n.t('table.postUp'));if(e.type==='multiball-awarded')notice(PinballI18n.t('table.multiball'));if(e.type==='free-ball-launch')notice(PinballI18n.t('table.multiballLaunch'));if(e.type==='kickback-lane')notice(e.side==='left'?PinballI18n.t('table.kickLeft'):PinballI18n.t('table.kickRight'));if(e.type==='capture'){if(spaceTheme)soundBank.play('space-magic');notice(PinballI18n.t('table.capture'));}if(e.type==='release')notice(PinballI18n.t('table.release'));if(e.type==='drain')notice(PinballI18n.t('table.drain'));if(e.type==='ready')notice(PinballI18n.t('table.launchShort'));if(e.type==='game-over')endGame();if(e.type==='layer')notice(e.to==='top'?PinballI18n.t('table.enterTop'):e.to!=='lower'?PinballI18n.t('table.enterMiddle'):PinballI18n.t('table.enterLower'));if(e.type==='target-group-complete')notice(game.targetGroups.find(g=>g.id===e.id)?.targets.length===1?PinballI18n.t('table.singleTarget'):PinballI18n.t('table.targetSet'));};
theater.game=game;
function startBoss(){
 if(!Number.isInteger(bossStage)||bossStage<1||bossStage>8)return;
 game.enemyActive=true;game.enemyIntroPending=true;
 theater.onEvent({type:'enemy-spawn-requested',eventId:bossStage});
 notice(PinballI18n.t('table.enemyWait'));
}
if(bossStage&&(!tutorialMode||['steampunk','space','norse','touhou1'].includes(PLAYTEST_THEME)))startBoss();
function path(points,fill,stroke,width=1,closed=false){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));if(closed)ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke()}}
function circle(p,r,fill,stroke){ctx.beginPath();ctx.arc(...p,r,0,Math.PI*2);if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=.65;ctx.stroke()}}
function object(o,upper=false,outline=upper?'#dfa6ff':'#83bdd0'){if(ConfiguredMechanisms.draw(o,game,ctx,circle))return;
 if(!o)return;
 if($('artToggle').checked&&o.id===game.bonus?.config.object)return;
 if(o.kind==='field'&&o.mechanic==='gravity-well'){
  if(!game.vortexActive){ctx.save();ctx.setLineDash([2,3]);circle(o.center,o.radius,null,'#3c6574');ctx.setLineDash([]);ctx.fillStyle='#78a4b0';ctx.font='5px sans-serif';ctx.textAlign='center';ctx.fillText(PinballI18n.t('table.vortexOff'),o.center[0],o.center[1]);ctx.restore();return;}
  ctx.save();ctx.setLineDash([2,2]);circle(o.center,o.radius,'#217a9820','#43899e');ctx.setLineDash([]);
  for(let arm=0;arm<3;arm++){
   const ps=[];for(let i=0;i<=60;i++){const t=i/60,r=o.radius*.85*(1-t),a=t*Math.PI*3+arm*Math.PI*2/3+game.time*.45;ps.push([o.center[0]+Math.cos(a)*r,o.center[1]+Math.sin(a)*r]);}
   path(ps,null,'#4faac077',.8);
  }
  circle(o.center,2,'#a0e8ee');ctx.restore();return;
 }
 if(['flipper','field'].includes(o.kind)||o.id==='gravity-well')return;
 if(o.id==='test-post-center'){circle(o.center,o.radius,game.centerPostRaised?'#ffd477':'#263945',game.centerPostRaised?'#fff1b9':'#667986');return}
 if(o.center){const color=o.kind==='bumper'?['','#75d8f5','#a7ec84','#ffd477'][game.bumperLevel(o.id)]:o.kind==='socket'||o.kind==='drop'?'#17202c':'#b8bec5';circle(o.center,o.radius,color,upper?outline:'#8eccdf');if(o.kind==='bumper'){circle(o.center,o.radius*.6,'#1d657d','#bcefff');ctx.save();ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#fff';ctx.font='bold 5px sans-serif';ctx.fillText(String(game.bumperLevel(o.id)),...o.center);ctx.restore();}if(o.kind==='socket')circle(o.center,o.radius*.55,'#02080e');return}
 if(!o.points)return;
 const lit=game.targetHits.has(o.id);let stroke=outline,fill=o.closed&&o.mechanic!=='solid-circle'?'#334956':null,width=.9;
 if(o.kind==='target'){stroke=lit?'#385362':'#a5f1ff';fill=lit?'#20323d':'#467788'}
 if(o.kind==='rebound'||o.kind==='active'){stroke='#ffbe86';width=2}
 if(o.kind==='flag'){stroke='#e6a5ea';width=1.8}
 if(o.thickness){width=o.thickness;ctx.lineCap='round'}
 path(o.points,fill,stroke,width,o.closed);ctx.lineCap='butt';
 if(o.pass_normal){const c=P.mix(o.points[0],o.points[1],.5),n=o.pass_normal,t=[-n[1],n[0]],tip=P.add(c,P.mul(n,8));path([P.add(c,P.mul(n,-5)),tip],null,"#a6e9b0",1);path([P.add(P.add(tip,P.mul(n,-3)),P.mul(t,3)),tip,P.add(P.add(tip,P.mul(n,-3)),P.mul(t,-3))],null,"#a6e9b0",1)}
}
function setText(id,value){const element=$(id),text=String(value);if(element.textContent!==text)element.textContent=text;}
const reboundEffects=createReboundEffects(game,soundBank);
const impactPresentation=createImpactPresentation(game,artLayers,artRenderer);
theater.onSound=name=>impactPresentation.onTheaterSound(name);
const trackOverlay=GuidedTrackGeometry.outlines([...(G.guided_tracks||[]),...(G.visual_tracks||[])]);const trackLayout=new Map([...trackOverlay].map(([id,t])=>[id,{...t,showAboveArt:true}]));
function drawGravityZone(zone){
 const [dx,dy]={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]}[zone.direction],size=Math.min(12,zone.width/4,zone.height/4),tip=[zone.x+dx*size,zone.y+dy*size];
 ctx.save();const points=zone.points||[[zone.x-zone.width/2,zone.y-zone.height/2],[zone.x+zone.width/2,zone.y-zone.height/2],[zone.x+zone.width/2,zone.y+zone.height/2],[zone.x-zone.width/2,zone.y+zone.height/2]];ctx.setLineDash([4,2]);path(points,zone.points?'#9ae2a520':'#77c9ff18',zone.points?'#9ae2a5':'#77c9ff',.8,true);ctx.setLineDash([]);
 path([[zone.x-dx*size,zone.y-dy*size],tip],null,'#77c9ff',1.2);path([[tip[0]-dx*size*.4-dy*size*.4,tip[1]-dy*size*.4+dx*size*.4],tip,[tip[0]-dx*size*.4+dy*size*.4,tip[1]-dy*size*.4-dx*size*.4]],null,'#77c9ff',1.2);ctx.restore();
}
function withLayoutLayer(layer,draw){
 const active=game.balls.some(b=>b.state!=='drained'&&(b.state==='guided'?(game.guidedTracks.find(t=>t.id===b.track?.id)?.layer||'lower'):b.layer)===layer);
 ctx.save();ctx.globalAlpha=active?1:.5;draw();ctx.restore();
}
function draw(){
 updateScreenDim();
 const scale=canvas.width/view[2];ctx.setTransform(scale,0,0,scale,-view[0]*scale,-view[1]*scale);ctx.clearRect(...view);ctx.fillStyle='#13242f';ctx.fillRect(...view);
 impactPresentation.update();ctx.translate(...impactPresentation.shake());
 theater.customScore=playAspect!=='landscape'&&!!topArt&&!topArt.hidden&&$('artToggle').checked;const theaterViewport=theater.draw(ctx,game,view[1]);
 art('background',backgroundBelowBall);
 for(const b of game.balls)if(b.layer==='right_upper')drawBall(b);
 art('background',backgroundAboveBall);
 bonusArt('background');
 artWithBalls('lower');
 artWithBalls('upper');artWithBalls('top');
 art('foreground');
 bossPresentation?.draw(ctx,theater,theaterViewport);
 if(spaceTheme)for(const plane of ['lower','upper','top'])ConfiguredMechanisms.drawPostCounts(game,ctx,plane,'#000');
 if($('artToggle').checked&&playAspect!=='landscape'){ctx.save();ctx.translate(0,topOffset());for(const plane of PinballArt.planes)artRenderer.draw(ctx,topLayers,plane,game);ctx.restore();}
 if(theater.customScore){ctx.save();ctx.translate(topArt.x,topArt.y+topOffset());ctx.rotate(topArt.angle*Math.PI/180);ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#ffe6a3';ctx.shadowColor='#201209';ctx.shadowBlur=4;ctx.font='bold 15px monospace';if(bossStage)theater.drawAttackMessage(ctx,topArt.width*(118/370-.5),topArt.height*(54/124-.5),topArt.width*134/370,topArt.height*18/124,game.time);else ctx.fillText(String(game.score).padStart(12,'0'),0,0,topArt.width*.48);
  const reserve=reservePreview|| (game.gameOver?0:Math.max(0,Math.min(99,4-game.ballNumber-(game.lifeLaunched?1:0)+(game.extraLives||0))));
  const counterX=topArt.width*(.159-.5),counterY=topArt.height*.014,counterW=topArt.width*.16,counterH=topArt.width*.047;
  ctx.shadowBlur=0;
  if(reserve<=3){
   const iconSize=counterH*.75,slotSpacing=topArt.width*30/594;
   if(topBallImage.complete&&topBallImage.naturalWidth){
    for(let i=0;i<reserve;i++)ctx.drawImage(topBallImage,counterX-slotSpacing+i*slotSpacing-iconSize/2,counterY-iconSize/2,iconSize,iconSize);
   }
  }else{
   ctx.fillStyle='#080808';ctx.fillRect(counterX-counterW/2,counterY-counterH/2,counterW,counterH);
   ctx.font='bold '+(topArt.width*.028)+'px monospace';ctx.fillStyle='#ffe6a3';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('BALL '+reserve,counterX,counterY,counterW*.94);
  }
  ctx.restore();}

 if($('geometryToggle').checked){
 for(const zone of G.gravity_zones||[])withLayoutLayer(zone.layer,()=>drawGravityZone(zone));
 withLayoutLayer('lower',()=>{for(const island of G.preview_islands)path(island,'#304657',null,1,true);G.lower.forEach(o=>object(o));});
 for(const k of G.rescue_kickers||[])withLayoutLayer(k.layer||'lower',()=>path(k.points,null,game.rescueState(k.layer||'lower').available[k.side]?'#ffd477':'#667986',1.4));

 for(const f of game.flippers)withLayoutLayer(f.layer||'lower',()=>{const tip=P.add(f.pivot,[Math.cos(f.angle)*f.length,Math.sin(f.angle)*f.length]);path(P.taperedOutline(f.pivot,tip,...f.radii),'#ccd5db','#a1b6c4',.4,true);circle(f.pivot,1.5,'#43596a')});
 }
 if($('geometryToggle').checked)for(const gate of game.gates){
  if(gate.mechanic!=='rescue-return'&&!['left-return','right-return'].includes(gate.id))continue;
  const closed=gate.closed&&!gate.unlocked;withLayoutLayer(gate.layer||'lower',()=>{ctx.save();ctx.setLineDash(closed?[]:[2,1.5]);
  path(gate.points,null,closed?'#ffbe86':'#78b6b9',closed?2:1);
  circle(gate.points[0],1.5,closed?'#ffbe86':'#78b6b9');ctx.restore();});
 }

 if($('geometryToggle').checked){
  withLayoutLayer('tavern',()=>{path(G.deck.points,'#775e9a','#d0abec',.7,true);if(G.upper_feeder_floor?.length)path(G.upper_feeder_floor,'#775e9a',null,0,true);if(G.upper_route_floor?.length)path(G.upper_route_floor,'#775e9a',null,0,true);G.upper_parts.forEach(o=>object(o,true));object(G.deck_exit,true);});
  withLayoutLayer('top',()=>{(G.top_parts||[]).forEach(o=>object(o,true,'#559dff'));});
 }

 const charge=game.charge;if($('geometryToggle').checked&&G.plunger.enabled!==false)withLayoutLayer(G.plunger.layer||'lower',()=>path([[G.plunger.x-5,G.plunger.rest_y+7.4+charge*10],[G.plunger.x+5,G.plunger.rest_y+7.4+charge*10]],null,'#f1bb77',2));
 if($('geometryToggle').checked){withLayoutLayer('lower',()=>GuidedTrackGeometry.drawRails(ctx,trackLayout,'lower'));withLayoutLayer('tavern',()=>GuidedTrackGeometry.drawRails(ctx,trackLayout,'upper'));withLayoutLayer('top',()=>GuidedTrackGeometry.drawRails(ctx,trackLayout,'top'));}
 for(const plane of PinballArt.planes)withLayoutLayer(plane==='upper'?'tavern':plane,()=>impactPresentation.draw(ctx,plane,view));
 drawFloatingRewards();
 drawBallOutlines();
 impactPresentation.drawHud(ctx,view);
 if(playAspect==='landscape'){setText('wideScore',game.score);setText('wideBalls',game.ballNumber+' / 3');setText('wideStage',bossStage||theater.hudState?.level||PinballI18n.t('table.freeShort'));setText('wideBoss',theater.hudState?.name?(theater.hudState.defeated?PinballI18n.t('table.defeated'):'BOSS · ')+theater.hudState.name:game.enemyActive?PinballI18n.t('table.entering'):PinballI18n.t('table.free'));setText('wideTime',formatBallTime(ballStartedAt===null?ballElapsed:game.time-ballStartedAt));setText('wideNotice',$('notice').textContent);}
 const mechanismStatus=ConfiguredMechanisms.status(game);
 setText('mechanics',PinballI18n.t('table.mechanics',{status:mechanismStatus,left:game.rescueState(game.ball.layer).hits.left?'✓':'○',right:game.rescueState(game.ball.layer).hits.right?'✓':'○',balls:game.balls.filter(b=>b.state!=='drained').length,awards:game.multiballAwards})+(game.configuredPosts?.size?' · '+mechanismStatus:''));
 const power=game.ball.state==='ready'?game.charge:game.plungerReleaseCharge;$('launchPower').value=power;setText('launchPercent',PinballI18n.t('table.charge',{seconds:(power*G.plunger.charge_seconds).toFixed(3),percent:(power*100).toFixed(1)}));
 setText('score',bossStage?PinballI18n.t('table.defeatBoss'):game.score);setText('ballNumber',game.ballNumber);setText('ballTime',formatBallTime(ballStartedAt===null?ballElapsed:game.time-ballStartedAt));
 if(artWarning)setText('notice',artWarning);else if(theater.curtainClosing)setText('notice',PinballI18n.t('table.waitCurtain'));else if(game.freezeRemaining>0)setText('notice',PinballI18n.t('table.freeze',{seconds:game.freezeRemaining.toFixed(1)}));else if(game.paused)setText('notice',PinballI18n.t('table.paused'));else if(game.time>noticeUntil&&game.ball.state==='ready')setText('notice',PinballI18n.t('table.launchHint'));
}
function drawBall(b){if(b.state==='drained')return;impactPresentation.drawBallGlow(ctx,b);ctx.save();if(topBallImage.complete&&topBallImage.naturalWidth)ctx.drawImage(topBallImage,b.p[0]-game.physics.ballRadius,b.p[1]-game.physics.ballRadius,game.physics.ballRadius*2,game.physics.ballRadius*2);else{circle(b.p,game.physics.ballRadius,'#e7eff5','#4c6677');circle([b.p[0]-1,b.p[1]-1],.9,'white')}ctx.restore()}
function drawBallOutlines(){
 if(G.gameplay?.ballOutline===false)return;
 ctx.save();ctx.globalCompositeOperation='source-over';ctx.setLineDash([1.7,1.2]);ctx.lineWidth=.5;ctx.strokeStyle='#ffffff';ctx.shadowBlur=0;
 for(const b of game.balls){
  if(b.state==='drained')continue;
  // Outline balls hidden beneath route artwork.
  ctx.globalAlpha=(b.layer==='right_upper'?1:.35);
  ctx.beginPath();ctx.arc(b.p[0],b.p[1],5.0,0,Math.PI*2);ctx.stroke();
 }
 ctx.restore();
}
let lastDrawAt=0;
function frame(now){
 const [shakeX,shakeY]=impactPresentation.screenShake(now),screenTranslate=shakeX||shakeY?`${shakeX}px ${shakeY}px`:'';
 // CSS translation keeps theater and table synchronized even while physics/drawing is frozen.
 if(canvas.style.translate!==screenTranslate){canvas.style.translate=screenTranslate;theater.frame.style.translate=screenTranslate;}
 const dt=Math.min(.05,(now-previous)/1000);previous=now;firstPlayGuide?.tick?.(dt);if(firstPlayGuidePending&&!game.paused&&!game.enemyIntroPending&&!theater.curtainClosing&&!game.theaterFrozen){firstPlayGuidePending=false;firstPlayGuide=TableTutorial.start({game,theater,canvas,G,P,artLayers,view,getView:()=>view,soundBank,clearTouchControls,launch,notice,
controls:{get launchMode(){return launchMode},get launchDrag(){return launchDrag},set launchDrag(value){launchDrag=value}},
onFinish(){firstPlayGuide=null;}});}theater.update(leaveDialog.open?0:dt,game);game.bonus?.update(dt);bossPresentation?.update(dt,soundBank,game.paused&&(!theater.bossDefeated||settings.open||leaveDialog.open||suspendedGameState!==null));soundBank.setPaused(game.paused&&!settings.open);if(G.gameplay?.runicTurntable)soundBank.sync('runic-spin',game.bonus.clock-game.bonus.phaseAt,!game.paused&&game.bonus.phase==='spin'&&game.bonus.clock-game.bonus.phaseAt<G.gameplay.runicTurntable.spinSeconds);if(!game.paused&&!game.theaterFrozen&&!game.bonusFrozen&&!firstPlayGuide?.demoFrozen){accumulator+=dt;while(accumulator>=game.physics.step){game.step();accumulator-=game.physics.step;if(game.theaterFrozen||game.bonusFrozen||game.paused){accumulator=0;break;}}}else accumulator=0;syncLaunchCharge(now);if(!game.paused&&!game.theaterFrozen||screenDimAlpha>0||now-lastDrawAt>=100){draw();lastDrawAt=now;}requestAnimationFrame(frame)}
let launchStartedAt=null;
function syncLaunchCharge(now=performance.now()){
 if(launchDrag)return;
 if(launchStartedAt===null||theater.curtainClosing||game.enemyIntroPending||game.paused||game.freezeRemaining>0||game.ball.state!=='ready')return;
 game.chargeElapsed=Math.max(0,Math.min(G.plunger.charge_seconds,(now-launchStartedAt)/1000));
 game.charge=game.chargePower(game.chargeElapsed);
 game.ball.p[1]=G.plunger.rest_y-game.physics.ballRadius+G.plunger.stroke*game.charge;
}
function launch(on){
 if(on){if(theater.curtainClosing||game.enemyIntroPending||game.paused||game.freezeRemaining>0||game.ball.state!=='ready'||launchStartedAt!==null)return;launchStartedAt=performance.now();game.input.launch=true;syncLaunchCharge();}
 else{syncLaunchCharge();const was=launchStartedAt!==null&&game.input.launch;launchStartedAt=null;game.input.launch=false;if(was&&!theater.curtainClosing&&!game.enemyIntroPending)game.launch(game.charge);game.charge=0;game.chargeElapsed=0;}
}
let suspendedGameState=null;
function suspendGame(){
 if(suspendedGameState!==null)return;
 suspendedGameState=game.paused;clearTouchControls();launchStartedAt=null;
 game.charge=game.chargeElapsed=0;game.input.left=game.input.right=game.input.launch=false;
 game.paused=true;soundBank.setPaused(true);
}
function resumeGame(){if(suspendedGameState===null)return;game.paused=suspendedGameState;suspendedGameState=null;soundBank.setPaused(game.paused);}
function applyPhysicsModel(value){value='legacy';game.config.physicsModel=value;game.vpxRemainder=game.arcadeRemainder=0;for(const f of game.flippers){f.angle=f.rest;f.omega=0;delete f.cadet;VpxFlipper.reset(f);}for(const ball of game.balls){ball.spin=0;delete ball.rollingSpin;delete ball.vpxLastSlingEventPosition;delete ball.slingshotContacts;delete ball.arcadeActiveContacts;delete ball.arcadeFlipperContacts;}$('physicsModel').value=value;localStorage.setItem('pinball-physics-model',value);}
function applyAppSettings(values){if(values.physicsModel&&values.physicsModel!==game.config.physicsModel)applyPhysicsModel(values.physicsModel);if(values.playAspect)applyPlayAspect('portrait');soundEnabled=values.sound;launchMode=values.launchMode; $('launchMode').value=launchMode;syncSound();}
function reset(){gameOverOverlay?.cancel();gameOverOverlay=null;clearTouchControls();launchStartedAt=null;game.reset();accumulator=0;if(bossStage&&(!tutorialMode||['steampunk','space','norse','touhou1'].includes(PLAYTEST_THEME)))startBoss();else notice(PinballI18n.t('table.launchShort'))}
$('settings').onclick=openSettings;$('restart').onclick=reset;$('nudge').onclick=()=>game.nudge();
$('probe').checked=false;
const mainFlipper=game.flippers.reduce((lowest,f)=>!lowest||f.pivot[1]>lowest.pivot[1]?f:lowest,null);
$('probeLayer').value=mainFlipper?.layer||'lower';
function bind(id,set){const b=$(id);b.onpointerdown=e=>{b.setPointerCapture(e.pointerId);set(true);e.preventDefault()};b.onpointerup=()=>set(false);b.onpointercancel=()=>set(false)}
bind('left',v=>game.input.left=v);bind('right',v=>game.input.right=v);bind('launch',launch);
function key(e,on){if(tutorialMode||leaveDialog.open)return;if(e.target.tagName==='INPUT')return;const k=e.key.toLowerCase();const control=['arrowleft','z'].includes(k)?'left':['arrowright','c'].includes(k)?'right':[' ','arrowdown'].includes(k)?'launch':null;if(firstPlayGuide&&!firstPlayGuide.allowed(control)){e.preventDefault();return;}if(!on&&control&&firstPlayGuide)firstPlayGuide.used(control);if([' ','arrowdown','arrowleft','arrowright','z','c','x','r'].includes(k))e.preventDefault();if(['arrowleft','z'].includes(k))game.input.left=on;if(['arrowright','c'].includes(k))game.input.right=on;if([' ','arrowdown'].includes(k)&&!e.repeat)launch(on);if(on&&!e.repeat){if(k==='r')reset();if(k==='x')game.nudge()}}
addEventListener('keydown',e=>{if(!gameOverOverlay)key(e,true)});addEventListener('keyup',e=>{if(!gameOverOverlay)key(e,false)});
addEventListener('blur',()=>{clearTouchControls();game.input.left=game.input.right=game.input.launch=false;if(!window.AppControls&&!game.paused)openSettings()});
canvas.onpointerdown=e=>{const r=canvas.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*view[2]+view[0],y=(e.clientY-r.top)/r.height*view[3]+view[1];if(topHit(backArt,x,y)){requestLeaveGame();return;}if(topHit(settingsArt,x,y)){openSettings();return;}if(topHit(soundArt,x,y)){soundEnabled=!soundEnabled;localStorage.setItem('pinball-sound',soundEnabled?'on':'off');syncSound();notice(soundEnabled?PinballI18n.t('table.soundOn'):PinballI18n.t('table.soundOff'));draw();return;}if(!$('probe').checked){
 if(e.pointerType!=='touch'||game.paused||game.gameOver||y<0)return;
 const control=game.ball.state==='ready'&&x>=G.plunger.left?'launch':x<180?'left':'right';
 const already=[...touchControls.values()].includes(control);touchControls.set(e.pointerId,control);canvas.setPointerCapture(e.pointerId);e.preventDefault();
 if(control==='launch'){if(!already){if(launchMode==='drag'){if(game.ball.state==='ready'&&!game.freezeRemaining&&!game.enemyIntroPending&&!theater.curtainClosing){launchDrag={pointerId:e.pointerId,y:e.clientY};game.launchAiming=true;}}else launch(true);}}else game.input[control]=true;
 return;
}
 const probeLayer=$('probeLayer')?.value||'lower';
 const entrance=probeLayer==='lower'&&game.guidedTracks.filter(t=>Math.hypot(x-t.points[0][0],y-t.points[0][1])<=Math.max(t.width/2,game.physics.ballRadius+2)).sort((a,b)=>Math.hypot(x-a.points[0][0],y-a.points[0][1])-Math.hypot(x-b.points[0][0],y-b.points[0][1]))[0];
 if(entrance){game.setBall(P.sub(entrance.points[0],P.mul(entrance.entry,game.physics.ballRadius+2)),P.mul(entrance.entry,180));notice('已朝導引入口送球');}
 else{game.setBall([x,y],[0,20],probeLayer);notice('已放球：'+({lower:'下層',tavern:'中層',top:'上層'}[probeLayer]));}
};
function clearTouchControls(){touchControls.clear();launchDrag=null;game.launchAiming=false;launchStartedAt=null;game.input.left=game.input.right=game.input.launch=false;game.charge=game.chargeElapsed=0;}
function endTouch(e,cancel=false){const control=touchControls.get(e.pointerId);if(!control)return;touchControls.delete(e.pointerId);if([...touchControls.values()].includes(control))return;if(control==='launch'){if(launchDrag){if(!cancel&&!theater.curtainClosing&&!game.enemyIntroPending)game.launch(game.charge);launchDrag=null;game.launchAiming=false;game.charge=game.chargeElapsed=0;return;}if(cancel){launchStartedAt=null;game.input.launch=false;game.charge=game.chargeElapsed=0;}else launch(false);}else game.input[control]=false;}
canvas.onpointermove=e=>{if(!launchDrag||launchDrag.pointerId!==e.pointerId)return;e.preventDefault();game.charge=Math.max(0,Math.min(1,(e.clientY-launchDrag.y)/100));game.chargeElapsed=game.charge;game.ball.p[1]=G.plunger.rest_y-game.physics.ballRadius+G.plunger.stroke*game.charge;};
canvas.onpointerup=e=>endTouch(e);
canvas.onpointercancel=e=>endTouch(e,true);
canvas.onlostpointercapture=e=>endTouch(e,true);
applyPlayAspect(playAspect);
requestAnimationFrame(frame);
window.viewAPI={hasSettingsControl:true,game,applyLocale,applySettings:applyAppSettings,suspend:suspendGame,resume:resumeGame};

}

const previewTheme=typeof PLAYTEST_THEME==='undefined'?'pirate':PLAYTEST_THEME;
let previewStarted=false;
const previewNotice=document.getElementById('notice');
const editorPreview=new URLSearchParams(location.search).has('editor')&&window.opener;
async function loadPiratePreview(layout){
 if(previewStarted)return;
 previewStarted=true;
 try{
  layout=window.PinballRuntimeImages?.toRuntime(layout)||layout;
  if(['touhou1','touhou2'].includes(previewTheme))layout={...layout,gameplay:{...layout.gameplay,ballImage:'res/img/touhou/touhou-ball-yin-yang.png'}};
  // Table-owned Touhou rules come from formal config, even when an editor
  // draft predates them. This preview copy never changes the saved document.
  if(editorPreview&&previewTheme==='touhou1'){
   const gameplay={...layout.gameplay},objects=layout.objects||[],defaults=TOUHOU_GAMEPLAY_DEFAULTS;
   if(objects.some(o=>o.id===defaults.touhouBagua?.object&&o.type==='blockhole'))gameplay.touhouBagua=structuredClone(defaults.touhouBagua);
   if(objects.some(o=>o.id===defaults.touhouGap?.hole&&o.type==='hole'))gameplay.touhouGap=structuredClone(defaults.touhouGap);
   layout={...layout,gameplay};
  }
  const geometry=ConfiguredMechanisms.compile(layout,PIRATE_GEOMETRY,compileLayout);
  // Decode referenced art before starting, so missing assets produce a useful error.
  const sources=new Set([geometry.gameplay?.ballImage||'res/img/top-ball.png']);
  function collectImages(value){
   if(typeof value==='string'&&/^res\/(?:img|hd_img)\/.+\.(?:png|jpe?g|webp|svg)$/i.test(value))sources.add(value);
   else if(value&&typeof value==='object')Object.values(value).forEach(collectImages);
  }
  collectImages(geometry.gameplay?.touhouBagua);collectImages(geometry.gameplay?.runicTurntable);collectImages(geometry.artLayers);collectImages(PlayFrame.createArt(previewTheme));
  await Promise.all([...sources].map(async src=>{
   const image=new Image();image.src=src;
   try{await image.decode();}catch{throw Error('圖片載入失敗：'+src);}
  }));
  startPreview(geometry);
  document.title=previewTheme+' · 試玩';
  if(editorPreview)window.opener.postMessage({channel:'pinball-local-preview',type:'started'},'*');
 }catch(error){
  previewNotice.textContent='無法試玩：'+error.message;
  if(editorPreview)window.opener.postMessage({channel:'pinball-local-preview',type:'error',message:error.message},'*');
  else throw error;
 }
}
if(editorPreview){
 previewNotice.textContent='等待編輯器資料…';
 window.addEventListener('message',event=>{
  if(event.source!==window.opener||event.data?.channel!=='pinball-local-preview'||event.data.type!=='load')return;
  loadPiratePreview(event.data.layout);
 });
 window.opener.postMessage({channel:'pinball-local-preview',type:'ready'},'*');
}else{
 const layoutTheme=previewTheme==='norse'?'saga':previewTheme;
 const layoutSource=window.AppControls&&window.MainRuntimeLayouts?.[layoutTheme]?Promise.resolve(window.MainRuntimeLayouts[layoutTheme]):location.protocol==='file:'&&!window.AppControls?Promise.resolve(PLAYTEST_LAYOUT):fetch(new URL('res/config/'+(layoutTheme+'-play')+'.json',document.baseURI),{cache:'no-store'})
  .then(response=>{if(!response.ok)throw Error('布局載入失敗：'+response.status);return response.json();});
 window.viewReady=layoutSource.then(loadPiratePreview);
 window.viewReady.catch(error=>{previewNotice.textContent='無法試玩：'+error.message;});
}
