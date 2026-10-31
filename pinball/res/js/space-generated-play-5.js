const PLAYTEST_THEME="space";
const PLAYTEST_LAYOUT={"theme": "sci-fi", "artLayers": [{"id": "art-001", "src": "res/img/space/space-plunger-rod.png", "x": 334, "y": 425, "width": 30, "height": 91, "angle": 0, "opacity": 1, "crop": [0, 0, 30, 154], "plane": "top", "frames": 1, "frameAxis": "x", "state": "plunger", "bind": "plunger", "layoutBind": "plunger-001", "layoutAnchor": [334.6056, 382.736]}, {"id": "art-002", "src": "res/img/space/space-plunger-collar.png", "x": 335, "y": 417, "width": 50, "height": 38, "angle": 0, "opacity": 1, "crop": [0, 0, 65, 38], "plane": "top", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "layoutBind": "plunger-001", "layoutAnchor": [334.6056, 382.736]}, {"id": "art-003", "src": "res/img/space/space-symbol-grandma-statue.webp", "x": 149, "y": 205, "width": 31, "height": 59, "angle": 0, "opacity": 1, "crop": [0, 0, 182, 348], "plane": "foreground", "frames": 1, "frameAxis": "x", "state": "static", "bind": ""}, {"id": "art-005", "src": "res/img/space/space-bumper-asteroid-level-1.png", "x": 101, "y": 139, "width": 39, "height": 39, "angle": 0, "opacity": 1, "crop": [0, 0, 39, 39], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "indicator": {"type": "bumper", "group": "space-bumpers", "lv1": "res/img/space/space-bumper-asteroid-level-1.png", "lv2": "res/img/space/space-bumper-asteroid-level-2.png", "lv3": "res/img/space/space-bumper-asteroid-level-3.png", "defaultState": "lv1", "trigger": {"kind": "level", "source": "circle-031"}}}, {"id": "art-006", "src": "res/img/space/space-bumper-asteroid-level-1.png", "x": 88, "y": 235, "width": 39, "height": 39, "angle": 0, "opacity": 1, "crop": [0, 0, 39, 39], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "indicator": {"type": "bumper", "group": "space-bumpers", "lv1": "res/img/space/space-bumper-asteroid-level-1.png", "lv2": "res/img/space/space-bumper-asteroid-level-2.png", "lv3": "res/img/space/space-bumper-asteroid-level-3.png", "defaultState": "lv1", "trigger": {"kind": "level", "source": "circle-054"}}}, {"id": "art-007", "src": "res/img/space/space-bumper-asteroid-level-1.png", "x": 71, "y": 190, "width": 39, "height": 39, "angle": 0, "opacity": 1, "crop": [0, 0, 39, 39], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "indicator": {"type": "bumper", "group": "space-bumpers", "lv1": "res/img/space/space-bumper-asteroid-level-1.png", "lv2": "res/img/space/space-bumper-asteroid-level-2.png", "lv3": "res/img/space/space-bumper-asteroid-level-3.png", "defaultState": "lv1", "trigger": {"kind": "level", "source": "circle-029"}}}, {"id": "art-008", "src": "res/img/space/space-bumper-asteroid-level-1.png", "x": 52, "y": 142, "width": 39, "height": 39, "angle": 0, "opacity": 1, "crop": [0, 0, 39, 39], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "indicator": {"type": "bumper", "group": "space-bumpers", "lv1": "res/img/space/space-bumper-asteroid-level-1.png", "lv2": "res/img/space/space-bumper-asteroid-level-2.png", "lv3": "res/img/space/space-bumper-asteroid-level-3.png", "defaultState": "lv1", "trigger": {"kind": "level", "source": "circle-032"}}}, {"id": "art-009", "src": "res/img/space/space-bumper-asteroid-level-1.png", "x": 133, "y": 198, "width": 39, "height": 39, "angle": 0, "opacity": 1, "crop": [0, 0, 39, 39], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "indicator": {"type": "bumper", "group": "space-bumpers", "lv1": "res/img/space/space-bumper-asteroid-level-1.png", "lv2": "res/img/space/space-bumper-asteroid-level-2.png", "lv3": "res/img/space/space-bumper-asteroid-level-3.png", "defaultState": "lv1", "trigger": {"kind": "level", "source": "circle-051"}}}, {"id": "art-010", "src": "res/hd_img/space/space-ch1-hero-ship.png", "x": 84, "y": 245, "width": 48, "height": 48, "angle": 27.146193688807294, "opacity": 1, "crop": [0, 0, 1254, 1254], "plane": "upper", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "animation": {"enabled": true, "effect": "shake", "duration": 0.75, "amplitude": 2.5, "trigger": {"kind": "target", "source": "target-015-1"}, "extraTriggers": [{"kind": "target", "source": "target-016-1"}]}}, {"id": "art-011", "src": "res/hd_img/space/space-flipper-concept.png", "x": 153, "y": 450, "width": 54, "height": 19, "angle": 25, "opacity": 1, "crop": [0, 0, 2172, 724], "plane": "top", "frames": 1, "frameAxis": "x", "state": "static", "bind": "flipper-004"}, {"id": "art-012", "src": "res/hd_img/space/space-flipper-concept.png", "x": 228, "y": 448, "width": 54, "height": 19, "angle": -25, "opacity": 1, "crop": [0, 0, 2172, 724], "plane": "top", "frames": 1, "frameAxis": "x", "state": "static", "bind": "flipper-003", "flipX": true}, {"id": "art-013", "src": "res/hd_img/space/space-flipper-concept.png", "x": 56, "y": 293, "width": 54, "height": 19, "angle": 74, "opacity": 1, "crop": [0, 0, 2172, 724], "plane": "top", "frames": 1, "frameAxis": "x", "state": "static", "bind": "flipper-001"}, {"id": "art-014", "src": "res/hd_img/space/space-flipper-concept.png", "x": 312, "y": 196, "width": 54, "height": 19, "angle": -64, "opacity": 1, "crop": [0, 0, 2172, 724], "plane": "top", "frames": 1, "frameAxis": "x", "state": "static", "bind": "flipper-002", "flipX": true}, {"id": "art-015", "src": "res/hd_img/space/space-king-toilet-throne-front.png", "x": 187, "y": 44, "width": 43, "height": 64, "angle": 0, "opacity": 1, "crop": [0, 0, 1024, 1536], "plane": "upper", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "animation": {"enabled": true, "effect": "shake", "duration": 0.75, "amplitude": 2.5, "trigger": {"kind": "layer-entry", "source": "oneway-001"}}}, {"id": "art-016", "src": "res/hd_img/space/space-flag-royal-no-cookie.png", "x": 143, "y": 141, "width": 25, "height": 23, "angle": 0, "opacity": 1, "crop": [0, 0, 1323, 1189], "plane": "top", "frames": 1, "frameAxis": "x", "state": "static", "bind": "flag-002"}, {"id": "art-017", "src": "res/hd_img/space/space-flag-royal-no-cookie.png", "x": 223, "y": 99, "width": 25, "height": 23, "angle": 0, "opacity": 1, "crop": [0, 0, 1323, 1189], "plane": "top", "frames": 1, "frameAxis": "x", "state": "static", "bind": "flag-001"}, {"id": "art-018", "src": "res/hd_img/space/space-target-bandit-flag.png", "x": 128, "y": 50, "width": 20, "height": 18, "angle": 0, "opacity": 1, "crop": [0, 0, 1322, 1190], "plane": "upper", "frames": 1, "frameAxis": "x", "state": "target", "bind": "target-011-1"}, {"id": "art-022", "src": "res/hd_img/space/space-target-bandit-flag.png", "x": 278, "y": 291, "width": 20, "height": 18, "angle": 0, "opacity": 1, "crop": [0, 0, 1322, 1190], "plane": "upper", "frames": 1, "frameAxis": "x", "state": "target", "bind": "target-014-1", "flipX": true}, {"id": "art-023", "src": "res/hd_img/space/space-target-bandit-flag.png", "x": 282, "y": 273, "width": 20, "height": 18, "angle": 0, "opacity": 1, "crop": [0, 0, 1322, 1190], "plane": "upper", "frames": 1, "frameAxis": "x", "state": "target", "bind": "target-013-1", "flipX": true}, {"id": "art-024", "src": "res/hd_img/space/space-object-refugee-ship.png", "x": 32, "y": 224, "width": 59, "height": 39, "angle": 0, "opacity": 1, "crop": [0, 0, 1536, 1024], "plane": "foreground", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "animation": {"enabled": true, "effect": "shake", "duration": 0.75, "amplitude": 2.5, "trigger": {"kind": "layer-entry", "source": "circle-039"}}}, {"id": "art-025", "src": "res/hd_img/space/space-theater-boss-5-warden-ship.png", "x": 271, "y": 127, "width": 50, "height": 37, "angle": 0, "opacity": 1, "crop": [0, 0, 1448, 1086], "plane": "top", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "indicator": {"off": "res/hd_img/space/space-theater-boss-5-warden-ship.png", "on": "", "defaultState": "off", "trigger": {"kind": "object-hidden", "source": "rect-005"}, "behavior": {"mode": "keep"}, "impactFlash": false}}, {"id": "art-026", "src": "res/hd_img/space/space-floor-background.png", "x": 189, "y": 249, "width": 385, "height": 500, "angle": 0, "opacity": 1, "crop": [0, 0, 1098, 1433], "plane": "background", "frames": 1, "frameAxis": "x", "state": "static", "bind": ""}, {"id": "art-032", "src": "res/img/space/space-light-star-off.png", "x": 289, "y": 370, "width": 22, "height": 22, "angle": 0, "opacity": 1, "crop": [0, 0, 23, 22], "plane": "background", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "indicator": {"off": "res/img/space/space-light-star-off.png", "on": "res/img/space/space-light-star-on.png", "defaultState": "off", "trigger": {"kind": "rollover", "source": "rollover-001"}, "behavior": {"mode": "keep"}, "impactFlash": false, "group": "space-rollovers"}}, {"id": "art-033", "src": "res/img/space/space-light-star-off.png", "x": 72, "y": 360, "width": 22, "height": 22, "angle": 0, "opacity": 1, "crop": [0, 0, 23, 22], "plane": "background", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "indicator": {"off": "res/img/space/space-light-star-off.png", "on": "res/img/space/space-light-star-on.png", "defaultState": "off", "trigger": {"kind": "rollover", "source": "rollover-002"}, "behavior": {"mode": "keep"}, "impactFlash": false, "group": "space-rollovers"}}, {"id": "art-034", "src": "res/img/space/space-light-star-off.png", "x": 95, "y": 360, "width": 22, "height": 22, "angle": 0, "opacity": 1, "crop": [0, 0, 23, 22], "plane": "background", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "indicator": {"off": "res/img/space/space-light-star-off.png", "on": "res/img/space/space-light-star-on.png", "defaultState": "off", "trigger": {"kind": "rollover", "source": "rollover-003"}, "behavior": {"mode": "keep"}, "impactFlash": false, "group": "space-rollovers"}}, {"id": "art-035", "src": "res/img/space/space-light-cookie-off.png", "x": 311, "y": 370, "width": 22, "height": 22, "angle": 0, "opacity": 1, "crop": [0, 0, 22, 23], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "indicator": {"off": "res/img/space/space-light-cookie-off.png", "on": "res/img/space/space-light-cookie-on.png", "defaultState": "off", "trigger": {"kind": "kickback", "source": "line-639"}, "behavior": {"mode": "keep"}, "group": "space-rescue"}}, {"id": "art-036", "src": "res/img/space/space-light-cookie-off.png", "x": 47, "y": 360, "width": 22, "height": 22, "angle": 0, "opacity": 1, "crop": [0, 0, 22, 23], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "indicator": {"off": "res/img/space/space-light-cookie-off.png", "on": "res/img/space/space-light-cookie-on.png", "defaultState": "off", "trigger": {"kind": "kickback", "source": "line-640"}, "behavior": {"mode": "keep"}, "group": "space-rescue"}}, {"id": "art-037", "src": "res/hd_img/space/space-ch7-spatial-rift-transparent.png", "x": 303, "y": 270, "width": 80, "height": 40, "angle": 268.91498238050264, "opacity": 1, "crop": [0, 0, 1774, 887], "plane": "background", "frames": 1, "frameAxis": "x", "state": "static", "bind": ""}, {"id": "art-038", "src": "res/hd_img/space/space-target-bandit-flag.png", "x": 177, "y": 201, "width": 20, "height": 18, "angle": 0, "opacity": 1, "crop": [0, 0, 1322, 1190], "plane": "upper", "frames": 1, "frameAxis": "x", "state": "target", "bind": "targets-001-1"}, {"id": "art-039", "src": "res/hd_img/space/space-target-bandit-flag.png", "x": 176, "y": 219, "width": 20, "height": 18, "angle": 0, "opacity": 1, "crop": [0, 0, 1322, 1190], "plane": "upper", "frames": 1, "frameAxis": "x", "state": "target", "bind": "targets-001-2"}, {"id": "art-040", "src": "res/hd_img/space/space-target-bandit-flag.png", "x": 177, "y": 235, "width": 20, "height": 18, "angle": 0, "opacity": 1, "crop": [0, 0, 1322, 1190], "plane": "upper", "frames": 1, "frameAxis": "x", "state": "target", "bind": "targets-001-3"}, {"id": "art-043", "src": "res/hd_img/space/space-ch7-spatial-rift-transparent.png", "x": 273, "y": 34, "width": 104, "height": 52, "angle": 17.339379308104924, "opacity": 1, "crop": [0, 0, 1774, 887], "plane": "background", "frames": 1, "frameAxis": "x", "state": "static", "bind": ""}, {"id": "art-044", "src": "res/hd_img/space/space-ch7-spatial-rift-transparent.png", "x": 267, "y": 97, "width": 59, "height": 29, "angle": 7.392196803762857, "opacity": 1, "crop": [0, 0, 1774, 887], "plane": "background", "frames": 1, "frameAxis": "x", "state": "static", "bind": ""}, {"id": "art-045", "src": "res/hd_img/space/space-theater-boss-4-bandit-ship.png", "x": 120, "y": 27, "width": 59, "height": 39, "angle": 0, "opacity": 1, "crop": [0, 0, 1536, 1024], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "bind": "target-011-1", "flipX": true, "animation": {"enabled": true, "effect": "shake", "duration": 0.75, "amplitude": 2.5, "trigger": {"kind": "hole-capture", "source": ""}}}, {"id": "art-048", "src": "res/img/space/space-handheld-mining-drill.png", "x": 86, "y": 258, "width": 24, "height": 24, "angle": -39.256080687992466, "opacity": 1, "crop": [0, 0, 24, 24], "plane": "foreground", "frames": 1, "frameAxis": "x", "state": "target", "bind": "target-016-1", "flipY": false, "flipX": true}, {"id": "art-049", "src": "res/img/space/space-handheld-mining-drill.png", "x": 99, "y": 253, "width": 24, "height": 24, "angle": -51.04210462710722, "opacity": 1, "crop": [0, 0, 24, 24], "plane": "foreground", "frames": 1, "frameAxis": "x", "state": "target", "bind": "target-015-1", "flipX": true}, {"id": "art-050", "src": "res/hd_img/space/space-object-tax-cookie-plate.png", "x": 149, "y": 234, "width": 51, "height": 26, "angle": 0, "opacity": 1, "crop": [0, 0, 1774, 887], "plane": "foreground", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "animation": {"enabled": true, "effect": "shake", "duration": 0.75, "amplitude": 2.5, "trigger": {"kind": "hole-capture", "source": "hole-012"}}}, {"id": "art-051", "src": "res/img/space/space-light-arrow-gold-off.png", "x": 337, "y": 177, "width": 11, "height": 14, "angle": 269.09215230218524, "opacity": 1, "crop": [0, 0, 12, 14], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "indicator": {"off": "res/img/space/space-light-arrow-gold-off.png", "on": "res/img/space/space-light-arrow-gold-on.png", "defaultState": "off", "trigger": {"kind": "sensor", "source": "sensor-005"}, "behavior": {"mode": "once", "onSeconds": 0.8}, "impactFlash": false, "group": "space-gold-sensor-005"}}, {"id": "art-052", "src": "res/img/space/space-light-arrow-gold-off.png", "x": 337, "y": 167, "width": 11, "height": 14, "angle": 269.21744902616194, "opacity": 1, "crop": [0, 0, 12, 14], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "indicator": {"off": "res/img/space/space-light-arrow-gold-off.png", "on": "res/img/space/space-light-arrow-gold-on.png", "defaultState": "off", "trigger": {"kind": "sensor", "source": "sensor-005"}, "behavior": {"mode": "once", "onSeconds": 0.8}, "impactFlash": false, "group": "space-gold-sensor-005"}}, {"id": "art-054", "src": "res/img/space/space-light-arrow-gold-off.png", "x": 337, "y": 157, "width": 11, "height": 14, "angle": -90, "opacity": 1, "crop": [0, 0, 12, 14], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "indicator": {"off": "res/img/space/space-light-arrow-gold-off.png", "on": "res/img/space/space-light-arrow-gold-on.png", "defaultState": "off", "trigger": {"kind": "sensor", "source": "sensor-005"}, "behavior": {"mode": "once", "onSeconds": 0.8}, "impactFlash": false, "group": "space-gold-sensor-005"}}, {"id": "art-055", "src": "res/img/space/space-light-arrow-gold-off.png", "x": 337, "y": 187, "width": 11, "height": 14, "angle": -90, "opacity": 1, "crop": [0, 0, 12, 14], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "indicator": {"off": "res/img/space/space-light-arrow-gold-off.png", "on": "res/img/space/space-light-arrow-gold-on.png", "defaultState": "off", "trigger": {"kind": "sensor", "source": "sensor-005"}, "behavior": {"mode": "once", "onSeconds": 0.8}, "impactFlash": false, "group": "space-gold-sensor-005"}}, {"id": "art-058", "src": "res/img/space/space-tower-arrows-right.png", "x": 34, "y": 110, "width": 46, "height": 46, "angle": 0, "opacity": 1, "crop": [0, 0, 46, 46], "plane": "foreground", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "indicator": {"off": "res/img/space/space-tower-arrows-right.png", "on": "res/img/space/space-tower-arrows-left.png", "defaultState": "off", "trigger": {"kind": "object-hidden", "source": "arc-006"}, "behavior": {"mode": "keep"}, "impactFlash": false, "group": "space-route-sign"}}, {"id": "art-059", "src": "res/img/space/space-tower-trigger-blue.png", "x": 205, "y": 103, "width": 30, "height": 30, "angle": 0, "opacity": 1, "crop": [0, 0, 30, 30], "plane": "top", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "indicator": {"off": "res/img/space/space-tower-trigger-blue.png", "on": "res/img/space/space-tower-trigger-yellow.png", "defaultState": "off", "trigger": {"kind": "object-hidden", "source": "arc-006"}, "behavior": {"mode": "keep"}, "impactFlash": false}}, {"id": "art-064", "src": "res/img/space/space-light-mission-spaghetti-off.png", "x": 290, "y": 24, "width": 28, "height": 21, "angle": 0, "opacity": 1, "crop": [0, 0, 29, 21], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "indicator": {"group": "space-lv4-counter", "off": "res/img/space/space-light-mission-spaghetti-off.png", "on": "res/img/space/space-light-mission-spaghetti-on.png", "complete": "res/img/space/space-light-mission-spaghetti-on.png", "defaultState": "off", "trigger": {"kind": "count", "source": "sensor-004", "threshold": 1}, "behavior": {"mode": "keep"}, "completion": {"mode": "once", "onSeconds": 0.6}, "impactFlash": false}}, {"id": "art-065", "src": "res/img/space/space-light-mission-spaghetti-off.png", "x": 303, "y": 45, "width": 28, "height": 21, "angle": 0, "opacity": 1, "crop": [0, 0, 29, 21], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "indicator": {"group": "space-lv4-counter", "off": "res/img/space/space-light-mission-spaghetti-off.png", "on": "res/img/space/space-light-mission-spaghetti-on.png", "complete": "res/img/space/space-light-mission-spaghetti-on.png", "defaultState": "off", "trigger": {"kind": "count", "source": "sensor-004", "threshold": 2}, "behavior": {"mode": "keep"}, "completion": {"mode": "once", "onSeconds": 0.6}, "impactFlash": false}}, {"id": "art-066", "src": "res/img/space/space-light-mission-spaghetti-off.png", "x": 317, "y": 24, "width": 28, "height": 21, "angle": 0, "opacity": 1, "crop": [0, 0, 29, 21], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "indicator": {"group": "space-lv4-counter", "off": "res/img/space/space-light-mission-spaghetti-off.png", "on": "res/img/space/space-light-mission-spaghetti-on.png", "complete": "res/img/space/space-light-mission-spaghetti-on.png", "defaultState": "off", "trigger": {"kind": "count", "source": "sensor-004", "threshold": 3}, "behavior": {"mode": "keep"}, "completion": {"mode": "once", "onSeconds": 0.6}, "impactFlash": false}}, {"id": "art-067", "src": "res/img/space/space-light-mission-spaghetti-off.png", "x": 344, "y": 24, "width": 28, "height": 21, "angle": 0, "opacity": 1, "crop": [0, 0, 29, 21], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "indicator": {"group": "space-lv4-counter", "off": "res/img/space/space-light-mission-spaghetti-off.png", "on": "res/img/space/space-light-mission-spaghetti-on.png", "complete": "res/img/space/space-light-mission-spaghetti-on.png", "defaultState": "off", "trigger": {"kind": "count", "source": "sensor-004", "threshold": 5}, "behavior": {"mode": "keep"}, "completion": {"mode": "once", "onSeconds": 0.6}, "impactFlash": false}}, {"id": "art-068", "src": "res/img/space/space-light-mission-spaghetti-off.png", "x": 331, "y": 45, "width": 28, "height": 21, "angle": 0, "opacity": 1, "crop": [0, 0, 29, 21], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "indicator": {"group": "space-lv4-counter", "off": "res/img/space/space-light-mission-spaghetti-off.png", "on": "res/img/space/space-light-mission-spaghetti-on.png", "complete": "res/img/space/space-light-mission-spaghetti-on.png", "defaultState": "off", "trigger": {"kind": "count", "source": "sensor-004", "threshold": 4}, "behavior": {"mode": "keep"}, "completion": {"mode": "once", "onSeconds": 0.6}, "impactFlash": false}}, {"id": "art-069", "src": "res/img/space/space-light-guide-blue-off.png", "x": 265, "y": 256, "width": 24, "height": 16, "angle": 40.6731088286384, "opacity": 1, "crop": [0, 0, 24, 16], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "indicator": {"group": "space-guide-blue", "off": "res/img/space/space-light-guide-blue-off.png", "on": "res/img/space/space-light-guide-blue-on.png", "defaultState": "off", "trigger": {"kind": "enemy-idle"}, "behavior": {"mode": "repeat", "onSeconds": 0.6, "offSeconds": 2.4}}}, {"id": "art-070", "src": "res/img/space/space-light-guide-gold-off.png", "x": 188, "y": 89, "width": 24, "height": 16, "angle": -87.91590284117663, "opacity": 1, "crop": [0, 0, 24, 16], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "indicator": {"group": "space-guide-gold", "off": "res/img/space/space-light-guide-gold-off.png", "on": "res/img/space/space-light-guide-gold-on.png", "defaultState": "off", "trigger": {"kind": "enemy-active"}, "behavior": {"mode": "repeat", "onSeconds": 0.6, "offSeconds": 2.4}}}, {"id": "art-071", "src": "res/img/space/space-light-guide-gold-off.png", "x": 157, "y": 105, "width": 24, "height": 16, "angle": 232.63995142188526, "opacity": 1, "crop": [0, 0, 24, 16], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "indicator": {"group": "space-guide-gold", "off": "res/img/space/space-light-guide-gold-off.png", "on": "res/img/space/space-light-guide-gold-on.png", "defaultState": "off", "trigger": {"kind": "enemy-active"}, "behavior": {"mode": "repeat", "onSeconds": 0.6, "offSeconds": 2.4}}}, {"id": "art-072", "src": "res/img/space/space-light-guide-gold-off.png", "x": 254, "y": 111, "width": 24, "height": 16, "angle": -69.23584595122603, "opacity": 1, "crop": [0, 0, 24, 16], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "indicator": {"group": "space-guide-gold", "off": "res/img/space/space-light-guide-gold-off.png", "on": "res/img/space/space-light-guide-gold-on.png", "defaultState": "off", "trigger": {"kind": "enemy-active"}, "behavior": {"mode": "repeat", "onSeconds": 0.6, "offSeconds": 2.4}}}, {"id": "art-073", "src": "res/img/space/space-light-guide-gold-off.png", "x": 290, "y": 235, "width": 24, "height": 16, "angle": 28.18174301734102, "opacity": 1, "crop": [0, 0, 24, 16], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "indicator": {"group": "space-guide-gold", "off": "res/img/space/space-light-guide-gold-off.png", "on": "res/img/space/space-light-guide-gold-on.png", "defaultState": "off", "trigger": {"kind": "enemy-active"}, "behavior": {"mode": "repeat", "onSeconds": 0.6, "offSeconds": 2.4}}}, {"id": "art-074", "src": "res/img/space/space-light-guide-gold-off.png", "x": 151, "y": 259, "width": 24, "height": 16, "angle": -87.91590284117663, "opacity": 1, "crop": [0, 0, 24, 16], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "indicator": {"group": "space-guide-gold", "off": "res/img/space/space-light-guide-gold-off.png", "on": "res/img/space/space-light-guide-gold-on.png", "defaultState": "off", "trigger": {"kind": "enemy-active"}, "behavior": {"mode": "repeat", "onSeconds": 0.6, "offSeconds": 2.4}}}, {"id": "art-075", "src": "res/img/space/space-light-guide-gold-off.png", "x": 254, "y": 293, "width": 24, "height": 16, "angle": 1.2962890195672827, "opacity": 1, "crop": [0, 0, 24, 16], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "indicator": {"group": "space-guide-gold", "off": "res/img/space/space-light-guide-gold-off.png", "on": "res/img/space/space-light-guide-gold-on.png", "defaultState": "off", "trigger": {"kind": "enemy-active"}, "behavior": {"mode": "repeat", "onSeconds": 0.6, "offSeconds": 2.4}}}, {"id": "art-076", "src": "res/img/space/space-light-guide-gold-off.png", "x": 198, "y": 217, "width": 24, "height": 16, "angle": 179.57370879361275, "opacity": 1, "crop": [0, 0, 24, 16], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "indicator": {"group": "space-guide-gold", "off": "res/img/space/space-light-guide-gold-off.png", "on": "res/img/space/space-light-guide-gold-on.png", "defaultState": "off", "trigger": {"kind": "enemy-active"}, "behavior": {"mode": "repeat", "onSeconds": 0.6, "offSeconds": 2.4}}}, {"id": "art-077", "src": "res/img/space/space-light-guide-blue-off.png", "x": 196, "y": 200, "width": 24, "height": 16, "angle": 179.3696930617263, "opacity": 1, "crop": [0, 0, 24, 16], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "indicator": {"group": "space-guide-blue", "off": "res/img/space/space-light-guide-blue-off.png", "on": "res/img/space/space-light-guide-blue-on.png", "defaultState": "off", "trigger": {"kind": "enemy-idle"}, "behavior": {"mode": "repeat", "onSeconds": 0.6, "offSeconds": 2.4}}}, {"id": "art-078", "src": "res/img/space/space-light-guide-blue-off.png", "x": 148, "y": 94, "width": 24, "height": 16, "angle": 235.15407753575494, "opacity": 1, "crop": [0, 0, 24, 16], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "indicator": {"group": "space-guide-blue", "off": "res/img/space/space-light-guide-blue-off.png", "on": "res/img/space/space-light-guide-blue-on.png", "defaultState": "off", "trigger": {"kind": "enemy-idle"}, "behavior": {"mode": "repeat", "onSeconds": 0.6, "offSeconds": 2.4}}}, {"id": "art-079", "src": "res/img/space/space-light-arrow-blue-off.png", "x": 212, "y": 61, "width": 11, "height": 14, "angle": 257.3459504809382, "opacity": 1, "crop": [0, 0, 12, 14], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "indicator": {"off": "res/img/space/space-light-arrow-blue-off.png", "on": "res/img/space/space-light-arrow-blue-on.png", "defaultState": "off", "trigger": {"kind": "flag", "source": "flag-001"}, "behavior": {"mode": "once", "onSeconds": 0.8}, "impactFlash": false, "group": "space-blue-flag-001"}}, {"id": "art-080", "src": "res/img/space/space-light-arrow-blue-off.png", "x": 215, "y": 70, "width": 11, "height": 14, "angle": 257.4998115589543, "opacity": 1, "crop": [0, 0, 12, 14], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "indicator": {"off": "res/img/space/space-light-arrow-blue-off.png", "on": "res/img/space/space-light-arrow-blue-on.png", "defaultState": "off", "trigger": {"kind": "flag", "source": "flag-001"}, "behavior": {"mode": "once", "onSeconds": 0.8}, "impactFlash": false, "group": "space-blue-flag-001"}}, {"id": "art-081", "src": "res/img/space/space-light-arrow-blue-off.png", "x": 218, "y": 79, "width": 11, "height": 14, "angle": 257.559392230999, "opacity": 1, "crop": [0, 0, 12, 14], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "indicator": {"off": "res/img/space/space-light-arrow-blue-off.png", "on": "res/img/space/space-light-arrow-blue-on.png", "defaultState": "off", "trigger": {"kind": "flag", "source": "flag-001"}, "behavior": {"mode": "once", "onSeconds": 0.8}, "impactFlash": false, "group": "space-blue-flag-001"}}, {"id": "art-082", "src": "res/img/space/space-light-arrow-blue-off.png", "x": 117, "y": 110, "width": 11, "height": 14, "angle": 233.21700016230668, "opacity": 1, "crop": [0, 0, 12, 14], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "indicator": {"off": "res/img/space/space-light-arrow-blue-off.png", "on": "res/img/space/space-light-arrow-blue-on.png", "defaultState": "off", "trigger": {"kind": "flag", "source": "flag-002"}, "behavior": {"mode": "once", "onSeconds": 0.8}, "impactFlash": false, "group": "space-blue-flag-002"}}, {"id": "art-083", "src": "res/img/space/space-light-arrow-blue-off.png", "x": 122, "y": 116, "width": 11, "height": 14, "angle": 233.21700016230668, "opacity": 1, "crop": [0, 0, 12, 14], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "indicator": {"off": "res/img/space/space-light-arrow-blue-off.png", "on": "res/img/space/space-light-arrow-blue-on.png", "defaultState": "off", "trigger": {"kind": "flag", "source": "flag-002"}, "behavior": {"mode": "once", "onSeconds": 0.8}, "impactFlash": false, "group": "space-blue-flag-002"}}, {"id": "art-084", "src": "res/img/space/space-light-arrow-blue-off.png", "x": 127, "y": 122, "width": 11, "height": 14, "angle": 233.21700016230668, "opacity": 1, "crop": [0, 0, 12, 14], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "indicator": {"off": "res/img/space/space-light-arrow-blue-off.png", "on": "res/img/space/space-light-arrow-blue-on.png", "defaultState": "off", "trigger": {"kind": "flag", "source": "flag-002"}, "behavior": {"mode": "once", "onSeconds": 0.8}, "impactFlash": false, "group": "space-blue-flag-002"}}, {"id": "art-085", "src": "res/img/space/space-light-mission-crown-off.png", "x": 276, "y": 142, "width": 21, "height": 17, "angle": 0, "opacity": 1, "crop": [0, 0, 22, 17], "plane": "background", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "indicator": {"off": "res/img/space/space-light-mission-crown-off.png", "on": "res/img/space/space-light-mission-crown-on.png", "defaultState": "off", "trigger": {"kind": "object-hidden", "source": "rect-005"}, "behavior": {"mode": "keep"}, "impactFlash": false}}, {"id": "art-086", "src": "res/img/space/space-light-crystal-off.png", "x": 27, "y": 189, "width": 20, "height": 20, "angle": 0, "opacity": 1, "crop": [0, 0, 20, 20], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "indicator": {"off": "res/img/space/space-light-crystal-off.png", "on": "res/img/space/space-light-crystal-on.png", "defaultState": "on", "trigger": {"kind": "level", "source": "circle-032", "threshold": 1}, "behavior": {"mode": "keep"}, "impactFlash": false, "complete": "res/img/space/space-light-crystal-off.png", "completion": {"mode": "burst", "onSeconds": 0.15, "offSeconds": 0.15, "cycles": 3}, "group": "space-bumper-levels"}}, {"id": "art-087", "src": "res/img/space/space-light-crystal-off.png", "x": 27, "y": 173, "width": 20, "height": 20, "angle": 0, "opacity": 1, "crop": [0, 0, 20, 20], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "indicator": {"off": "res/img/space/space-light-crystal-off.png", "on": "res/img/space/space-light-crystal-on.png", "defaultState": "off", "trigger": {"kind": "level", "source": "circle-032", "threshold": 2}, "behavior": {"mode": "keep"}, "impactFlash": false, "complete": "res/img/space/space-light-crystal-off.png", "completion": {"mode": "burst", "onSeconds": 0.15, "offSeconds": 0.15, "cycles": 3}, "group": "space-bumper-levels"}}, {"id": "art-088", "src": "res/img/space/space-light-crystal-off.png", "x": 27, "y": 156, "width": 20, "height": 20, "angle": 0, "opacity": 1, "crop": [0, 0, 20, 20], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "indicator": {"off": "res/img/space/space-light-crystal-off.png", "on": "res/img/space/space-light-crystal-on.png", "defaultState": "off", "trigger": {"kind": "level", "source": "circle-032", "threshold": 3}, "behavior": {"mode": "keep"}, "impactFlash": false, "complete": "res/img/space/space-light-crystal-off.png", "completion": {"mode": "burst", "onSeconds": 0.15, "offSeconds": 0.15, "cycles": 3}, "group": "space-bumper-levels"}}, {"id": "art-090", "src": "res/img/space/space-light-arrow-gold-off.png", "x": 262, "y": 183, "width": 11, "height": 14, "angle": 196.33259797753445, "opacity": 1, "crop": [0, 0, 12, 14], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "indicator": {"off": "res/img/space/space-light-arrow-gold-off.png", "on": "res/img/space/space-light-arrow-gold-on.png", "defaultState": "off", "trigger": {"kind": "flipper", "source": "flipper-002"}, "behavior": {"mode": "once", "onSeconds": 0.6}, "impactFlash": false, "group": "space-gold-flipper-002"}}, {"id": "art-091", "src": "res/img/space/space-light-arrow-gold-off.png", "x": 270, "y": 185, "width": 11, "height": 14, "angle": 196.33259797753445, "opacity": 1, "crop": [0, 0, 12, 14], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "indicator": {"off": "res/img/space/space-light-arrow-gold-off.png", "on": "res/img/space/space-light-arrow-gold-on.png", "defaultState": "off", "trigger": {"kind": "flipper", "source": "flipper-002"}, "behavior": {"mode": "once", "onSeconds": 0.6}, "impactFlash": false, "group": "space-gold-flipper-002"}}, {"id": "art-092", "src": "res/img/space/space-light-arrow-gold-off.png", "x": 278, "y": 187, "width": 11, "height": 14, "angle": 196.33259797753445, "opacity": 1, "crop": [0, 0, 12, 14], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "indicator": {"off": "res/img/space/space-light-arrow-gold-off.png", "on": "res/img/space/space-light-arrow-gold-on.png", "defaultState": "off", "trigger": {"kind": "flipper", "source": "flipper-002"}, "behavior": {"mode": "once", "onSeconds": 0.6}, "impactFlash": false, "group": "space-gold-flipper-002"}}, {"id": "art-093", "src": "res/img/space/space-light-arrow-gold-off.png", "x": 98, "y": 290, "width": 11, "height": 14, "angle": -13.893886924461484, "opacity": 1, "crop": [0, 0, 12, 14], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "indicator": {"off": "res/img/space/space-light-arrow-gold-off.png", "on": "res/img/space/space-light-arrow-gold-on.png", "defaultState": "off", "trigger": {"kind": "flipper", "source": "flipper-001"}, "behavior": {"mode": "once", "onSeconds": 0.6}, "impactFlash": false, "group": "space-gold-flipper-001"}}, {"id": "art-094", "src": "res/img/space/space-light-arrow-gold-off.png", "x": 106, "y": 288, "width": 11, "height": 14, "angle": -13.893886924461484, "opacity": 1, "crop": [0, 0, 12, 14], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "indicator": {"off": "res/img/space/space-light-arrow-gold-off.png", "on": "res/img/space/space-light-arrow-gold-on.png", "defaultState": "off", "trigger": {"kind": "flipper", "source": "flipper-001"}, "behavior": {"mode": "once", "onSeconds": 0.6}, "impactFlash": false, "group": "space-gold-flipper-001"}}, {"id": "art-095", "src": "res/img/space/space-light-arrow-gold-off.png", "x": 114, "y": 286, "width": 11, "height": 14, "angle": -13.893886924461484, "opacity": 1, "crop": [0, 0, 12, 14], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "indicator": {"off": "res/img/space/space-light-arrow-gold-off.png", "on": "res/img/space/space-light-arrow-gold-on.png", "defaultState": "off", "trigger": {"kind": "flipper", "source": "flipper-001"}, "behavior": {"mode": "once", "onSeconds": 0.6}, "impactFlash": false, "group": "space-gold-flipper-001"}}, {"id": "art-096", "src": "res/img/space/space-symbol-grandma-statue.webp", "x": 189, "y": 461, "width": 22, "height": 13, "angle": 0, "opacity": 1, "crop": [20, 0, 145, 90], "plane": "foreground", "frames": 1, "frameAxis": "x", "state": "center-post", "bind": "centerPost-001"}], "gameplay": {"ballImage": "res/img/space/space-ball-cookie.png", "spaceConstellation": {"object": "circle-056", "threshold": 10, "holes": ["hole-012", "hole-013", "hole-014"], "spinSeconds": 4.5, "winFlashSeconds": 1.2, "rewards": [{"kind": "enemy", "value": 0}, {"kind": "score", "value": 1000}, {"kind": "score", "value": 2500}, {"kind": "score", "value": 5000}, {"kind": "score", "value": 10000}, {"kind": "multi", "value": 2}, {"kind": "enemy", "value": 0}, {"kind": "multiplier", "value": 2}, {"kind": "multiplier", "value": 3}, {"kind": "multiplier", "value": 4}, {"kind": "ball", "value": 1}, {"kind": "ball", "value": 2}], "countSeconds": 0.8}}, "screenLayout": {"width": 360, "height": 640, "theaterHeight": 170.5, "playfieldHeight": 469.5, "top": -170.5, "bottom": 469.5}, "format": "pinball-layout-editor", "version": 6, "canvas": {"width": 360, "height": 469.5, "upperLimit": 469.5}, "objects": [{"id": "arc-004", "type": "arc", "layer": "top", "x1": 109, "y1": 61, "qx": 109, "qy": 41, "x2": 87, "y2": 34, "neonBorder": "blue"}, {"id": "arc-006", "type": "arc", "layer": "top", "x1": 60.7936, "y1": 167.2392, "qx": 46.2312, "qy": 152.632, "x2": 43.876, "y2": 133.2736, "neonBorder": "blue"}, {"id": "line-051", "type": "line", "layer": "upper", "x1": 35, "y1": 470, "x2": 37, "y2": 148}, {"id": "line-072", "type": "line", "layer": "upper", "x1": 300, "y1": 434, "x2": 259, "y2": 467}, {"id": "line-100", "type": "line", "layer": "top", "x1": 346, "y1": 148, "x2": 345, "y2": 471, "neonBorder": "blue"}, {"id": "line-144", "type": "line", "layer": "upper", "x1": 111, "y1": 470, "x2": 59, "y2": 435}, {"id": "line-152", "type": "line", "layer": "top", "x1": 324.0528, "y1": 469.456, "x2": 326, "y2": 142, "neonBorder": "blue"}, {"id": "line-157", "type": "line", "layer": "upper", "x1": 108.2528, "y1": 345.056, "x2": 108.02, "y2": 384.712}, {"id": "line-158", "type": "line", "layer": "upper", "x1": 108.02, "y1": 384.712, "x2": 110.3048, "y2": 387.6592}, {"id": "line-159", "type": "line", "layer": "upper", "x1": 110.3048, "y1": 387.6592, "x2": 129.8528, "y2": 400.256}, {"id": "line-162", "type": "line", "layer": "upper", "x1": 258.0528, "y1": 399.456, "x2": 277.2528, "y2": 386.656}, {"id": "line-164", "type": "line", "layer": "upper", "x1": 279.6528, "y1": 382.656, "x2": 278.8528, "y2": 344.256}, {"id": "line-167", "type": "line", "layer": "upper", "x1": 277.1992, "y1": 386.7912, "x2": 279.7408, "y2": 382.328}, {"id": "line-214", "type": "line", "layer": "upper", "x1": 62, "y1": 405, "x2": 131, "y2": 446}, {"id": "arc-059", "type": "arc", "layer": "upper", "x1": 129, "y1": 446, "qx": 132.32319999999999, "qy": 446.288, "x2": 131.2088, "y2": 440.6264}, {"id": "line-215", "type": "line", "layer": "upper", "x1": 131.2088, "y1": 440.6264, "x2": 132.6928, "y2": 438.1512}, {"id": "arc-060", "type": "arc", "layer": "upper", "x1": 132.6928, "y1": 438.1512, "qx": 137.5224, "qy": 436.34799999999996, "x2": 138.408, "y2": 433.5728}, {"id": "line-217", "type": "line", "layer": "upper", "x1": 138, "y1": 433, "x2": 75, "y2": 392}, {"id": "arc-061", "type": "arc", "layer": "upper", "x1": 74.6952, "y1": 391.8176, "qx": 64.3272, "qy": 386.58, "x2": 62.697599999999994, "y2": 375.32}, {"id": "arc-062", "type": "arc", "layer": "upper", "x1": 297.84, "y1": 387.2088, "qx": 297.6832, "qy": 394.5976, "x2": 292.5632, "y2": 399.4056}, {"id": "line-219", "type": "line", "layer": "upper", "x1": 292.5632, "y1": 399.4056, "x2": 246, "y2": 431}, {"id": "arc-063", "type": "arc", "layer": "upper", "x1": 245.1352, "y1": 431.0952, "qx": 243.2248, "qy": 434.17599999999993, "x2": 248.396, "y2": 434.3256}, {"id": "line-220", "type": "line", "layer": "upper", "x1": 248.396, "y1": 434.3256, "x2": 250.2608, "y2": 436.2536}, {"id": "arc-064", "type": "arc", "layer": "upper", "x1": 250.2608, "y1": 436.2536, "qx": 251.06079999999997, "qy": 441.72, "x2": 254.70320000000004, "y2": 442.7816}, {"id": "line-221", "type": "line", "layer": "upper", "x1": 255, "y1": 441, "x2": 298, "y2": 411}, {"id": "line-228", "type": "line", "layer": "top", "x1": 84.2864, "y1": 182.2088, "x2": 62, "y2": 168, "neonBorder": "blue"}, {"id": "arc-092", "type": "arc", "layer": "top", "x1": 82, "y1": 60, "qx": 87, "qy": 66, "x2": 87, "y2": 79, "neonBorder": "blue"}, {"id": "arc-093", "type": "arc", "layer": "top", "x1": 346, "y1": 148, "qx": 345, "qy": 102, "x2": 307, "y2": 78, "neonBorder": "blue"}, {"id": "line-339", "type": "line", "layer": "upper", "x1": 323, "y1": 470, "x2": 323, "y2": 336}, {"id": "arc-119", "type": "arc", "layer": "upper", "x1": 158, "y1": 133, "qx": 118, "qy": 75, "x2": 117.2528, "y2": 46.656}, {"id": "arc-123", "type": "arc", "layer": "upper", "x1": 136.01600000000002, "y1": 41.7632, "qx": 143.04399999999998, "qy": 71.5808, "x2": 168, "y2": 96}, {"id": "arc-124", "type": "arc", "layer": "upper", "x1": 294, "y1": 109, "qx": 294.88, "qy": 94.76080000000002, "x2": 284, "y2": 86}, {"id": "line-369", "type": "line", "layer": "upper", "x1": 284, "y1": 86, "x2": 202, "y2": 47}, {"id": "arc-140", "type": "arc", "layer": "upper", "x1": 86, "y1": 34, "qx": 68, "qy": 60, "x2": 79, "y2": 98, "neonBorder": false}, {"id": "arc-152", "type": "arc", "layer": "upper", "x1": 71, "y1": 22, "qx": 44, "qy": 55, "x2": 58, "y2": 111, "neonBorder": "pink"}, {"id": "arc-161", "type": "arc", "layer": "top", "x1": 176, "y1": 4, "qx": 97, "qy": -24, "x2": 60, "y2": 36, "neonBorder": "blue"}, {"id": "arc-162", "type": "arc", "layer": "top", "x1": 87, "y1": 34, "qx": 109, "qy": 2, "x2": 155, "y2": 25, "neonBorder": "blue"}, {"id": "arc-171", "type": "arc", "layer": "top", "x1": 238.45280000000002, "y1": 119.05599999999998, "qx": 241, "qy": 34, "x2": 176, "y2": 4, "neonBorder": "blue"}, {"id": "arc-178", "type": "arc", "layer": "top", "x1": 155, "y1": 25, "qx": 194, "qy": 44, "x2": 208, "y2": 89, "neonBorder": "blue"}, {"id": "line-467", "type": "line", "layer": "top", "x1": 61.4952, "y1": 219.99599999999998, "x2": 61, "y2": 168, "neonBorder": "blue"}, {"id": "line-469", "type": "line", "layer": "top", "x1": 43, "y1": 121, "x2": 42, "y2": 218, "neonBorder": "blue"}, {"id": "line-471", "type": "line", "layer": "top", "x1": 63, "y1": 126, "x2": 74, "y2": 63, "neonBorder": "blue"}, {"id": "arc-187", "type": "arc", "layer": "top", "x1": 94, "y1": 167, "qx": 61.3056, "qy": 150.62720000000002, "x2": 63, "y2": 126, "neonBorder": "blue"}, {"id": "circle-022", "type": "circle", "layer": "upper", "cx": 283.1376, "cy": 103.16, "r": 3.4616, "neonBorder": false, "mechanic": "solid-circle"}, {"id": "hole-012", "type": "hole", "layer": "upper", "x": 149.5464, "y": 236.704, "angle": 0, "releaseMode": "fixed", "releaseAngle": 90, "attack": "lv1"}, {"id": "circle-029", "type": "circle", "layer": "upper", "cx": 71.1688, "cy": 189.77840000000003, "r": 11.995}, {"id": "circle-031", "type": "circle", "layer": "upper", "cx": 102.0904, "cy": 140.1536, "r": 11.998}, {"id": "circle-032", "type": "circle", "layer": "upper", "cx": 49.5432, "cy": 142.284, "r": 11.9}, {"id": "target-010", "type": "target", "layer": "upper", "x": 207.0648, "y": 110.5384, "angle": 1.508, "targetGroup": {"id": "targetGroup-005", "members": ["target-010"], "action": "objectControl", "object": "arc-006", "effect": "hide"}}, {"id": "target-011", "type": "target", "layer": "upper", "x": 126.75279999999998, "y": 48.2576, "angle": -15, "targetGroup": {"id": "targetGroup-004", "members": ["target-011"], "action": "attack", "attack": "lv3", "attackCount": 1, "spawnEnemyWhenIdle": true}}, {"id": "plunger-001", "type": "plunger", "layer": "top", "x": 334.6056, "y": 382.736, "angle": 0}, {"id": "flipper-001", "type": "flipper", "layer": "upper", "x": 55.364000000000004, "y": 293.2816, "angle": 78}, {"id": "flipper-002", "type": "flipper", "layer": "upper", "x": 313.1096, "y": 197.4048, "angle": -250}, {"id": "flipper-003", "type": "flipper", "layer": "upper", "x": 227.6704, "y": 449.35760000000005, "angle": -209.3}, {"id": "flipper-004", "type": "flipper", "layer": "upper", "x": 152.3352, "y": 449.35760000000005, "angle": 29.3}, {"id": "line-607", "type": "line", "layer": "upper", "x1": 112, "y1": 160, "x2": 122, "y2": 176, "neonBorder": "yellow", "mechanic": "active-rebound"}, {"id": "circle-039", "type": "circle", "layer": "top", "cx": 51.4528, "cy": 229.45600000000002, "r": 7.582, "initialSpeed": 50, "mechanic": "layer-transition", "fromLayer": "top", "toLayer": "upper", "bidirectional": false}, {"id": "ublock-001", "type": "ublock", "layer": "top", "x": 52.2528, "y": 230.25599999999997, "angle": 180, "neonBorder": "blue"}, {"id": "line-609", "type": "line", "mechanic": "guided-rail", "trackWidth": 14.4, "showAboveArt": true, "layer": "top", "x1": 88, "y1": 174, "x2": 261, "y2": 275}, {"id": "arc-242", "type": "arc", "mechanic": "guided-rail", "trackWidth": 14.4, "showAboveArt": true, "layer": "top", "x1": 260.6528, "y1": 274.656, "qx": 286.2528, "qy": 291.456, "x2": 288.6528, "y2": 316.256}, {"id": "line-610", "type": "line", "mechanic": "guided-rail", "trackWidth": 14.4, "showAboveArt": true, "layer": "top", "x1": 288.6528, "y1": 315.256, "x2": 289, "y2": 362, "ballSpeed": 0}, {"id": "line-611", "type": "line", "layer": "upper", "x1": 117.8528, "y1": 343.456, "x2": 137.0528, "y2": 393.856, "neonBorder": "yellow", "reboundStrength": "strong", "mechanic": "active-rebound"}, {"id": "line-612", "type": "line", "layer": "upper", "x1": 269.2528, "y1": 342.656, "x2": 251.6528, "y2": 390.656, "neonBorder": "yellow", "reboundStrength": "strong", "slingshot": true, "mechanic": "active-rebound"}, {"id": "circle-040", "type": "circle", "layer": "upper", "cx": 113.0528, "cy": 344.056, "r": 5.1224, "mechanic": "solid-circle"}, {"id": "circle-041", "type": "circle", "layer": "upper", "cx": 133.0528, "cy": 396.256, "r": 5.1224, "mechanic": "solid-circle"}, {"id": "circle-042", "type": "circle", "layer": "upper", "cx": 274.0528, "cy": 342.456, "r": 5.1224, "mechanic": "solid-circle"}, {"id": "circle-043", "type": "circle", "layer": "upper", "cx": 254.0528, "cy": 396.256, "r": 5.1224, "mechanic": "solid-circle"}, {"id": "line-614", "type": "line", "layer": "upper", "x1": 44, "y1": 278, "x2": 55, "y2": 319}, {"id": "thickline-001", "type": "thickline", "layer": "upper", "x1": 85, "y1": 347, "x2": 84.6528, "y2": 373.056, "thickness": 5}, {"id": "thickline-002", "type": "thickline", "layer": "upper", "x1": 61, "y1": 347, "x2": 61, "y2": 403, "thickness": 5}, {"id": "thickline-003", "type": "thickline", "layer": "upper", "x1": 299, "y1": 332, "x2": 299, "y2": 409, "thickness": 5}, {"id": "line-616", "type": "line", "layer": "upper", "x1": 325, "y1": 187, "x2": 309, "y2": 229}, {"id": "thickline-006", "type": "thickline", "layer": "upper", "x1": 170, "y1": 22, "x2": 169.6528, "y2": 94.056, "thickness": 5, "neonBorder": false}, {"id": "line-618", "type": "line", "layer": "upper", "x1": 207, "y1": 107, "x2": 203, "y2": 76, "neonBorder": "pink"}, {"id": "line-619", "type": "line", "layer": "upper", "x1": 171, "y1": 39, "x2": 201, "y2": 47, "neonBorder": false}, {"id": "circle-045", "type": "circle", "layer": "upper", "cx": 290.4528, "cy": 109.856, "r": 4, "neonBorder": false, "mechanic": "solid-circle"}, {"id": "line-620", "type": "line", "layer": "upper", "x1": 254, "y1": 77, "x2": 241, "y2": 121, "neonBorder": false}, {"id": "targets-001", "type": "targets", "layer": "upper", "x": 169.4528, "y": 221.856, "angle": 90.388, "targetGroup": {"id": "targetGroup-002", "members": ["targets-001"], "action": "attack", "attack": "lv3", "attackCount": 1, "spawnEnemyWhenIdle": true}}, {"id": "oneway-001", "type": "oneway", "layer": "lower", "x1": 198, "y1": 44, "x2": 171, "y2": 39, "direction": 1, "mechanic": "layer-transition", "fromLayer": "lower", "toLayer": "upper", "bidirectional": false}, {"id": "oneway-002", "type": "oneway", "layer": "upper", "x1": 170, "y1": 78, "x2": 205.0528, "y2": 76.656, "direction": -1, "mechanic": "layer-transition", "fromLayer": "upper", "toLayer": "lower", "bidirectional": true}, {"id": "oneway-003", "type": "oneway", "layer": "upper", "x1": 208, "y1": 89, "x2": 236.8528, "y2": 88.656, "direction": -1, "mechanic": "layer-transition", "fromLayer": "upper", "toLayer": "top", "bidirectional": true}, {"id": "line-625", "type": "line", "layer": "upper", "x1": 83, "y1": 107, "x2": 92, "y2": 121}, {"id": "line-626", "type": "line", "layer": "upper", "x1": 88.2528, "y1": 103.256, "x2": 99.4528, "y2": 116.05599999999998}, {"id": "arc-243", "type": "arc", "layer": "upper", "x1": 135.6528, "y1": 40.856, "qx": 125.2528, "qy": 38.656, "x2": 117.2528, "y2": 45.656}, {"id": "arc-245", "type": "arc", "layer": "top", "x1": 109, "y1": 61, "qx": 110, "qy": 87, "x2": 157.2528, "y2": 134.05599999999998, "neonBorder": "blue"}, {"id": "oneway-004", "type": "oneway", "layer": "top", "x1": 86, "y1": 35, "x2": 78, "y2": 58, "direction": 1}, {"id": "oneway-005", "type": "oneway", "layer": "top", "x1": 85.8528, "y1": 33.456, "x2": 54, "y2": 46, "direction": -1}, {"id": "oneway-006", "type": "oneway", "layer": "top", "x1": 294.8528, "y1": 363.856, "x2": 280.4528, "y2": 363.856, "direction": -1, "initialSpeed": 50, "mechanic": "layer-transition", "fromLayer": "top", "toLayer": "upper", "bidirectional": false}, {"id": "oneway-007", "type": "oneway", "layer": "top", "x1": 301, "y1": 72, "x2": 324, "y2": 131, "direction": 1, "mechanic": "layer-transition", "fromLayer": "top", "toLayer": "upper", "bidirectional": false}, {"id": "line-629", "type": "line", "layer": "upper", "x1": 279.6528, "y1": 84.256, "x2": 275.6528, "y2": 100.256, "neonBorder": false}, {"id": "line-630", "type": "line", "layer": "upper", "x1": 253.25279999999998, "y1": 77.056, "x2": 280.4528, "y2": 84.256, "neonBorder": false}, {"id": "oneway-008", "type": "oneway", "layer": "upper", "x1": 251, "y1": 92, "x2": 275.6528, "y2": 99.45600000000002, "direction": -1, "mechanic": "layer-transition", "fromLayer": "upper", "toLayer": "lower", "bidirectional": false}, {"id": "ublock-003", "type": "ublock", "layer": "upper", "x": 265.4830448591572, "y": 22, "angle": 0.143, "neonBorder": false}, {"id": "oneway-009", "type": "oneway", "layer": "upper", "x1": 225, "y1": 19, "x2": 295, "y2": 67, "direction": 1, "neonBorder": "pink"}, {"id": "arc-246", "type": "arc", "layer": "upper", "x1": 55, "y1": 319, "qx": 35, "qy": 328, "x2": 36, "y2": 351}, {"id": "arc-248", "type": "arc", "layer": "upper", "x1": 317, "y1": 168, "qx": 331, "qy": 171, "x2": 325, "y2": 187}, {"id": "arc-249", "type": "arc", "layer": "upper", "x1": 56, "y1": 264, "qx": 42, "qy": 266, "x2": 44, "y2": 278}, {"id": "arc-250", "type": "arc", "layer": "upper", "x1": 114, "y1": 137, "qx": 143, "qy": 176, "x2": 166, "y2": 191, "neonBorder": "blue"}, {"id": "line-638", "type": "line", "layer": "upper", "x1": 300, "y1": 434, "x2": 299, "y2": 470}, {"id": "line-639", "type": "line", "layer": "upper", "mechanic": "rescue-kicker", "side": "right", "aim": [312, 411], "direction": [0, -1], "speed": 600, "x1": 299.5, "y1": 449, "x2": 324.5, "y2": 449, "neonBorder": "yellow"}, {"id": "line-640", "type": "line", "layer": "upper", "mechanic": "rescue-kicker", "side": "left", "aim": [48, 411], "direction": [0, -1], "speed": 600, "x1": 35.5, "y1": 449, "x2": 60.5, "y2": 449, "neonBorder": "yellow"}, {"id": "oneway-010", "type": "oneway", "layer": "upper", "mechanic": "rescue-return", "side": "left", "x1": 37, "y1": 418, "x2": 58, "y2": 433, "direction": -1, "neonBorder": "pink"}, {"id": "oneway-011", "type": "oneway", "layer": "upper", "mechanic": "rescue-return", "side": "right", "x1": 302.5, "y1": 430.5, "x2": 321, "y2": 419, "direction": -1, "neonBorder": "pink"}, {"id": "line-641", "type": "line", "layer": "upper", "x1": 59, "y1": 435, "x2": 59, "y2": 470}, {"id": "line-642", "type": "line", "layer": "upper", "x1": 133, "y1": 214, "x2": 133, "y2": 242}, {"id": "line-643", "type": "line", "layer": "upper", "x1": 166, "y1": 191, "x2": 166, "y2": 244}, {"id": "line-644", "type": "line", "layer": "upper", "x1": 133, "y1": 214, "x2": 163, "y2": 214, "neonBorder": false}, {"id": "oneway-012", "type": "oneway", "layer": "upper", "x1": 148, "y1": 129, "x2": 127, "y2": 148, "direction": 1, "mechanic": "layer-transition", "fromLayer": "upper", "toLayer": "top", "bidirectional": true}, {"id": "arc-251", "type": "arc", "layer": "top", "x1": 60, "y1": 36, "qx": 45, "qy": 54, "x2": 43, "y2": 121, "neonBorder": "blue"}, {"id": "arc-252", "type": "arc", "layer": "top", "x1": 87, "y1": 79, "qx": 88, "qy": 114, "x2": 153, "y2": 182, "neonBorder": "blue"}, {"id": "arc-253", "type": "arc", "layer": "upper", "x1": 128, "y1": 100, "qx": 129, "qy": 103, "x2": 157, "y2": 134, "neonBorder": "blue"}, {"id": "rollover-001", "type": "rollover", "layer": "upper", "x1": 280, "y1": 370, "x2": 297, "y2": 370, "rolloverGroup": {"id": "rolloverGroup-001", "members": ["rollover-001", "rollover-003", "rollover-002"], "attack": "none", "attackCount": 1}}, {"id": "rollover-002", "type": "rollover", "layer": "upper", "x1": 64, "y1": 370, "x2": 81, "y2": 370}, {"id": "rollover-003", "type": "rollover", "layer": "upper", "x1": 88, "y1": 370, "x2": 105, "y2": 370}, {"id": "circle-051", "type": "circle", "layer": "upper", "cx": 134.1688, "cy": 198.77840000000003, "r": 11.995}, {"id": "line-649", "type": "line", "layer": "upper", "x1": 64, "y1": 240, "x2": 75, "y2": 235}, {"id": "centerPost-001", "type": "centerPost", "layer": "upper", "x": 190, "y": 461, "angle": 0, "radius": 7, "triggerRollovers": ["rollover-001", "rollover-003", "rollover-002"], "hitCount": 5}, {"id": "arc-254", "type": "arc", "layer": "upper", "x1": 323, "y1": 338, "qx": 323, "qy": 316, "x2": 300, "y2": 305}, {"id": "arc-257", "type": "arc", "layer": "upper", "x1": 238.45280000000002, "y1": 121.05599999999998, "qx": 238, "qy": 79, "x2": 232, "y2": 66, "neonBorder": "blue"}, {"id": "thickline-008", "type": "thickline", "layer": "lower", "x1": 201, "y1": 47, "x2": 205, "y2": 77, "thickness": 5}, {"id": "thickline-009", "type": "thickline", "layer": "lower", "x1": 170, "y1": 24, "x2": 169.6528, "y2": 94.056, "thickness": 5}, {"id": "line-652", "type": "line", "layer": "upper", "x1": 208, "y1": 88, "x2": 208, "y2": 106, "neonBorder": "blue"}, {"id": "flag-001", "type": "flag", "layer": "upper", "x1": 211, "y1": 103, "x2": 234, "y2": 103}, {"id": "flag-002", "type": "flag", "layer": "upper", "x1": 153, "y1": 138, "x2": 136, "y2": 153}, {"id": "arc-260", "type": "arc", "layer": "upper", "x1": 318, "y1": 167, "qx": 348, "qy": 101, "x2": 295, "y2": 67}, {"id": "line-655", "type": "line", "layer": "upper", "x1": 169, "y1": 18, "x2": 217, "y2": 34, "neonBorder": false}, {"id": "sensor-001", "type": "sensor", "layer": "lower", "x1": 245, "y1": 111, "x2": 268, "y2": 118, "objectEffect": {"action": "restore", "object": "rect-005"}}, {"id": "sensor-002", "type": "sensor", "layer": "upper", "x1": 206, "y1": 32, "x2": 205, "y2": 46, "attack": "lv2"}, {"id": "circle-052", "type": "circle", "layer": "lower", "cx": 231, "cy": 193, "r": 46.002, "mechanic": "solid-circle"}, {"id": "line-656", "type": "line", "layer": "upper", "x1": 56, "y1": 264, "x2": 50, "y2": 246}, {"id": "line-657", "type": "line", "layer": "upper", "x1": 50, "y1": 246, "x2": 37, "y2": 233}, {"id": "line-658", "type": "line", "layer": "upper", "x1": 72, "y1": 249, "x2": 64, "y2": 240}, {"id": "circle-054", "type": "circle", "layer": "upper", "cx": 88.1688, "cy": 235.77840000000003, "r": 11.985}, {"id": "line-659", "type": "line", "layer": "upper", "x1": 74, "y1": 260, "x2": 72, "y2": 249}, {"id": "line-662", "type": "line", "layer": "upper", "x1": 300, "y1": 305, "x2": 327, "y2": 238, "neonBorder": false}, {"id": "line-663", "type": "line", "layer": "upper", "x1": 309, "y1": 228, "x2": 328, "y2": 237, "neonBorder": false}, {"id": "line-664", "type": "line", "layer": "upper", "x1": 74, "y1": 260, "x2": 108, "y2": 245, "neonBorder": false}, {"id": "line-665", "type": "line", "layer": "upper", "x1": 110, "y1": 245, "x2": 101, "y2": 238, "neonBorder": false}, {"id": "target-013", "type": "target", "layer": "upper", "x": 286, "y": 276, "angle": -68.144}, {"id": "target-014", "type": "target", "layer": "upper", "x": 280, "y": 290, "angle": -65.391, "targetGroup": {"id": "targetGroup-001", "members": ["target-014", "target-013"], "action": "attack", "attack": "lv3", "attackCount": 1, "spawnEnemyWhenIdle": true}}, {"id": "line-667", "type": "line", "layer": "upper", "x1": 58, "y1": 111, "x2": 53, "y2": 131, "neonBorder": "pink"}, {"id": "hole-013", "type": "hole", "layer": "lower", "x": 260, "y": 128, "angle": 0, "exitHole": "hole-015", "objectEffect": {"action": "restore", "object": "rect-005"}}, {"id": "hole-014", "type": "hole", "layer": "upper", "x": 297, "y": 286, "angle": 0, "exitHole": "hole-015", "attack": "none"}, {"id": "hole-015", "type": "hole", "layer": "upper", "x": 265, "y": 24, "angle": 0, "releaseMode": "fixed", "releaseAngle": 95.509}, {"id": "oneway-013", "type": "oneway", "layer": "upper", "x1": 216, "y1": 34, "x2": 231, "y2": 60, "direction": -1}, {"id": "rect-005", "type": "rect", "layer": "upper", "x": 271.4528, "y": 130.45600000000002, "angle": 190, "width": 35.64374694528174, "height": 3.5607806813560288, "neonBorder": false}, {"id": "rect-006", "type": "rect", "layer": "lower", "x": 260, "y": 107, "angle": 15.083, "width": 27.19968072053047, "height": 54.81037646925263, "neonBorder": false}, {"id": "circle-055", "type": "circle", "layer": "upper", "cx": 240, "cy": 120, "r": 2, "mechanic": "pachinko-pin"}, {"id": "arc-261", "type": "arc", "layer": "upper", "x1": 133, "y1": 241, "qx": 135, "qy": 228, "x2": 143, "y2": 227, "neonBorder": false}, {"id": "arc-262", "type": "arc", "layer": "upper", "x1": 155, "y1": 226, "qx": 165, "qy": 235, "x2": 166, "y2": 243, "neonBorder": false}, {"id": "line-668", "type": "line", "layer": "upper", "x1": 143, "y1": 226, "x2": 154, "y2": 226, "neonBorder": false}, {"id": "oneway-014", "type": "oneway", "layer": "upper", "x1": 309, "y1": 230, "x2": 282, "y2": 296, "direction": -1}, {"id": "target-015", "type": "target", "layer": "upper", "x": 103, "y": 251, "angle": -26.051}, {"id": "oneway-015", "type": "oneway", "layer": "lower", "x1": 276, "y1": 120, "x2": 243, "y2": 118, "direction": -1}, {"id": "sensor-003", "type": "sensor", "layer": "top", "x1": 43, "y1": 199, "x2": 61, "y2": 199, "objectEffect": {"action": "restore", "object": "arc-006"}}, {"id": "sensor-004", "type": "sensor", "layer": "upper", "x1": 276, "y1": 37, "x2": 259, "y2": 37, "attack": "lv4", "attackCount": 5}, {"id": "target-016", "type": "target", "layer": "upper", "x": 87, "y": 258, "angle": -22.926, "targetGroup": {"id": "targetGroup-003", "action": "upgrade", "members": ["target-016", "target-015"], "hole": "blockhole-001", "bumpers": ["circle-032", "circle-031", "circle-054", "circle-051", "circle-029"], "repeatExtraBall": true}}, {"id": "line-669", "type": "line", "layer": "upper", "x1": 292, "y1": 271, "x2": 282, "y2": 296}, {"id": "circle-056", "type": "circle", "layer": "lower", "cx": 192, "cy": 343, "r": 54.011, "mechanic": "solid-circle"}, {"id": "target-017", "type": "target", "layer": "upper", "x": 271, "y": 134, "angle": 2.556, "targetGroup": {"id": "targetGroup-006", "members": ["target-017"], "action": "objectControl", "object": "rect-005", "effect": "hide"}}, {"id": "circle-057", "type": "circle", "layer": "upper", "cx": 157, "cy": 134, "r": 2, "mechanic": "pachinko-pin"}, {"id": "arc-263", "type": "arc", "layer": "upper", "x1": 129, "y1": -9, "qx": 91, "qy": -6, "x2": 71, "y2": 22}, {"id": "arc-264", "type": "arc", "layer": "upper", "x1": 130, "y1": -9, "qx": 165, "qy": -13, "x2": 225, "y2": 19}, {"id": "arc-265", "type": "arc", "layer": "upper", "x1": 130, "y1": 11, "qx": 102.75, "qy": 12, "x2": 87, "y2": 33, "neonBorder": false}, {"id": "arc-266", "type": "arc", "layer": "upper", "x1": 131, "y1": 11, "qx": 146, "qy": 11, "x2": 169, "y2": 18, "neonBorder": false}, {"id": "arc-267", "type": "arc", "layer": "top", "x1": 82, "y1": 60, "qx": 77, "qy": 57, "x2": 74, "y2": 63, "neonBorder": "blue"}, {"id": "line-670", "type": "line", "layer": "upper", "x1": 203, "y1": 77, "x2": 199, "y2": 47, "neonBorder": false}, {"id": "line-671", "type": "line", "layer": "upper", "x1": 169, "y1": 97, "x2": 172, "y2": 40}, {"id": "arc-268", "type": "arc", "layer": "lower", "x1": 171, "y1": 19, "qx": 126, "qy": 2, "x2": 98, "y2": 21, "neonBorder": "pink"}, {"id": "arc-269", "type": "arc", "layer": "lower", "x1": 98, "y1": 21, "qx": 68, "qy": 42, "x2": 78, "y2": 96, "neonBorder": "pink"}, {"id": "circle-058", "type": "circle", "layer": "lower", "cx": 52, "cy": 230, "r": 7.246, "neonBorder": "blue", "mechanic": "solid-circle"}, {"id": "line-672", "type": "line", "layer": "upper", "x1": 241, "y1": 121, "x2": 249, "y2": 94}, {"id": "sensor-005", "type": "sensor", "layer": "top", "x1": 327, "y1": 200, "x2": 345, "y2": 199}, {"id": "arc-270", "type": "arc", "layer": "upper", "x1": 88, "y1": 103, "qx": 82, "qy": 100, "x2": 83, "y2": 107}, {"id": "arc-271", "type": "arc", "layer": "upper", "x1": 92, "y1": 121, "qx": 95, "qy": 125, "x2": 99, "y2": 123}, {"id": "arc-272", "type": "arc", "layer": "upper", "x1": 100, "y1": 117, "qx": 102, "qy": 121, "x2": 99, "y2": 123}, {"id": "arc-273", "type": "arc", "layer": "upper", "x1": 122, "y1": 176, "qx": 125, "qy": 180, "x2": 129, "y2": 178}, {"id": "arc-274", "type": "arc", "layer": "upper", "x1": 131, "y1": 172, "qx": 132, "qy": 176, "x2": 129, "y2": 178}, {"id": "line-673", "type": "line", "layer": "upper", "x1": 131, "y1": 172, "x2": 121, "y2": 155}, {"id": "arc-275", "type": "arc", "layer": "upper", "x1": 121, "y1": 155, "qx": 117, "qy": 150, "x2": 113, "y2": 153}, {"id": "arc-276", "type": "arc", "layer": "upper", "x1": 112, "y1": 160, "qx": 110, "qy": 156, "x2": 113, "y2": 153}], "gravityRegions": [{"id": "gravityZone-001", "type": "gravityZone", "layer": "upper", "x": 100.5, "y": 12, "angle": 0, "width": 59, "height": 42, "outline": [[0.4830508474576271, -0.5], [0.4568894316633606, -0.49683663552884705], [0.430982147269146, -0.4931774459054759], [0.4053289942749845, -0.48902243112988636], [0.37992997268087464, -0.48437159120207846], [0.3547850824868169, -0.47922492612205236], [0.3298943236928115, -0.47358243588980775], [0.30525769629885874, -0.46744412050534506], [0.28087520030495783, -0.4608099799686639], [0.25674683571110907, -0.4536800142797644], [0.23287260251731293, -0.44605422343864665], [0.2092525007235684, -0.4379326074453105], [0.1858865303298765, -0.429315166299756], [0.16277469133623698, -0.42020190000198326], [0.13991698374264983, -0.41059280855199226], [0.11731340754911454, -0.4004878919497828], [0.09496396275563188, -0.38988715019535514], [0.07286864936220085, -0.37879058328870907], [0.05102746736882267, -0.3671981912298447], [0.02944041677549589, -0.35510997401876204], [0.008107497582221963, -0.342525931655461], [-0.012971290211000077, -0.3294460641399417], [-0.03379594660416975, -0.315870371472204], [-0.054366471597286574, -0.301798853652248], [-0.07468286519035151, -0.2872315106800738], [-0.09474512738336432, -0.2721683425556811], [-0.11455325817632502, -0.2566093492790702], [-0.13410725756923308, -0.24055453085024106], [-0.1534071255620893, -0.22400388726919343], [-0.1724528621548931, -0.2069574185359275], [-0.1912444673476448, -0.18941512465044327], [-0.20978194114034415, -0.17137700561274072], [-0.2280652835329911, -0.1528430614228199], [-0.24609449452558618, -0.1338132920806807], [-0.2638695741181289, -0.11428769758632315], [-0.28139052231061923, -0.09426627793974729], [-0.2986573391030575, -0.07374903314095317], [-0.31567002449544335, -0.05273596318994075], [-0.33242857848777707, -0.03122706808670994], [-0.3489330010800584, -0.009222347831260799], [-0.36518329227228763, 0.013278197576406681], [-0.3811794520644645, 0.03627456813629246], [-0.3969214804565895, 0.059766763848396444], [-0.41240937744866185, 0.08375478471271881], [-0.4276431430406821, 0.1082386307292597], [-0.44262277723265026, 0.1332183018980187], [-0.45734828002456596, 0.15869379821899612], [-0.4718196514164296, 0.18466511969219163], [-0.48603689140824086, 0.21113226631760573], [-0.5, 0.23809523809523808], [-0.2288135593220339, 0.5], [-0.2138326532747436, 0.4725896531452086], [-0.19855095208202553, 0.4459141681363903], [-0.18296845574387943, 0.4199735449735449], [-0.1670851642603055, 0.39476778365667253], [-0.1509010776313036, 0.3702968841857731], [-0.13441619585687384, 0.3465608465608466], [-0.1176305189370161, 0.323559670781893], [-0.10054404687173053, 0.30129335684891234], [-0.08315677966101695, 0.27976190476190477], [-0.06546871730487533, 0.2589653145208701], [-0.047479859803306164, 0.2389035861258083], [-0.029190207156308958, 0.21957671957671956], [-0.010599759363883724, 0.20098471487360375], [0.008291483573969303, 0.183127572016461], [0.027483521657250362, 0.16600529100529107], [0.046976354885959214, 0.14961787184009412], [0.0667699832600961, 0.1339653145208701], [0.08686440677966102, 0.11904761904761904], [0.10725962544465373, 0.10486478542034103], [0.12795563925507447, 0.09141681363903587], [0.14895244821092252, 0.07870370370370365], [0.17025005231219933, 0.06672545561434452], [0.19184845155890345, 0.05548206937095822], [0.21374764595103607, 0.04497354497354503], [0.235947635488596, 0.03519988242210466], [0.25844842017158426, 0.026161081716637283], [0.28125, 0.017857142857142856], [0.3043523749738438, 0.010288065843621382], [0.3277555450931156, 0.003453850676072898], [0.35145951035781575, -0.0026455026455026362], [0.37546427076794364, -0.008009994121105177], [0.3997698263234986, -0.012639623750734897], [0.4243761770244821, -0.016534391534391624], [0.44928332287089334, -0.019694297472075274], [0.47449126386273244, -0.022119341563785973], [0.5, -0.023809523809523808]], "bridges": [[[-0.5, 0.23809523809523808], [-0.2288135593220339, 0.5]], [[0.5, -0.023809523809523808], [0.4830508474576271, -0.5]]], "gravityDirection": "left", "gravityStrength": 5}, {"id": "gravityZone-002", "type": "gravityZone", "layer": "upper", "x": 177.5, "y": 12.278197857592943, "angle": 0, "width": 95, "height": 43.443604284814114, "outline": [[-0.08947368421052632, 0.13170643266371745], [0.41578947368421054, 0.5], [0.5, 0.1547247806222351], [0.48174863750428354, 0.1335484806730003], [0.4636078223283478, 0.11272028428457463], [0.44557755447219194, 0.09224019145695851], [0.42765783393581625, 0.07210820219015154], [0.4098486607192207, 0.052324316484154025], [0.3921500348224057, 0.032888534338965734], [0.3745619562453708, 0.013800855754586994], [0.3570844249881164, -0.004938719268982485], [0.3397174410506418, -0.023330190731742702], [0.3224610044329477, -0.04137355863369349], [0.30531511513503345, -0.05906882297483507], [0.2882797731568997, -0.07641598375516717], [0.2713549784985461, -0.09341504097468993], [0.2545407311599733, -0.11006599463340347], [0.23783703114118027, -0.12636884473130752], [0.22124387844216717, -0.1423235912684024], [0.2047612730629345, -0.1579302342446878], [0.18838921500348235, -0.173188773660164], [0.17212770426381033, -0.18809920951483067], [0.15597674084391847, -0.2026615418086881], [0.13993632474380618, -0.21687577054173618], [0.12400645596347527, -0.23074189571397488], [0.10818713450292392, -0.24425991732540434], [0.09247836036215301, -0.2574298353760244], [0.07688013354116228, -0.27025164986583516], [0.06139245403995203, -0.28272536079483646], [0.04601532185852163, -0.29485096816302847], [0.030748736996871397, -0.30662847197041126], [0.01559269945500163, -0.3180578722169845], [0.0005472092329120259, -0.32913916890274864], [-0.014387733669397412, -0.33987236202770327], [-0.029212129251926386, -0.3502574515918485], [-0.043925977514675196, -0.3602944375951846], [-0.058529278457643844, -0.3699833200377112], [-0.07302203208083202, -0.3793240989194286], [-0.08740423838424033, -0.38831677424033645], [-0.10167589736786849, -0.39696134600043514], [-0.11583700903171618, -0.4052578141997244], [-0.12988757337578338, -0.4132061788382045], [-0.14382759040007076, -0.42080643991587496], [-0.15765706010457795, -0.4280585974327363], [-0.17137598248930436, -0.43496265138878815], [-0.18498435755425094, -0.44151860178403074], [-0.19848218529941763, -0.447726448618464], [-0.21186946572480356, -0.4535861918920879], [-0.225146198830409, -0.4590978316049025], [-0.23831238461623522, -0.46426136775690774], [-0.2513680230822807, -0.46907680034810356], [-0.26431311422854536, -0.4735441293784901], [-0.27714765805503017, -0.4776633548480673], [-0.2898716545617354, -0.48143447675683515], [-0.30248510374865956, -0.48485749510479365], [-0.31498800561580387, -0.4879324098919428], [-0.3273803601631674, -0.49065922111828275], [-0.3396621673907517, -0.4930379287838133], [-0.35183342729855493, -0.49506853288853436], [-0.3638941398865786, -0.49675103343244614], [-0.3758443051548215, -0.49808543041554865], [-0.3876839231032842, -0.4990717238378418], [-0.39941299373196676, -0.4997099136993256], [-0.41103151704086915, -0.5], [-0.4225394930299917, -0.4999419827398652], [-0.43393692169933346, -0.4995358619189209], [-0.4452238030488951, -0.4987816375371673], [-0.4564001370786765, -0.49767930959460444], [-0.4674659237886778, -0.49622887809123223], [-0.4784211631788986, -0.49443034302705047], [-0.4892658552493395, -0.4922837044020596], [-0.5, -0.48978896221625934], [-0.48947368421052634, -0.029422003045906163], [-0.47766226265251605, -0.029200976385124783], [-0.4656198108439822, -0.028537896402780642], [-0.45334632878492526, -0.027432763098873825], [-0.440841816475345, -0.025885576473404125], [-0.4281062739152404, -0.023896336526371704], [-0.41513970110461346, -0.021465043257776567], [-0.40194209804346287, -0.01859169666761875], [-0.38851346473178827, -0.01527629675589805], [-0.3748538011695904, -0.011518843522614633], [-0.36096310735686943, -0.007319336967768495], [-0.3468413832936251, -0.0026777770913595975], [-0.33248862897985715, 0.0024058361066120596], [-0.3179048444155656, 0.007931502626146518], [-0.30309002960075065, 0.013899222467243653], [-0.28804418453541264, 0.02030899562990359], [-0.27276730921955106, 0.027160822114126286], [-0.2572594036531661, 0.0344547019199117], [-0.24152046783625744, 0.04219063504725988], [-0.22555050176882518, 0.05036862149617086], [-0.20934950545087017, 0.05898866126664451], [-0.19291747888239122, 0.06805075435868096], [-0.1762544220633889, 0.07755490077228018], [-0.15936033499386326, 0.08750110050744211], [-0.14223521767381397, 0.09788935356416681], [-0.12487907010324163, 0.10871965994245426], [-0.10729189228214595, 0.1199920196423044]], "bridges": [[[0.41578947368421054, 0.5], [0.5, 0.1547247806222351]], [[-0.5, -0.48978896221625934], [-0.48947368421052634, -0.029422003045906163]]], "gravityDirection": "right", "gravityStrength": 5}, {"id": "gravityZone-003", "type": "gravityZone", "layer": "upper", "x": 226.5, "y": 52, "angle": 0, "width": 115, "height": 68, "outline": [[0.5, 0.5], [-0.21304347826086956, -0.07352941176470588], [-0.4826086956521739, -0.19117647058823528], [-0.5, -0.5], [-0.08260869565217391, -0.2647058823529412], [0.0391304347826087, 0.11764705882352941]], "bridges": [[[-0.4826086956521739, -0.19117647058823528], [-0.5, -0.5]], [[0.0391304347826087, 0.11764705882352941], [0.5, 0.5]]], "gravityDirection": "right", "gravityStrength": 30}], "lockedLayout": [], "upperLayout": [], "topLayout": [], "templates": {"hole": {"label": "Hole", "width": 12, "height": 12, "markup": "<circle r=\"5.5\" fill=\"#08121d\"/><circle r=\"3.4\" stroke-dasharray=\"1 1\"/>"}, "target": {"label": "單顆 target", "width": 13, "height": 3, "markup": "<polygon points=\"-6.0000,0.6000 -6.0000,-0.6000 -5.9991,-0.6273 -5.9963,-0.6545 -5.9916,-0.6814 -5.9852,-0.7079 -5.9769,-0.7340 -5.9669,-0.7594 -5.9552,-0.7840 -5.9418,-0.8078 -5.9268,-0.8307 -5.9103,-0.8524 -5.8923,-0.8730 -5.8730,-0.8923 -5.8524,-0.9103 -5.8307,-0.9268 -5.8078,-0.9418 -5.7840,-0.9552 -5.7594,-0.9669 -5.7340,-0.9769 -5.7079,-0.9852 -5.6814,-0.9916 -5.6545,-0.9963 -5.6273,-0.9991 -5.6000,-1.0000 5.6000,-1.0000 5.6273,-0.9991 5.6545,-0.9963 5.6814,-0.9916 5.7079,-0.9852 5.7340,-0.9769 5.7594,-0.9669 5.7840,-0.9552 5.8078,-0.9418 5.8307,-0.9268 5.8524,-0.9103 5.8730,-0.8923 5.8923,-0.8730 5.9103,-0.8524 5.9268,-0.8307 5.9418,-0.8078 5.9552,-0.7840 5.9669,-0.7594 5.9769,-0.7340 5.9852,-0.7079 5.9916,-0.6814 5.9963,-0.6545 5.9991,-0.6273 6.0000,-0.6000 6.0000,0.6000 5.9991,0.6273 5.9963,0.6545 5.9916,0.6814 5.9852,0.7079 5.9769,0.7340 5.9669,0.7594 5.9552,0.7840 5.9418,0.8078 5.9268,0.8307 5.9103,0.8524 5.8923,0.8730 5.8730,0.8923 5.8524,0.9103 5.8307,0.9268 5.8078,0.9418 5.7840,0.9552 5.7594,0.9669 5.7340,0.9769 5.7079,0.9852 5.6814,0.9916 5.6545,0.9963 5.6273,0.9991 5.6000,1.0000 -5.6000,1.0000 -5.6273,0.9991 -5.6545,0.9963 -5.6814,0.9916 -5.7079,0.9852 -5.7340,0.9769 -5.7594,0.9669 -5.7840,0.9552 -5.8078,0.9418 -5.8307,0.9268 -5.8524,0.9103 -5.8730,0.8923 -5.8923,0.8730 -5.9103,0.8524 -5.9268,0.8307 -5.9418,0.8078 -5.9552,0.7840 -5.9669,0.7594 -5.9769,0.7340 -5.9852,0.7079 -5.9916,0.6814 -5.9963,0.6545 -5.9991,0.6273 -6.0000,0.6000\" fill=\"#3e6373\"/>"}, "plunger": {"label": "發球區", "width": 20, "height": 8, "markup": "<rect x=\"-10\" y=\"-4\" width=\"20\" height=\"8\" fill=\"#b78a43\"/><path d=\"M0 3V-3M-2 -1L0 -3L2 -1\" fill=\"none\"/>"}, "flipper": {"label": "Flipper", "width": 50.72938359896286, "height": 14.061202228069305, "markup": "<path d=\"M-18.33409068544678 -6.530601114034653 L20.805223887761155 -4.059467911720276 A4.059467911720276 4.059467911720276 0 0 1 20.805223887761155 4.059467911720276 L-18.33409068544678 6.530601114034653 A6.530601114034653 6.530601114034653 0 0 1 -18.33409068544678 -6.530601114034653 Z\" fill=\"#355b73\"/><circle cx=\"-18.33409068544678\" cy=\"0\" r=\"1.8\" fill=\"#79cafa\"/>"}, "ublock": {"label": "ㄇ形阻擋物", "width": 25, "height": 23, "markup": "<path d=\"M-12 11V-11H12V11H9V-8H-9V11Z\" fill=\"#455e6b\"/>"}, "targets": {"label": "三連 target", "width": 43, "height": 3.000000000000014, "markup": "<polygon points=\"-21.0000,0.6000 -21.0000,-0.6000 -20.9991,-0.6273 -20.9963,-0.6545 -20.9916,-0.6814 -20.9852,-0.7079 -20.9769,-0.7340 -20.9669,-0.7594 -20.9552,-0.7840 -20.9418,-0.8078 -20.9268,-0.8307 -20.9103,-0.8524 -20.8923,-0.8730 -20.8730,-0.8923 -20.8524,-0.9103 -20.8307,-0.9268 -20.8078,-0.9418 -20.7840,-0.9552 -20.7594,-0.9669 -20.7340,-0.9769 -20.7079,-0.9852 -20.6814,-0.9916 -20.6545,-0.9963 -20.6273,-0.9991 -20.6000,-1.0000 -9.4000,-1.0000 -9.3727,-0.9991 -9.3455,-0.9963 -9.3186,-0.9916 -9.2921,-0.9852 -9.2660,-0.9769 -9.2406,-0.9669 -9.2160,-0.9552 -9.1922,-0.9418 -9.1693,-0.9268 -9.1476,-0.9103 -9.1270,-0.8923 -9.1077,-0.8730 -9.0897,-0.8524 -9.0732,-0.8307 -9.0582,-0.8078 -9.0448,-0.7840 -9.0331,-0.7594 -9.0231,-0.7340 -9.0148,-0.7079 -9.0084,-0.6814 -9.0037,-0.6545 -9.0009,-0.6273 -9.0000,-0.6000 -9.0000,0.6000 -9.0009,0.6273 -9.0037,0.6545 -9.0084,0.6814 -9.0148,0.7079 -9.0231,0.7340 -9.0331,0.7594 -9.0448,0.7840 -9.0582,0.8078 -9.0732,0.8307 -9.0897,0.8524 -9.1077,0.8730 -9.1270,0.8923 -9.1476,0.9103 -9.1693,0.9268 -9.1922,0.9418 -9.2160,0.9552 -9.2406,0.9669 -9.2660,0.9769 -9.2921,0.9852 -9.3186,0.9916 -9.3455,0.9963 -9.3727,0.9991 -9.4000,1.0000 -20.6000,1.0000 -20.6273,0.9991 -20.6545,0.9963 -20.6814,0.9916 -20.7079,0.9852 -20.7340,0.9769 -20.7594,0.9669 -20.7840,0.9552 -20.8078,0.9418 -20.8307,0.9268 -20.8524,0.9103 -20.8730,0.8923 -20.8923,0.8730 -20.9103,0.8524 -20.9268,0.8307 -20.9418,0.8078 -20.9552,0.7840 -20.9669,0.7594 -20.9769,0.7340 -20.9852,0.7079 -20.9916,0.6814 -20.9963,0.6545 -20.9991,0.6273 -21.0000,0.6000\" fill=\"#3e6373\"/><polygon points=\"-6.0000,0.6000 -6.0000,-0.6000 -5.9991,-0.6273 -5.9963,-0.6545 -5.9916,-0.6814 -5.9852,-0.7079 -5.9769,-0.7340 -5.9669,-0.7594 -5.9552,-0.7840 -5.9418,-0.8078 -5.9268,-0.8307 -5.9103,-0.8524 -5.8923,-0.8730 -5.8730,-0.8923 -5.8524,-0.9103 -5.8307,-0.9268 -5.8078,-0.9418 -5.7840,-0.9552 -5.7594,-0.9669 -5.7340,-0.9769 -5.7079,-0.9852 -5.6814,-0.9916 -5.6545,-0.9963 -5.6273,-0.9991 -5.6000,-1.0000 5.6000,-1.0000 5.6273,-0.9991 5.6545,-0.9963 5.6814,-0.9916 5.7079,-0.9852 5.7340,-0.9769 5.7594,-0.9669 5.7840,-0.9552 5.8078,-0.9418 5.8307,-0.9268 5.8524,-0.9103 5.8730,-0.8923 5.8923,-0.8730 5.9103,-0.8524 5.9268,-0.8307 5.9418,-0.8078 5.9552,-0.7840 5.9669,-0.7594 5.9769,-0.7340 5.9852,-0.7079 5.9916,-0.6814 5.9963,-0.6545 5.9991,-0.6273 6.0000,-0.6000 6.0000,0.6000 5.9991,0.6273 5.9963,0.6545 5.9916,0.6814 5.9852,0.7079 5.9769,0.7340 5.9669,0.7594 5.9552,0.7840 5.9418,0.8078 5.9268,0.8307 5.9103,0.8524 5.8923,0.8730 5.8730,0.8923 5.8524,0.9103 5.8307,0.9268 5.8078,0.9418 5.7840,0.9552 5.7594,0.9669 5.7340,0.9769 5.7079,0.9852 5.6814,0.9916 5.6545,0.9963 5.6273,0.9991 5.6000,1.0000 -5.6000,1.0000 -5.6273,0.9991 -5.6545,0.9963 -5.6814,0.9916 -5.7079,0.9852 -5.7340,0.9769 -5.7594,0.9669 -5.7840,0.9552 -5.8078,0.9418 -5.8307,0.9268 -5.8524,0.9103 -5.8730,0.8923 -5.8923,0.8730 -5.9103,0.8524 -5.9268,0.8307 -5.9418,0.8078 -5.9552,0.7840 -5.9669,0.7594 -5.9769,0.7340 -5.9852,0.7079 -5.9916,0.6814 -5.9963,0.6545 -5.9991,0.6273 -6.0000,0.6000\" fill=\"#3e6373\"/><polygon points=\"9.0000,0.6000 9.0000,-0.6000 9.0009,-0.6273 9.0037,-0.6545 9.0084,-0.6814 9.0148,-0.7079 9.0231,-0.7340 9.0331,-0.7594 9.0448,-0.7840 9.0582,-0.8078 9.0732,-0.8307 9.0897,-0.8524 9.1077,-0.8730 9.1270,-0.8923 9.1476,-0.9103 9.1693,-0.9268 9.1922,-0.9418 9.2160,-0.9552 9.2406,-0.9669 9.2660,-0.9769 9.2921,-0.9852 9.3186,-0.9916 9.3455,-0.9963 9.3727,-0.9991 9.4000,-1.0000 20.6000,-1.0000 20.6273,-0.9991 20.6545,-0.9963 20.6814,-0.9916 20.7079,-0.9852 20.7340,-0.9769 20.7594,-0.9669 20.7840,-0.9552 20.8078,-0.9418 20.8307,-0.9268 20.8524,-0.9103 20.8730,-0.8923 20.8923,-0.8730 20.9103,-0.8524 20.9268,-0.8307 20.9418,-0.8078 20.9552,-0.7840 20.9669,-0.7594 20.9769,-0.7340 20.9852,-0.7079 20.9916,-0.6814 20.9963,-0.6545 20.9991,-0.6273 21.0000,-0.6000 21.0000,0.6000 20.9991,0.6273 20.9963,0.6545 20.9916,0.6814 20.9852,0.7079 20.9769,0.7340 20.9669,0.7594 20.9552,0.7840 20.9418,0.8078 20.9268,0.8307 20.9103,0.8524 20.8923,0.8730 20.8730,0.8923 20.8524,0.9103 20.8307,0.9268 20.8078,0.9418 20.7840,0.9552 20.7594,0.9669 20.7340,0.9769 20.7079,0.9852 20.6814,0.9916 20.6545,0.9963 20.6273,0.9991 20.6000,1.0000 9.4000,1.0000 9.3727,0.9991 9.3455,0.9963 9.3186,0.9916 9.2921,0.9852 9.2660,0.9769 9.2406,0.9669 9.2160,0.9552 9.1922,0.9418 9.1693,0.9268 9.1476,0.9103 9.1270,0.8923 9.1077,0.8730 9.0897,0.8524 9.0732,0.8307 9.0582,0.8078 9.0448,0.7840 9.0331,0.7594 9.0231,0.7340 9.0148,0.7079 9.0084,0.6814 9.0037,0.6545 9.0009,0.6273 9.0000,0.6000\" fill=\"#3e6373\"/>"}, "centerPost": {"label": "Center post", "width": 10, "height": 10, "markup": "<circle r=\"5\" fill=\"#263945\"/><circle r=\"3.3\" fill=\"none\"/><path d=\"M-2 0H2M0 -2V2\"/>"}, "flag": {"label": "旗幟線", "width": 14, "height": 2, "markup": "<line x1=\"-7\" y1=\"0\" x2=\"7\" y2=\"0\" fill=\"none\" stroke=\"#e6a5ea\" stroke-width=\"1.8\" stroke-linecap=\"round\"/>"}}};
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
 const androidTutorial=window.PinballPlatform==='android';
 const androidText={'tutorial.left.text':'tutorial.android.left.text','tutorial.right.text':'tutorial.android.right.text'};
 const text=value=>typeof value==='function'?value():PinballI18n.t(androidTutorial&&androidText[value]||value);
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
 function render(){overlay.hidden=waiting||tutorialMode&&['enemy','ball','barrel','airdrop','kraken'].includes(demo);overlay.dataset.demo=demo||'';overlay.dataset.step=String(step+1);overlay.dataset.heartOnly=String(heartOnly);$('tutorialTitle').hidden=step>=4;$('tutorialHint').hidden=!!demo||!replay&&step<3;$('tutorialHint').textContent=PinballI18n.t(androidTutorial?'tutorial.android.next':window.matchMedia?.('(pointer: fine)').matches?'tutorial.nextKeyboard':'tutorial.next');$('tutorialTitle').textContent=text(step===3&&heartOnly?'tutorial.health.title':steps[step][0]);$('tutorialText').textContent=text(step===3&&heartOnly?'tutorial.health.text':steps[step][1]);position();}
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

