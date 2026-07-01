-- GearPulse v1 catalog seed data
-- Ported 1:1 from src/data/appData.ts and src/data/gearData.ts.
-- Run after 0001_init.sql.

insert into account_types (id, emoji, name, description) values
  ('musician', '🎸', 'Musician', 'For performers and players'),
  ('producer', '🎛️', 'Producer', 'For producers and beat makers'),
  ('engineer', '🎧', 'Audio Engineer', 'For recording/mixing professionals'),
  ('brand', '🏢', 'Brand', 'For music companies'),
  ('creator', '🎬', 'Creator', 'For content creators');

insert into instruments (id, emoji, name) values
  ('keyboard', '🎹', 'Keyboard'),
  ('drums', '🥁', 'Drums'),
  ('guitar', '🎸', 'Guitar'),
  ('vocals', '🎤', 'Vocals'),
  ('strings', '🎻', 'Strings'),
  ('wind', '🎷', 'Wind Instruments'),
  ('synth', '🎛️', 'Synthesizers'),
  ('audio', '🎧', 'Audio Equipment');

insert into spaces (id, emoji, name, description, gradient, image_url) values
  ('keyboard', '🎹', 'Keyboard Space', 'New keyboards, stage setups, performances', 'linear-gradient(135deg,#2563eb,#0891b2)', 'https://images.unsplash.com/photo-1563330232-57114bb0823c?w=800&q=80'),
  ('drum', '🥁', 'Drum Space', 'Drummers, kits, techniques, gear', 'linear-gradient(135deg,#ea580c,#dc2626)', 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=800&q=80'),
  ('guitar', '🎸', 'Guitar Space', 'Guitars, pedals, amps', 'linear-gradient(135deg,#9333ea,#db2777)', 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&q=80'),
  ('studio', '🎧', 'Studio Space', 'Recording equipment and studio builds', 'linear-gradient(135deg,#059669,#0d9488)', 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80'),
  ('synth', '🎛️', 'Synth Space', 'Synthesizers and electronic music', 'linear-gradient(135deg,#7c3aed,#9333ea)', 'https://images.unsplash.com/photo-1563330232-57114bb0823c?w=800&q=80'),
  ('live', '📡', 'Live Sound Space', 'Mixing consoles, speakers, touring', 'linear-gradient(135deg,#ca8a04,#ea580c)', 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80'),
  ('worship', '⛪', 'Worship Space', 'Worship teams and setups', 'linear-gradient(135deg,#4f46e5,#2563eb)', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80'),
  ('production', '💻', 'Music Production Space', 'DAWs, plugins, production', 'linear-gradient(135deg,#db2777,#e11d48)', 'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?w=800&q=80');

insert into brands (id, emoji, name) values
  ('behringer', '🎹', 'Behringer'),
  ('yamaha', '🎼', 'Yamaha'),
  ('roland', '🎹', 'Roland'),
  ('nord', '🔴', 'Nord'),
  ('mackie', '🎚️', 'Mackie'),
  ('sennheiser', '🎧', 'Sennheiser'),
  ('shure', '🎤', 'Shure'),
  ('focusrite', '🔊', 'Focusrite'),
  ('fender', '🎸', 'Fender');

insert into gear_categories (id, emoji, label) values
  ('all', '🎵', 'All'),
  ('keyboards', '🎹', 'Keyboards'),
  ('drums', '🥁', 'Drums'),
  ('guitars', '🎸', 'Guitars'),
  ('microphones', '🎤', 'Microphones'),
  ('mixers', '🎚', 'Mixers'),
  ('headphones', '🎧', 'Headphones'),
  ('synthesizers', '🎛', 'Synthesizers'),
  ('software', '💻', 'Software'),
  ('speakers', '🔊', 'Speakers'),
  ('interfaces', '🔌', 'Interfaces');

insert into gear (id, name, brand, category_id, image_url, description, specs) values
  ('yamaha-ck88', 'Yamaha CK88', 'Yamaha', 'keyboards',
    'https://images.unsplash.com/photo-1563330232-57114bb0823c?w=800&q=80',
    'The Yamaha CK88 is a stage keyboard engineered for the professional working musician. With 88 weighted keys and premium FM and AWM2 tone generation, it delivers expressive, venue-ready sound that holds up night after night.',
    '[{"label":"Keys","value":"88 Weighted GH"},{"label":"Polyphony","value":"128 voices"},{"label":"Sounds","value":"480 Voices"},{"label":"Weight","value":"15.5 kg"},{"label":"Connectivity","value":"USB, MIDI, 1/4\""},{"label":"Released","value":"2023"}]'::jsonb),

  ('focusrite-scarlett-18i20', 'Scarlett 18i20', 'Focusrite', 'interfaces',
    'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80',
    'Studio-quality recording with 18 inputs and 20 outputs. Perfect for professional home studio setups and live recording environments where flexibility is everything.',
    '[{"label":"Inputs","value":"18 (8 mic/line)"},{"label":"Outputs","value":"20"},{"label":"Sample Rate","value":"Up to 192kHz"},{"label":"Bit Depth","value":"24-bit"},{"label":"Connectivity","value":"USB-C, ADAT, S/PDIF"},{"label":"Released","value":"2022"}]'::jsonb),

  ('shure-sm7b', 'SM7B', 'Shure', 'microphones',
    'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&q=80',
    'The Shure SM7B is a legend in broadcast, podcast, and vocal recording. Its smooth, warm midrange and excellent rejection of ambient noise make it the go-to microphone for professional vocals.',
    '[{"label":"Type","value":"Dynamic, Cardioid"},{"label":"Frequency","value":"50Hz – 20kHz"},{"label":"Output","value":"XLR balanced"},{"label":"SPL","value":"180 dB max"},{"label":"Weight","value":"765 g"},{"label":"Released","value":"Classic model"}]'::jsonb),

  ('korg-sv2', 'SV-2S', 'Korg', 'keyboards',
    'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=800&q=80',
    'The Korg SV-2S is a premium stage piano with onboard speaker system. Delivering vintage electric piano tones with professional-grade quality and incredible feel.',
    '[{"label":"Keys","value":"73 or 88 RH3"},{"label":"Sounds","value":"36 Vintage Voices"},{"label":"Effects","value":"Onboard speaker system"},{"label":"Weight","value":"18.4 kg"},{"label":"Connectivity","value":"USB, MIDI, XLR"},{"label":"Released","value":"2020"}]'::jsonb),

  ('roland-rd-2000', 'RD-2000', 'Roland', 'keyboards',
    'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80',
    'Roland''s flagship stage piano combining two premium sound engines for unmatched expressive performance. The definitive workhorse for touring musicians.',
    '[{"label":"Keys","value":"88 PHA-50"},{"label":"Engines","value":"SuperNATURAL + V-Piano"},{"label":"Zones","value":"8 independent"},{"label":"Weight","value":"21.2 kg"},{"label":"Connectivity","value":"USB, MIDI, 1/4\", XLR"},{"label":"Released","value":"2017"}]'::jsonb),

  ('nord-stage-4', 'Stage 4', 'Nord', 'keyboards',
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80',
    'The Nord Stage 4 is the ultimate performance keyboard. Iconic red design, world-class piano, organ, and synth engines make it the choice of top touring musicians worldwide.',
    '[{"label":"Keys","value":"88 Triple Sensor"},{"label":"Piano Memory","value":"2 GB"},{"label":"Layers","value":"4 independent"},{"label":"Weight","value":"18.9 kg"},{"label":"Connectivity","value":"USB, MIDI, 1/4\""},{"label":"Released","value":"2022"}]'::jsonb),

  ('sony-wh1000xm5', 'WH-1000XM5', 'Sony', 'headphones',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    'Industry-leading noise cancellation headphones built for both mixing and everyday use. Exceptional sound clarity across all frequencies with up to 30 hours of battery life.',
    '[{"label":"Type","value":"Over-ear, Closed-back"},{"label":"Driver","value":"30mm"},{"label":"Freq. Response","value":"4Hz – 40kHz"},{"label":"Battery","value":"30 hours"},{"label":"Connectivity","value":"Bluetooth 5.2, 3.5mm"},{"label":"Released","value":"2022"}]'::jsonb),

  ('audio-technica-ath-m50x', 'ATH-M50x', 'Audio-Technica', 'headphones',
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80',
    'The industry-standard studio headphones for mixing, tracking, and critical listening. Accurate, flat frequency response beloved by audio engineers worldwide.',
    '[{"label":"Type","value":"Over-ear, Closed-back"},{"label":"Driver","value":"45mm"},{"label":"Freq. Response","value":"15Hz – 28kHz"},{"label":"Impedance","value":"38 Ohms"},{"label":"Connectivity","value":"3.5mm + 6.3mm adaptor"},{"label":"Released","value":"2014"}]'::jsonb),

  ('moog-grandmother', 'Grandmother', 'Moog', 'synthesizers',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    'The Moog Grandmother is a semi-modular analog synthesizer that requires no patching to play. 32 spring-loaded keys and the legendary Moog ladder filter.',
    '[{"label":"Keys","value":"32 Spring-loaded"},{"label":"Oscillators","value":"2 VCOs + Noise"},{"label":"Filter","value":"Moog Ladder 4-pole"},{"label":"Patchpoints","value":"41"},{"label":"Connectivity","value":"CV/Gate, MIDI, USB"},{"label":"Released","value":"2018"}]'::jsonb),

  ('rode-nt1', 'NT1', 'Røde', 'microphones',
    'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80',
    'The world''s quietest studio condenser microphone. The Røde NT1 delivers incredibly detailed recordings with a warm, open sound and ultra-low self-noise of just 4.5 dB-A.',
    '[{"label":"Type","value":"Condenser, Cardioid"},{"label":"Frequency","value":"20Hz – 20kHz"},{"label":"Self-noise","value":"4.5 dB-A"},{"label":"Max SPL","value":"137 dB"},{"label":"Output","value":"XLR balanced"},{"label":"Released","value":"2021 (5th gen)"}]'::jsonb),

  ('yamaha-hs8', 'HS8', 'Yamaha', 'speakers',
    'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=80',
    'The Yamaha HS8 near-field reference monitor is trusted by mixing engineers worldwide. Its flat, uncolored response reveals every detail in your mix without flattery.',
    '[{"label":"Woofer","value":"8-inch cone"},{"label":"Tweeter","value":"1-inch dome"},{"label":"Amplifier","value":"75W LF + 45W HF"},{"label":"Freq. Response","value":"38Hz – 30kHz"},{"label":"Connectivity","value":"XLR, TRS"},{"label":"Released","value":"2012"}]'::jsonb),

  ('ableton-live-11', 'Live 11 Suite', 'Ableton', 'software',
    'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?w=800&q=80',
    'The industry-leading DAW for electronic music production, live performance, and composition. Live 11 Suite includes all instruments, effects, and the full Max for Live library.',
    '[{"label":"Version","value":"11.x"},{"label":"Instruments","value":"25 included"},{"label":"Effects","value":"70+ audio effects"},{"label":"Samples","value":"70+ GB library"},{"label":"Platform","value":"macOS + Windows"},{"label":"Released","value":"2021"}]'::jsonb),

  ('pearl-masters-maple', 'Masters Maple Complete', 'Pearl', 'drums',
    'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=800&q=80',
    'Pearl''s flagship Masters Maple Complete kit delivers warm, resonant tones with exceptional projection. The choice of professional session drummers and touring artists.',
    '[{"label":"Shell Material","value":"6-ply Maple"},{"label":"Configuration","value":"5-piece"},{"label":"Sizes","value":"22\" kick, 10/12/16 toms"},{"label":"Hardware","value":"830 Series"},{"label":"Finish","value":"Multiple options"},{"label":"Origin","value":"Japan"}]'::jsonb),

  ('gibson-les-paul', 'Les Paul Standard', 'Gibson', 'guitars',
    'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&q=80',
    'The Gibson Les Paul Standard is one of the most iconic electric guitars ever made. Mahogany body, maple top, and Burstbucker Pro humbuckers deliver that unmistakable tone.',
    '[{"label":"Body","value":"Mahogany + Maple top"},{"label":"Neck","value":"Mahogany, Rounded C"},{"label":"Pickups","value":"Burstbucker Pro"},{"label":"Scale Length","value":"24.75\""},{"label":"Tuners","value":"Grover Rotomatic"},{"label":"Origin","value":"Nashville, TN USA"}]'::jsonb);

-- relatedIds from gearData.ts, applied as a self-referential many-to-many.
-- Kept as a separate join table rather than an array column so referential
-- integrity is enforced if a gear row is ever renamed or removed.
create table gear_related (
  gear_id text not null references gear(id) on delete cascade,
  related_gear_id text not null references gear(id) on delete cascade,
  primary key (gear_id, related_gear_id),
  check (gear_id <> related_gear_id)
);
alter table gear_related enable row level security;
create policy "gear_related read" on gear_related for select to authenticated using (true);

insert into gear_related (gear_id, related_gear_id) values
  ('yamaha-ck88', 'korg-sv2'), ('yamaha-ck88', 'roland-rd-2000'), ('yamaha-ck88', 'nord-stage-4'),
  ('focusrite-scarlett-18i20', 'shure-sm7b'), ('focusrite-scarlett-18i20', 'yamaha-hs8'), ('focusrite-scarlett-18i20', 'rode-nt1'),
  ('shure-sm7b', 'focusrite-scarlett-18i20'), ('shure-sm7b', 'rode-nt1'),
  ('korg-sv2', 'yamaha-ck88'), ('korg-sv2', 'roland-rd-2000'),
  ('roland-rd-2000', 'yamaha-ck88'), ('roland-rd-2000', 'korg-sv2'), ('roland-rd-2000', 'nord-stage-4'),
  ('nord-stage-4', 'roland-rd-2000'), ('nord-stage-4', 'yamaha-ck88'),
  ('sony-wh1000xm5', 'audio-technica-ath-m50x'),
  ('audio-technica-ath-m50x', 'sony-wh1000xm5'),
  ('moog-grandmother', 'roland-rd-2000'), ('moog-grandmother', 'korg-sv2'),
  ('rode-nt1', 'shure-sm7b'), ('rode-nt1', 'focusrite-scarlett-18i20'),
  ('yamaha-hs8', 'focusrite-scarlett-18i20'), ('yamaha-hs8', 'shure-sm7b'),
  ('ableton-live-11', 'focusrite-scarlett-18i20'), ('ableton-live-11', 'yamaha-ck88'), ('ableton-live-11', 'moog-grandmother'),
  ('pearl-masters-maple', 'shure-sm7b'),
  ('gibson-les-paul', 'moog-grandmother');
