-- Adds 30 more exercises to the `exercises` table.
--
-- Rewritten after seeing your actual schema/data (the first version of
-- this file assumed a UUID id with a default, Title-Case muscle groups,
-- and integer rep counts -- none of which match your table). This
-- version matches what's already there:
--   - id: kebab-case text, no default -- set explicitly below
--   - muscle_group: one of legs, chest, calves, back, biceps, shoulders,
--     core, triceps (your existing 8 values -- no new ones introduced,
--     since the picker's filter chips are just the distinct values here)
--   - equipment: barbell, dumbbell, machine, cable, bodyweight (your
--     existing 5 -- no new ones introduced)
--   - default_reps: a text range like '8-12', or '30-60s' for a timed hold
--   - secondary_muscles: text[] tags reusing the same vocabulary, plus
--     "glutes" (used as a secondary-only tag in your existing rows, e.g.
--     back-squat, deadlift, leg-press)
--
-- Checked against your existing 16 ids (back-squat, bench-press,
-- calf-raise, chest-press-machine, deadlift, dumbbell-bicep-curl,
-- lat-pulldown, lateral-raise, leg-curl, leg-extension, leg-press,
-- overhead-press, plank, pull-up, seated-row-machine, tricep-pushdown)
-- -- none of the 30 below repeat those movements.
--
-- NOTE ON CITATIONS: still not linking exercise_citations here -- same
-- reason as before, I don't have read access to your citations table's
-- actual rows, so I can't respons­ibly guess which ones apply.
--
-- HOW TO RUN: paste into the Supabase SQL Editor and run. The
-- `on conflict (id) do nothing` guards make it safe to re-run.

insert into exercises
  (id, name, category, muscle_group, secondary_muscles, equipment, default_sets, default_reps, default_rest_seconds, why)
values
  ('incline-dumbbell-press', 'Incline Dumbbell Press', 'compound', 'chest', ARRAY['shoulders','triceps'], 'dumbbell', 3, '8-12', 90,
    'The incline angle shifts more load onto the upper chest and front delts than a flat press, and independent dumbbells let each side move through a full, natural range of motion.'),
  ('cable-chest-fly', 'Cable Chest Fly', 'isolation', 'chest', ARRAY[]::text[], 'cable', 3, '12-15', 60,
    'Cables keep constant tension on the chest through the full arc of motion, which is hard to achieve with dumbbells since tension drops off at the top of a dumbbell fly.'),
  ('push-up', 'Push-Up', 'compound', 'chest', ARRAY['triceps','shoulders','core'], 'bodyweight', 3, '12-20', 60,
    'A bodyweight horizontal press that also demands core and scapular stability, useful as a no-equipment substitute or high-rep finisher for the same movement pattern as the bench press.'),
  ('decline-barbell-bench-press', 'Decline Barbell Bench Press', 'compound', 'chest', ARRAY['shoulders','triceps'], 'barbell', 3, '6-10', 120,
    'The decline angle shifts more emphasis onto the lower chest fibers than a flat or incline press, rounding out chest development.'),
  ('bent-over-row', 'Bent-Over Barbell Row', 'compound', 'back', ARRAY['biceps','shoulders'], 'barbell', 3, '6-10', 120,
    'A horizontal pulling movement that loads the mid-back heavily and, done with a hip hinge, reinforces the same spinal-bracing pattern used in squats and deadlifts.'),
  ('t-bar-row', 'T-Bar Row', 'compound', 'back', ARRAY['biceps'], 'machine', 3, '8-12', 90,
    'A chest-supported row variation that removes lower-back strain from the movement, letting you focus load on the back and biceps alone.'),
  ('single-arm-dumbbell-row', 'Single-Arm Dumbbell Row', 'compound', 'back', ARRAY['biceps'], 'dumbbell', 3, '8-12', 90,
    'Training one side at a time helps correct strength imbalances that bilateral rows can mask, and the supported stance takes the lower back out of the movement.'),
  ('chin-up', 'Chin-Up', 'compound', 'back', ARRAY['biceps'], 'bodyweight', 3, '6-12', 120,
    'The underhand grip biases the biceps more than a standard pull-up while still training the same vertical pulling pattern for the back.'),
  ('front-squat', 'Front Squat', 'compound', 'legs', ARRAY['core'], 'barbell', 3, '6-10', 150,
    'The front-loaded bar position shifts more emphasis onto the quads and demands a more upright torso, which can be easier on the lower back than a back squat for some lifters.'),
  ('romanian-deadlift', 'Romanian Deadlift', 'compound', 'legs', ARRAY['glutes','back'], 'barbell', 3, '8-12', 120,
    'A hip-hinge movement that keeps the legs nearly straight, putting a stretch-focused load on the hamstrings and glutes that a conventional deadlift or squat doesn''t emphasize as directly.'),
  ('walking-lunge', 'Walking Lunge', 'compound', 'legs', ARRAY['glutes'], 'dumbbell', 3, '10-15', 90,
    'A single-leg movement that trains each side independently, which helps address strength imbalances that bilateral lifts like squats can mask.'),
  ('bulgarian-split-squat', 'Bulgarian Split Squat', 'compound', 'legs', ARRAY['glutes'], 'dumbbell', 3, '8-12', 90,
    'The rear-foot-elevated position increases single-leg demand and range of motion compared to a standard lunge, building unilateral leg strength.'),
  ('hip-thrust', 'Hip Thrust', 'compound', 'legs', ARRAY['glutes'], 'barbell', 3, '8-12', 120,
    'Loads the glutes through their most active range at the top of a hip extension, more directly than squats or deadlifts where the glutes work hardest lower in the range.'),
  ('goblet-squat', 'Goblet Squat', 'compound', 'legs', ARRAY['core'], 'dumbbell', 3, '10-15', 90,
    'Holding the weight at the chest counterbalances the squat, making it easier to learn good depth and posture than a barbell squat.'),
  ('seated-calf-raise', 'Seated Calf Raise', 'isolation', 'calves', ARRAY[]::text[], 'machine', 3, '12-20', 60,
    'The bent-knee position shifts emphasis onto the soleus rather than the gastrocnemius, complementing standing calf raise work.'),
  ('dumbbell-shoulder-press', 'Dumbbell Shoulder Press', 'compound', 'shoulders', ARRAY['triceps'], 'dumbbell', 3, '8-12', 90,
    'Independent dumbbells let each shoulder move through its own natural path, useful as an accessory or substitute for the barbell overhead press.'),
  ('face-pull', 'Face Pull', 'isolation', 'shoulders', ARRAY['back'], 'cable', 3, '15-20', 45,
    'Targets the rear delts and upper back rotators, which get comparatively little direct work from pressing-dominant programs and matter for shoulder joint health.'),
  ('front-raise', 'Dumbbell Front Raise', 'isolation', 'shoulders', ARRAY[]::text[], 'dumbbell', 3, '12-15', 45,
    'Isolates front-delt shoulder flexion, a movement pattern pressing exercises train indirectly but not with the same targeted volume.'),
  ('arnold-press', 'Arnold Press', 'compound', 'shoulders', ARRAY['triceps'], 'dumbbell', 3, '8-12', 90,
    'The rotating path works the shoulder through a wider range than a standard press, adding front and side delt emphasis along the way.'),
  ('barbell-bicep-curl', 'Barbell Bicep Curl', 'isolation', 'biceps', ARRAY[]::text[], 'barbell', 3, '8-12', 60,
    'A straightforward elbow-flexion isolation movement for building biceps size and strength beyond what pulling compounds provide as a side effect.'),
  ('hammer-curl', 'Dumbbell Hammer Curl', 'isolation', 'biceps', ARRAY[]::text[], 'dumbbell', 3, '10-15', 60,
    'The neutral grip shifts some emphasis onto the brachialis and forearms alongside the biceps, complementing a standard curl.'),
  ('preacher-curl', 'Preacher Curl', 'isolation', 'biceps', ARRAY[]::text[], 'machine', 3, '10-15', 60,
    'The supported arm position removes momentum from the curl, isolating the biceps more strictly than a standing curl.'),
  ('close-grip-bench-press', 'Close-Grip Bench Press', 'compound', 'triceps', ARRAY['chest','shoulders'], 'barbell', 3, '6-10', 90,
    'A narrower grip on the bench press shifts more of the load onto the triceps while still training chest and shoulders, letting you press heavier than most isolation triceps work allows.'),
  ('skull-crusher', 'Skull Crusher', 'isolation', 'triceps', ARRAY[]::text[], 'barbell', 3, '8-12', 60,
    'Isolates the triceps through a long stretch-to-contraction range from an overhead-ish position, complementing pushdown-style movements that emphasize a shorter range.'),
  ('overhead-triceps-extension', 'Overhead Triceps Extension', 'isolation', 'triceps', ARRAY[]::text[], 'dumbbell', 3, '10-15', 60,
    'The overhead position stretches the long head of the triceps more than a pushdown, which is trained in a shortened position instead.'),
  ('dip', 'Triceps Dip', 'compound', 'triceps', ARRAY['chest','shoulders'], 'bodyweight', 3, '8-15', 90,
    'A bodyweight pressing movement that loads the triceps, chest, and shoulders together, scaling naturally with added weight or an assist band as needed.'),
  ('hanging-leg-raise', 'Hanging Leg Raise', 'isolation', 'core', ARRAY[]::text[], 'bodyweight', 3, '10-15', 60,
    'Trains the lower abs and hip flexors through active hip flexion under load from a dead hang, a harder progression than a floor-based leg raise.'),
  ('cable-woodchopper', 'Cable Woodchopper', 'isolation', 'core', ARRAY['shoulders'], 'cable', 3, '12-15', 45,
    'Trains rotational core strength through a diagonal chopping pattern, which flexion/extension-only core exercises like planks and crunches don''t address.'),
  ('russian-twist', 'Russian Twist', 'isolation', 'core', ARRAY[]::text[], 'bodyweight', 3, '15-20', 45,
    'A rotational core movement that can be loaded with a plate or medicine ball once bodyweight reps stop being challenging.'),
  ('ab-wheel-rollout', 'Ab Wheel Rollout', 'isolation', 'core', ARRAY['shoulders'], 'bodyweight', 3, '8-12', 60,
    'Trains the core to resist spinal extension under load as the body extends out and back, a harder anti-extension challenge than a plank.')
on conflict (id) do nothing;