/* Space lessons reuse the shared controls, spotlight, narration and progress flow. */
const SpaceTutorial={
 describe(G,artLayers){
  const info=PirateTutorial.describe(G,artLayers),objects=[...G.lower,...G.upper_parts,...(G.top_parts||[])],rules=G.mechanisms;
  const related=a=>[a.indicator?.trigger,...(a.indicator?.extraTriggers||[]),a.animation?.trigger,...(a.animation?.extraTriggers||[])].filter(Boolean);
  const regions=(ids,geometry=false)=>{
   const result=[],seen=new Set();
   for(const id of new Set(ids)){
    const matches=artLayers.filter(a=>!a.hidden&&(a.bind===id||related(a).some(t=>t.source===id)));
    for(const a of matches)if(!seen.has(a.id)){seen.add(a.id);result.push(info.artBounds(a));}
    if(geometry||!matches.length){const object=objects.find(o=>o.id===id),raw=G.art_layout_objects?.find(o=>o.id===id);const b=info.bounds(object||(raw?.type==='circle'?{center:[raw.cx,raw.cy],radius:raw.r}:null));if(b)result.push(b);}
   }return result;
  };
  const controls=effect=>rules.groups.filter(r=>r.action==='objectControl'&&r.effect===effect);
  const hidden=controls('hide');
  const restoredByHole=r=>(G.objectEffects||[]).some(e=>e.object===r.object&&e.action==='restore'&&objects.some(o=>o.id===e.source&&o.kind==='socket'));
  const warden=hidden.filter(restoredByHole),route=hidden.filter(r=>!restoredByHole(r));
  const controlRegions=groups=>regions(groups.flatMap(r=>[...r.targets,r.object,...(G.objectEffects||[]).filter(e=>e.object===r.object&&e.action==='restore').map(e=>e.source)]));
  const upgrades=rules.groups.filter(r=>r.action==='upgrade');
  const attackIds=level=>[...Object.keys(rules.attacks).filter(id=>rules.attacks[id]===level),...rules.groups.filter(r=>r.action==='attack'&&r.attack===level).flatMap(r=>r.targets),...rules.rolloverGroups.filter(r=>r.attack===level).flatMap(r=>r.members)];
  const attack=level=>regions(attackIds(level));
  const counter=Object.keys(rules.attacks).filter(id=>rules.attacks[id]==='lv4');
  const counts=[...new Set(counter.map(id=>rules.attackCounts[id]||1))];
  const star=G.gameplay?.spaceConstellation;
  const artRegions=predicate=>artLayers.filter(a=>!a.hidden&&predicate(a)).map(info.artBounds);
  const firstPlaySteps=[
   ['tutorial.space.attack.title','tutorial.space.attack.text',()=>{const ids=attackIds('lv3'),flags=artRegions(a=>ids.includes(a.bind)&&/\/space-target-bandit-flag\./.test(a.src));return flags.length?flags:regions(ids);}],
   ['tutorial.space.lv1.title','tutorial.space.lv1.text',()=>attack('lv1')],
   ['tutorial.space.lv2.title','tutorial.space.lv2.text',()=>{const throne=artRegions(a=>/\/space-king-toilet-throne-front\./.test(a.src));return throne.length?throne:attack('lv2');}],
   ['tutorial.space.lv4.title',()=>PinballI18n.t('tutorial.space.lv4.text',{count:counts[0]||1}),()=>regions(counter,true)],
  ];
  return {firstPlaySteps,steps:[...firstPlaySteps,
   ['tutorial.space.upgrade.title','tutorial.space.upgrade.text',()=>regions(upgrades.flatMap(r=>[...r.targets,...r.bumpers]))],
   ['tutorial.space.route.title','tutorial.space.route.text',()=>controlRegions(route)],
   ['tutorial.space.warden.title','tutorial.space.warden.text',()=>controlRegions(warden)],
   ['tutorial.space.stars.title',()=>PinballI18n.t('tutorial.space.stars.text',{count:star?.threshold||10}),()=>regions(star?[star.object,...star.holes]:[])],
   ['tutorial.space.lights.title','tutorial.space.lights.text',()=>artRegions(a=>/space-light-guide-/.test(a.src)||a.indicator?.trigger?.kind==='flag')],
   ['tutorial.space.rescue.title','tutorial.space.rescue.text',()=>regions([...(G.rescue_kickers||[]).map(k=>k.id),...rules.posts.flatMap(p=>[p.id,...p.sensors])])]
  ]};
 },
 start(options){return PirateTutorial.start({...options,lesson:{storageKey:'pinball-space-first-play-tutorial-v1',...this.describe(options.G,options.artLayers)}});}
};

