const PLAYTEST_THEME="steampunk";
const PLAYTEST_LAYOUT={"theme": "steampunk", "artLayers": [{"id": "art-013", "src": "res/img/steampunk-floor-background.png", "x": 180, "y": 235, "width": 360, "height": 470, "angle": 0, "opacity": 1, "crop": [0, 0, 360, 470], "plane": "background", "frames": 1, "frameAxis": "x", "state": "static"}, {"id": "art-007", "src": "res/img/steampunk-rollover-off.png", "x": 73, "y": 375, "width": 14, "height": 14, "angle": 0, "opacity": 1, "crop": [0, 0, 361, 368], "plane": "background", "frames": 1, "frameAxis": "x", "state": "static", "indicator": {"group": "4", "defaultState": "off", "off": "res/img/steampunk-rollover-off.png", "on": "res/img/steampunk-rollover-on.png", "trigger": {"kind": "rollover", "source": "rollover-001"}, "behavior": {"mode": "keep"}}}, {"id": "art-008", "src": "res/img/steampunk-rollover-off.png", "x": 267, "y": 374, "width": 14, "height": 14, "angle": 0, "opacity": 1, "crop": [0, 0, 361, 368], "plane": "background", "frames": 1, "frameAxis": "x", "state": "static", "indicator": {"group": "4", "defaultState": "off", "off": "res/img/steampunk-rollover-off.png", "on": "res/img/steampunk-rollover-on.png", "trigger": {"kind": "rollover", "source": "rollover-002"}, "behavior": {"mode": "keep"}}}, {"id": "art-060", "src": "res/img/steampunk-table-frame-theme.png", "x": 180, "y": 230, "width": 360, "height": 480, "angle": 0, "opacity": 1, "crop": [0, 0, 360, 480], "plane": "background", "frames": 1, "frameAxis": "x", "state": "static"}, {"id": "art-061", "src": "res/img/steampunk-mine-laboratory.png", "x": 100, "y": 125, "width": 70, "height": 210, "angle": 0, "opacity": 1, "crop": [0, 0, 70, 210], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static"}, {"id": "art-062", "src": "res/img/steampunk-airship-dock.png", "x": 260, "y": 78, "width": 90, "height": 115, "angle": 0, "opacity": 1, "crop": [0, 0, 90, 115], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static"}, {"id": "art-063", "src": "res/img/steampunk-village.png", "x": 276, "y": 114, "width": 40, "height": 100, "angle": 0, "opacity": 1, "crop": [0, 0, 40, 100], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static"}, {"id": "art-064", "src": "res/img/steampunk-race-venue.png", "x": 190, "y": 132, "width": 64, "height": 64, "angle": 0, "opacity": 1, "crop": [0, 0, 64, 64], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static"}, {"id": "art-065", "src": "res/img/steampunk-sling-left-idle.png", "x": 98, "y": 367, "width": 50, "height": 90, "angle": 0, "opacity": 1, "crop": [0, 0, 50, 90], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "indicator": {"defaultState": "off", "off": "res/img/steampunk-sling-left-idle.png", "on": "res/img/steampunk-sling-left-active.png", "trigger": {"kind": "rebound", "source": "line-059"}, "behavior": {"mode": "once", "onSeconds": 0.28}, "group": "3"}}, {"id": "art-066", "src": "res/img/steampunk-sling-right-idle.png", "x": 244, "y": 366, "width": 50, "height": 90, "angle": 0, "opacity": 1, "crop": [0, 0, 50, 90], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "indicator": {"defaultState": "off", "off": "res/img/steampunk-sling-right-idle.png", "on": "res/img/steampunk-sling-right-active.png", "trigger": {"kind": "rebound", "source": "line-058"}, "behavior": {"mode": "once", "onSeconds": 0.28}, "group": "3"}}, {"id": "art-067", "src": "res/img/steampunk-return-left.png", "x": 91, "y": 388, "width": 59, "height": 108, "angle": 0, "opacity": 1, "crop": [0, 0, 59, 108], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static"}, {"id": "art-068", "src": "res/img/steampunk-return-right.png", "x": 250, "y": 389, "width": 58, "height": 108, "angle": 0, "opacity": 1, "crop": [0, 0, 58, 108], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static"}, {"id": "art-launch-hs-GameItem95-970-rod", "src": "res/img/plunger-rod.png", "x": 310, "y": 428, "width": 30, "height": 91, "angle": 0, "opacity": 1, "crop": [0, 0, 31, 91], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "plunger", "bind": "plunger", "layoutBind": "plunger-001", "layoutAnchor": [309.896, 386.688]}, {"id": "art-105", "src": "res/img/steampunk-rollover-off.png", "x": 54, "y": 394, "width": 14, "height": 14, "angle": 0, "opacity": 1, "crop": [0, 0, 361, 368], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "indicator": {"defaultState": "off", "off": "res/img/steampunk-rollover-off.png", "on": "res/img/steampunk-rollover-on.png", "trigger": {"kind": "kickback", "source": "line-060"}, "behavior": {"mode": "keep"}, "group": "2"}, "bind": "thickline-003"}, {"id": "art-098", "src": "res/img/steampunk-rollover-off.png", "x": 286, "y": 394, "width": 14, "height": 14, "angle": 0, "opacity": 1, "crop": [0, 0, 361, 368], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "indicator": {"defaultState": "off", "off": "res/img/steampunk-rollover-off.png", "on": "res/img/steampunk-rollover-on.png", "trigger": {"kind": "kickback", "source": "line-061"}, "behavior": {"mode": "keep"}, "group": "2"}, "bind": "thickline-003"}, {"id": "art-launch-hs-GameItem95-970-collar", "src": "res/img/plunger-collar.png", "x": 311, "y": 420, "width": 50, "height": 38, "angle": 0, "opacity": 1, "crop": [0, 0, 51, 38], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "layoutBind": "plunger-001", "layoutAnchor": [309.896, 386.688]}, {"id": "art-001", "src": "res/img/steampunk-bumper-furnace-level-1.png", "x": 172, "y": 51, "width": 28, "height": 28, "angle": 0, "opacity": 1, "crop": [0, 0, 28, 28], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "indicator": {"type": "bumper", "group": "5", "defaultState": "lv1", "lv1": "res/img/steampunk-bumper-furnace-level-1.png", "lv2": "res/img/steampunk-bumper-furnace-level-2.png", "lv3": "res/img/steampunk-bumper-furnace-level-3.png", "trigger": {"kind": "level", "source": "circle-001"}}}, {"id": "art-002", "src": "res/img/steampunk-bumper-furnace-level-1.png", "x": 229, "y": 74, "width": 28, "height": 28, "angle": 0, "opacity": 1, "crop": [0, 0, 28, 28], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "indicator": {"type": "bumper", "group": "5", "defaultState": "lv1", "lv1": "res/img/steampunk-bumper-furnace-level-1.png", "lv2": "res/img/steampunk-bumper-furnace-level-2.png", "lv3": "res/img/steampunk-bumper-furnace-level-3.png", "trigger": {"kind": "level", "source": "circle-002"}}}, {"id": "art-003", "src": "res/img/steampunk-bumper-furnace-level-1.png", "x": 181, "y": 112, "width": 28, "height": 28, "angle": 0, "opacity": 1, "crop": [0, 0, 28, 28], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "indicator": {"type": "bumper", "group": "5", "defaultState": "lv1", "lv1": "res/img/steampunk-bumper-furnace-level-1.png", "lv2": "res/img/steampunk-bumper-furnace-level-2.png", "lv3": "res/img/steampunk-bumper-furnace-level-3.png", "trigger": {"kind": "level", "source": "circle-003"}}}, {"id": "art-004", "src": "res/img/steampunk-flipper.png", "x": 205, "y": 450, "width": 51, "height": 14, "angle": -211.5, "opacity": 1, "crop": [0, 0, 51, 14], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "bind": "flipper-001"}, {"id": "art-005", "src": "res/img/steampunk-flipper.png", "x": 136, "y": 450, "width": 51, "height": 14, "angle": 31.5, "opacity": 1, "crop": [0, 0, 51, 14], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "bind": "flipper-002"}, {"id": "art-006", "src": "res/img/steampunk-flipper.png", "x": 282, "y": 230, "width": 51, "height": 14, "angle": 111, "opacity": 1, "crop": [0, 0, 51, 14], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "bind": "flipper-003"}, {"id": "art-085", "src": "res/img/steampunk-steam-tower-off.png", "x": 30, "y": 193, "width": 34, "height": 62, "angle": 0, "opacity": 1, "crop": [10, 1, 34, 62], "plane": "top", "frames": 1, "frameAxis": "x", "state": "static", "indicator": {"group": "1", "off": "res/img/steampunk-steam-tower-off.png", "on": "res/img/steampunk-steam-tower-on.png", "defaultState": "off", "trigger": {"kind": "sensor", "source": "sensor-002"}, "behavior": {"mode": "burst", "onSeconds": 0.15, "offSeconds": 0.15, "cycles": 4}, "extraTriggers": [{"kind": "hole-capture", "source": "hole-002"}]}}, {"id": "art-014", "src": "res/img/steampunk-flag.png", "x": 299, "y": 100, "width": 16, "height": 24, "angle": 0, "opacity": 1, "crop": [0, 0, 240, 360], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "bind": "flag-001"}, {"id": "art-015", "src": "res/img/steampunk-flag.png", "x": 64, "y": 133, "width": 16, "height": 24, "angle": 0, "opacity": 1, "crop": [0, 0, 240, 360], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "bind": "flag-002"}, {"id": "art-016", "src": "res/img/steampunk-flag.png", "x": 253, "y": 122, "width": 16, "height": 24, "angle": 0, "opacity": 1, "crop": [0, 0, 240, 360], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "bind": "flag-003"}, {"id": "art-018", "src": "res/img/steampunk-rebound.png", "x": 124, "y": 43, "width": 21, "height": 4, "angle": 123.34466092102573, "opacity": 1, "crop": [0, 0, 131, 5], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "animation": {"enabled": true, "effect": "shake", "duration": 0.18, "amplitude": 0.6, "trigger": {"kind": "rebound", "source": "line-051"}}}, {"id": "art-019", "src": "res/img/steampunk-rebound.png", "x": 236, "y": 43, "width": 14, "height": 5, "angle": -72.89727103094764, "opacity": 1, "crop": [0, 0, 131, 5], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "animation": {"enabled": true, "effect": "shake", "duration": 0.18, "amplitude": 0.6, "trigger": {"kind": "rebound", "source": "line-052"}}}, {"id": "art-020", "src": "res/img/steampunk-rebound.png", "x": 244, "y": 32, "width": 14, "height": 5, "angle": -33.690067525979785, "opacity": 1, "crop": [0, 0, 131, 5], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "animation": {"enabled": true, "effect": "shake", "duration": 0.18, "amplitude": 0.6, "trigger": {"kind": "rebound", "source": "line-053"}}}, {"id": "art-021", "src": "res/img/steampunk-rebound.png", "x": 227, "y": 107, "width": 19, "height": 5, "angle": 90, "opacity": 1, "crop": [0, 0, 131, 5], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "animation": {"enabled": true, "effect": "shake", "duration": 0.18, "amplitude": 0.6, "trigger": {"kind": "rebound", "source": "line-054"}}, "flipY": true}, {"id": "art-022", "src": "res/img/steampunk-rebound.png", "x": 205, "y": 137, "width": 21, "height": 5, "angle": 62.24145939893998, "opacity": 1, "crop": [0, 0, 131, 5], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "animation": {"enabled": true, "effect": "shake", "duration": 0.18, "amplitude": 0.6, "trigger": {"kind": "rebound", "source": "line-055"}}}, {"id": "art-024", "src": "res/img/steampunk-rebound.png", "x": 282, "y": 108, "width": 38, "height": 5, "angle": 108.43494882292202, "opacity": 1, "crop": [0, 0, 131, 5], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "animation": {"enabled": true, "effect": "shake", "duration": 0.18, "amplitude": 0.6, "trigger": {"kind": "rebound", "source": "line-056"}}}, {"id": "art-025", "src": "res/img/steampunk-rebound.png", "x": 194, "y": -1, "width": 131, "height": 5, "angle": 0, "opacity": 1, "crop": [0, 0, 131, 5], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "animation": {"enabled": true, "effect": "shake", "duration": 0.18, "amplitude": 0.6, "trigger": {"kind": "rebound", "source": "line-057"}}}, {"id": "art-029", "src": "res/img/steampunk-target-gear-standing-off.png", "x": 76, "y": 277, "width": 12, "height": 18, "angle": 0, "opacity": 1, "crop": [0, 0, 12, 18], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "bind": "shape-36-1", "flipX": true, "indicator": {"group": "8", "off": "res/img/steampunk-target-gear-standing-off.png", "on": "res/img/steampunk-target-gear-standing-on.png", "defaultState": "off", "trigger": {"kind": "default"}, "behavior": {"mode": "keep"}}}, {"id": "art-030", "src": "res/img/steampunk-target-gear-standing-off.png", "x": 77, "y": 262, "width": 12, "height": 18, "angle": 0, "opacity": 1, "crop": [0, 0, 12, 18], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "bind": "shape-36-2", "flipX": true, "indicator": {"group": "8", "off": "res/img/steampunk-target-gear-standing-off.png", "on": "res/img/steampunk-target-gear-standing-on.png", "defaultState": "off", "trigger": {"kind": "default"}, "behavior": {"mode": "keep"}}}, {"id": "art-031", "src": "res/img/steampunk-target-gear-standing-off.png", "x": 78, "y": 247, "width": 12, "height": 18, "angle": 0, "opacity": 1, "crop": [0, 0, 12, 18], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "bind": "shape-36-3", "flipX": true, "indicator": {"group": "8", "off": "res/img/steampunk-target-gear-standing-off.png", "on": "res/img/steampunk-target-gear-standing-on.png", "defaultState": "off", "trigger": {"kind": "default"}, "behavior": {"mode": "keep"}}}, {"id": "art-032", "src": "res/img/steampunk-target-bullseye.png", "x": 173, "y": 140, "width": 12, "height": 12, "angle": 0, "opacity": 1, "crop": [0, 0, 12, 12], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "bind": "shape-9-1"}, {"id": "art-033", "src": "res/img/steampunk-target-bullseye.png", "x": 186, "y": 147, "width": 12, "height": 12, "angle": 0, "opacity": 1, "crop": [0, 0, 12, 12], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "bind": "shape-9-2"}, {"id": "art-034", "src": "res/img/steampunk-target-bullseye.png", "x": 199, "y": 154, "width": 12, "height": 12, "angle": 0, "opacity": 1, "crop": [0, 0, 12, 12], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "bind": "shape-9-3"}, {"id": "art-035", "src": "res/img/steampunk-target-gear-standing-off.png", "x": 122, "y": 94, "width": 12, "height": 18, "angle": 0, "opacity": 1, "crop": [0, 0, 12, 18], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "bind": "shape-37-1", "flipX": true, "indicator": {"group": "9", "off": "res/img/steampunk-target-gear-standing-off.png", "on": "res/img/steampunk-target-gear-standing-on.png", "defaultState": "off", "trigger": {"kind": "default"}, "behavior": {"mode": "keep"}}}, {"id": "art-036", "src": "res/img/steampunk-target-gear-standing-off.png", "x": 122, "y": 79, "width": 12, "height": 18, "angle": 0, "opacity": 1, "crop": [0, 0, 12, 18], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "bind": "shape-37-2", "flipX": true, "indicator": {"group": "9", "off": "res/img/steampunk-target-gear-standing-off.png", "on": "res/img/steampunk-target-gear-standing-on.png", "defaultState": "off", "trigger": {"kind": "default"}, "behavior": {"mode": "keep"}}}, {"id": "art-037", "src": "res/img/steampunk-target-gear-standing-off.png", "x": 122, "y": 64, "width": 12, "height": 18, "angle": 0, "opacity": 1, "crop": [0, 0, 12, 18], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "bind": "shape-37-3", "flipX": true, "indicator": {"group": "9", "off": "res/img/steampunk-target-gear-standing-off.png", "on": "res/img/steampunk-target-gear-standing-on.png", "defaultState": "off", "trigger": {"kind": "default"}, "behavior": {"mode": "keep"}}}, {"id": "art-038", "src": "res/img/steampunk-target-gear-standing-off.png", "x": 117, "y": 211, "width": 12, "height": 18, "angle": 0, "opacity": 1, "crop": [0, 0, 12, 18], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "bind": "shape-38-1", "flipX": true, "indicator": {"group": "10", "off": "res/img/steampunk-target-gear-standing-off.png", "on": "res/img/steampunk-target-gear-standing-on.png", "defaultState": "off", "trigger": {"kind": "default"}, "behavior": {"mode": "keep"}}}, {"id": "art-039", "src": "res/img/steampunk-target-gear-standing-off.png", "x": 120, "y": 196, "width": 12, "height": 18, "angle": 0, "opacity": 1, "crop": [0, 0, 12, 18], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "bind": "shape-38-2", "flipX": true, "indicator": {"group": "10", "off": "res/img/steampunk-target-gear-standing-off.png", "on": "res/img/steampunk-target-gear-standing-on.png", "defaultState": "off", "trigger": {"kind": "default"}, "behavior": {"mode": "keep"}}}, {"id": "art-040", "src": "res/img/steampunk-target-gear-standing-off.png", "x": 123, "y": 181, "width": 12, "height": 18, "angle": 0, "opacity": 1, "crop": [0, 0, 12, 18], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "bind": "shape-38-3", "flipX": true, "indicator": {"group": "10", "off": "res/img/steampunk-target-gear-standing-off.png", "on": "res/img/steampunk-target-gear-standing-on.png", "defaultState": "off", "trigger": {"kind": "default"}, "behavior": {"mode": "keep"}}}, {"id": "art-069", "src": "res/img/steampunk-gear.png", "x": 30, "y": 19, "width": 85, "height": 85, "angle": 0, "opacity": 1, "crop": [0, 0, 64, 64], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static"}, {"id": "art-070", "src": "res/img/steampunk-pressure-gauge.png", "x": 340, "y": 54, "width": 42, "height": 42, "angle": 0, "opacity": 1, "crop": [0, 0, 42, 42], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static"}, {"id": "art-071", "src": "res/img/steampunk-pressure-needle.png", "x": 340, "y": 54, "width": 42, "height": 42, "angle": 45, "opacity": 1, "crop": [0, 0, 42, 42], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static"}, {"id": "art-074", "src": "res/img/steampunk-rescue-bar.png", "x": 56, "y": 435, "width": 25, "height": 5, "angle": 31.40163462281317, "opacity": 1, "crop": [0, 0, 52, 5], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "bind": "thickline-003", "animation": {"enabled": false, "effect": "shake", "duration": 0.75, "amplitude": 2.5, "trigger": {"kind": "multiball", "source": ""}}}, {"id": "art-076", "src": "res/img/steampunk-rescue-bar.png", "x": 286, "y": 435, "width": 26, "height": 5, "angle": -28.02140981141757, "opacity": 1, "crop": [0, 0, 52, 5], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "bind": "thickline-001"}, {"id": "art-080", "src": "res/img/steampunk-upper-deck.png", "x": 203, "y": 13, "width": 170, "height": 44, "angle": 0, "opacity": 1, "crop": [0, 0, 170, 44], "plane": "upper", "frames": 1, "frameAxis": "x", "state": "static"}, {"id": "art-102", "src": "", "needsAsset": true, "state": "ball-layer", "plane": "upper", "x": 0, "y": 0, "width": 1, "height": 1, "angle": 0, "opacity": 1, "crop": [0, 0, 1, 1], "frames": 1, "frameAxis": "x", "bind": ""}, {"id": "art-084", "src": "res/img/steampunk-crystal-off.png", "x": 308, "y": 66, "width": 32, "height": 27, "angle": 0, "opacity": 1, "crop": [0, 0, 32, 27], "plane": "upper", "frames": 1, "frameAxis": "x", "state": "static", "indicator": {"defaultState": "off", "off": "res/img/steampunk-crystal-off.png", "on": "res/img/steampunk-crystal-on.png", "trigger": {"kind": "attack", "source": "lv4"}, "behavior": {"mode": "burst", "onSeconds": 0.15, "offSeconds": 0.15, "cycles": 4}, "screenMask": true, "group": "7"}}, {"id": "art-090", "src": "res/img/steampunk-enemy-battleship.png", "x": 175, "y": 20, "width": 80, "height": 26, "angle": 0, "opacity": 1, "crop": [2, 56, 359, 117], "plane": "top", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "animation": {"enabled": true, "effect": "shake", "duration": 0.75, "amplitude": 2.5, "trigger": {"kind": "sensor", "source": "sensor-004"}}}, {"id": "art-077", "src": "res/img/steampunk-blocker.png", "x": 175, "y": 4, "width": 36, "height": 10, "angle": 46.27303002005671, "opacity": 1, "crop": [0, 0, 37, 10], "plane": "upper", "frames": 1, "frameAxis": "x", "state": "static", "bind": "arc-046"}, {"id": "art-078", "src": "res/img/steampunk-blocker.png", "x": 224, "y": 4, "width": 37, "height": 10, "angle": 45, "opacity": 1, "crop": [0, 0, 37, 10], "plane": "upper", "frames": 1, "frameAxis": "x", "state": "static", "bind": "arc-045"}, {"id": "art-089", "src": "res/img/steampunk-enemy-carrier.png", "x": 242, "y": 18, "width": 80, "height": 29, "angle": 0, "opacity": 1, "crop": [4, 79, 716, 261], "plane": "top", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "flipX": true, "animation": {"enabled": true, "effect": "shake", "duration": 0.75, "amplitude": 2.5, "trigger": {"kind": "sensor", "source": "sensor-005"}}}, {"id": "art-092", "src": "res/img/steampunk-steam-tower-off.png", "x": 331, "y": 184, "width": 34, "height": 62, "angle": 0, "opacity": 1, "crop": [10, 1, 34, 62], "plane": "top", "frames": 1, "frameAxis": "x", "state": "static", "indicator": {"group": "1", "off": "res/img/steampunk-steam-tower-off.png", "on": "res/img/steampunk-steam-tower-on.png", "defaultState": "off", "trigger": {"kind": "sensor", "source": "sensor-001"}, "behavior": {"mode": "burst", "onSeconds": 0.15, "offSeconds": 0.15, "cycles": 4}, "extraTriggers": [{"kind": "hole-capture", "source": "hole-001"}]}}, {"id": "art-091", "src": "res/img/steampunk-enemy-airship.png", "x": 266, "y": 61, "width": 24, "height": 12, "angle": 0, "opacity": 1, "crop": [0, 0, 720, 360], "plane": "upper", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "animation": {"enabled": true, "effect": "shake", "duration": 0.75, "amplitude": 2.5, "trigger": {"kind": "hole-capture", "source": "hole-003"}}}, {"id": "art-093", "src": "res/img/steampunk-rocket.png", "x": 106, "y": 147, "width": 35, "height": 51, "angle": 0, "opacity": 1, "crop": [0, 0, 361, 542], "plane": "top", "frames": 1, "frameAxis": "x", "state": "static", "bind": ""}, {"id": "art-094", "src": "res/img/steampunk-air-bike-11.png", "x": 200, "y": 133, "width": 28, "height": 14, "angle": 0, "opacity": 1, "crop": [0, 0, 28, 14], "plane": "top", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "flipX": true}, {"id": "art-012", "src": "res/img/steampunk-unlock-lights-0.png", "x": 104, "y": 171, "width": 36, "height": 18, "angle": 0, "opacity": 1, "crop": [0, 0, 36, 18], "plane": "top", "frames": 1, "frameAxis": "x", "state": "static", "indicator": {"group": "6", "defaultState": "off", "off": "res/img/steampunk-unlock-lights-0.png", "on": "res/img/steampunk-unlock-lights-2.png", "trigger": {"kind": "default"}, "behavior": {"mode": "keep"}}}, {"id": "art-095", "src": "res/img/steampunk-air-bike-03.png", "x": 206, "y": 140, "width": 29, "height": 14, "angle": 0, "opacity": 1, "crop": [0, 0, 29, 14], "plane": "top", "frames": 1, "frameAxis": "x", "state": "static", "bind": ""}, {"id": "art-096", "src": "res/img/steampunk-air-bike-02.png", "x": 211, "y": 147, "width": 17, "height": 8, "angle": 0, "opacity": 1, "crop": [0, 0, 17, 8], "plane": "top", "frames": 1, "frameAxis": "x", "state": "static", "bind": ""}, {"id": "art-097", "src": "res/img/steampunk-table-dragon.png", "x": 60, "y": 86, "width": 64, "height": 74, "angle": 0, "opacity": 1, "crop": [0, 0, 64, 74], "plane": "upper", "frames": 1, "frameAxis": "x", "state": "static", "bind": ""}, {"id": "art-099", "src": "res/img/plunger-rod.png", "x": 310, "y": 428, "width": 30, "height": 91, "angle": 0, "opacity": 1, "crop": [0, 0, 31, 91], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "plunger", "bind": "plunger", "layoutBind": "plunger-001", "layoutAnchor": [309.896, 386.688]}, {"id": "art-100", "src": "res/img/plunger-collar.png", "x": 311, "y": 420, "width": 50, "height": 38, "angle": 0, "opacity": 1, "crop": [0, 0, 51, 38], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "layoutBind": "plunger-001", "layoutAnchor": [309.896, 386.688]}, {"id": "art-103", "src": "", "needsAsset": true, "state": "ball-layer", "plane": "top", "x": 0, "y": 0, "width": 1, "height": 1, "angle": 0, "opacity": 1, "crop": [0, 0, 1, 1], "frames": 1, "frameAxis": "x", "bind": ""}, {"id": "art-104", "src": "res/img/steampunk-target-sign-blackhole.png", "x": 65, "y": 257, "width": 32, "height": 10, "angle": 90, "opacity": 1, "crop": [0, 0, 50, 16], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "bind": ""}, {"id": "art-108", "src": "res/img/steampunk-low-ramp.png", "x": 200, "y": 66, "width": 260, "height": 166, "angle": 0, "opacity": 1, "crop": [0, 0, 260, 166], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "bind": ""}, {"id": "art-122", "src": "res/img/steampunk-bonus-ring-background.png", "x": 170, "y": 310, "width": 140, "height": 140, "angle": 0, "opacity": 1, "crop": [0, 0, 140, 140], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "bind": ""}, {"id": "art-101", "src": "", "needsAsset": true, "state": "ball-layer", "plane": "lower", "x": 0, "y": 0, "width": 1, "height": 1, "angle": 0, "opacity": 1, "crop": [0, 0, 1, 1], "frames": 1, "frameAxis": "x", "bind": ""}, {"id": "art-106", "src": "res/img/steampunk-target-sign-upgrade.png", "x": 110, "y": 77, "width": 32, "height": 10, "angle": 90, "opacity": 1, "crop": [0, 0, 50, 16], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "bind": ""}, {"id": "art-107", "src": "res/img/steampunk-upper-ramp.png", "x": 200, "y": 67, "width": 260, "height": 166, "angle": 0, "opacity": 1, "crop": [0, 0, 260, 166], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "bind": ""}, {"id": "art-109", "src": "res/img/steampunk-center-post.png", "x": 170, "y": 468, "width": 14, "height": 18, "angle": 0, "opacity": 1, "crop": [0, 0, 14, 18], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "center-post", "bind": "centerPost-001"}, {"id": "art-115", "src": "res/img/steampunk-mission-arrow-off.png", "x": 261, "y": 80, "width": 16, "height": 16, "angle": -82.14845293840264, "opacity": 1, "crop": [0, 0, 16, 16], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "indicator": {"group": "11", "defaultState": "off", "off": "res/img/steampunk-mission-arrow-off.png", "on": "res/img/steampunk-mission-arrow-on.png", "trigger": {"kind": "enemy-active"}, "behavior": {"mode": "repeat", "onSeconds": 0.5, "offSeconds": 0.5}}}, {"id": "art-116", "src": "res/img/steampunk-mission-arrow-off.png", "x": 209, "y": 168, "width": 16, "height": 16, "angle": 268.67113861400287, "opacity": 1, "crop": [0, 0, 16, 16], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "indicator": {"group": "13", "defaultState": "off", "off": "res/img/steampunk-mission-arrow-off.png", "on": "res/img/steampunk-mission-arrow-on.png", "trigger": {"kind": "enemy-idle"}, "behavior": {"mode": "keep"}}}, {"id": "art-117", "src": "res/img/steampunk-mission-arrow-off.png", "x": 113, "y": 128, "width": 16, "height": 16, "angle": 235.99257286408647, "opacity": 1, "crop": [0, 0, 16, 16], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "indicator": {"group": "11", "defaultState": "off", "off": "res/img/steampunk-mission-arrow-off.png", "on": "res/img/steampunk-mission-arrow-on.png", "trigger": {"kind": "enemy-active"}, "behavior": {"mode": "repeat", "onSeconds": 0.5, "offSeconds": 0.5}}}, {"id": "art-118", "src": "res/img/steampunk-mission-arrow-off.png", "x": 105, "y": 115, "width": 16, "height": 16, "angle": 241.98412999827585, "opacity": 1, "crop": [0, 0, 16, 16], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "indicator": {"group": "11", "defaultState": "off", "off": "res/img/steampunk-mission-arrow-off.png", "on": "res/img/steampunk-mission-arrow-on.png", "trigger": {"kind": "enemy-active"}, "behavior": {"mode": "repeat", "onSeconds": 0.5, "offSeconds": 0.5}}}, {"id": "art-119", "src": "res/img/steampunk-mission-arrow-off.png", "x": 122, "y": 140, "width": 16, "height": 16, "angle": 230.29339143613632, "opacity": 1, "crop": [0, 0, 16, 16], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "bind": "", "indicator": {"group": "11", "defaultState": "off", "off": "res/img/steampunk-mission-arrow-off.png", "on": "res/img/steampunk-mission-arrow-on.png", "trigger": {"kind": "enemy-active"}, "behavior": {"mode": "repeat", "onSeconds": 0.5, "offSeconds": 0.5}}}, {"id": "art-120", "src": "res/img/steampunk-mission-arrow-off.png", "x": 115, "y": 226, "width": 16, "height": 16, "angle": 268.65270630379194, "opacity": 1, "crop": [0, 0, 16, 16], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "bind": "targetGroup-004", "indicator": {"group": "12", "defaultState": "off", "off": "res/img/steampunk-mission-arrow-off.png", "on": "res/img/steampunk-mission-arrow-on.png", "trigger": {"kind": "default"}, "behavior": {"mode": "keep"}}}, {"id": "art-121", "src": "res/img/steampunk-mission-arrow-off.png", "x": 81, "y": 291, "width": 16, "height": 16, "angle": 251.4000426412865, "opacity": 1, "crop": [0, 0, 16, 16], "plane": "lower", "frames": 1, "frameAxis": "x", "state": "static", "bind": "targetGroup-001", "indicator": {"group": "11", "defaultState": "off", "off": "res/img/steampunk-mission-arrow-off.png", "on": "res/img/steampunk-mission-arrow-on.png", "trigger": {"kind": "enemy-active"}, "behavior": {"mode": "repeat", "onSeconds": 0.5, "offSeconds": 0.5}}}], "gameplay": {"steampunkBonus": {"hole": "blockhole-001", "artId": "art-122", "spinSeconds": 5, "winFlashSeconds": 1.28, "bossFlashSeconds": 1.44, "geometry": {"angle": 30, "inner": 352, "outer": 578, "cx": 626, "cy": 620, "startAngle": 0, "opacity": 1, "stepAngle": 30, "canvasSize": 1254, "color": "#ffdd4b"}, "rewards": [{"position": 1, "kind": "enemy", "value": 0, "art": {"src": "res/img/steampunk-bonus-enemy.png", "crop": [0, 0, 13, 13], "x": 746.3508559726722, "y": 170.8444907755832, "width": 116, "height": 115.64197530864197, "angle": 0}}, {"position": 2, "kind": "score", "value": 1000, "art": {"src": "res/img/steampunk-bonus-score-1000.png", "crop": [0, 0, 20, 9], "x": 954.8046532517446, "y": 291.1953467482554, "width": 178, "height": 76.41815476190476, "angle": 0}}, {"position": 3, "kind": "score", "value": 2500, "art": {"src": "res/img/steampunk-bonus-score-2500.png", "crop": [0, 0, 20, 7], "x": 1075.1555092244168, "y": 499.64914402732785, "width": 178, "height": 61.832793259883346, "angle": 0}}, {"position": 4, "kind": "score", "value": 5000, "art": {"src": "res/img/steampunk-bonus-score-5000.png", "crop": [0, 0, 20, 8], "x": 1072.6323703914188, "y": 728.9967312241813, "width": 178, "height": 63.85018270401949, "angle": 0}}, {"position": 5, "kind": "score", "value": 10000, "art": {"src": "res/img/steampunk-bonus-score-10000.png", "crop": [0, 0, 20, 7], "x": 969.3239930729657, "y": 924.0926010159488, "width": 178, "height": 54.48594164456234, "angle": 0}}, {"position": 6, "kind": "multi", "value": 2, "art": {"src": "res/img/steampunk-bonus-multiball.png", "crop": [0, 0, 19, 18], "x": 755.1818418881652, "y": 1051.493537393431, "width": 162.04487133868489, "height": 152.5210586757371, "angle": 0}}, {"position": 7, "kind": "enemy", "value": 0, "art": {"src": "res/img/steampunk-bonus-enemy.png", "crop": [0, 0, 13, 13], "x": 506.91071344382675, "y": 1057.801384475926, "width": 116, "height": 115.64197530864197, "angle": 0}}, {"position": 8, "kind": "multiplier", "value": 2, "art": {"src": "res/img/steampunk-bonus-multiplier-2.png", "crop": [0, 0, 16, 12], "x": 294.0301316755252, "y": 935.4467257644397, "width": 136.6435318627044, "height": 103.92387200960529, "angle": 0}}, {"position": 9, "kind": "multiplier", "value": 3, "art": {"src": "res/img/steampunk-bonus-multiplier-3.png", "crop": [0, 0, 14, 12], "x": 176.84449077558327, "y": 740.3508559726723, "width": 122.55044036988531, "height": 104.3655363149991, "angle": 0}}, {"position": 10, "kind": "multiplier", "value": 4, "art": {"src": "res/img/steampunk-bonus-multiplier-4.png", "crop": [0, 0, 17, 12], "x": 174.81248728166162, "y": 511.29102679565153, "width": 144.5794010478669, "height": 103.86851859272983, "angle": 0}}, {"position": 11, "kind": "ball", "value": 1, "art": {"src": "res/img/steampunk-bonus-ball-plus-1.png", "crop": [0, 0, 18, 9], "x": 281.4144375105353, "y": 303.2917048190612, "width": 154.07901380775115, "height": 78.7265034054203, "angle": 0}}, {"position": 12, "kind": "ball", "value": 2, "art": {"src": "res/img/steampunk-bonus-ball-plus-2.png", "crop": [0, 0, 20, 9], "x": 491.5207824626005, "y": 180.5827278876756, "width": 176.29386135289505, "height": 73.79365861597722, "angle": 0}}], "sphere": "res/img/steampunk-attack-electric-sphere.png", "mine": {"src": "res/img/steampunk-tesla-mine.png", "crop": [1, 1, 99, 119]}, "multiballHoles": ["hole-002", "hole-001"]}}, "screenLayout": {"width": 360, "height": 640, "theaterHeight": 170.5, "playfieldHeight": 469.5, "top": -170.5, "bottom": 469.5}, "format": "pinball-layout-editor", "version": 6, "canvas": {"width": 360, "height": 469.5, "upperLimit": 469.5}, "objects": [{"id": "arc-001", "type": "arc", "layer": "lower", "x1": 289.116, "y1": 89.239, "qx": 285.253, "qy": 76.957, "x2": 274.163, "y2": 70.749}, {"id": "arc-002", "type": "arc", "layer": "lower", "x1": 110.794, "y1": 441.35, "qx": 113.075, "qy": 441.922, "x2": 113.085, "y2": 439.242}, {"id": "arc-003", "type": "arc", "layer": "lower", "x1": 116.125, "y1": 434.417, "qx": 119.703, "qy": 433.479, "x2": 118.217, "y2": 430.924}, {"id": "line-001", "type": "line", "layer": "lower", "x1": 118.217, "y1": 430.924, "x2": 103.757, "y2": 420.648}, {"id": "line-002", "type": "line", "layer": "lower", "x1": 103.757, "y1": 420.651, "x2": 85.166, "y2": 407.636}, {"id": "line-003", "type": "line", "layer": "lower", "x1": 85.166, "y1": 407.636, "x2": 78.221, "y2": 402.707}, {"id": "arc-004", "type": "arc", "layer": "lower", "x1": 78.221, "y1": 402.707, "qx": 68.226, "qy": 397.834, "x2": 65.32900000000001, "y2": 386.609}, {"id": "line-004", "type": "line", "layer": "lower", "x1": 65.32900000000001, "y1": 386.609, "x2": 65.326, "y2": 338.098}, {"id": "line-005", "type": "line", "layer": "lower", "x1": 62, "y1": 337, "x2": 61.949, "y2": 412.059}, {"id": "arc-005", "type": "arc", "layer": "lower", "x1": 61.949, "y1": 412.059, "qx": 63.667, "qy": 413.966, "x2": 66.783, "y2": 413.295}, {"id": "line-006", "type": "line", "layer": "lower", "x1": 66.783, "y1": 413.295, "x2": 69.537, "y2": 413.685}, {"id": "line-007", "type": "line", "layer": "lower", "x1": 69.537, "y1": 413.685, "x2": 74.261, "y2": 415.467}, {"id": "line-008", "type": "line", "layer": "lower", "x1": 74.261, "y1": 415.467, "x2": 110.794, "y2": 441.35}, {"id": "arc-006", "type": "arc", "layer": "lower", "x1": 222.637, "y1": 431.043, "qx": 221.525, "qy": 433.5, "x2": 224.845, "y2": 434.325}, {"id": "arc-007", "type": "arc", "layer": "lower", "x1": 227.517, "y1": 437.954, "qx": 227.572, "qy": 442.336, "x2": 230.775, "y2": 440.942}, {"id": "line-009", "type": "line", "layer": "lower", "x1": 230, "y1": 441, "x2": 274, "y2": 410}, {"id": "arc-008", "type": "arc", "layer": "lower", "x1": 273.295, "y1": 411.194, "qx": 277.802, "qy": 406.604, "x2": 278.013, "y2": 400.047}, {"id": "arc-009", "type": "arc", "layer": "lower", "x1": 276, "y1": 380, "qx": 276, "qy": 394, "x2": 269, "y2": 399}, {"id": "line-010", "type": "line", "layer": "lower", "x1": 269, "y1": 399, "x2": 222.637, "y2": 431.043}, {"id": "line-011", "type": "line", "layer": "lower", "x1": 81.936, "y1": 380.066, "x2": 84.583, "y2": 385.508}, {"id": "line-012", "type": "line", "layer": "lower", "x1": 84.583, "y1": 385.508, "x2": 104.831, "y2": 400.004}, {"id": "line-013", "type": "line", "layer": "lower", "x1": 104.831, "y1": 400.004, "x2": 113, "y2": 393}, {"id": "line-014", "type": "line", "layer": "lower", "x1": 81.727, "y1": 336.776, "x2": 81.936, "y2": 380.066}, {"id": "line-015", "type": "line", "layer": "lower", "x1": 228, "y1": 393, "x2": 236.305, "y2": 399.903}, {"id": "line-016", "type": "line", "layer": "lower", "x1": 236.305, "y1": 399.903, "x2": 256.79499999999996, "y2": 385.373}, {"id": "line-017", "type": "line", "layer": "lower", "x1": 256.79499999999996, "y1": 385.373, "x2": 259.127, "y2": 380.793}, {"id": "line-018", "type": "line", "layer": "lower", "x1": 259.127, "y1": 380.793, "x2": 259.255, "y2": 336.68100000000004}, {"id": "line-019", "type": "line", "layer": "lower", "x1": 296.055, "y1": 326.534, "x2": 297, "y2": 470}, {"id": "arc-010", "type": "arc", "layer": "lower", "x1": 296, "y1": 327, "qx": 287, "qy": 295, "x2": 265, "y2": 278}, {"id": "line-020", "type": "line", "layer": "lower", "x1": 262.369, "y1": 0.6839999999999975, "x2": 282, "y2": 1}, {"id": "line-021", "type": "line", "layer": "lower", "x1": 322, "y1": 62, "x2": 314.652, "y2": 100.809}, {"id": "line-022", "type": "line", "layer": "lower", "x1": 314.652, "y1": 100.809, "x2": 284.405, "y2": 203.59199999999998}, {"id": "arc-011", "type": "arc", "layer": "lower", "x1": 321.502, "y1": 38.900000000000006, "qx": 316, "qy": 6, "x2": 281, "y2": 1}, {"id": "arc-012", "type": "arc", "layer": "lower", "x1": 123, "y1": 26, "qx": 87.529, "qy": 38.559, "x2": 70.623, "y2": 59.798}, {"id": "arc-013", "type": "arc", "layer": "lower", "x1": 70, "y1": 60, "qx": 71, "qy": 118, "x2": 82.926, "y2": 151.756}, {"id": "line-023", "type": "line", "layer": "lower", "x1": 82.926, "y1": 151.756, "x2": 100.782, "y2": 218.333}, {"id": "arc-014", "type": "arc", "layer": "lower", "x1": 239.83, "y1": 122.867, "qx": 248.746, "qy": 93.301, "x2": 254, "y2": 55}, {"id": "arc-015", "type": "arc", "layer": "lower", "x1": 254.24900000000002, "y1": 54.771, "qx": 254.97000000000003, "qy": 47.221999999999994, "x2": 262.117, "y2": 44.915000000000006}, {"id": "arc-016", "type": "arc", "layer": "lower", "x1": 262.117, "y1": 44.915000000000006, "qx": 267.329, "qy": 44.681, "x2": 272.415, "y2": 46.412000000000006}, {"id": "arc-017", "type": "arc", "layer": "lower", "x1": 272.415, "y1": 46.412000000000006, "qx": 287.128, "qy": 53.283, "x2": 297.766, "y2": 65.467}, {"id": "arc-018", "type": "arc", "layer": "lower", "x1": 297.766, "y1": 65.467, "qx": 299.698, "qy": 62.474000000000004, "x2": 299.748, "y2": 58.840999999999994}, {"id": "arc-019", "type": "arc", "layer": "lower", "x1": 299.748, "y1": 58.840999999999994, "qx": 299.55, "qy": 50.974000000000004, "x2": 297.349, "y2": 43.458}, {"id": "arc-020", "type": "arc", "layer": "lower", "x1": 297.349, "y1": 43.458, "qx": 288.196, "qy": 29.373000000000005, "x2": 253, "y2": 26}, {"id": "line-024", "type": "line", "layer": "lower", "x1": 322, "y1": 0, "x2": 322, "y2": 468.5}, {"id": "line-025", "type": "line", "layer": "upper", "x1": 22, "y1": 182, "x2": 21, "y2": 214}, {"id": "arc-021", "type": "arc", "layer": "upper", "x1": 22, "y1": 182, "qx": 30, "qy": 175, "x2": 41, "y2": 183}, {"id": "arc-022", "type": "arc", "layer": "lower", "x1": 49.093, "y1": 126.69800000000001, "qx": 41, "qy": 97, "x2": 44, "y2": 57}, {"id": "arc-023", "type": "arc", "layer": "lower", "x1": 44, "y1": 56, "qx": 45, "qy": 41, "x2": 55.624, "y2": 25.726}, {"id": "arc-024", "type": "arc", "layer": "lower", "x1": 55.624, "y1": 25.726, "qx": 72, "qy": 3, "x2": 120, "y2": 1}, {"id": "line-026", "type": "line", "layer": "lower", "x1": 45, "y1": 470, "x2": 45.51, "y2": 333.221}, {"id": "arc-025", "type": "arc", "layer": "lower", "x1": 45.51, "y1": 333.221, "qx": 48.574, "qy": 309.47, "x2": 70, "y2": 292}, {"id": "arc-026", "type": "arc", "layer": "lower", "x1": 277, "y1": 257, "qx": 313, "qy": 289, "x2": 321, "y2": 351}, {"id": "line-027", "type": "line", "layer": "lower", "x1": 321, "y1": 351, "x2": 321, "y2": 467}, {"id": "line-028", "type": "line", "layer": "lower", "x1": 284.405, "y1": 203.59199999999998, "x2": 292.331, "y2": 206.834}, {"id": "arc-027", "type": "arc", "layer": "lower", "x1": 292.331, "y1": 206.834, "qx": 297.234, "qy": 210.511, "x2": 295.417, "y2": 216.465}, {"id": "line-029", "type": "line", "layer": "lower", "x1": 295.417, "y1": 216.465, "x2": 277, "y2": 256}, {"id": "line-030", "type": "line", "layer": "lower", "x1": 74, "y1": 235, "x2": 70, "y2": 292}, {"id": "line-031", "type": "line", "layer": "upper", "x1": 295.362, "y1": 75.602, "x2": 301, "y2": 58}, {"id": "line-032", "type": "line", "layer": "upper", "x1": 323, "y1": 60, "x2": 318.634, "y2": 81.816}, {"id": "arc-028", "type": "arc", "layer": "lower", "x1": 272.549, "y1": 73.62899999999999, "qx": 273.637, "qy": 95.463, "x2": 268.651, "y2": 116.751}, {"id": "line-033", "type": "line", "layer": "lower", "x1": 268.651, "y1": 116.751, "x2": 262.464, "y2": 148.066}, {"id": "arc-029", "type": "arc", "layer": "lower", "x1": 65.326, "y1": 338.101, "qx": 65.126, "qy": 334.001, "x2": 62.083, "y2": 336.31600000000003}, {"id": "arc-030", "type": "arc", "layer": "upper", "x1": 339, "y1": 179, "qx": 330, "qy": 172, "x2": 322.104, "y2": 179.062}, {"id": "line-034", "type": "line", "layer": "lower", "x1": 275.752, "y1": 337.525, "x2": 275.7, "y2": 380.56}, {"id": "line-035", "type": "line", "layer": "lower", "x1": 278, "y1": 401, "x2": 277.509, "y2": 337.61699999999996}, {"id": "arc-031", "type": "arc", "layer": "lower", "x1": 277.509, "y1": 337.61699999999996, "qx": 276.653, "qy": 335.717, "x2": 275.752, "y2": 337.525}, {"id": "line-036", "type": "line", "layer": "upper", "x1": 323.376, "y1": 59.995000000000005, "x2": 323, "y2": 28}, {"id": "arc-032", "type": "arc", "layer": "upper", "x1": 323, "y1": 29, "qx": 315, "qy": -7, "x2": 272, "y2": -8}, {"id": "line-037", "type": "line", "layer": "upper", "x1": 234, "y1": 15, "x2": 276, "y2": 14}, {"id": "arc-033", "type": "arc", "layer": "upper", "x1": 276, "y1": 14, "qx": 297, "qy": 18, "x2": 300, "y2": 36}, {"id": "line-038", "type": "line", "layer": "upper", "x1": 300, "y1": 35, "x2": 301.073, "y2": 57.363}, {"id": "arc-034", "type": "arc", "layer": "upper", "x1": 117.944, "y1": 28.305000000000007, "qx": 124.007, "qy": 13.971000000000004, "x2": 141, "y2": 13}, {"id": "line-039", "type": "line", "layer": "upper", "x1": 140, "y1": 13, "x2": 167, "y2": 13}, {"id": "arc-035", "type": "arc", "layer": "upper", "x1": 131.618, "y1": -7.640999999999991, "qx": 126.245, "qy": -6.917000000000002, "x2": 121.214, "y2": -4.911000000000001}, {"id": "arc-036", "type": "arc", "layer": "upper", "x1": 121.214, "y1": -4.911000000000001, "qx": 90, "qy": 4, "x2": 82, "y2": 54}, {"id": "line-040", "type": "line", "layer": "upper", "x1": 169.292, "y1": 97.19, "x2": 165.295, "y2": 108.843}, {"id": "arc-037", "type": "arc", "layer": "lower", "x1": 118.401, "y1": 157.142, "qx": 108.442, "qy": 149.608, "x2": 100, "y2": 141}, {"id": "arc-038", "type": "arc", "layer": "upper", "x1": 99.365, "y1": 141.09, "qx": 93.541, "qy": 133.663, "x2": 89.488, "y2": 125.143}, {"id": "arc-039", "type": "arc", "layer": "upper", "x1": 89.488, "y1": 125.143, "qx": 74.98, "qy": 90.993, "x2": 82, "y2": 53}, {"id": "line-041", "type": "line", "layer": "upper", "x1": 340, "y1": 210, "x2": 340, "y2": 179}, {"id": "line-042", "type": "line", "layer": "upper", "x1": 322, "y1": 179, "x2": 322, "y2": 211}, {"id": "line-043", "type": "line", "layer": "upper", "x1": 123, "y1": 122, "x2": 110.922, "y2": 100.785}, {"id": "arc-040", "type": "arc", "layer": "upper", "x1": 110.922, "y1": 100.785, "qx": 104.512, "qy": 79.72, "x2": 107.008, "y2": 57.82299999999999}, {"id": "arc-041", "type": "arc", "layer": "lower", "x1": 81.88, "y1": 53.334999999999994, "qx": 76.374, "qy": 81.762, "x2": 83.344, "y2": 109.904}, {"id": "arc-042", "type": "arc", "layer": "lower", "x1": 83.344, "y1": 109.904, "qx": 89, "qy": 128, "x2": 100, "y2": 141}, {"id": "hole-001", "type": "hole", "layer": "upper", "x": 331.042, "y": 183.774, "angle": 0}, {"id": "hole-002", "type": "hole", "layer": "upper", "x": 30.04, "y": 186.954, "angle": 0}, {"id": "hole-003", "type": "hole", "layer": "lower", "x": 264.276, "y": 57.467, "angle": 0, "releaseMode": "fixed", "releaseAngle": 20.275, "attack": "lv1"}, {"id": "circle-001", "type": "circle", "layer": "lower", "cx": 172.183, "cy": 50.900999999999996, "r": 13.803}, {"id": "circle-002", "type": "circle", "layer": "lower", "cx": 228.967, "cy": 73.632, "r": 13.803}, {"id": "circle-003", "type": "circle", "layer": "lower", "cx": 181.335, "cy": 111.598, "r": 13.803}, {"id": "flag-001", "type": "flag", "layer": "lower", "x1": 286.135, "y1": 95.981, "x2": 311.493, "y2": 103.254}, {"id": "flag-002", "type": "flag", "layer": "lower", "x1": 53.771, "y1": 135.189, "x2": 75, "y2": 131}, {"id": "flag-003", "type": "flag", "layer": "lower", "x1": 242, "y1": 119, "x2": 264.099, "y2": 125.00200000000001}, {"id": "plunger-001", "type": "plunger", "layer": "lower", "x": 309.896, "y": 386.688, "angle": 0}, {"id": "flipper-001", "type": "flipper", "layer": "lower", "x": 205.222, "y": 449.985, "angle": -211.5}, {"id": "flipper-002", "type": "flipper", "layer": "lower", "x": 135.755, "y": 450.063, "angle": 31.5}, {"id": "flipper-003", "type": "flipper", "layer": "lower", "x": 281.871, "y": 230.261, "angle": 111}, {"id": "line-044", "type": "line", "layer": "upper", "x1": 40, "y1": 214, "x2": 39.924, "y2": 182.451}, {"id": "oneway-001", "type": "oneway", "layer": "lower", "x1": 277, "y1": 257, "x2": 265, "y2": 278, "direction": 1}, {"id": "hole-004", "type": "hole", "layer": "upper", "x": 310, "y": 64, "angle": 0, "releaseMode": "cadet", "releaseAngle": 90, "attack": "lv4"}, {"id": "oneway-002", "type": "oneway", "layer": "upper", "x1": 322, "y1": 190, "x2": 338, "y2": 190, "direction": 1}, {"id": "oneway-003", "type": "oneway", "layer": "upper", "x1": 21, "y1": 197, "x2": 38, "y2": 197, "direction": 1}, {"id": "arc-043", "type": "arc", "layer": "upper", "x1": 168, "y1": 15, "qx": 172, "qy": 57, "x2": 169, "y2": 97}, {"id": "arc-044", "type": "arc", "layer": "upper", "x1": 118, "y1": 28, "qx": 108, "qy": 47, "x2": 107, "y2": 59}, {"id": "line-045", "type": "line", "layer": "upper", "x1": 132, "y1": -8, "x2": 272, "y2": -8}, {"id": "arc-045", "type": "arc", "layer": "upper", "x1": 212, "y1": -8, "qx": 234, "qy": -7, "x2": 235, "y2": 15}, {"id": "arc-046", "type": "arc", "layer": "upper", "x1": 164, "y1": -8, "qx": 185, "qy": -7, "x2": 186, "y2": 15}, {"id": "line-046", "type": "line", "layer": "upper", "x1": 186, "y1": 14, "x2": 215, "y2": 14}, {"id": "oneway-004", "type": "oneway", "layer": "lower", "x1": 120, "y1": 120, "x2": 95, "y2": 135, "direction": 1, "mechanic": "layer-transition", "fromLayer": "lower", "toLayer": "upper", "bidirectional": true}, {"id": "oneway-005", "type": "oneway", "layer": "upper", "x1": 101, "y1": 347, "x2": 122, "y2": 338, "direction": 1, "mechanic": "layer-transition", "fromLayer": "upper", "toLayer": "lower", "bidirectional": false}, {"id": "oneway-006", "type": "oneway", "layer": "upper", "x1": 220, "y1": 336, "x2": 240, "y2": 341, "direction": 1, "mechanic": "layer-transition", "fromLayer": "upper", "toLayer": "lower", "bidirectional": false}, {"id": "line-047", "type": "line", "layer": "lower", "x1": 74, "y1": 235, "x2": 49, "y2": 128}, {"id": "line-048", "type": "line", "layer": "lower", "x1": 166, "y1": 132, "x2": 209, "y2": 155}, {"id": "line-049", "type": "line", "layer": "lower", "x1": 110, "y1": 219, "x2": 121, "y2": 171}, {"id": "line-050", "type": "line", "layer": "lower", "x1": 118, "y1": 106, "x2": 117, "y2": 55}, {"id": "line-051", "type": "line", "layer": "lower", "x1": 130, "y1": 34, "x2": 117, "y2": 53, "mechanic": "active-rebound"}, {"id": "line-052", "type": "line", "layer": "lower", "x1": 234, "y1": 49, "x2": 238, "y2": 36, "mechanic": "active-rebound"}, {"id": "line-053", "type": "line", "layer": "lower", "x1": 238, "y1": 36, "x2": 250, "y2": 28, "mechanic": "active-rebound"}, {"id": "line-054", "type": "line", "layer": "lower", "x1": 227, "y1": 97, "x2": 227, "y2": 116, "mechanic": "active-rebound"}, {"id": "line-055", "type": "line", "layer": "lower", "x1": 200, "y1": 127, "x2": 210, "y2": 146, "mechanic": "active-rebound"}, {"id": "line-056", "type": "line", "layer": "lower", "x1": 288, "y1": 90, "x2": 276, "y2": 126, "mechanic": "active-rebound"}, {"id": "line-057", "type": "line", "layer": "lower", "x1": 128, "y1": -1, "x2": 259, "y2": -1, "mechanic": "active-rebound"}, {"id": "line-058", "type": "line", "layer": "lower", "x1": 227, "y1": 392, "x2": 248, "y2": 334, "mechanic": "active-rebound"}, {"id": "line-059", "type": "line", "layer": "lower", "x1": 114, "y1": 392, "x2": 94, "y2": 335, "mechanic": "active-rebound"}, {"id": "targets-001", "type": "targets", "layer": "lower", "x": 77, "y": 262, "angle": -86.582, "targetGroup": {"id": "targetGroup-001", "members": ["targets-001"], "action": "blackHole", "hole": "blockhole-001"}}, {"id": "circle-004", "type": "circle", "layer": "lower", "cx": 230, "cy": 94, "r": 3.511, "mechanic": "solid-circle"}, {"id": "circle-005", "type": "circle", "layer": "lower", "cx": 230, "cy": 117, "r": 3, "mechanic": "solid-circle"}, {"id": "circle-006", "type": "circle", "layer": "lower", "cx": 266, "cy": 150, "r": 3, "mechanic": "solid-circle"}, {"id": "circle-007", "type": "circle", "layer": "lower", "cx": 235, "cy": 124, "r": 3, "mechanic": "solid-circle"}, {"id": "circle-008", "type": "circle", "layer": "lower", "cx": 273, "cy": 128, "r": 3, "mechanic": "solid-circle"}, {"id": "circle-009", "type": "circle", "layer": "lower", "cx": 213, "cy": 154, "r": 3, "mechanic": "solid-circle"}, {"id": "circle-010", "type": "circle", "layer": "lower", "cx": 286, "cy": 90, "r": 3, "mechanic": "solid-circle"}, {"id": "circle-011", "type": "circle", "layer": "lower", "cx": 167, "cy": 128, "r": 3, "mechanic": "solid-circle"}, {"id": "circle-012", "type": "circle", "layer": "lower", "cx": 209, "cy": 148, "r": 3, "mechanic": "solid-circle"}, {"id": "circle-013", "type": "circle", "layer": "lower", "cx": 196, "cy": 127, "r": 3.511, "mechanic": "solid-circle"}, {"id": "circle-014", "type": "circle", "layer": "lower", "cx": 120, "cy": 108, "r": 3, "mechanic": "solid-circle"}, {"id": "circle-015", "type": "circle", "layer": "lower", "cx": 109, "cy": 224, "r": 3, "mechanic": "solid-circle"}, {"id": "circle-016", "type": "circle", "layer": "lower", "cx": 105, "cy": 217, "r": 3, "mechanic": "solid-circle"}, {"id": "circle-017", "type": "circle", "layer": "lower", "cx": 124, "cy": -3, "r": 3, "mechanic": "solid-circle"}, {"id": "circle-018", "type": "circle", "layer": "lower", "cx": 262, "cy": -3, "r": 3, "mechanic": "solid-circle"}, {"id": "circle-019", "type": "circle", "layer": "lower", "cx": 236, "cy": 54, "r": 3.511, "mechanic": "solid-circle"}, {"id": "circle-020", "type": "circle", "layer": "lower", "cx": 252, "cy": 31, "r": 3.511, "mechanic": "solid-circle"}, {"id": "circle-021", "type": "circle", "layer": "lower", "cx": 112, "cy": 51, "r": 3.511, "mechanic": "solid-circle"}, {"id": "circle-022", "type": "circle", "layer": "lower", "cx": 126, "cy": 30, "r": 3.511, "mechanic": "solid-circle"}, {"id": "circle-023", "type": "circle", "layer": "lower", "cx": 88, "cy": 336, "r": 5.831, "mechanic": "solid-circle"}, {"id": "circle-024", "type": "circle", "layer": "lower", "cx": 108, "cy": 393, "r": 5.831, "mechanic": "solid-circle"}, {"id": "circle-025", "type": "circle", "layer": "lower", "cx": 233, "cy": 393, "r": 5.831, "mechanic": "solid-circle"}, {"id": "circle-026", "type": "circle", "layer": "lower", "cx": 254, "cy": 335, "r": 5.831, "mechanic": "solid-circle"}, {"id": "circle-027", "type": "circle", "layer": "lower", "cx": 117, "cy": 165, "r": 5.657, "mechanic": "solid-circle"}, {"id": "centerPost-001", "type": "centerPost", "layer": "lower", "x": 170, "y": 468, "angle": 0, "triggerRollovers": ["rollover-002", "rollover-001"]}, {"id": "circle-028", "type": "circle", "layer": "lower", "cx": 275, "cy": 74, "r": 3, "mechanic": "solid-circle"}, {"id": "blockhole-001", "type": "blockhole", "layer": "lower", "x": 170, "y": 310, "angle": 0, "attractionRadius": 70, "attack": "lv3"}, {"id": "line-060", "type": "line", "layer": "lower", "mechanic": "rescue-kicker", "side": "left", "aim": [51, 417], "direction": [0, -1], "speed": 600, "x1": 38.5, "y1": 455, "x2": 63.5, "y2": 455}, {"id": "oneway-007", "type": "oneway", "layer": "lower", "mechanic": "rescue-return", "side": "left", "x1": 46, "y1": 427, "x2": 62.5, "y2": 438.5, "direction": -1}, {"id": "oneway-008", "type": "oneway", "layer": "lower", "mechanic": "rescue-return", "side": "right", "x1": 280, "y1": 436, "x2": 296, "y2": 425, "direction": -1}, {"id": "line-061", "type": "line", "layer": "lower", "mechanic": "rescue-kicker", "side": "right", "aim": [288, 418], "direction": [0, -1], "speed": 600, "x1": 275.5, "y1": 456, "x2": 300.5, "y2": 456}, {"id": "sensor-001", "type": "sensor", "layer": "upper", "x1": 322, "y1": 208, "x2": 322, "y2": 191, "attack": "lv2"}, {"id": "sensor-002", "type": "sensor", "layer": "upper", "x1": 40, "y1": 213, "x2": 40, "y2": 197, "attack": "lv2"}, {"id": "sensor-003", "type": "sensor", "layer": "upper", "x1": 319, "y1": 76, "x2": 298, "y2": 70}, {"id": "thickline-001", "type": "thickline", "x1": 275, "y1": 440, "x2": 280, "y2": 460, "thickness": 5, "layer": "lower"}, {"id": "thickline-002", "type": "thickline", "layer": "lower", "x1": 105, "y1": 465, "x2": 65, "y2": 440, "thickness": 5}, {"id": "thickline-003", "type": "thickline", "layer": "lower", "x1": 65, "y1": 460, "x2": 65, "y2": 440, "thickness": 5}, {"id": "thickline-004", "type": "thickline", "layer": "lower", "x1": 275, "y1": 440, "x2": 235, "y2": 465, "thickness": 5}, {"id": "arc-047", "type": "arc", "mechanic": "guided-rail", "trackWidth": 18, "showAboveArt": true, "layer": "upper", "x1": 177, "y1": 15, "qx": 192, "qy": 200, "x2": 39, "y2": 205}, {"id": "arc-048", "type": "arc", "mechanic": "guided-rail", "trackWidth": 18, "showAboveArt": true, "layer": "upper", "x1": 225, "y1": 15, "qx": 196, "qy": 212, "x2": 322, "y2": 199}, {"id": "arc-049", "type": "arc", "mechanic": "guided-rail", "trackWidth": 18, "showAboveArt": true, "layer": "upper", "x1": 331, "y1": 210, "qx": 333, "qy": 256, "x2": 280, "y2": 275}, {"id": "arc-050", "type": "arc", "mechanic": "guided-rail", "trackWidth": 18, "showAboveArt": true, "layer": "upper", "x1": 31, "y1": 214, "qx": 28, "qy": 264, "x2": 64, "y2": 283}, {"id": "arc-051", "type": "arc", "mechanic": "guided-rail", "trackWidth": 18, "showAboveArt": true, "layer": "upper", "x1": 64, "y1": 283, "qx": 98, "qy": 297, "x2": 111, "y2": 340}, {"id": "arc-052", "type": "arc", "mechanic": "guided-rail", "trackWidth": 18, "showAboveArt": true, "layer": "upper", "x1": 279, "y1": 275, "qx": 243, "qy": 297, "x2": 231, "y2": 335}, {"id": "targets-002", "type": "targets", "layer": "lower", "x": 186, "y": 147, "angle": 28.062, "targetGroup": {"id": "targetGroup-002", "members": ["targets-002"], "action": "boss", "repeatExtraBall": true}, "spacing": 16.422}, {"id": "targets-003", "type": "targets", "layer": "lower", "x": 122, "y": 79, "angle": 269.605, "targetGroup": {"id": "targetGroup-003", "members": ["targets-003"], "action": "upgrade", "bumpers": ["circle-001", "circle-002", "circle-003"], "repeatExtraBall": true}, "spacing": 17.506}, {"id": "targets-004", "type": "targets", "layer": "lower", "x": 120, "y": 196, "angle": -77.508, "targetGroup": {"id": "targetGroup-004", "members": ["targets-004"], "action": "unblock", "blockers": ["arc-046", "arc-045"], "resetSensors": ["sensor-003"]}, "spacing": 18.2}, {"id": "oneway-009", "type": "oneway", "layer": "upper", "x1": 297, "y1": 75, "x2": 318, "y2": 81, "direction": 1, "mechanic": "layer-transition", "fromLayer": "upper", "toLayer": "lower", "bidirectional": false}, {"id": "rollover-001", "type": "rollover", "layer": "lower", "x1": 81, "y1": 375, "x2": 65, "y2": 375}, {"id": "rollover-002", "type": "rollover", "layer": "lower", "x1": 259, "y1": 374, "x2": 275, "y2": 374, "rolloverGroup": {"id": "rolloverGroup-001", "members": ["rollover-002", "rollover-001"], "attack": "none", "attackCount": 1}}, {"id": "line-062", "type": "line", "mechanic": "guided-rail", "trackWidth": 18, "layer": "upper", "x1": 139, "y1": 1, "x2": 167, "y2": 1}, {"id": "line-063", "type": "line", "mechanic": "guided-rail", "trackWidth": 18, "layer": "upper", "x1": 189, "y1": 4, "x2": 216, "y2": 4}, {"id": "line-064", "type": "line", "mechanic": "guided-rail", "trackWidth": 18, "layer": "upper", "x1": 236, "y1": 4, "x2": 278, "y2": 3}, {"id": "arc-053", "type": "arc", "mechanic": "guided-rail", "trackWidth": 18, "showAboveArt": true, "visualOnly": true, "layer": "upper", "x1": 39, "y1": 205, "qx": 32, "qy": 207, "x2": 31, "y2": 213}, {"id": "arc-054", "type": "arc", "mechanic": "guided-rail", "trackWidth": 18, "showAboveArt": true, "visualOnly": true, "layer": "upper", "x1": 322, "y1": 199, "qx": 331, "qy": 201, "x2": 331, "y2": 211}, {"id": "sensor-004", "type": "sensor", "layer": "upper", "x1": 168, "y1": 16, "x2": 185, "y2": 16}, {"id": "sensor-005", "type": "sensor", "layer": "upper", "x1": 216, "y1": 15, "x2": 233, "y2": 15}, {"id": "line-065", "type": "line", "layer": "lower", "x1": 123, "y1": 122, "x2": 110.922, "y2": 100.785}, {"id": "thickline-005", "type": "thickline", "layer": "lower", "x1": 273, "y1": 128, "x2": 266, "y2": 151, "thickness": 5}], "lockedLayout": [], "upperLayout": [], "topLayout": [], "templates": {"hole": {"label": "Hole", "width": 12, "height": 12, "source": "現有 capture 半徑 5.5。", "markup": "<circle r=\"5.5\" fill=\"#08121d\"/><circle r=\"3.4\" stroke-dasharray=\"1 1\"/>"}, "flag": {"label": "旗幟線", "width": 14, "height": 2, "source": "固定長度 14；可拖曳旋轉控制點或輸入角度。穿越感應線，不阻擋球。", "markup": "<line x1=\"-7\" y1=\"0\" x2=\"7\" y2=\"0\" fill=\"none\" stroke=\"#e6a5ea\" stroke-width=\"1.8\" stroke-linecap=\"round\"/>"}, "plunger": {"label": "發球區", "width": 20, "height": 8, "source": "固定大小；上緣中心為推球點，發球方向向上。", "markup": "<rect x=\"-10\" y=\"-4\" width=\"20\" height=\"8\" fill=\"#b78a43\"/><path d=\"M0 3V-3M-2 -1L0 -3L2 -1\" fill=\"none\"/>"}, "flipper": {"label": "Flipper", "width": 50.72938359896286, "height": 14.061202228069305, "source": "現有 space-355 軸距與頭尾半徑。", "markup": "<path d=\"M-18.33409068544678 -6.530601114034653 L20.805223887761155 -4.059467911720276 A4.059467911720276 4.059467911720276 0 0 1 20.805223887761155 4.059467911720276 L-18.33409068544678 6.530601114034653 A6.530601114034653 6.530601114034653 0 0 1 -18.33409068544678 -6.530601114034653 Z\" fill=\"#355b73\"/><circle cx=\"-18.33409068544678\" cy=\"0\" r=\"1.8\" fill=\"#79cafa\"/>"}, "targets": {"label": "三連 target", "width": 43, "height": 3.000000000000014, "source": "現有 island-target-1～3，保留原尺寸與間距。", "markup": "<polygon points=\"-21.0000,0.6000 -21.0000,-0.6000 -20.9991,-0.6273 -20.9963,-0.6545 -20.9916,-0.6814 -20.9852,-0.7079 -20.9769,-0.7340 -20.9669,-0.7594 -20.9552,-0.7840 -20.9418,-0.8078 -20.9268,-0.8307 -20.9103,-0.8524 -20.8923,-0.8730 -20.8730,-0.8923 -20.8524,-0.9103 -20.8307,-0.9268 -20.8078,-0.9418 -20.7840,-0.9552 -20.7594,-0.9669 -20.7340,-0.9769 -20.7079,-0.9852 -20.6814,-0.9916 -20.6545,-0.9963 -20.6273,-0.9991 -20.6000,-1.0000 -9.4000,-1.0000 -9.3727,-0.9991 -9.3455,-0.9963 -9.3186,-0.9916 -9.2921,-0.9852 -9.2660,-0.9769 -9.2406,-0.9669 -9.2160,-0.9552 -9.1922,-0.9418 -9.1693,-0.9268 -9.1476,-0.9103 -9.1270,-0.8923 -9.1077,-0.8730 -9.0897,-0.8524 -9.0732,-0.8307 -9.0582,-0.8078 -9.0448,-0.7840 -9.0331,-0.7594 -9.0231,-0.7340 -9.0148,-0.7079 -9.0084,-0.6814 -9.0037,-0.6545 -9.0009,-0.6273 -9.0000,-0.6000 -9.0000,0.6000 -9.0009,0.6273 -9.0037,0.6545 -9.0084,0.6814 -9.0148,0.7079 -9.0231,0.7340 -9.0331,0.7594 -9.0448,0.7840 -9.0582,0.8078 -9.0732,0.8307 -9.0897,0.8524 -9.1077,0.8730 -9.1270,0.8923 -9.1476,0.9103 -9.1693,0.9268 -9.1922,0.9418 -9.2160,0.9552 -9.2406,0.9669 -9.2660,0.9769 -9.2921,0.9852 -9.3186,0.9916 -9.3455,0.9963 -9.3727,0.9991 -9.4000,1.0000 -20.6000,1.0000 -20.6273,0.9991 -20.6545,0.9963 -20.6814,0.9916 -20.7079,0.9852 -20.7340,0.9769 -20.7594,0.9669 -20.7840,0.9552 -20.8078,0.9418 -20.8307,0.9268 -20.8524,0.9103 -20.8730,0.8923 -20.8923,0.8730 -20.9103,0.8524 -20.9268,0.8307 -20.9418,0.8078 -20.9552,0.7840 -20.9669,0.7594 -20.9769,0.7340 -20.9852,0.7079 -20.9916,0.6814 -20.9963,0.6545 -20.9991,0.6273 -21.0000,0.6000\" fill=\"#3e6373\"/><polygon points=\"-6.0000,0.6000 -6.0000,-0.6000 -5.9991,-0.6273 -5.9963,-0.6545 -5.9916,-0.6814 -5.9852,-0.7079 -5.9769,-0.7340 -5.9669,-0.7594 -5.9552,-0.7840 -5.9418,-0.8078 -5.9268,-0.8307 -5.9103,-0.8524 -5.8923,-0.8730 -5.8730,-0.8923 -5.8524,-0.9103 -5.8307,-0.9268 -5.8078,-0.9418 -5.7840,-0.9552 -5.7594,-0.9669 -5.7340,-0.9769 -5.7079,-0.9852 -5.6814,-0.9916 -5.6545,-0.9963 -5.6273,-0.9991 -5.6000,-1.0000 5.6000,-1.0000 5.6273,-0.9991 5.6545,-0.9963 5.6814,-0.9916 5.7079,-0.9852 5.7340,-0.9769 5.7594,-0.9669 5.7840,-0.9552 5.8078,-0.9418 5.8307,-0.9268 5.8524,-0.9103 5.8730,-0.8923 5.8923,-0.8730 5.9103,-0.8524 5.9268,-0.8307 5.9418,-0.8078 5.9552,-0.7840 5.9669,-0.7594 5.9769,-0.7340 5.9852,-0.7079 5.9916,-0.6814 5.9963,-0.6545 5.9991,-0.6273 6.0000,-0.6000 6.0000,0.6000 5.9991,0.6273 5.9963,0.6545 5.9916,0.6814 5.9852,0.7079 5.9769,0.7340 5.9669,0.7594 5.9552,0.7840 5.9418,0.8078 5.9268,0.8307 5.9103,0.8524 5.8923,0.8730 5.8730,0.8923 5.8524,0.9103 5.8307,0.9268 5.8078,0.9418 5.7840,0.9552 5.7594,0.9669 5.7340,0.9769 5.7079,0.9852 5.6814,0.9916 5.6545,0.9963 5.6273,0.9991 5.6000,1.0000 -5.6000,1.0000 -5.6273,0.9991 -5.6545,0.9963 -5.6814,0.9916 -5.7079,0.9852 -5.7340,0.9769 -5.7594,0.9669 -5.7840,0.9552 -5.8078,0.9418 -5.8307,0.9268 -5.8524,0.9103 -5.8730,0.8923 -5.8923,0.8730 -5.9103,0.8524 -5.9268,0.8307 -5.9418,0.8078 -5.9552,0.7840 -5.9669,0.7594 -5.9769,0.7340 -5.9852,0.7079 -5.9916,0.6814 -5.9963,0.6545 -5.9991,0.6273 -6.0000,0.6000\" fill=\"#3e6373\"/><polygon points=\"9.0000,0.6000 9.0000,-0.6000 9.0009,-0.6273 9.0037,-0.6545 9.0084,-0.6814 9.0148,-0.7079 9.0231,-0.7340 9.0331,-0.7594 9.0448,-0.7840 9.0582,-0.8078 9.0732,-0.8307 9.0897,-0.8524 9.1077,-0.8730 9.1270,-0.8923 9.1476,-0.9103 9.1693,-0.9268 9.1922,-0.9418 9.2160,-0.9552 9.2406,-0.9669 9.2660,-0.9769 9.2921,-0.9852 9.3186,-0.9916 9.3455,-0.9963 9.3727,-0.9991 9.4000,-1.0000 20.6000,-1.0000 20.6273,-0.9991 20.6545,-0.9963 20.6814,-0.9916 20.7079,-0.9852 20.7340,-0.9769 20.7594,-0.9669 20.7840,-0.9552 20.8078,-0.9418 20.8307,-0.9268 20.8524,-0.9103 20.8730,-0.8923 20.8923,-0.8730 20.9103,-0.8524 20.9268,-0.8307 20.9418,-0.8078 20.9552,-0.7840 20.9669,-0.7594 20.9769,-0.7340 20.9852,-0.7079 20.9916,-0.6814 20.9963,-0.6545 20.9991,-0.6273 21.0000,-0.6000 21.0000,0.6000 20.9991,0.6273 20.9963,0.6545 20.9916,0.6814 20.9852,0.7079 20.9769,0.7340 20.9669,0.7594 20.9552,0.7840 20.9418,0.8078 20.9268,0.8307 20.9103,0.8524 20.8923,0.8730 20.8730,0.8923 20.8524,0.9103 20.8307,0.9268 20.8078,0.9418 20.7840,0.9552 20.7594,0.9669 20.7340,0.9769 20.7079,0.9852 20.6814,0.9916 20.6545,0.9963 20.6273,0.9991 20.6000,1.0000 9.4000,1.0000 9.3727,0.9991 9.3455,0.9963 9.3186,0.9916 9.2921,0.9852 9.2660,0.9769 9.2406,0.9669 9.2160,0.9552 9.1922,0.9418 9.1693,0.9268 9.1476,0.9103 9.1270,0.8923 9.1077,0.8730 9.0897,0.8524 9.0732,0.8307 9.0582,0.8078 9.0448,0.7840 9.0331,0.7594 9.0231,0.7340 9.0148,0.7079 9.0084,0.6814 9.0037,0.6545 9.0009,0.6273 9.0000,0.6000\" fill=\"#3e6373\"/>"}, "centerPost": {"label": "Center post", "width": 10, "height": 10, "source": "可調半徑的升降救球柱；指定 Rollover 線集滿後升起，依設定碰撞次數收回。", "markup": "<circle r=\"5\" fill=\"#263945\"/><circle r=\"3.3\" fill=\"none\"/><path d=\"M-2 0H2M0 -2V2\"/>"}, "blockhole": {"label": "Blockhole（水渦中心）", "width": 12, "height": 12, "source": "水渦專用捕球中心，不走一般 Hole 的進洞流程。", "markup": "<circle r=\"5.5\" fill=\"#08121d\"/><path d=\"M-4 0a4 4 0 1 1 4 4a2.5 2.5 0 1 1 2.5-2.5a1 1 0 1 1-1-1\" fill=\"none\"/>"}}};
const PirateTutorial={
 start({game,theater,canvas,G,P,artLayers,view,soundBank,controls,clearTouchControls,launch,notice,onFinish,lesson=null}){
 const replay=new URLSearchParams(location.search).get('tutorial')==='1';
 const tutorialMode=replay&&!lesson;
 const $=id=>document.getElementById(id);
 let guide=null;
 if(replay)game.paused=true;
 clearTouchControls();
 const overlay=document.createElement('div');overlay.id='tableTutorial';overlay.style.pointerEvents='none';
 overlay.innerHTML='<svg id="tutorialSpotlight" aria-hidden="true"></svg><section id="tutorialPanel"><h2 id="tutorialTitle"></h2><p id="tutorialText"></p><p id="tutorialHint" hidden>點擊進入下一步</p></section>';
 document.body.append(overlay);
 let step=0,waiting=false,pointer=null,heldKey=null,heartOnly=false,narrationReady=replay,demo=null,demoElapsed=0;
 function bounds(o,padding=12){if(!o)return null;const points=o.points||[o.center],xs=points.map(p=>p[0]),ys=points.map(p=>p[1]);return [Math.min(...xs)-padding,Math.min(...ys)-padding,Math.max(...xs)-Math.min(...xs)+padding*2,Math.max(...ys)-Math.min(...ys)+padding*2];}
 function flipper(side){const f=game.flippers.find(f=>f.side===side)||game.flippers[side==='left'?0:1];return bounds({points:[f.pivot,P.add(f.pivot,[Math.cos(f.rest)*f.length,Math.sin(f.rest)*f.length])]});}
 function artBounds(a){return [a.x-a.width/2-5,a.y-a.height/2-5,a.width+10,a.height+10];}
 function holes(attack){const level={ball:'lv1',barrel:'lv2'}[attack];return [...G.lower,...G.upper_parts,...(G.top_parts||[])].filter(o=>G.mechanisms.attacks[o.id]===level).map(o=>bounds(o,15));}
 const steps=[
  ['左 flipper','點按螢幕左半邊，揮動左擋板。',()=>[flipper('left')]],
  ['右 flipper','點按螢幕右半邊，揮動右擋板。',()=>[flipper('right')]],
  ['發球道',controls.launchMode==='drag'?'在高亮區域向下拖曳，放開發球。':'按住高亮區域蓄力，放開發球。',()=>{const p=G.plunger;return [[p.left-5,p.rest_y-32,p.right-p.left+10,Math.min(view[1]+view[3],p.base_y+15)-(p.rest_y-32)]];}],
  ['Boss 血量','每顆愛心代表 1 點血量。',()=>[]],
  ['砲彈攻擊 −1','球進入這區，扣除1顆心。',()=>holes('ball')],
  ['炸藥攻擊 −2','球進入這區，扣除2顆心。',()=>holes('barrel')],
  ['三燈攻擊 −3','亮滿三盞燈，扣除3顆心。',()=>artLayers.filter(a=>G.mechanisms.rolloverGroups.some(r=>r.attack==='lv3'&&r.members.includes(a.bind))).map(artBounds)],
  ['章魚攻擊 −4','經過這區五次，扣除4顆心。',()=>artLayers.filter(a=>a.indicator?.trigger?.kind==='count-complete'&&G.mechanisms.attacks[a.indicator.trigger.source]==='lv4').map(artBounds)]
 ];
 if(lesson&&!tutorialMode)steps.splice(4,steps.length-4,...lesson.steps);
 function targets(action){const ids=G.mechanisms.groups.filter(r=>r.action===({enemy:'boss',vortex:'blackHole'}[action]||action)).flatMap(r=>r.targets);return artLayers.filter(a=>ids.includes(a.bind)).map(artBounds);}
 if(tutorialMode)steps.splice(3,5,
  ['Boss 出現條件','命中這些目標，召喚 Boss。',()=>targets('enemy')],
  ['砲彈攻擊 −1','球進入這區，扣除1顆心。',()=>holes('ball')],
  ['炸藥攻擊 −2','球進入這區，扣除2顆心。',()=>holes('barrel')],
  ['三燈攻擊 −3','亮滿三盞燈，扣除3顆心。',()=>artLayers.filter(a=>G.mechanisms.rolloverGroups.some(r=>r.attack==='lv3'&&r.members.includes(a.bind))).map(artBounds)],
  ['章魚攻擊 −4','經過這區五次，扣除4顆心。',()=>artLayers.filter(a=>a.indicator?.trigger?.kind==='count-complete'&&G.mechanisms.attacks[a.indicator.trigger.source]==='lv4').map(artBounds)],
  ['水渦','命中這區，啟動水渦。',()=>demo==='vortex'?artLayers.filter(a=>a.state==='vortex').map(artBounds):targets('vortex')],
  ['Center post','亮滿底下三條魚，升起中央保護柱。',()=>artLayers.filter(a=>a.state==='center-post'||a.state==='rollover'&&/\/fish-3-[345]\.png$/.test(a.src)&&G.mechanisms.posts.some(p=>p.sensors.includes(a.bind))).map(artBounds)]
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

 function rects(){const r=canvas.getBoundingClientRect(),root=overlay.getBoundingClientRect(),scale=r.width/view[2];
  if(step===3&&!tutorialMode){const t=theater.frame.getBoundingClientRect(),b=theater.tutorialBounds;if(!b)return [];return [b.hearts].filter(Boolean).map(q=>({x:t.left-root.left+q.x*t.width-3,y:t.top-root.top+q.y*t.height-3,w:q.w*t.width+6,h:q.h*t.height+6}));}
  const result=steps[step][2]().filter(Boolean).map(([x,y,w,h])=>({x:r.left-root.left+(x-view[0])*scale,y:r.top-root.top+(y-view[1])*scale,w:w*scale,h:h*scale}));
  let merge=true;while(merge){merge=false;for(let i=0;i<result.length&&!merge;i++)for(let j=i+1;j<result.length;j++){const a=result[i],b=result[j];if(a.x<=b.x+b.w&&a.x+a.w>=b.x&&a.y<=b.y+b.h&&a.y+a.h>=b.y){const x=Math.min(a.x,b.x),y=Math.min(a.y,b.y);result[i]={x,y,w:Math.max(a.x+a.w,b.x+b.w)-x,h:Math.max(a.y+a.h,b.y+b.h)-y};result.splice(j,1);merge=true;break;}}}return result;
 }
 function position(){if(waiting)return;const root=overlay.getBoundingClientRect(),rs=rects(),svg=$('tutorialSpotlight');svg.setAttribute('viewBox',`0 0 ${root.width} ${root.height}`);svg.innerHTML=`<defs><mask id="tutorialMask"><rect width="100%" height="100%" fill="white"/>${rs.map(q=>`<rect x="${q.x}" y="${q.y}" width="${q.w}" height="${q.h}" rx="7" fill="black"/>`).join('')}</mask></defs><rect width="100%" height="100%" fill="black" opacity=".75" mask="url(#tutorialMask)"/>`;
  const panel=$('tutorialPanel'),table=canvas.getBoundingClientRect();
  const left=Math.max(0,table.left-root.left),right=Math.min(root.width,table.right-root.left),top=Math.max(0,table.top-root.top),bottom=Math.min(root.height,table.bottom-root.top);
  panel.style.left=(left+right)/2+'px';panel.style.width=Math.max(1,Math.min(310,right-left-24))+'px';
  const h=panel.offsetHeight,minY=rs.length?Math.min(...rs.map(q=>q.y)):0,maxY=rs.length?Math.max(...rs.map(q=>q.y+q.h)):0;
  const preferred=rs.length?(steps[step][3]==='below'?maxY+16:minY-top>=h+24?minY-h-16:maxY+16):(top+bottom-h)/2;
  panel.style.top=Math.max(top+12,Math.min(bottom-h-12,preferred))+'px';
 }
 function render(){overlay.hidden=waiting||tutorialMode&&['enemy','ball','barrel','airdrop','kraken'].includes(demo);overlay.dataset.demo=demo||'';overlay.dataset.step=String(step+1);overlay.dataset.heartOnly=String(heartOnly);$('tutorialTitle').hidden=step>=4;$('tutorialHint').hidden=!!demo||!replay&&step<3;$('tutorialTitle').textContent=step===3&&heartOnly?'Boss 血量':steps[step][0];$('tutorialText').textContent=step===3&&heartOnly?'每顆愛心代表 1 點血量。':steps[step][1];position();}
 function used(control){if(waiting||step>1||control!==['left','right'][step])return;step++;render();}
 function allowed(control){return waiting||step<3&&control===['left','right','launch'][step];}
 function stop(e){e.preventDefault();e.stopImmediatePropagation();}
 function down(e){if(tutorialMode&&demo){stop(e);return;}if(waiting)return;if(replay||step>=3){stop(e);if((step<3||narrationReady)&&pointer===null){pointer={id:e.pointerId,control:'next'};canvas.setPointerCapture(e.pointerId);}return;}const r=overlay.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;const inside=x>=0&&x<=r.width&&y>=0&&y<=r.height;const hit=inside&&(step===0?x<r.width/2:step===1?x>=r.width/2:rects().some(q=>x>=q.x&&x<=q.x+q.w&&y>=q.y&&y<=q.y+q.h));if(pointer!==null||!hit){stop(e);return;}
  stop(e);if(game.paused||game.theaterFrozen||game.enemyIntroPending)return;const control=['left','right','launch'][step];pointer={id:e.pointerId,control};canvas.setPointerCapture(e.pointerId);soundBank.unlock();if(control==='launch'){if(controls.launchMode==='drag'){controls.launchDrag={pointerId:e.pointerId,y:e.clientY};game.launchAiming=true;}else launch(true);}else game.input[control]=true;
 }
 function move(e){if(!pointer||pointer.id!==e.pointerId)return;stop(e);if(controls.launchDrag){game.charge=Math.max(0,Math.min(1,(e.clientY-controls.launchDrag.y)/100));game.chargeElapsed=game.charge;game.ball.p[1]=G.plunger.rest_y-G.ball_radius+G.plunger.stroke*game.charge;}}
 function up(e){if(!pointer||pointer.id!==e.pointerId)return;stop(e);const control=pointer.control;pointer=null;if(control==='next'){if(e.type==='pointerup'){if(tutorialMode&&step>=3){playDemo();}else if(step<steps.length-1){step++;if(step===3&&!tutorialMode){heartOnly=true;narrationReady=false;theater.tutorialBounds=null;theater.send({command:'tutorial-bounds'});}render();}else finish();}return;}if(control==='launch'){if(controls.launchDrag){const charge=game.charge;controls.launchDrag=null;game.launchAiming=false;if(e.type==='pointerup')game.launch(charge);}else if(e.type==='pointerup')launch(false);else clearTouchControls();}else{game.input[control]=false;if(e.type==='pointerup')used(control);}}
 // Require a fresh keypress for each tutorial step.
 function keyboard(e){if(replay){stop(e);return;}if(waiting)return;const k=e.key.toLowerCase(),control=['arrowleft','z'].includes(k)?'left':['arrowright','c'].includes(k)?'right':k===' '?'launch':null;stop(e);if(!allowed(control)||game.paused||game.theaterFrozen)return;if(e.type==='keydown'){if(e.repeat||heldKey)return;heldKey={k,control};if(control==='launch')launch(true);else game.input[control]=true;}else if(heldKey?.k===k){heldKey=null;if(control==='launch')launch(false);else{game.input[control]=false;used(control);}}}
 const listeners=[['pointerdown',down],['pointermove',move],['pointerup',up],['pointercancel',up],['keydown',keyboard],['keyup',keyboard]];for(const [name,fn]of listeners)addEventListener(name,fn,{capture:true});
 const observer=new ResizeObserver(position);observer.observe(canvas);
 guide={allowed,used,demoFrozen:false,onEvent(e){if(tutorialMode){if(demo==='vortex'&&e.type==='release')demoDone();return;}if(e.type==='launch'&&step===2){waiting=true;render();}else if(waiting&&e.type==='rollover'){waiting=false;step=3;heartOnly=true;game.paused=true;clearTouchControls();theater.update(0,game);narrationReady=false;theater.tutorialBounds=null;theater.send({command:'tutorial-bounds'});render();}}};
 if(lesson&&!tutorialMode){let flightTime=0;guide.tick=dt=>{if(!waiting||game.paused||game.theaterFrozen||game.enemyIntroPending)return;flightTime+=dt;if(flightTime>=2)guide.onEvent({type:'rollover'});};}
 function finish(){if(!replay){if(window.AppProgress)window.AppProgress.completeTutorial();else localStorage.setItem(lesson?.storageKey||'pinball-pirate-first-play-tutorial-v1','1');}onFinish();theater.onTutorialBounds=null;theater.onCommandComplete=null;observer.disconnect();for(const [name,fn]of listeners)removeEventListener(name,fn,{capture:true});overlay.remove();canvas.tabIndex=0;canvas.focus();clearTouchControls();if(replay){if(window.AppControls?.exitGame)window.AppControls.exitGame();else location.href=new URL('res/main.html',document.baseURI).href;return;}game.paused=false;theater.update(0,game);}
 function theaterBounds(){if(step!==3||waiting)return;narrationReady=true;render();}
 theater.onTutorialBounds=theaterBounds;
 if(tutorialMode){
  theater.onCommandComplete=e=>{if(demo&&e.id?.split(':')[1]===demo){if(e.type==='complete')demoDone();else{game.paused=true;notice('教學示範載入失敗');}}};
  guide.tick=dt=>{if(!demo)return;game.time+=dt;demoElapsed+=dt;if(demo==='vortex'){if(game.ball.state==='playing')game.sensors(dt);else if(game.ball.state==='captured'&&demoElapsed>=1.5)game.release();}else if(demo==='post'&&game.centerPostRaised&&demoElapsed>=2)demoDone();};
 }



 render();
 return guide;
 }
};

// First-stage onboarding uses Pirate's input/spotlight flow with this table's rules.
const SteampunkTutorial={
 start(options){
  const {G,artLayers}=options;
  const objects=[...G.lower,...G.upper_parts,...(G.top_parts||[])];
  const bounds=o=>{const points=o.points||[o.center],xs=points.map(p=>p[0]),ys=points.map(p=>p[1]);return [Math.min(...xs)-14,Math.min(...ys)-14,Math.max(...xs)-Math.min(...xs)+28,Math.max(...ys)-Math.min(...ys)+28];};
  const attack=level=>()=>objects.filter(o=>G.mechanisms.attacks[o.id]===level).map(bounds);
  const group=action=>()=>{const ids=G.mechanisms.groups.filter(g=>g.action===action).flatMap(g=>g.targets);return objects.filter(o=>ids.includes(o.id)).map(bounds);};
  const artBounds=a=>{const angle=(a.angle||0)*Math.PI/180,w=Math.abs(a.width*Math.cos(angle))+Math.abs(a.height*Math.sin(angle)),h=Math.abs(a.width*Math.sin(angle))+Math.abs(a.height*Math.cos(angle));return [a.x-w/2-5,a.y-h/2-5,w+10,h+10];};
  const unlock=()=>{const ids=G.mechanisms.groups.filter(g=>g.action==='unblock').flatMap(g=>[...g.targets,...g.blockers]);return [...objects.filter(o=>ids.includes(o.id)).map(bounds),...artLayers.filter(a=>/steampunk-unlock-lights-/.test(a.src)).map(artBounds)];};
  const posts=()=>{const ids=G.mechanisms.posts.flatMap(p=>[p.id,...p.sensors]);return objects.filter(o=>ids.includes(o.id)).map(bounds);};
  const bonus=()=>artLayers.filter(a=>a.id===G.gameplay?.steampunkBonus?.artId).map(a=>[a.x-a.width/2,a.y-a.height/2,a.width,a.height]);
  return PirateTutorial.start({...options,lesson:{
   storageKey:'pinball-steampunk-first-play-tutorial-v1',
   steps:[
    ['召喚 Boss','沒有 Boss 時，命中並集滿這組紅白圓靶 Target，就會召喚 Boss。',group('boss')],
    ['機槍攻擊 −1','球進入這個洞，發動 Lv1 機槍攻擊，扣除 1 顆心。',attack('lv1')],
    ['蒸氣塔砲擊 −2','球通過左側或右側中層偵測線，發動 Lv2 砲擊，扣除 2 顆心。',attack('lv2')],
    ['解鎖中層','集滿這組齒輪，依序解除上方左右兩個擋板。兩盞燈代表左右解鎖狀態。',unlock,'below'],
    ['抽獎盤與電磁空雷 −3','命中這組目標啟動抽獎盤。Boss 在場時，球落入抽獎盤中央的洞會發動 Lv3 電磁空雷，扣除 3 顆心。',()=>[...group('blackHole')(),...attack('lv3')()]],
    ['水晶攻擊 −4','球進入中層水晶洞，發動 Lv4 神之罰，扣除 4 顆心。',attack('lv4')],
    ['抽獎盤','沒有 Boss 時，抽獎盤會顯示獎項。球落洞後暫停球桌並抽獎，可獲得分數、倍率、額外球或召喚敵人。',bonus],
    ['中央保護柱','收集左右回球道的兩盞燈，升起中央螺絲保護柱。',posts],
    ['繼續挑戰','Boss 在場時，閃爍箭頭提示攻擊位置。照著指示把球送往目標吧！',()=>artLayers.filter(a=>/steampunk-mission-arrow-/.test(a.src)&&a.indicator?.trigger?.kind==='enemy-active'&&a.indicator?.behavior?.mode==='repeat').map(artBounds)]
   ]
  }});
 }
};

const TableTutorial=SteampunkTutorial;
/* Editor JSON -> physics geometry. Shared by editor previews and built games. */
(function(root){
'use strict';
function compileLayout(layout,base){
 const copy=v=>JSON.parse(JSON.stringify(v)),rad=v=>(v||0)*Math.PI/180,dist=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
 if(layout?.format!=='pinball-layout-editor'||!Array.isArray(layout.objects)||!Array.isArray(layout.lockedLayout))throw Error('不是有效的布局 JSON');
 for(const art of layout.artLayers||[])if(art.state!=='ball-layer'&&(!/^res\/(?:img|hd_img)\/[^/\\?#]+\.(png|webp|jpg|jpeg)$/i.test(art.src||'')||art.src.includes('..')))throw Error('請指定 res/img 中的圖片：'+art.id);
 const g=copy(base),source=copy(base);
 g.layout_preview=true;g.artLayers=copy(layout.artLayers||[]);g.art_layout_objects=copy(layout.objects);g.gameplay=copy(layout.gameplay||{});
 for(const art of g.artLayers)if((art.src||'').endsWith('/plunger-rod.png')&&(art.state||'static')==='static')Object.assign(art,{state:'plunger',bind:'plunger'});
 const wells=layout.objects.filter(o=>o.mechanic==='gravity-well');
 for(const art of g.artLayers)if((art.src||'').endsWith('/pirate-whirlpool.png')&&wells.length){const w=wells.find(w=>w.id===art.bind)||wells.reduce((a,b)=>Math.hypot(a.cx-art.x,a.cy-art.y)<=Math.hypot(b.cx-art.x,b.cy-art.y)?a:b);Object.assign(art,{state:'vortex',bind:w.id})}
 const rules={};for(const rule of g.gameplay.target_rules||[])for(const id of rule.objects)rules[id]=rule.id;
 const center=copy(g.lower.find(o=>o.id==='test-post-center'));
 g.lower=copy(layout.lockedLayout.filter(o=>!['main-perimeter','left-approach-outer-wall','shooter-divider'].includes(o.id)));
 if((layout.version||1)<6&&!g.lower.some(o=>o.id===center.id))g.lower.push(center);
 const topParts=copy(layout.topLayout||[]);
 let destination=g.lower;
 function poly(id,points,kind='wall',closed=false,extra={}){if(closed&&JSON.stringify(points[0])!==JSON.stringify(points.at(-1)))points=[...points,points[0]];const o={id,kind,points,closed,...extra};destination.push(o);return o}
 const transform=(o,[x,y])=>{const a=rad(o.angle);return[o.x+x*Math.cos(a)-y*Math.sin(a),o.y+x*Math.sin(a)+y*Math.cos(a)]};
 const floor=layout.lockedLayout.find(o=>o.id==='shooter-floor'),oldFloor=source.lower.find(o=>o.id==='shooter-floor'),offset=floor?floor.points[0].map((v,i)=>v-oldFloor.points[0][i]):[0,0];g.lower_offset=offset;
 Object.assign(g.plunger,{launch_min:0,charge_seconds:2.5,charge_step_seconds:.025,launch_max:2100});
 for(const k of ['x','left','right'])g.plunger[k]+=offset[0];for(const k of ['rest_y','base_y'])g.plunger[k]+=offset[1];
 const rod=g.artLayers.find(o=>o.state==='plunger'&&!o.hidden);
 if(rod){const a=rad(rod.angle),dx=rod.x+Math.sin(a)*rod.height/2-g.plunger.x;for(const k of ['x','left','right'])g.plunger[k]+=dx;g.plunger.rest_y=rod.y-Math.cos(a)*rod.height/2}
 const launcher=layout.objects.find(o=>o.type==='plunger');if(launcher){const dx=launcher.x-g.plunger.x;for(const k of ['x','left','right'])g.plunger[k]+=dx;g.plunger.rest_y=launcher.y-4}
 g.plunger.enabled=(layout.version||1)<6||!!(launcher||rod||floor);
 const collar=g.artLayers.find(o=>(o.src||'').endsWith('/plunger-collar.png')&&!o.hidden);if(collar)g.plunger.stroke=Math.max(0,collar.y-Math.cos(rad(collar.angle))*collar.height/2-g.plunger.rest_y);
 if((layout.version||1)<6)poly('shooter-divider-lower',[[311,300],[311,448],[316,448],[316,300]]);
 if((layout.version||1)>=6){const upper=copy(layout.upperLayout||[]);g.deck=upper.find(o=>o.kind==='deck')||{points:[]};g.ramp_triangles=upper.filter(o=>o.kind==='ramp-floor').map(o=>o.points);g.upper_parts=upper.filter(o=>!['deck','ramp-floor','portal','drop'].includes(o.kind));g.deck_exit=upper.find(o=>o.kind==='drop')||null;g.portals=g.portals.map(o=>upper.find(u=>u.kind==='portal'&&u.id===o.id)||o)}
 g.guided_tracks=[];g.visual_tracks=[];
 g.editor_transitions=[];
 for(const o of layout.objects){
  const t=o.type,key=o.id;if(t.startsWith('original_'))continue;destination=o.layer==='top'?topParts:o.layer==='upper'?g.upper_parts:g.lower;
  if(['rescue-kicker','rescue-return'].includes(o.mechanic))continue;
  const points=()=>[[o.x1,o.y1],[o.x2,o.y2]],layer=o.layer||'lower';
  if(o.mechanic==='layer-transition'){
   const layers={lower:'lower',upper:'tavern',top:'top'};
   if(t!=='oneway'||!Object.hasOwn(layers,o.fromLayer)||!Object.hasOwn(layers,o.toLayer)||o.fromLayer===o.toLayer||typeof o.bidirectional!=='boolean'||![1,-1].includes(o.direction)||![o.x1,o.y1,o.x2,o.y2].every(Number.isFinite)||dist(...points())<.5)throw Error('跨層入口線設定不合法：'+key);
   const length=dist(...points()),n=[-(o.y2-o.y1)/length*o.direction,(o.x2-o.x1)/length*o.direction];
   g.editor_transitions.push({id:key,points:points(),n,from:layers[o.fromLayer],to:layers[o.toLayer]});
   if(o.bidirectional)g.editor_transitions.push({id:key,points:points(),n:n.map(v=>-v),from:layers[o.toLayer],to:layers[o.fromLayer]});
  }else if(o.mechanic==='active-rebound'){
   if(t!=='line'||![o.x1,o.y1,o.x2,o.y2].every(Number.isFinite)||dist(...points())<.5)throw Error('彈片線尺寸不合法：'+key);
   poly(key,points(),'rebound',false,{mechanic:'active_rebound'});
  }else if(o.mechanic==='guided-rail'){
   if(!['line','arc'].includes(t)||!['x1','y1','x2','y2',...(t==='arc'?['qx','qy']:[])].every(k=>Number.isFinite(o[k]))||dist(...points())<.5||!Number.isFinite(o.trackWidth)||o.trackWidth<14||o.trackWidth>60)throw Error('高架軌道尺寸不合法：'+key);
   const n=t==='arc'?Math.max(8,Math.ceil((Math.hypot(o.qx-o.x1,o.qy-o.y1)+Math.hypot(o.x2-o.qx,o.y2-o.qy))/1.5)):1;
   const ps=t==='arc'?Array.from({length:n+1},(_,i)=>{const u=i/n;return[(1-u)**2*o.x1+2*(1-u)*u*o.qx+u*u*o.x2,(1-u)**2*o.y1+2*(1-u)*u*o.qy+u*u*o.y2]}):points();
   (o.visualOnly?g.visual_tracks:g.guided_tracks).push({id:key,points:ps,width:o.trackWidth,railMaterial:o.railMaterial,layer:layer==='upper'?'tavern':layer,showAboveArt:o.showAboveArt===true});
  }else if(t==='line'&&o.mechanic==='airdrop-rollover')poly(key,points(),'airdrop-rollover',false,{layer,collision:false});
  else if(t==='circle'&&o.mechanic==='gravity-well')destination.push({id:key,kind:'field',mechanic:'gravity-well',center:[o.cx,o.cy],radius:o.r,layer,collision:false});
  else if(t==='circle'&&o.mechanic==='solid-circle'){
   const n=Math.max(32,Math.ceil(2*Math.PI*o.r/2));
   poly(key,Array.from({length:n},(_,i)=>[o.cx+o.r*Math.cos(i*2*Math.PI/n),o.cy+o.r*Math.sin(i*2*Math.PI/n)]),'wall',true,{mechanic:o.mechanic});
  }
  else if(t==='circle'&&o.mechanic==='pachinko-pin')destination.push({id:key,kind:'wall',mechanic:o.mechanic,center:[o.cx,o.cy],radius:2});
  else if(t==='circle')destination.push({id:key,kind:'bumper',center:[o.cx,o.cy],radius:o.r});
  else if(t==='line')poly(key,points(),'rail');
  else if(t==='plunger')continue;
  else if(t==='sensor')poly(key,points(),'sensor',false,{layer,collision:false});
  else if(t==='thickline'){if(o.thickness!==5)throw Error('Invalid thick line: '+key);poly(key,points(),'rail',false,{thickness:5})}
  else if(t==='flipper'){
   const original=source.lower.find(f=>f.id==='space-355'),[ra,rb]=original.radii,length=dist(original.pivot,original.tip),local=-(length+ra+rb)/2+ra,pivot=transform(o,[local,0]),tip=transform(o,[local+length,0]),side=tip[0]>pivot[0]?'left':'right',src=source.lower.find(f=>f.id===(side==='left'?'space-355':'space-363'));
   const rest=Math.atan2(src.tip[1]-src.pivot[1],src.tip[0]-src.pivot[0]),raised=Math.atan2(src.raised[1]-src.pivot[1],src.raised[0]-src.pivot[0]),a=rad(o.angle)+Math.atan2(Math.sin(raised-rest),Math.cos(raised-rest));destination.push({id:key,kind:'flipper',pivot,tip,raised:[pivot[0]+length*Math.cos(a),pivot[1]+length*Math.sin(a)],radii:[ra,rb],control:side,profile:'tapered'});
  }else if(t==='oneway'){const dx=o.x2-o.x1,dy=o.y2-o.y1,length=Math.hypot(dx,dy);if(length<.5||![-1,1].includes(o.direction))throw Error('Invalid one-way line: '+key);poly(key,points(),'rail',false,{pass_normal:[-dy/length*o.direction,dx/length*o.direction]})}
  else if(t==='arc'){const n=Math.max(8,Math.ceil((Math.hypot(o.qx-o.x1,o.qy-o.y1)+Math.hypot(o.x2-o.qx,o.y2-o.qy))/1.5));poly(key,Array.from({length:n+1},(_,i)=>{const t=i/n;return[(1-t)**2*o.x1+2*(1-t)*t*o.qx+t*t*o.x2,(1-t)**2*o.y1+2*(1-t)*t*o.qy+t*t*o.y2]}),'rail')}
  else if(t==='rebound'){const length=layout.templates[t].width-1;poly(key,[transform(o,[-length/2,0]),transform(o,[length/2,0])],'rebound',false,{mechanic:'active_rebound'})}
  else if(t==='targets'||t==='target'){let i=0;for(const m of layout.templates[t].markup.matchAll(/<polygon points="([^"]+)"/g)){const ps=m[1].trim().split(/\s+/).map(p=>transform(o,p.split(',').map(Number)));poly(key+'-'+(++i),ps,'target',true,{target_group:rules[key]||key})}}
  else if(t==='triangleLeft'||t==='triangleRight'){
   const match=layout.templates?.[t]?.markup.match(/<polygon points="([^"]+)"/);
   if(!match)throw Error('三角擋板缺少輪廓：'+key);
   poly(key,match[1].trim().split(/\s+/).map(p=>transform(o,p.split(',').map(Number))),'wall',true);
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
     if(o.center)edges.push({id:o.id,c:o.center,r:o.radius,kind:o.kind});
     else for(let i=1;i<(o.points||[]).length;i++)edges.push({id:o.id,a:o.points[i-1],b:o.points[i],kind:o.kind,n:o.pass_normal,thickness:o.thickness||0,mechanic:o.mechanic,launchOnly:o.collisionMode==='launch-only'});
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
    const time=-from/speed,q=add(p,mul(d,time)),near=nearest(q,...t.points),width=len(sub(...t.points));
    if(len(sub(q,near.p))>.01||near.t*width<this.config.ballRadius||(1-near.t)*width<this.config.ballRadius)continue;
    if(!best||time<best.t)best={t:time,editorPortal:t,n:t.n};
   }
   return best;
  }
  transition(hit){
   if(!hit.editorPortal)return super.transition(hit);
   this.ball.layer=hit.editorPortal.to;this.lastPortal=this.time;
   this.emit('layer',{id:hit.editorPortal.id,to:this.ball.layer});
  }
  visualPlane(ball){return ball.layer==='top'?'top':super.visualPlane(ball);}
  field(){const result=super.field();if(this.ball.layer==='top')this.ball.z=this.config.rampHeight*2;return result;}
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
   return {id:o.id,center:[o.cx,o.cy],radius:o.r,from:layerNames[o.fromLayer],to:layerNames[o.toLayer],bidirectional:o.bidirectional};
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
 // Compile object-owned rules.
 for(const part of parts(g))if(part.kind==='target')delete part.target_group;
 delete g.gameplay.target_rules;
 delete g.gameplay.hole_attacks;
 const groups=objects.filter(o=>o.targetGroup).map(o=>JSON.parse(JSON.stringify(o.targetGroup))),used=new Set();
 for(const r of groups){
  const bank=Array.isArray(r.members)&&r.members.length===1&&objects.some(o=>o.id===r.members[0]&&o.type==='targets');
  if(!Array.isArray(r.members)||(!bank&&(r.members.length!==3||new Set(r.members).size!==3))||r.members.some(id=>!objects.some(o=>o.id===id&&(bank?o.type==='targets':o.type==='target'))||used.has(id)))throw Error('Target 群組需要三顆不重複的單個 target');
  r.members.forEach(id=>used.add(id));
  if(!['upgrade','boss','blackHole','unblock'].includes(r.action))throw Error('請設定 Target 群組事件');
  if(r.action==='upgrade'&&(!Array.isArray(r.bumpers)||r.bumpers.length<1||r.bumpers.length>3||new Set(r.bumpers).size!==r.bumpers.length||r.bumpers.some(id=>!parts(g).some(o=>o.id===id&&o.kind==='bumper'))))throw Error('升級事件需指定 1～3 個 Bumper');
  if(r.action==='blackHole'&&!objects.some(o=>o.id===r.hole&&['hole','blockhole'].includes(o.type)))throw Error('請指定黑洞');
  if(r.action==='unblock'){
   if(!Array.isArray(r.blockers)||r.blockers.length!==2||new Set(r.blockers).size!==2||r.blockers.some(id=>!parts(g).some(p=>p.id===id&&['wall','rail','active','rebound','bumper'].includes(p.kind))))throw Error('依序解除阻擋需指定兩個不同的碰撞物件：'+r.id);
   if(!Array.isArray(r.resetSensors)||!r.resetSensors.length||new Set(r.resetSensors).size!==r.resetSensors.length||r.resetSensors.some(id=>!objects.some(o=>o.id===id&&['sensor','rollover'].includes(o.type))))throw Error('請指定重置用的偵測線或 Rollover：'+r.id);
  }
  r.targets=r.members.flatMap(id=>parts(g).filter(o=>o.kind==='target'&&(o.id===id||o.id.startsWith(id+'-'))).map(o=>o.id));
  if(r.targets.length!==3)throw Error('Target 群組編譯後必須有三顆');
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
  socket.release_mode=o.releaseMode||(o.release_direction?'fixed':'cadet');
  if(o.releaseMode==='fixed'){const a=o.releaseAngle*Math.PI/180;
 socket.release_direction=[Math.cos(a),Math.sin(a)];
 socket.release=socket.mechanic==='vortex-center'?[...socket.center]:o.release_point||socket.center.map((v,i)=>v+14*socket.release_direction[i]);
 }
 }
 for(const o of objects.filter(o=>['hole','blockhole'].includes(o.type)&&o.attractionRadius!==undefined)){
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
 for(const o of objects)if(o.attack!==undefined){if(!['hole','blockhole','rollover','sensor'].includes(o.type)||!['none','lv1','lv2','lv3','lv4'].includes(o.attack))throw Error('攻擊設定不合法：'+o.id);
 attacks[o.id]=o.attack;
 }
 const rolloverGroups=objects.filter(o=>o.rolloverGroup).map(o=>JSON.parse(JSON.stringify(o.rolloverGroup))),rolloverMembers=new Set();
 for(const r of rolloverGroups){if(!Array.isArray(r.members)||r.members.length<2||new Set(r.members).size!==r.members.length||r.members.some(id=>rolloverMembers.has(id)||!objects.some(o=>o.id===id&&o.type==='rollover'))||!['none','lv1','lv2','lv3','lv4'].includes(r.attack))throw Error('Rollover 群組設定不合法：'+r.id);
 r.members.forEach(id=>rolloverMembers.add(id));
 }
 const attackCounts={};
 for(const o of objects.filter(o=>['rollover','sensor'].includes(o.type)))attackCounts[o.id]=o.attackCount??1;
 for(const r of rolloverGroups)attackCounts[r.id]=r.attackCount??1;
 for(const [id,count] of Object.entries(attackCounts))if(!Number.isInteger(count)||count<1||count>99)throw Error('攻擊倒數需為 1～99：'+id);
 g.mechanisms={posts:configs,groups,attacks,rolloverGroups,attackCounts};
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
function draw(o,game,ctx,circle){if(!o)return false;
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
function drawPostCounts(game,ctx,plane){
 for(const post of game.configuredPosts?.values()||[]){
  if(!post.raised||(post.layer==='tavern'?'upper':post.layer)!==plane)continue;
  ctx.save();
  ctx.globalAlpha=1;ctx.setLineDash([]);
  ctx.font='bold '+Math.max(7,Math.min(12,post.radius*1.3))+'px sans-serif';
  ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.lineWidth=1.5;ctx.strokeStyle='#21180e';ctx.fillStyle='#fff5bb';
  ctx.strokeText(String(post.left),...post.center);
  ctx.fillText(String(post.left),...post.center);
  ctx.restore();
 }
}
function status(game){return [...(game.configuredPosts?.values()||[])].map(p=>'Center post '+p.id+'：'+(p.raised?'剩 '+p.left+' 次':p.collected.size+'/'+p.sensors.length)).join(' · ');
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
  // Physics integration: flippers, portals and guided tracks.
  collide(dt){
   const Cadet=typeof module!=='undefined'?require('./game/space-cadet-flipper.js'):root.SpaceCadetFlipper;
   for(const f of this.flippers){
    if(!f.cadet)f.cadet=new Cadet(f,this.config);
    if(f.cadet.configuredWallGuard)continue;
    const find=f.cadet.find.bind(f.cadet);
    f.cadet.find=(p,v,time,remaining)=>{
     const hit=find(p,v,time,remaining);
 if(!hit?.position)return hit;
     const d=P.sub(hit.position,p),r=this.config.ballRadius;
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
 emit(type,data={}){if(type==='configured-attack'){this.attackVisualAt??=new Map();
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
 if(h&&(!best||h.t<best.t))best={t:h.t,editorPortal:{id:e.id,to},circleEntry:true};
 }return best;
 }
 transition(hit){super.transition(hit);
 if(hit.circleEntry)this.ball.circleEntryBlocked=true;
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
 // Rule state.
 resetTargets(){super.resetTargets();
 this.configuredPosts=new Map((this.g.mechanisms?.posts||[]).map(p=>[p.id,{...p,collected:new Set(),raised:false,left:0,contacts:new Set()}]));
 this.configuredGroups=(this.g.mechanisms?.groups||[]).map(r=>({...r,collected:new Set(),last:-Infinity,unlocked:0}));
 for(const r of this.configuredGroups){let group=this.targetGroups.find(g=>g.id===r.id);
 if(!group){group={id:r.id,hits:new Set(),complete:false,completions:0,resetAt:0};
 this.targetGroups.push(group);
 }group.targets=[...r.targets];
 }this.configuredBumpers=new Map();
 this.armedHoles=new Set();
 this.holeExpiresAt=new Map();
 if(this.configuredGroups.some(r=>r.action==='blackHole')){this.vortexActive=false;
 this.vortexActivatedAt=null;
 }this.attackVisualAt=new Map();
 this.attackCompletedAt=new Map();
 this.objectAttackAt=new Map();
 this.attackRemaining=new Map(Object.entries(this.g.mechanisms?.attackCounts||{}));
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
 for(const rule of this.configuredGroups){
  for(const id of rule.targets)this.targetRuleById.set(id,rule);
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

 }
 // Attack counters and grouped rollover completion.
 fireObjectAttack(objectId){
  const group=this.rolloverByMember.get(objectId);
  const id=group?.id||objectId;
  const kind=group?group.attack:this.g.mechanisms?.attacks?.[id];
  if(!kind||kind==='none')return;
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
  this.emit('configured-attack',{kind,id,position:[...this.ball.p]});
 }
 // Hole release, activation and expiry.
 release(){
  const h=this.held,socket=this.socketsById.get(h?.id),releaseStart=[...this.ball.p];
 if(!socket?.release_mode)return super.release();
  // Space Cadet angular and speed variation.
  // https://github.com/k4zmu2a/SpaceCadetPinball/blob/master/SpaceCadetPinball/TBall.cpp
  const spread=socket.mechanic==='vortex-center'?45:5;
  const random=this.random||Math.random,angle=socket.release_mode==='fixed'?0:(1-2*random())*spread*Math.PI/180;
  const d=socket.release_direction||h.direction,c=Math.cos(angle),s=Math.sin(angle),speed=260*this.config.speedScale*(1+(1-2*random())*.1),b=this.ball;
  b.p=[...h.release];
 b.layer=h.layer;
 b.z=0;
 b.v=P.mul(P.unit([d[0]*c-d[1]*s,d[0]*s+d[1]*c]),speed);
  b.state='playing';
 b.immunity=this.time+1.25;
 this.held=null;
 this.limitSpeed();
 this.emit('release',{id:h.id,speed:P.len(b.v)});
 // Local hole ejection traverses the short segment to its exit, including sensors.
 if(!socket.remote_release)this.crossConfiguredSensors(releaseStart,h.layer);
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
 }
 onCapture(id){this.fireObjectAttack(id);
 this.consumeHole(id);
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
 r.last=this.time;
 r.collected.clear();
 for(const id of r.targets){this.targetHits.delete(id);
 this.targetHitAt.delete(id);
 }const display=this.targetDisplayById.get(r.id);
 display.hits.clear();
 display.complete=false;
 display.resetAt=0;
 this.emit('blockers-reset',{id:r.id,objects:[...r.blockers]});
 }}
 edgeEnabled(e,b=this.ball){if(this.isBlockerDisabled(e.id))return false;
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
 afterSubstep(){this.spawnFreeBall();
 for(const p of this.configuredPosts.values())for(const b of p.contacts)if(b.state!=='playing'||b.layer!==p.layer||P.len(P.sub(b.p,p.center))>p.radius+this.config.ballRadius+.3)p.contacts.delete(b);
 }
 afterBallStep(previous,layer,dt){
  if(this.ball.launchGuard&&this.ball.v[1]>=0&&this.ball.p[1]>this.launchGateExitY+this.config.ballRadius)this.ball.launchGuard=false;
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
   if(alongMovement<0||alongMovement>1||alongSensor<0||alongSensor>1)continue;

   if(sensor.kind==='sensor')this.sensorHitAt.set(sensor.id,this.time);
   else{
    crossedRollovers.add(sensor.id);
    this.recordRolloverLight(sensor.id);
    this.emit('rollover',{id:sensor.id,layer});
   }
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
 recordTarget(id){const r=this.targetRuleById.get(id);
 if(!r)return;
  if(r.action==='unblock'&&r.unlocked>=r.blockers.length)return;
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
  if(r.action==='unblock'){const object=r.blockers[r.unlocked++];
 this.emit('blocker-unlocked',{id:r.id,object,count:r.unlocked,total:r.blockers.length});
 }
  if(r.action==='upgrade'){const max=r.bumpers.every(id=>this.bumperLevel(id)>=3);
 for(const id of r.bumpers)this.configuredBumpers.set(id,Math.min(3,this.bumperLevel(id)+1));
 if(max&&r.repeatExtraBall)this.awardExtraLife('bumper-max');
 this.emit('bumper-upgraded',{level:Math.max(...r.bumpers.map(id=>this.bumperLevel(id)))});
 }
  if(r.action==='boss'){if(this.enemyActive){if(r.repeatExtraBall)this.awardExtraLife('boss-target');
 }else{this.enemyActive=true;
 this.emit('enemy-spawn-requested',{group:r.id});
 }}
  if(r.action==='blackHole'){this.activateHole(r.hole);
 this.emit('vortex-activated',{id:r.hole});
 }
  this.emit('target-group-complete',{id:r.id});
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
  const present=new Set(members.map(a=>a.indicator.group));
  const xs=members.map(a=>a.x),ys=members.map(a=>a.y);
  const bandWidth=Math.max(12,...members.map(a=>a.height));
  show=game.configuredAttractVisual={ball:game.ball,start:game.time,groups:[...present].sort((a,b)=>String(a).localeCompare(String(b),undefined,{numeric:true})),
   left:Math.min(...xs),right:Math.max(...xs),top:Math.min(...ys),bottom:Math.max(...ys),bandWidth};
 }
 // Fixed loop: up, down, groups, left-to-right, right-to-left, all on.
 const sweepDuration=3,groupStep=.6,allOnDuration=1.2;
 const verticalDuration=sweepDuration*2,groupDuration=show.groups.length*groupStep;
 const horizontalStart=verticalDuration+groupDuration,horizontalEnd=horizontalStart+sweepDuration*2;
 const elapsed=Math.max(0,game.time-show.start)%(horizontalEnd+allOnDuration);
 if(elapsed>=verticalDuration&&elapsed<horizontalStart)return show.groups[Math.floor((elapsed-verticalDuration)/groupStep)]===group;
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
 const attract=attractLight(g,o);if(attract!==null)return {state:c.type==='bumper'?(attract?'lv3':'lv1'):(attract?'on':'off'),alpha:1,on:false};
 if(c.type==='bumper'){const id=c.trigger?.source||o.bind;let n=g.bumperLevel(id);if((g.bumperHitUntil?.get(id)||0)>g.time)n=n%3+1;return {state:'lv'+n,alpha:1,on:false};}
 let cache=visualStates.get(g);if(!cache||cache.epoch!==g.attackRemaining){cache={epoch:g.attackRemaining,items:new Map()};visualStates.set(g,cache)}
 let v=cache.items.get(o);if(!v){v={active:false,start:null,stamp:undefined,lastOn:false,alpha:0,time:g.time};cache.items.set(o,v)}
 const triggers=[c.trigger||{},...(c.extraTriggers||[])],inputs=triggers.map(t=>signal(o,g,t));
 let completion=null;
 if(c.completion)for(let i=0;i<triggers.length;i++){
  const t=triggers[i],id=t.source;let stamp,rest;
  if(t.kind==='count'){
   const n=g.g.mechanisms.attackCounts[id];stamp=g.attackCompletedAt.get(id);rest=(g.attackRemaining.get(id)??n)===n;
   inputs[i].stamp=undefined;
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
 if(!o.indicator)return (base.artState||basicState)(o,g,renderer);
 const p=presentation(o,g),src=o.indicator[p.state];if(!src)return null;
 renderer.image(src);return {src,baseSrc:src,frame:0,alpha:p.alpha};
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

function startPreview(PIRATE_GEOMETRY){
'use strict';
const tutorialMode=!!TableTutorial&&new URLSearchParams(location.search).get('tutorial')==='1';
const requestedBossStage=Number(new URLSearchParams(location.search).get('bossStage'));
const bossStage=Number.isInteger(requestedBossStage)&&requestedBossStage>=1&&requestedBossStage<=8?requestedBossStage:0;
const G=PIRATE_GEOMETRY,P=PiratePhysics,Game=ConfiguredMechanisms.createGame(EditorLayers.createGame(P),P),game=new (PLAYTEST_THEME==='steampunk'?SteampunkBonus.createGame(Game):Game)(G),canvas=document.getElementById('table'),ctx=canvas.getContext('2d'),$=id=>document.getElementById(id);
game.preserveTableOnDrain=!!bossStage;
game.scoringEnabled=!bossStage;
window.layoutGame=game;
const theater=new LayoutTheater(PLAYTEST_THEME);theater.bossStage=bossStage;theater.tutorialPreview=false;window.layoutTheater=theater;
let firstPlayGuide=null;
let firstPlayGuidePending=!!TableTutorial&&(tutorialMode||bossStage===1&&new URLSearchParams(location.search).get('firstPlayTutorial')==='1'&&!(window.AppProgress?window.AppProgress.tutorialComplete:localStorage.getItem(`pinball-${PLAYTEST_THEME}-first-play-tutorial-v1`)==='1'));
const touchControls=new Map();let launchMode=localStorage.getItem('pinball-launch-mode')||'hold',launchDrag=null;
const artRenderer=new (PLAYTEST_THEME==='steampunk'?SteampunkArt.Renderer:PinballArt.Renderer)("",IndicatorLights.artMap(PirateMap));let artLayers=[],artWarning='';
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
const [topArt,soundArt,settingsArt,backArt]=PinballArt.validate(PlayFrame.createArt());
const topBallImage=artRenderer.image('res/img/top-ball.png');
const topItems=new Set([topArt,soundArt,settingsArt,backArt]);
const artByPlane=new Map(PinballArt.planes.map(plane=>[plane,artLayers.filter(o=>o.plane===plane&&!topItems.has(o))]));
const ballMarkerPlanes=new Set([...artByPlane].filter(([,items])=>items.some(o=>o.state==='ball-layer')).map(([plane])=>plane));
const maskCandidates=[...PinballArt.planes.flatMap(plane=>artByPlane.get(plane)),...PinballArt.planes.flatMap(plane=>[...topItems].filter(o=>o.plane===plane))].filter(o=>!o.hidden&&o.indicator?.screenMask);

let topVisibleInset=null;
function topOffset(){
 if(!topArt)return 0;
 if(topVisibleInset===null){const img=artRenderer.image(topArt.src);if(img.complete&&img.naturalWidth){
  const c=document.createElement('canvas');c.width=topArt.crop[2];c.height=topArt.crop[3];const brush=c.getContext('2d');brush.drawImage(img,...topArt.crop,0,0,c.width,c.height);
  try{const pixels=brush.getImageData(0,0,c.width,c.height).data;let first=0;for(;first<c.height;first++){let found=false;for(let x=0;x<c.width;x++)if(pixels[(first*c.width+x)*4+3]>32){found=true;break;}if(found)break;}topVisibleInset=first/c.height;}catch{topVisibleInset=.3812;}
 }}
 return view[1]+2-(topArt.y-topArt.height/2+topArt.height*(topVisibleInset??.3812));
}
const soundBank=new PinballSound({...PirateMap.sounds,...(PLAYTEST_THEME==='steampunk'?SteampunkSounds:{})});theater.soundBank=soundBank;
for(const event of ['pointerdown','keydown'])addEventListener(event,()=>soundBank.unlock(),{capture:true});
let soundEnabled=localStorage.getItem('pinball-sound')!=='off';
function syncSound(){soundBank.setEnabled(soundEnabled);document.querySelectorAll('audio,video').forEach(a=>a.muted=!soundEnabled);}
syncSound();
const settings=document.createElement('dialog');settings.style.cssText='background:#30251e;color:#fff0cc;border:2px solid #b89051;border-radius:12px;padding:24px';
settings.innerHTML='<h2>設定</h2>'+[['artToggle','美術圖層'],['geometryToggle','布局線'],['upper','顯示中／上層']].map(([id,label])=>`<p><label><input type="checkbox" data-setting="${id}"> ${label}</label></p>`).join('')+'<p><label>發射模式 <select id="launchMode"><option value="hold">按住蓄力</option><option value="drag">向下拖曳</option></select></label></p><button id="testImpactSound">測試碰撞音效</button><button id="closeSettings">關閉</button><button id="mobileRestart">重新開始</button>';
document.body.append(settings);$('launchMode').value=launchMode;$('launchMode').onchange=()=>{clearTouchControls();launchMode=$('launchMode').value;localStorage.setItem('pinball-launch-mode',launchMode);};let settingsWasPaused=false;
settings.onchange=e=>{const id=e.target.dataset.setting;if(id){$(id).checked=e.target.checked;draw();}};
$('closeSettings').onclick=()=>settings.close();$('testImpactSound').onclick=()=>{soundEnabled=true;localStorage.setItem('pinball-sound','on');syncSound();soundBank.unlock();soundBank.setPaused(false);soundBank.play('metal');};$('mobileRestart').onclick=()=>{settings.close();reset();};settings.onclose=()=>{game.paused=settingsWasPaused;};
function openSettings(){if(window.AppControls){window.AppControls.openSettings();return;}if(settings.open)return;clearTouchControls();settingsWasPaused=game.paused;game.paused=true;launchStartedAt=null;game.input.launch=game.input.left=game.input.right=false;settings.querySelectorAll('[data-setting]').forEach(e=>e.checked=$(e.dataset.setting).checked);settings.showModal();}
const leaveDialog=document.createElement('dialog');leaveDialog.id='leaveGameDialog';leaveDialog.style.cssText='background:#30251e;color:#fff0cc;border:2px solid #b89051;border-radius:12px;padding:24px';
leaveDialog.innerHTML='<h2>離開球台？</h2><button id="continueGame">繼續遊玩</button> <button id="leaveGame">離開球台</button>';document.body.append(leaveDialog);
let leaveWasPaused=false;
function requestLeaveGame(){if(leaveDialog.open)return;clearTouchControls();leaveWasPaused=game.paused;game.paused=true;game.input.left=game.input.right=game.input.launch=false;launchStartedAt=null;leaveDialog.showModal();$('continueGame').focus();}
leaveDialog.onclose=()=>{game.paused=leaveWasPaused;};
$('continueGame').onclick=()=>leaveDialog.close();
$('leaveGame').onclick=()=>{leaveDialog.close();if(window.AppControls?.exitGame)window.AppControls.exitGame();else location.href=new URL('../res/main.html',location.href).href;};
function topHit(a,x,y){if(!a||a.hidden||!$('artToggle').checked)return false;const angle=-a.angle*Math.PI/180,dx=x-a.x,dy=y-a.y-(topItems.has(a)?topOffset():0);return Math.abs(dx*Math.cos(angle)-dy*Math.sin(angle))<=a.width/2&&Math.abs(dx*Math.sin(angle)+dy*Math.cos(angle))<=a.height/2;}

function art(plane,layers=artByPlane.get(plane)){if($('artToggle').checked)artRenderer.draw(ctx,layers,plane,game)}
function artWithBalls(plane){
 const layers=artByPlane.get(plane);
 // Right ramp balls are drawn separately, just below the right boundary art.
 const drawBalls=()=>{reboundEffects.draw(ctx,plane);for(const b of game.balls){if(b.layer==='right_upper')continue;const track=b.state==='guided'?game.guidedTracks.find(t=>t.id===b.track.id):null;const visualPlane=track?(track.layer==='tavern'?'upper':track.layer||'lower'):game.visualPlane(b);if(visualPlane===plane)drawBall(b);}};
 if(!ballMarkerPlanes.has(plane))drawBalls();
 let drawn=false;for(const o of layers){if(o.state==='ball-layer'){if(!drawn){drawBalls();drawn=true;}}else if($('artToggle').checked){artRenderer.draw(ctx,[o],plane,game);}}
 GuidedTrackGeometry.drawRails(ctx,trackOverlay,plane);
 ConfiguredMechanisms.drawPostCounts(game,ctx,plane);
}

const reservePreview=Math.max(0,Math.min(99,Number(new URLSearchParams(location.search).get('previewLives'))||0));
const view=[...G.view_box];
function resize(){
 const parent=canvas.parentElement,r=parent.getBoundingClientRect(),style=getComputedStyle(parent);
 const availableW=Math.max(1,r.width-parseFloat(style.paddingLeft)-parseFloat(style.paddingRight)),availableH=Math.max(1,r.height-parseFloat(style.paddingTop)-parseFloat(style.paddingBottom));
 const w=Math.min(availableW,600,availableH*view[2]/view[3]),h=w*view[3]/view[2];
 const pixelWidth=Math.max(1,Math.round(w)),pixelHeight=Math.max(1,Math.round(h));
 if(canvas.width!==pixelWidth)canvas.width=pixelWidth;if(canvas.height!==pixelHeight)canvas.height=pixelHeight;
 canvas.style.width=w+'px';canvas.style.height=h+'px';requestAnimationFrame(()=>draw());
}
new ResizeObserver(resize).observe(canvas.parentElement);resize();
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
  else{ctx.strokeText(reward.ballIcon?'+1 球':reward.text,0,0);ctx.fillText(reward.ballIcon?'+1 球':reward.text,0,0);}
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
 gameOverOverlay=PirateMap.showGameOver(document,game.score,rows,id,()=>{gameOverOverlay=null;if(bossStage)window.dispatchEvent(new CustomEvent('pinball:boss-exit',{detail:{stage:bossStage}}));else reset();},bossStage?'離開球台':'重新開始');
}
game.onEvent=e=>{artRenderer.onEvent?.(e);firstPlayGuide?.onEvent(e);updateScreenDimEvent(e);if(e.type==='new-game')floatingRewards=[];if((e.type==='score'||e.type==='target-bonus')&&e.points>0)showFloatingReward(e.position,'+'+e.points);if(e.type==='extra-life-awarded')showFloatingReward(e.position||game.ball.p,'+1',true);if(e.type==='launch'){ballStartedAt=game.time;ballElapsed=0;soundBank.play('explosion');}if(e.type==='drain'&&ballStartedAt!==null){ballElapsed=game.time-ballStartedAt;ballStartedAt=null;}if(e.type==='new-game'){ballStartedAt=null;ballElapsed=0;}if(e.type==='ball-saved')notice('BALL SAVE · 保球成功，不扣命');if(e.type==='ball-save-ready'){launchStartedAt=null;notice('保球補發：請重新發球');}if(e.type==='sound')soundBank.play(e.name);if(e.type==='release'||e.type==='kickback')soundBank.play('explosion');if(e.type==='new-game'||e.type==='ready')soundBank.stop();theater.onEvent(e);if(e.type==='enemy-spawn-requested'){launchStartedAt=null;game.input.launch=false;game.charge=game.chargeElapsed=0;notice('敵人登場準備');window.dispatchEvent(new CustomEvent('pinball:enemy-spawn',{detail:e}));}if(e.type==='extra-life-awarded')notice((e.source==='multiball'?'Multiball':e.source==='boss-target'?'Boss target':'水渦')+'獎勵：備用球 +1');if(e.type==='vortex-activated')notice('水渦已啟動');if(e.type==='target-bonus')notice('三連完成 · 額外 +150（合計 300）');if(e.type==='bumper-upgraded')notice('Bumper 升至第 '+e.level+' 級');if(e.type==='center-post-up')notice('Center post 已升起');if(e.type==='multiball-awarded')notice('Multiball！獲得額外球');if(e.type==='free-ball-launch')notice('Multiball 額外球已發射');if(e.type==='kickback-lane')notice(e.side==='left'?'左側彈簧已觸發':'右側彈簧已觸發');if(e.type==='capture'){notice('進洞 +250');}if(e.type==='release')notice('出球');if(e.type==='drain')notice('失球');if(e.type==='ready')notice('按住空白鍵發射');if(e.type==='game-over')endGame();if(e.type==='layer')notice(e.to==='top'?'進入上層':e.to!=='lower'?'進入中層':'回到下層');if(e.type==='target-group-complete')notice(game.targetGroups.find(g=>g.id===e.id)?.targets.length===1?'單顆 target 命中':'三連 target 完成');};
theater.game=game;
function startBoss(){
 if(!Number.isInteger(bossStage)||bossStage<1||bossStage>8)return;
 game.enemyActive=true;game.enemyIntroPending=true;
 theater.onEvent({type:'enemy-spawn-requested',eventId:bossStage});
 notice('敵人登場準備');
}
if(bossStage&&(!tutorialMode||PLAYTEST_THEME==='steampunk'))startBoss();
function path(points,fill,stroke,width=1,closed=false){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));if(closed)ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke()}}
function circle(p,r,fill,stroke){ctx.beginPath();ctx.arc(...p,r,0,Math.PI*2);if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=.65;ctx.stroke()}}
function object(o,upper=false){if(ConfiguredMechanisms.draw(o,game,ctx,circle))return;
 if(!o)return;
 if(o.kind==='field'&&o.mechanic==='gravity-well'){
  if(!game.vortexActive){ctx.save();ctx.setLineDash([2,3]);circle(o.center,o.radius,null,'#3c6574');ctx.setLineDash([]);ctx.fillStyle='#78a4b0';ctx.font='5px sans-serif';ctx.textAlign='center';ctx.fillText('水渦未啟動',o.center[0],o.center[1]);ctx.restore();return;}
  ctx.save();ctx.setLineDash([2,2]);circle(o.center,o.radius,'#217a9820','#43899e');ctx.setLineDash([]);
  for(let arm=0;arm<3;arm++){
   const ps=[];for(let i=0;i<=60;i++){const t=i/60,r=o.radius*.85*(1-t),a=t*Math.PI*3+arm*Math.PI*2/3+game.time*.45;ps.push([o.center[0]+Math.cos(a)*r,o.center[1]+Math.sin(a)*r]);}
   path(ps,null,'#4faac077',.8);
  }
  circle(o.center,2,'#a0e8ee');ctx.restore();return;
 }
 if(['flipper','field'].includes(o.kind)||o.id==='gravity-well')return;
 if(o.id==='test-post-center'){circle(o.center,o.radius,game.centerPostRaised?'#ffd477':'#263945',game.centerPostRaised?'#fff1b9':'#667986');return}
 if(o.center){const color=o.kind==='bumper'?['','#75d8f5','#a7ec84','#ffd477'][game.bumperLevel(o.id)]:o.kind==='socket'||o.kind==='drop'?'#17202c':'#b8bec5';circle(o.center,o.radius,color,upper?'#dfa6ff':'#8eccdf');if(o.kind==='bumper'){circle(o.center,o.radius*.6,'#1d657d','#bcefff');ctx.save();ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#fff';ctx.font='bold 5px sans-serif';ctx.fillText(String(game.bumperLevel(o.id)),...o.center);ctx.restore();}if(o.kind==='socket')circle(o.center,o.radius*.55,'#02080e');return}
 if(!o.points)return;
 const lit=game.targetHits.has(o.id);let stroke=upper?'#dfa6ff':'#83bdd0',fill=o.closed&&o.mechanic!=='solid-circle'?'#334956':null,width=.9;
 if(o.kind==='target'){stroke=lit?'#385362':'#a5f1ff';fill=lit?'#20323d':'#467788'}
 if(o.kind==='rebound'||o.kind==='active'){stroke='#ffbe86';width=2}
 if(o.kind==='flag'){stroke='#e6a5ea';width=1.8}
 if(o.thickness){width=o.thickness;ctx.lineCap='round'}
 path(o.points,fill,stroke,width,o.closed);ctx.lineCap='butt';
 if(o.pass_normal){const c=P.mix(o.points[0],o.points[1],.5),n=o.pass_normal,t=[-n[1],n[0]],tip=P.add(c,P.mul(n,8));path([P.add(c,P.mul(n,-5)),tip],null,"#a6e9b0",1);path([P.add(P.add(tip,P.mul(n,-3)),P.mul(t,3)),tip,P.add(P.add(tip,P.mul(n,-3)),P.mul(t,-3))],null,"#a6e9b0",1)}
}
function setText(id,value){if(id==='mechanics'&&game.configuredPosts?.size)value=value+' · '+ConfiguredMechanisms.status(game);if(id==='targetDebugStatus'&&(game.configuredGroups?.length||game.rolloverGroups?.length||Object.keys(game.g.mechanisms?.attacks||{}).length))value=ConfiguredMechanisms.groupStatus(game);const element=$(id),text=String(value);if(element.textContent!==text)element.textContent=text;}
const reboundEffects=createReboundEffects(game,soundBank);
const trackOverlay=GuidedTrackGeometry.outlines([...(G.guided_tracks||[]),...(G.visual_tracks||[])]);const trackLayout=new Map([...trackOverlay].map(([id,t])=>[id,{...t,showAboveArt:true}]));
function draw(){
 updateScreenDim();
 const scale=canvas.width/view[2];ctx.setTransform(scale,0,0,scale,-view[0]*scale,-view[1]*scale);ctx.clearRect(...view);ctx.fillStyle='#13242f';ctx.fillRect(...view);
 theater.customScore=!!topArt&&!topArt.hidden&&$('artToggle').checked;theater.draw(ctx,game,view[1]);
 const backgroundLayers=artLayers.filter(o=>o.plane==='background');
 const rightBoundaryIndex=backgroundLayers.findIndex(o=>o.src.endsWith('/pirate-wall-right.png'));
 const ballIndex=rightBoundaryIndex<0?backgroundLayers.length:rightBoundaryIndex;
 art('background',backgroundLayers.slice(0,ballIndex));
 for(const b of game.balls)if(b.layer==='right_upper')drawBall(b);
 art('background',backgroundLayers.slice(ballIndex));
 artWithBalls('lower');
 artWithBalls('upper');artWithBalls('top');
 art('foreground');
 if($('artToggle').checked){ctx.save();ctx.translate(0,topOffset());for(const plane of PinballArt.planes)artRenderer.draw(ctx,[...topItems],plane,game);ctx.restore();}
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
 for(const island of G.preview_islands)path(island,'#304657',null,1,true);
 G.lower.forEach(o=>object(o));
 for(const k of G.rescue_kickers||[])if((k.layer||'lower')==='lower'||$('upper').checked||game.balls.some(b=>b.layer===k.layer))path(k.points,null,game.rescueState(k.layer||'lower').available[k.side]?'#ffd477':'#667986',1.4);

 for(const f of game.flippers){const tip=P.add(f.pivot,[Math.cos(f.angle)*f.length,Math.sin(f.angle)*f.length]);path(P.taperedOutline(f.pivot,tip,...f.radii),'#ccd5db','#a1b6c4',.4,true);circle(f.pivot,1.5,'#43596a')}
 }
 if($('geometryToggle').checked)for(const gate of game.gates){
  if(gate.mechanic!=='rescue-return'&&!['left-return','right-return'].includes(gate.id))continue;
  if(gate.layer!=='lower'&&!$('upper').checked&&!game.balls.some(b=>b.layer===gate.layer))continue;
  const closed=gate.closed&&!gate.unlocked;ctx.save();ctx.setLineDash(closed?[]:[2,1.5]);
  path(gate.points,null,closed?'#ffbe86':'#78b6b9',closed?2:1);
  circle(gate.points[0],1.5,closed?'#ffbe86':'#78b6b9');ctx.restore();
 }

 if($('geometryToggle').checked&&($('upper').checked||game.balls.some(b=>b.layer!=='lower'))){
  ctx.globalAlpha=game.balls.some(b=>b.layer!=='lower')?.8:.22;path(G.deck.points,'#775e9a','#d0abec',.7,true);if(G.upper_feeder_floor?.length)path(G.upper_feeder_floor,'#775e9a',null,0,true);if(G.upper_route_floor?.length)path(G.upper_route_floor,'#775e9a',null,0,true);G.upper_parts.forEach(o=>object(o,true));(G.top_parts||[]).forEach(o=>object(o,true));object(G.deck_exit,true);ctx.globalAlpha=1;
 }

 const charge=game.charge;if($('geometryToggle').checked&&G.plunger.enabled!==false)path([[G.plunger.x-5,G.plunger.rest_y+7.4+charge*10],[G.plunger.x+5,G.plunger.rest_y+7.4+charge*10]],null,'#f1bb77',2);
 if($('geometryToggle').checked){GuidedTrackGeometry.drawRails(ctx,trackLayout,'lower');if($('upper').checked){GuidedTrackGeometry.drawRails(ctx,trackLayout,'upper');GuidedTrackGeometry.drawRails(ctx,trackLayout,'top');}}
 drawFloatingRewards();
 drawBallOutlines();
 setText('mechanics',`${ConfiguredMechanisms.status(game)} · Multiball 彈簧：左 ${game.rescueState(game.ball.layer).hits.left?'✓':'○'}／右 ${game.rescueState(game.ball.layer).hits.right?'✓':'○'} · 場上 ${game.balls.filter(b=>b.state!=='drained').length} 球 · 獎勵 ${game.multiballAwards} 次`);
 const power=game.ball.state==='ready'?game.charge:game.plungerReleaseCharge;$('launchPower').value=power;setText('launchPercent',`${(power*G.plunger.charge_seconds).toFixed(3)} 秒 · ${(power*100).toFixed(1)}%`);
 setText('targetDebugStatus',ConfiguredMechanisms.groupStatus(game));
 setText('score',bossStage?'DEFEAT BOSS':game.score);setText('ballNumber',game.ballNumber);setText('ballTime',formatBallTime(ballStartedAt===null?ballElapsed:game.time-ballStartedAt));
 if(artWarning)setText('notice',artWarning);else if(theater.curtainClosing)setText('notice','布幕閉合中，請稍候');else if(game.freezeRemaining>0)setText('notice',`敵人登場 · 凍結 ${game.freezeRemaining.toFixed(1)} 秒`);else if(game.paused)setText('notice','已暫停');else if(game.time>noticeUntil&&game.ball.state==='ready')setText('notice','按住空白鍵，再放開發射');
}
function drawBall(b){if(b.state==='drained')return;ctx.save();if(topBallImage.complete&&topBallImage.naturalWidth)ctx.drawImage(topBallImage,b.p[0]-G.ball_radius,b.p[1]-G.ball_radius,G.ball_radius*2,G.ball_radius*2);else{circle(b.p,G.ball_radius,'#e7eff5','#4c6677');circle([b.p[0]-1,b.p[1]-1],.9,'white')}ctx.restore()}
function drawBallOutlines(){
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
function frame(now){const dt=Math.min(.05,(now-previous)/1000);previous=now;firstPlayGuide?.tick?.(dt);if(firstPlayGuidePending&&!game.paused&&!game.enemyIntroPending&&!theater.curtainClosing&&!game.theaterFrozen){firstPlayGuidePending=false;firstPlayGuide=TableTutorial.start({game,theater,canvas,G,P,artLayers,view,soundBank,clearTouchControls,launch,notice,
controls:{get launchMode(){return launchMode},get launchDrag(){return launchDrag},set launchDrag(value){launchDrag=value}},
onFinish(){firstPlayGuide=null;}});}theater.update(leaveDialog.open?0:dt,game);game.bonus?.update(dt);soundBank.setPaused(game.paused&&!settings.open);if(!game.paused&&!game.theaterFrozen&&!game.bonusFrozen&&!firstPlayGuide?.demoFrozen){accumulator+=dt;while(accumulator>=game.config.step){game.step();accumulator-=game.config.step;if(game.theaterFrozen||game.bonusFrozen||game.paused){accumulator=0;break;}}}else accumulator=0;syncLaunchCharge(now);if(!game.paused&&!game.theaterFrozen||screenDimAlpha>0||now-lastDrawAt>=100){draw();lastDrawAt=now;}requestAnimationFrame(frame)}
let launchStartedAt=null;
function syncLaunchCharge(now=performance.now()){
 if(launchDrag)return;
 if(launchStartedAt===null||theater.curtainClosing||game.enemyIntroPending||game.paused||game.freezeRemaining>0||game.ball.state!=='ready')return;
 game.chargeElapsed=Math.max(0,Math.min(G.plunger.charge_seconds,(now-launchStartedAt)/1000));
 game.charge=game.chargePower(game.chargeElapsed);
 game.ball.p[1]=G.plunger.rest_y-G.ball_radius+G.plunger.stroke*game.charge;
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
function applyAppSettings(values){soundEnabled=values.sound;launchMode=values.launchMode; $('launchMode').value=launchMode;syncSound();}
function reset(){gameOverOverlay?.cancel();gameOverOverlay=null;clearTouchControls();launchStartedAt=null;game.reset();accumulator=0;if(bossStage&&(!tutorialMode||PLAYTEST_THEME==='steampunk'))startBoss();else notice('按住空白鍵發射')}
$('settings').onclick=openSettings;$('restart').onclick=reset;$('nudge').onclick=()=>game.nudge();
function setupPhysicsDebug(){
 const panel=$('debugPanel');if(!panel)return;
 const defaults={config:{...game.config},launchMax:G.plunger.launch_max,kickerSpeeds:(G.rescue_kickers||[]).map(k=>k.speed)};
 const groups=[
  ['球與速度',[
   ['ballRadius','球半徑',1,10,.1],['maxSpeed','速度上限',100,1600,10],['launchMax','最大發射推力',0,2400,10],['kickbackSpeed','救球彈簧推力',0,1600,10]
  ]],
  ['重力與阻力',[
   ['gravity','桌面重力',0,600,1],['verticalGravity','斜坡重力',0,1000,1],['rampHeight','斜坡高度',0,60,1],['drag','桌面阻力',0,1,.001],['rampDrag','斜坡阻力',0,1,.001],['wellPull','重力井吸力',0,1000,1],['wellDrag','重力井阻力',0,2,.01]
  ]],
  ['碰撞與 Bumper',[
   ['elasticity','牆面彈性',0,1,.01],['collisionSmoothness','牆面平滑係數',0,1,.01],['roughWallElasticity','粗糙牆面彈性',0,1,.01],['roughWallSmoothness','粗糙牆面平滑係數',0,1,.01],['bumperElasticity','Bumper 彈性',0,1,.01],['bumperSmoothness','Bumper 平滑係數',0,1,.01],['bumperBoost','下層 Bumper 推力',0,500,1],['upperBumperBoost','上層 Bumper 推力',0,500,1],['bumperThreshold','Bumper 觸發門檻',0,100,1],['activeElasticity','主動反彈彈性',0,1,.01],['activeSmoothness','主動反彈平滑係數',0,1,.01],['activeBoost','主動反彈推力',0,500,1],['activeThreshold','主動反彈最低撞擊速度',0,100,1]
  ]],
  ['擋板',[
   ['flipperSeconds','上揮時間（秒）',.02,.2,.001],['flipperReturnSeconds','回落時間（秒）',.02,.2,.001],['flipperElasticity','擋板彈性',0,1,.01],['flipperSmoothness','擋板平滑係數',0,1,.01],['flipperBoostScale','揮擊推力倍率',0,2,.01]
  ]]
 ];
 function setPanel(open){panel.hidden=!open;$('debugToggle')?.setAttribute('aria-expanded',String(open));resize();}
 $('debugToggle').onclick=()=>setPanel(panel.hidden);$('debugClose').onclick=()=>setPanel(false);
 $('probe').checked=false;
 const launcher=G.art_layout_objects?.find(o=>o.type==='plunger');
 $('probeLayer').value=({lower:'lower',upper:'tavern',top:'top'}[launcher?.layer]||'lower');
 $('debugProbe').checked=$('probe').checked;
 $('debugProbe').onchange=()=>{$('probe').checked=$('debugProbe').checked;};
 $('probe').addEventListener('change',()=>{$('debugProbe').checked=$('probe').checked;});
 const controls=new Map();
 function apply(key,value){
  if(key==='launchMax'){G.plunger.launch_max=value;return;}
  const old=game.config[key];game.config[key]=value;
  if(key==='ballRadius'){
   G.ball_radius=value;
   if(G.right_upper_region)G.right_upper_region.exit_margin+=value-old;
   for(const t of game.transitions)if(t.lip_clearance)t.lip_clearance+=value-old;
   if(game.shark)game.sharkRelease=P.add(P.mix(...game.shark.entry,.5),P.mul(game.sharkOut,value*2));
   for(const ball of game.balls)if(ball.state==='ready')ball.p[1]=G.plunger.rest_y-value+G.plunger.stroke*game.charge;
  }
  if(key==='maxSpeed')for(const ball of game.balls){ball.speedLimit=value;const speed=P.len(ball.v);if(speed>value)ball.v=P.mul(ball.v,value/speed);}
 }
 for(const [title,fields]of groups){
  const fieldset=document.createElement('details'),legend=document.createElement('summary');legend.textContent=title;fieldset.append(legend);fieldset.addEventListener('toggle',()=>resize());
  for(const [key,title,min,max,step]of fields){
   const label=document.createElement('label'),text=document.createElement('span'),output=document.createElement('output'),input=document.createElement('input');
   label.className='physics-label';label.htmlFor='physics-'+key;text.textContent=title;output.htmlFor='physics-'+key;label.append(text,output);
   input.type='range';input.id='physics-'+key;input.min=min;input.max=max;input.step=step;
   const display=value=>{input.value=value;output.value=String(Number(Number(value).toFixed(3)));};
   display(key==='launchMax'?G.plunger.launch_max:game.config[key]);
   input.oninput=()=>{const value=Number(input.value);apply(key,value);display(value);draw();};
   fieldset.append(label,input);controls.set(key,{display});
  }
  $('physicsControls').append(fieldset);
 }
 $('physicsReset').onclick=()=>{
  for(const [key,{display}]of controls){const value=key==='launchMax'?defaults.launchMax:defaults.config[key];apply(key,value);display(value);}
  (G.rescue_kickers||[]).forEach((k,i)=>{if(defaults.kickerSpeeds[i]===undefined)delete k.speed;else k.speed=defaults.kickerSpeeds[i];});
  notice('物理參數已還原預設');draw();
 };
}
setupPhysicsDebug();
function debugAction(label,action){
 const button=document.createElement('button');button.textContent=label;
 button.onclick=()=>{action();draw();};$('targetDebugButtons').append(button);
}
for(let level=1;level<=4;level++)debugAction('Lv'+level+' 攻擊',()=>{
 if(!game.enemyActive){notice('請先觸發 Enemy event');return;}
 game.emit('configured-attack',{kind:'lv'+level,id:'debug-lv'+level,position:[...game.ball.p]});notice('除錯：Lv'+level+' 攻擊');
});
debugAction('Center post',()=>{
 for(const post of game.configuredPosts.values())game.raiseCenterPost(post.id);
 notice(game.configuredPosts.size?'除錯：Center post 已升起':'布局沒有 Center post');
});
debugAction('Enemy event',()=>{
 if(game.enemyActive){notice('目前已有敵人');return;}
 game.enemyActive=true;game.emit('enemy-spawn-requested',{group:'debug'});notice('除錯：Enemy event');
});
debugAction('黑洞啟動',()=>{
 const hole=game.configuredGroups.find(r=>r.action==='blackHole')?.hole;
 if(!hole){notice('布局沒有設定黑洞關聯');return;}
 game.activateHole(hole);game.emit('vortex-activated',{id:hole});notice('除錯：黑洞已啟動（15 秒或捕球一次後關閉）');
});
debugAction('Bumper upgrade',()=>{
 const ids=new Set(game.configuredGroups.filter(r=>r.action==='upgrade').flatMap(r=>r.bumpers||[]));
 for(const id of ids){const level=Math.min(3,game.bumperLevel(id)+1);game.configuredBumpers.set(id,level);game.emit('bumper-upgraded',{id,level});}
 notice(ids.size?'除錯：已升級關聯 Bumper（最高 Lv3）':'布局沒有 Bumper 升級關聯');
});
function bind(id,set){const b=$(id);b.onpointerdown=e=>{b.setPointerCapture(e.pointerId);set(true);e.preventDefault()};b.onpointerup=()=>set(false);b.onpointercancel=()=>set(false)}
bind('left',v=>game.input.left=v);bind('right',v=>game.input.right=v);bind('launch',launch);
function key(e,on){if(tutorialMode||leaveDialog.open)return;if(e.target.tagName==='INPUT')return;const k=e.key.toLowerCase();const control=['arrowleft','z'].includes(k)?'left':['arrowright','c'].includes(k)?'right':k===' '?'launch':null;if(firstPlayGuide&&!firstPlayGuide.allowed(control)){e.preventDefault();return;}if(!on&&control&&firstPlayGuide)firstPlayGuide.used(control);if([' ','arrowleft','arrowright','z','c','x','r'].includes(k))e.preventDefault();if(['arrowleft','z'].includes(k))game.input.left=on;if(['arrowright','c'].includes(k))game.input.right=on;if(k===' '&&!e.repeat)launch(on);if(on&&!e.repeat){if(k==='r')reset();if(k==='x')game.nudge()}}
addEventListener('keydown',e=>{if(!gameOverOverlay)key(e,true)});addEventListener('keyup',e=>{if(!gameOverOverlay)key(e,false)});
addEventListener('blur',()=>{clearTouchControls();game.input.left=game.input.right=game.input.launch=false;if(!window.AppControls&&!game.paused)openSettings()});
canvas.onpointerdown=e=>{const r=canvas.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*view[2]+view[0],y=(e.clientY-r.top)/r.height*view[3]+view[1];if(topHit(backArt,x,y)){requestLeaveGame();return;}if(topHit(settingsArt,x,y)){openSettings();return;}if(topHit(soundArt,x,y)){soundEnabled=!soundEnabled;localStorage.setItem('pinball-sound',soundEnabled?'on':'off');syncSound();notice(soundEnabled?'音效開啟':'音效關閉');draw();return;}if(!$('probe').checked){
 if(e.pointerType!=='touch'||game.paused||game.gameOver||y<0)return;
 const control=game.ball.state==='ready'&&x>=G.plunger.left?'launch':x<180?'left':'right';
 const already=[...touchControls.values()].includes(control);touchControls.set(e.pointerId,control);canvas.setPointerCapture(e.pointerId);e.preventDefault();
 if(control==='launch'){if(!already){if(launchMode==='drag'){if(game.ball.state==='ready'&&!game.freezeRemaining&&!game.enemyIntroPending&&!theater.curtainClosing){launchDrag={pointerId:e.pointerId,y:e.clientY};game.launchAiming=true;}}else launch(true);}}else game.input[control]=true;
 return;
}
 const probeLayer=$('probeLayer')?.value||'lower';
 const entrance=probeLayer==='lower'&&game.guidedTracks.filter(t=>Math.hypot(x-t.points[0][0],y-t.points[0][1])<=Math.max(t.width/2,G.ball_radius+2)).sort((a,b)=>Math.hypot(x-a.points[0][0],y-a.points[0][1])-Math.hypot(x-b.points[0][0],y-b.points[0][1]))[0];
 if(entrance){game.setBall(P.sub(entrance.points[0],P.mul(entrance.entry,G.ball_radius+2)),P.mul(entrance.entry,180));notice('已朝導引入口送球');}
 else{game.setBall([x,y],[0,20],probeLayer);notice('已放球：'+({lower:'下層',tavern:'中層',top:'上層'}[probeLayer]));}
};
function clearTouchControls(){touchControls.clear();launchDrag=null;game.launchAiming=false;launchStartedAt=null;game.input.left=game.input.right=game.input.launch=false;game.charge=game.chargeElapsed=0;}
function endTouch(e,cancel=false){const control=touchControls.get(e.pointerId);if(!control)return;touchControls.delete(e.pointerId);if([...touchControls.values()].includes(control))return;if(control==='launch'){if(launchDrag){if(!cancel&&!theater.curtainClosing&&!game.enemyIntroPending)game.launch(game.charge);launchDrag=null;game.launchAiming=false;game.charge=game.chargeElapsed=0;return;}if(cancel){launchStartedAt=null;game.input.launch=false;game.charge=game.chargeElapsed=0;}else launch(false);}else game.input[control]=false;}
canvas.onpointermove=e=>{if(!launchDrag||launchDrag.pointerId!==e.pointerId)return;e.preventDefault();game.charge=Math.max(0,Math.min(1,(e.clientY-launchDrag.y)/100));game.chargeElapsed=game.charge;game.ball.p[1]=G.plunger.rest_y-G.ball_radius+G.plunger.stroke*game.charge;};
canvas.onpointerup=e=>endTouch(e);
canvas.onpointercancel=e=>endTouch(e,true);
canvas.onlostpointercapture=e=>endTouch(e,true);
requestAnimationFrame(frame);
window.viewAPI={hasSettingsControl:true,game,applySettings:applyAppSettings,suspend:suspendGame,resume:resumeGame};

}

const previewTheme=typeof PLAYTEST_THEME==='undefined'?'pirate':PLAYTEST_THEME;
let previewStarted=false;
const previewNotice=document.getElementById('notice');
const editorPreview=new URLSearchParams(location.search).has('editor')&&window.opener;
async function loadPiratePreview(layout){
 if(previewStarted)return;
 previewStarted=true;
 try{
  const geometry=ConfiguredMechanisms.compile(layout,PIRATE_GEOMETRY,compileLayout);
  // Decode referenced art before starting, so missing assets produce a useful error.
  await Promise.all([...new Set(geometry.artLayers.filter(a=>a.state!=='ball-layer').map(a=>a.src))].map(src=>new Promise((resolve,reject)=>{
   const image=new Image();image.onload=resolve;image.onerror=()=>reject(Error('圖片載入失敗：'+src));image.src=src;
  })));
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
 const layoutSource=location.protocol==='file:'&&!window.AppControls?Promise.resolve(PLAYTEST_LAYOUT):fetch(new URL('res/config/'+(previewTheme==='pirate'?'pirate-table-layout':previewTheme+'-play')+'.json',document.baseURI),{cache:'no-store'})
  .then(response=>{if(!response.ok)throw Error('布局載入失敗：'+response.status);return response.json();});
 window.viewReady=layoutSource.then(loadPiratePreview);
 window.viewReady.catch(error=>{previewNotice.textContent='無法試玩：'+error.message;});
}
