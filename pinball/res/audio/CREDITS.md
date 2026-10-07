# Scene 1 — recorded sound credits

These are field recordings, not synthesized or AI-generated sounds.

## pirate-seagulls.ogg
- Title: Gull 1
- Author: avphillips
- Recording: Herring gull, Long Island, USA, September 1999.
- Source: https://commons.wikimedia.org/wiki/File:Gull_1.ogg
- Original: https://upload.wikimedia.org/wikipedia/commons/4/43/Gull_1.ogg
- License: Public domain, released by the author via PDSounds.
- Changes: Original file unchanged; the player uses an excerpt with volume fades.

## pirate-waves.ogg
- Title: Oceanwavescrushing
- Author: Luftrum
- Recording: Waves at Kalundborg Fjord, Røsnæs, February 2008.
- Source: https://commons.wikimedia.org/wiki/File:Oceanwavescrushing.ogg
- Original: https://upload.wikimedia.org/wikipedia/commons/f/f1/Oceanwavescrushing.ogg
- License: Creative Commons Attribution 3.0 Unported (CC BY 3.0).
- License link: https://creativecommons.org/licenses/by/3.0/
- Changes: Original file unchanged; the player uses an excerpt with volume fades.

Sources and licenses checked on 2026-09-21.

## Steampunk attack cues
- Files: `steampunk-machine-gun.wav`, `steampunk-electric-charge.wav`, `steampunk-electric-burst.wav`, `steampunk-judgment-beam.wav`, `steampunk-judgment-collapse.wav`.
- Original procedural synthesis created for this project; no external recordings or samples.
- Reproducible source: `tools/build_steampunk_sounds.py`.
- Electric: rising pulsed charge and three consecutive detonations; judgment: sustained low beam and decaying collapse.

## User-supplied Steampunk attack effects
- `steampunk-attack-tesla.ogg`: converted from `tmp/steampunk/雷魔法3.mp3` (air mine).
- `steampunk-attack-judgment.ogg`: converted from `tmp/steampunk/雷魔法4.mp3` (God's Punishment).
- Converted to Ogg Vorbis, preserving duration, sample rate and stereo channels.
- Supplied by the user; original author/license metadata was not provided.
- Judgment uses the supplied OGG. The supplied Tesla OGG is retained but inactive; Tesla uses synthesized electric charge plus three Pirate explosion cues.

- Active judgment cue shortened to the first 2.00 seconds with a 250 ms fade-out; original 3.00-second OGG retained under `tmp/steampunk/雷魔法4.ogg`.