const TableTutorial=SpaceTutorial;
const TOUHOU_GAMEPLAY_DEFAULTS={"touhouGap": {"sensor": "sensor-003", "hole": "hole-008", "passes": 1, "locks": 3, "autoLaunch": true, "keepOpenUntilFull": true, "readySeconds": 3, "captureSeconds": 3}, "indicatorCounters": ["sensor-001"], "touhouBagua": {"object": "blockhole-001", "radius": 68, "threshold": 8, "spinSeconds": 4.5, "winFlashSeconds": 1.2, "rewards": [{"kind": "score", "value": 1000, "art": {"src": "res/img/steampunk/steampunk-bonus-score-1000.png", "crop": [0, 0, 20, 9]}}, {"kind": "score", "value": 2500, "art": {"src": "res/img/steampunk/steampunk-bonus-score-2500.png", "crop": [0, 0, 20, 7]}}, {"kind": "score", "value": 5000, "art": {"src": "res/img/steampunk/steampunk-bonus-score-5000.png", "crop": [0, 0, 20, 8]}}, {"kind": "multiplier", "value": 2, "art": {"src": "res/img/steampunk/steampunk-bonus-multiplier-2.png", "crop": [0, 0, 16, 12]}}, {"kind": "multiplier", "value": 3, "art": {"src": "res/img/steampunk/steampunk-bonus-multiplier-3.png", "crop": [0, 0, 14, 12]}}, {"kind": "ball", "value": 1, "art": {"src": "res/img/steampunk/steampunk-bonus-ball-plus-1.png", "crop": [0, 0, 18, 9]}}, {"kind": "multi", "value": 2, "art": {"src": "res/img/steampunk/steampunk-bonus-multiball.png", "crop": [0, 0, 19, 18]}}, {"kind": "enemy", "value": 0, "art": {"src": "res/img/steampunk/steampunk-bonus-enemy.png", "crop": [0, 0, 13, 13]}}], "yinYang": {"fadeSeconds": 0.8}, "attackArt": {"src": "res/img/touhou/touhou-attack-lv4-fantasy-seal.png", "duration": 1.55, "fullscreen": true}}, "ballImage": "res/img/touhou/touhou-ball-yin-yang.png"};
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
  if(bagua.entryCooldown!==undefined&&(!Number.isFinite(bagua.entryCooldown)||bagua.entryCooldown<0))throw Error('八卦進入冷卻時間不合法');
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
  hasPendingBalls(){return super.hasPendingBalls()||this.gapLock?.pending>0;}
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
  // A multi-lane group already deduplicates its members with a Set. Applying
  // the last round's contact cooldown here can discard a valid next-lane hit.
  if((!group||group.members.length<2)&&this.time-(this.objectAttackAt.get(id)??-Infinity)<.3)return;

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
  // A fast ball can cross the entire gap between two endpoint checks.
  const gap=this.g.gameplay?.touhouGap,hole=gap&&this.socketsById.get(gap.hole),ball=this.ball;
  if(hole&&ball.state==='playing'&&layer===ball.layer&&hole.layer===layer&&this.gapLock?.armed&&!this.gapBusy()&&this.time>=ball.immunity&&P.len(P.sub(P.nearest(hole.center,previous,ball.p).p,hole.center))<hole.radius){
   this.capture(hole.id,hole.center,hole.release,layer,hole.release_direction,250);
  }
  this.sensors(previous,layer);
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
 sensors(previous=null,previousLayer=null){
  this.expireHoles();
  const ball=this.ball;
  if(ball.state!=='playing')return;
  const floorParts=this.socketsByLayer.get(ball.layer)||[];
  if(this.time>=ball.immunity){
   for(const socket of floorParts||[]){
    const controlled=this.controlledHoles.has(socket.id);
    if(controlled&&!this.armedHoles.has(socket.id))continue;
    const position=Array.isArray(previous)&&previousLayer===ball.layer?P.nearest(socket.center,previous,ball.p).p:ball.p;
    if(P.len(P.sub(position,socket.center))>=socket.radius)continue;
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
 const linkedTriggers=[c.trigger||{},...(c.extraTriggers||[])],captureSource=linkedTriggers.find(t=>t.kind==='hole-active')?.source;
 // Boss replacement balls retain locks, but paired gaps stay visually closed
 // until a ball is back in play. A live multiball must not close the pair.
 if(g.storyMode&&g.preserveTableOnDrain&&captureSource===g.g.gameplay?.touhouGap?.hole&&
    linkedTriggers.some(t=>t.kind==='gap-launch')&&g.balls.every(ball=>['ready','drained','saver-return'].includes(ball.state)))
  return {state:'off',alpha:1,on:false};
 if(captureSource&&c.captureBehavior&&g.balls.some(ball=>ball.state==='captured'&&ball.held?.id===captureSource)){
  const b=c.captureBehavior,on=b.onSeconds||.2,off=b.offSeconds||.2,age=Math.max(0,g.time-(g.holeCapturedAt.get(captureSource)??g.time)),lit=age%(on+off)<on;
  return {state:lit?'on':'off',alpha:1,on:lit};
 }
 if(c.releaseBehavior){
  const stamp=Math.max(...linkedTriggers.filter(t=>t.kind==='gap-launch').map(t=>g.gapLaunchAt?.get(t.source)??-Infinity));
  const b=c.releaseBehavior,on=b.onSeconds||.15,off=b.offSeconds||.15,age=g.time-stamp;
  const duration=b.mode==='once'?on:b.mode==='burst'?(on+off)*(b.cycles||3):Infinity;
  if(Number.isFinite(stamp)&&age>=0&&age<duration){const lit=['repeat','burst'].includes(b.mode)?age%(on+off)<on:true;return {state:lit?'on':'off',alpha:1,on:lit};}
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
 const triggers=c.releaseBehavior?linkedTriggers.filter(t=>t.kind!=='gap-launch'):linkedTriggers;
 const inputs=v.signals||(v.signals=[]);inputs.length=triggers.length;
 for(let i=0;i<triggers.length;i++)inputs[i]=signal(o,g,triggers[i]);
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
 let stamp=-Infinity,active=false,rising=false;
 const previousInputs=v.inputs||(v.inputs=[]);
 for(let i=0;i<inputs.length;i++){
  const input=inputs[i];if(Number.isFinite(input.stamp))stamp=Math.max(stamp,input.stamp);
  if(input.active){active=true;if(!previousInputs[i])rising=true;}
  previousInputs[i]=!!input.active;
 }
 previousInputs.length=inputs.length;
 const event=Number.isFinite(stamp);
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
 const effectLists=[particles,rings,swings];let cleanedAt=null,cleanDirty=true;
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
  cleanDirty=true;
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
  if(!cleanDirty&&cleanedAt===game.time)return;
  cleanDirty=false;cleanedAt=game.time;
  if(game.time-lastHit>2&&combo){combo=0;game.combo={count:0,multiplier:1,expiresAt:0};}
  for(const list of effectLists){let live=0;for(let i=0;i<list.length;i++)if(!(game.time-list[i].at>(list[i].life||.4)))list[live++]=list[i];list.length=live;}
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
   const trail=b.trail;let start=trail?.length||0,count=0;
   for(let i=start-1;i>=0;i--)if(trail[i].layer===b.layer){start=i;if(++count===10)break;}
   ctx.strokeStyle=combo>=10?'#ffe597':'#a9eaff';
   let previous=null,index=0;
   for(let i=start;i<(trail?.length||0);i++){const point=trail[i];if(point.layer!==b.layer)continue;if(previous){index++;ctx.globalAlpha=(index/count)*Math.min(.48,speed/1800);ctx.lineWidth=.5+index/count*2;ctx.beginPath();ctx.moveTo(...previous.p);ctx.lineTo(...point.p);ctx.stroke();}previous=point;}
  }
  for(const r of rings){if(r.plane!==floor)continue;const age=game.time-r.at,t=age/.4;ctx.globalAlpha=(1-t)*.85;ctx.strokeStyle=r.color;ctx.lineWidth=2.2*(1-t)+.3;ctx.beginPath();ctx.arc(...r.p,3+age*42*r.strength,0,Math.PI*2);ctx.stroke();}
  for(const q of particles){if(q.plane!==floor)continue;const age=game.time-q.at;ctx.save();ctx.globalAlpha=1-age/q.life;ctx.translate(q.p[0]+q.v[0]*age,q.p[1]+q.v[1]*age+18*age*age);ctx.rotate(q.angle+age*5);ctx.fillStyle=q.color;ctx.fillRect(-q.size,-q.size*.4,q.size*2,q.size*.8);ctx.restore();}
  for(const s of swings){if(s.plane!==floor)continue;const age=game.time-s.at;if(age>.18)continue;ctx.globalAlpha=1-age/.18;ctx.strokeStyle='#fff0bb';ctx.lineWidth=2*(1-age/.18);ctx.beginPath();ctx.arc(...s.p,5+age*45,s.angle+Math.PI-.9,s.angle+Math.PI+.9);ctx.stroke();}
  for(const [id,q] of lampPulses){const a=artById.get(id);if(!a||a.hidden||a.plane!==floor)continue;const age=game.time-q.at;if(age<0)continue;
   const c=a.indicator,src=c.type==='bumper'&&c.keepLevelOnHit?c['lv'+game.bumperLevel(c.trigger?.source||a.bind)]:c.on||c.lv3||c.complete||a.src,img=renderer.image(src),fade=Math.sin(Math.PI*age/.35);
   ctx.save();ctx.translate(a.x,a.y);ctx.rotate((a.angle||0)*Math.PI/180);ctx.scale(a.flipX?-1:1,a.flipY?-1:1);ctx.globalAlpha=.65*fade;ctx.shadowColor=q.color;ctx.shadowBlur=6;
   if(img.complete&&img.naturalWidth){
    if(renderer.drawImageWithShadow)renderer.drawImageWithShadow(ctx,img,...a.crop,a.width,a.height);
    else ctx.drawImage(img,...a.crop,-a.width/2,-a.height/2,a.width,a.height);
   }
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
  cleanDirty=true;
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
  let hasLower=false;for(const f of game.flippers)if((f.layer||'lower')==='lower'){hasLower=true;break;}
  let left=null,right=null,first=null,second=null;
  for(const f of game.flippers){
   if(hasLower&&(f.layer||'lower')!=='lower')continue;
   if(!first||f.pivot[1]>first.pivot[1]){second=first;first=f;}else if(!second||f.pivot[1]>second.pivot[1])second=f;
   const side=f.control||f.side;
   if(side==='left'&&(!left||f.pivot[1]>left.pivot[1]))left=f;
   if(side==='right'&&(!right||f.pivot[1]>right.pivot[1]))right=f;
  }
  const a=left&&right?left:first,b=left&&right?right:second;
  const cx=a?(b?(a.pivot[0]+b.pivot[0])/2:a.pivot[0]):x+w/2;
  const cy=a?(b?(a.pivot[1]+b.pivot[1])/2:a.pivot[1])-75:y+h-100;
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
artRenderer.bitmapCacheEnabled=true;
artRenderer.backgroundCacheEnabled=true;
artRenderer.staticCacheEnabled=true;
artRenderer.reuseCompositionBuffers=true;
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
function syncSound(){soundBank.setEnabled(soundEnabled);document.querySelectorAll('audio,video').forEach(a=>a.muted=!soundEnabled);soundArt.src='res/img/system-marker-'+(soundEnabled&&window.PinballSystemVolume!==0?'sound':'muted')+'.png';const button=$('wideSound');button.setAttribute('aria-pressed',String(soundEnabled));button.querySelector('img').src=PinballRuntimeImages.resolve(soundArt.src);}
function setPlaySound(enabled){
 if(window.AppControls?.setSound)window.AppControls.setSound(!!enabled);
 else{soundEnabled=!!enabled;localStorage.setItem('pinball-sound',soundEnabled?'on':'off');syncSound();}
 draw();
}
addEventListener('storage',event=>{if(event.key==='pinball-sound'){soundEnabled=localStorage.getItem('pinball-sound')!=='off';syncSound();draw();}});
syncSound();
const settings=document.createElement('dialog');settings.style.cssText='background:#30251e;color:#fff0cc;border:2px solid #b89051;border-radius:12px;padding:24px';
settings.innerHTML='<p><label><span data-i18n="settings.language">語言</span> <select id="tableLanguage"><option value="zh-Hant">繁體中文</option><option value="en">English</option><option value="ja">日本語</option></select></label></p><h2 data-i18n="settings.title">設定</h2><p><label><span data-i18n="settings.physics">球物理</span> <select id="physicsModel"><option value="legacy" data-i18n="settings.legacy">原本物理</option></select></label></p>'+[['geometryToggle','table.geometry']].map(([id,label])=>`<p><label><input type="checkbox" data-setting="${id}"> <span data-i18n="${label}">${PinballI18n.t(label)}</span></label></p>`).join('')+'<p><label><input id="artToggle" type="checkbox" checked> <span data-i18n="table.art">美術圖層</span></label></p><p hidden><label>畫面比例 <select id="playAspect"><option value="portrait">直向（原布局）</option><option value="landscape">16:9 橫向</option></select></label></p><p><label><span data-i18n="settings.launch">發射模式</span> <select id="launchMode"><option value="hold" data-i18n="settings.holdCharge">按住蓄力</option><option value="drag" data-i18n="settings.dragDown">向下拖曳</option></select></label></p><button id="testImpactSound" data-i18n="table.testSound">測試碰撞音效</button><button id="closeSettings" data-i18n="common.close">關閉</button><button id="mobileRestart" data-i18n="common.restart">重新開始</button>';
document.body.append(settings);$('physicsModel').value=game.config.physicsModel;$('physicsModel').onchange=()=>applyPhysicsModel($('physicsModel').value);$('launchMode').value=launchMode;$('launchMode').onchange=()=>{clearTouchControls();launchMode=$('launchMode').value;localStorage.setItem('pinball-launch-mode',launchMode);};let settingsWasPaused=false;
settings.onchange=e=>{const id=e.target.dataset.setting;if(id)$(id).checked=e.target.checked;if(id||e.target.id==='artToggle')draw();};
$('closeSettings').onclick=()=>settings.close();$('testImpactSound').onclick=()=>{setPlaySound(true);soundBank.unlock();soundBank.setPaused(false);soundBank.play('metal');};$('mobileRestart').onclick=()=>{settings.close();reset();};settings.onclose=()=>{game.paused=settingsWasPaused;};
function openSettings(){if(window.AppControls){window.AppControls.openSettings();return;}if(settings.open)return;clearTouchControls();settingsWasPaused=game.paused;game.paused=true;launchStartedAt=null;game.input.launch=game.input.left=game.input.right=false;settings.querySelectorAll('[data-setting]').forEach(e=>e.checked=$(e.dataset.setting).checked);settings.showModal();}
const leaveDialog=document.createElement('dialog');leaveDialog.id='leaveGameDialog';leaveDialog.setAttribute('aria-labelledby','leave-game-title');
leaveDialog.innerHTML='<h2 id="leave-game-title" data-i18n="table.leaveTitle">離開球台？</h2><button id="continueGame" data-i18n="table.continue">繼續遊玩</button> <button id="leaveGame" data-i18n="table.leave">離開球台</button>';document.body.append(leaveDialog);
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
 trackRenderer.draw(ctx,plane);
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
$('wideSettings').onclick=()=>openSettings();$('wideRestart').onclick=()=>reset();$('wideSound').onclick=()=>setPlaySound(!soundEnabled);
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
game.onEvent=e=>{window.PinballHaptics?.onEvent(e,game);bossPresentation?.onEvent(e);artRenderer.onEvent?.(e);firstPlayGuide?.onEvent(e);updateScreenDimEvent(e);if(e.type==='new-game')floatingRewards=[];if((e.type==='score'||e.type==='target-bonus')&&e.points>0)showFloatingReward(e.position,'+'+e.points);if(e.type==='extra-life-awarded')showFloatingReward(e.position||game.ball.p,'+1',true);if(e.type==='launch'){ballStartedAt=game.time;ballElapsed=0;soundBank.play('explosion');}if(e.type==='drain'&&ballStartedAt!==null){ballElapsed=game.time-ballStartedAt;ballStartedAt=null;}if(e.type==='new-game'){ballStartedAt=null;ballElapsed=0;}if(e.type==='ball-saved')notice(PinballI18n.t('table.ballSaved'));if(e.type==='ball-save-ready'){launchStartedAt=null;notice(PinballI18n.t('table.relaunch'));}if(e.type==='sound'&&e.name!=='runic-spin')soundBank.play(e.name);if(e.type==='release'||e.type==='kickback')soundBank.play('explosion');if(e.type==='new-game'||e.type==='ready')soundBank.stop();theater.onEvent(e);if(e.type==='enemy-spawn-requested'){launchStartedAt=null;game.input.launch=false;game.charge=game.chargeElapsed=0;notice(PinballI18n.t('table.enemyWait'));window.dispatchEvent(new CustomEvent('pinball:enemy-spawn',{detail:e}));}if(e.type==='extra-life-awarded')notice(PinballI18n.t('table.extraBall',{source:e.source==='multiball'?'Multiball':e.source==='boss-target'?'Boss target':PinballI18n.t('table.vortex')}));if(e.type==='vortex-activated')notice(PinballI18n.t('table.vortexActive'));if(e.type==='target-bonus')notice(PinballI18n.t('table.targetBonus'));if(e.type==='bumper-upgraded')notice(PinballI18n.t('table.bumperLevel',{level:e.level}));if(e.type==='center-post-up')notice(PinballI18n.t('table.postUp'));if(e.type==='multiball-awarded')notice(PinballI18n.t('table.multiball'));if(e.type==='free-ball-launch')notice(PinballI18n.t('table.multiballLaunch'));if(e.type==='kickback-lane')notice(e.side==='left'?PinballI18n.t('table.kickLeft'):PinballI18n.t('table.kickRight'));if(e.type==='capture'){if(spaceTheme)soundBank.play('space-magic');notice(PinballI18n.t('table.capture'));}if(e.type==='release')notice(PinballI18n.t('table.release'));if(e.type==='drain')notice(PinballI18n.t('table.drain'));if(e.type==='ready')notice(PinballI18n.t('table.launchShort'));if(e.type==='game-over')endGame();if(e.type==='layer')notice(e.to==='top'?PinballI18n.t('table.enterTop'):e.to!=='lower'?PinballI18n.t('table.enterMiddle'):PinballI18n.t('table.enterLower'));if(e.type==='target-group-complete')notice(game.targetGroups.find(g=>g.id===e.id)?.targets.length===1?PinballI18n.t('table.singleTarget'):PinballI18n.t('table.targetSet'));};
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
const trackRenderer=GuidedTrackGeometry.createRenderer(trackOverlay);
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
 if($('artToggle').checked)game.bonus?.drawAttackOverlay?.(ctx,artRenderer,view);
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
onFinish(){firstPlayGuide=null;}});}theater.update(leaveDialog.open?0:dt,game);game.bonus?.update(dt);bossPresentation?.update(dt,soundBank,settings.open||leaveDialog.open||suspendedGameState!==null||game.paused&&!firstPlayGuide&&!theater.bossDefeated);soundBank.setPaused(game.paused&&!settings.open);if(G.gameplay?.runicTurntable)soundBank.sync('runic-spin',game.bonus.clock-game.bonus.phaseAt,!game.paused&&game.bonus.phase==='spin'&&game.bonus.clock-game.bonus.phaseAt<G.gameplay.runicTurntable.spinSeconds);if(!game.paused&&!game.theaterFrozen&&!game.bonusFrozen&&!firstPlayGuide?.demoFrozen){accumulator+=dt;while(accumulator>=game.physics.step){game.step();accumulator-=game.physics.step;if(game.theaterFrozen||game.bonusFrozen||game.paused){accumulator=0;break;}}}else accumulator=0;syncLaunchCharge(now);if(!game.paused&&!game.theaterFrozen||screenDimAlpha>0||now-lastDrawAt>=100){draw();lastDrawAt=now;}requestAnimationFrame(frame)}
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
function bind(id,set){const b=$(id);b.onpointerdown=e=>{b.setPointerCapture(e.pointerId);set(true);if(!game.paused&&!game.gameOver)window.PinballHaptics?.play('tap');e.preventDefault()};b.onpointerup=()=>set(false);b.onpointercancel=()=>set(false)}
bind('left',v=>game.input.left=v);bind('right',v=>game.input.right=v);bind('launch',launch);
function key(e,on){if(tutorialMode||leaveDialog.open)return;if(e.target.tagName==='INPUT')return;const k=e.key.toLowerCase();const control=['arrowleft','z'].includes(k)?'left':['arrowright','c'].includes(k)?'right':[' ','arrowdown'].includes(k)?'launch':null;if(firstPlayGuide&&!firstPlayGuide.allowed(control)){e.preventDefault();return;}if(!on&&control&&firstPlayGuide)firstPlayGuide.used(control);if([' ','arrowdown','arrowleft','arrowright','z','c','x','r'].includes(k))e.preventDefault();if(['arrowleft','z'].includes(k))game.input.left=on;if(['arrowright','c'].includes(k))game.input.right=on;if([' ','arrowdown'].includes(k)&&!e.repeat)launch(on);if(on&&!e.repeat){if(k==='r')reset();if(k==='x')game.nudge()}}
addEventListener('keydown',e=>{if(!gameOverOverlay)key(e,true)});addEventListener('keyup',e=>{if(!gameOverOverlay)key(e,false)});
addEventListener('blur',()=>{clearTouchControls();game.input.left=game.input.right=game.input.launch=false;if(!window.AppControls&&!game.paused)openSettings()});
canvas.onpointerdown=e=>{const r=canvas.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*view[2]+view[0],y=(e.clientY-r.top)/r.height*view[3]+view[1];if(topHit(backArt,x,y)){requestLeaveGame();return;}if(topHit(settingsArt,x,y)){openSettings();return;}if(topHit(soundArt,x,y)){setPlaySound(!soundEnabled);notice(soundEnabled?PinballI18n.t('table.soundOn'):PinballI18n.t('table.soundOff'));draw();return;}if(!$('probe').checked){
 if(e.pointerType!=='touch'||game.paused||game.gameOver||y<0)return;
 const control=game.ball.state==='ready'&&x>=G.plunger.left?'launch':x<180?'left':'right';
 const already=[...touchControls.values()].includes(control);if(!already)window.PinballHaptics?.play('tap');touchControls.set(e.pointerId,control);canvas.setPointerCapture(e.pointerId);e.preventDefault();
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
   const image=new Image();image.src=PinballRuntimeImages.resolve(src);
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
