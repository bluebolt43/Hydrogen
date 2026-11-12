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

## Selected Touhou arrangements

Original compositions: ZUN / 上海アリス幻樂団. These arrangements are used only in the game's free Touhou content, subject to the [Touhou fan-work guidelines](https://touhou-project.news/guideline/).

| Runtime file | Arrangement | Arranger | Source |
| --- | --- | --- | --- |
| `touhou1/touhou-a4-bgm.m4a` / `.ogg` | 幽雅に咲かせ、墨染の桜 ～ Border of Life (introcut, 2:59) | YouFulca / ユーフルカ | https://youfulca.com/2022/08/10/sumizome-sakura/ |
| `touhou2-b4.ogg` | ラクトガール ～ 少女密室 | YouFulca / ユーフルカ | https://youfulca.com/2022/09/02/locked_girl/ |
| `touhou2-b6.ogg` | 亡き王女の為のセプテット | YouFulca / ユーフルカ | https://youfulca.com/2022/08/10/septet/ |
| `touhou2-b7.mp3` | さとりんステップ | ajapa | https://ajapabgm.s323.xrea.com/index.html |
| `touhou2-b8.mp3` | ハルトマンの妖怪少女 (Ex, track 10) | 生パン | https://namapann.com/music.html |
| `touhou2-menu.ogg` | Bad Apple!! — orchestral arrangement | Project-generated with YuE2 | https://touhou-project.news/guideline/ |

- `さとりんステップ`: original theme `少女さとり ～ 3rd eye`.
- YouFulca terms: https://youfulca.com/kiyaku_jp/ . Editing for productions is permitted; standalone sale or redistribution as material is prohibited. Touhou arrangements are restricted to compliant Touhou fan works.
- ajapa terms: https://ajapabgm.s323.xrea.com/riyoukiyaku.html . No standalone music sales, redistribution as material, or audio hotlinking. Follow the Touhou fan-work guidelines.
- 生パン terms: https://namapann.com/index.html . Use and modification permitted; attribution and prior contact are not mandatory. Follow the Touhou fan-work guidelines.
- Terms reviewed on 2026-11-07. Downloaded candidates not used in the game are not listed as used music.

### Touhou2 menu — Bad Apple!!

- Original composition: ZUN / 上海アリス幻樂団, `Bad Apple!!`.
- Selected arrangement: YuE2 output, `15-seed-comparison`, seed 48 (style includes `Solo violin lead`), 205.72 seconds.
- Generation prompt ID: `61ba519c-f2a4-493e-99ea-93bcca0d6bad`.
- Source FLAC: `../music/bad-apple-redwire-orchestral-20261109/versions/15-seed-comparison/bad-apple-seed-48.flac` (relative to the source repository root).
- Reference transcription: user-supplied RedWire remix recording, transcribed with SheetSage2; only the first 120 bars are retained. No Lizz ending is included.
- Changes after generation: OGG Vorbis encoding only; no trimming, fades, gain adjustment or vocal separation.
- YuE2 model source and terms: https://github.com/multimodal-art-projection/YuE/blob/main/MODEL_LICENSE . Model-weight terms are separate from rights in the original composition and reference arrangement.
- This entry documents provenance and attribution; it does not grant a new license to the original composition or the RedWire arrangement.

## Saga soundtrack — 荒野を抜けて

- Runtime file: `saga-menu.mp3` (Saga theme music).
- Title: 荒野を抜けて / Beyond the wasteland.
- Composer: Keido Honda（ホンダケイドウ）.
- Track source: https://opentracks.com/en/bgm/detail/22037
- Composer: https://opentracks.com/en/creator/detail/136
- License: OpenTracks Audio Source Usage License, https://opentracks.com/en/help/articles/license/
- The composer's profile specifies the site license.
- Input: user-supplied `/home/ken/Downloads/荒野を抜けて.mp3`.
- Changes: original MP3 copied unchanged; no conversion, trimming or gain adjustment. The existing menu music player controls looping and fades.
- Source and license checked on 2026-11-09.

## Project-created Touhou arrangements

- Original compositions: ZUN / 上海アリス幻樂団.
- Arrangement credit displayed in the game: chickeneren43 & Yue2.
- Active reference themes: おてんば恋娘, 風神少女, 信仰は儚き人間の為に, 狂気の瞳 ～ Invisible Full Moon, 月まで届け、不死の煙, ネクロファンタジア, 恋色マスタースパーク, 明治十七年の上海アリス, 人形裁判 ～ 人の形弄びし少女, 月時計 ～ Luna Dial, U.N.オーエンは彼女なのか？, Bad Apple!!.
- Covers Touhou A stages 1–3 and 5–8, generated Touhou B stages 1, 2, 3 and 5, and the generated Bad Apple!! menu arrangement.
- The external YouFulca, ajapa and 生パン recordings retain their own arrangement credits. MIDI/score production provenance is retained in the music workspace rather than the player-facing credits.

### Touhou A4 — YouFulca introcut

- Selected on 2026-11-10: official game-use introcut OGG, 179.42127 seconds (2:59).
- Source: `../music/youfulca/audio/a4-yuyuko-introcut/Touhou_Sumizome-YFintrocut_loop.ogg` (relative to the source repository root).
- Original OGG copied unchanged; SHA-256: `258ee4f08fa0002fd5dc310b547b8f832a950f9a8f29061ffdde89a15b355040`.
- Existing runtime AAC path retained for iPhone compatibility; AAC 128 kbps conversion only, 179.421 seconds; SHA-256: `da22f9bc2fcc1fbd0514be7dd551c35166cbccbe5139b039f9972d86b89c1866`.
- No additional trimming, fades, gain adjustment, vocal separation, or AI generation.
- Replaces the project-generated Youmu/Yuyuko A4 medley for the whole A4 stage. Previous runtime audio is preserved in `../music/boss-candidates/previous-runtime/A4/`.
- Arrangement: YouFulca / ユーフルカ; original composition: ZUN / 上海アリス幻樂団. Source page and YouFulca terms rechecked on 2026-11-10; the existing Touhou fan-work conditions apply.
