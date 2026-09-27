-- Adds 30 more exercises to the `exercises` table.
--
-- HOW TO RUN
-- 1. Open your Supabase project -> SQL Editor.
-- 2. Before running, check your existing naming conventions so the new
--    rows match (the exercise picker's filter chips are just the distinct
--    values in these columns, so inconsistent casing/spelling fragments
--    them into near-duplicate chips):
--      select distinct muscle_group from exercises order by 1;
--      select distinct equipment from exercises order by 1;
--      select distinct category from exercises order by 1;
--    If your existing values differ from what's used below (e.g. "legs"
--    instead of "Quadriceps", or lowercase equipment names), find/replace
--    in this file before running it.
-- 3. Paste the INSERT block below and run it.
--
-- NOTE ON CITATIONS: these rows are inserted without exercise_citations
-- links. I didn't have read access to your citations table's actual rows
-- while writing this, so I couldn't safely reference existing citation
-- ids without guessing -- and fabricating a citation link would go
-- against the whole point of this app. Link relevant citations to these
-- exercises afterward (or share the citations table and I'll do it).
--
-- NOTE ON id: assumes the `id` column has a default (e.g. gen_random_uuid())
-- and so is omitted from the column list below. If your table doesn't
-- default it, add `id` to the column list and a uuid generator call to
-- each row's values.

insert into exercises
  (name, category, muscle_group, secondary_muscles, equipment, default_sets, default_reps, default_rest_seconds, why)
values
  ('Barbell Bench Press', 'compound', 'Chest', ARRAY['Triceps','Shoulders'], 'Barbell', 4, 6, 150,
    'A horizontal press that lets you load the chest, shoulders, and triceps heavily under a stable bar path, making it a standard strength benchmark and a reliable driver of upper-body pressing strength.'),
  ('Incline Dumbbell Press', 'compound', 'Chest', ARRAY['Shoulders','Triceps'], 'Dumbbell', 3, 10, 90,
    'The incline angle shifts more load onto the upper chest and front delts than a flat press, and independent dumbbells let each side work through a full, natural range of motion.'),
  ('Cable Chest Fly', 'isolation', 'Chest', ARRAY[]::text[], 'Cable', 3, 12, 60,
    'Cables keep constant tension on the chest through the full arc of motion, which is harder to achieve with dumbbells since tension drops off at the top of a dumbbell fly.'),
  ('Push-Up', 'compound', 'Chest', ARRAY['Triceps','Shoulders','Core'], 'Bodyweight', 3, 15, 60,
    'A bodyweight horizontal press that also demands core and scapular stability, useful as a no-equipment substitute or high-rep finisher for the same movement pattern as the bench press.'),
  ('Barbell Deadlift', 'compound', 'Hamstrings', ARRAY['Glutes','Lower back','Core'], 'Barbell', 3, 5, 180,
    'A hip-hinge lift that trains the entire posterior chain and grip in one movement, and is one of the most reliable ways to build total-body pulling strength.'),
  ('Pull-Up', 'compound', 'Back', ARRAY['Biceps','Shoulders'], 'Bodyweight', 3, 8, 120,
    'A vertical pulling movement against bodyweight resistance that builds lat width and grip/pulling strength, scaling naturally with added weight as you progress.'),
  ('Lat Pulldown', 'compound', 'Back', ARRAY['Biceps'], 'Machine', 3, 10, 90,
    'A machine-based vertical pull that lets you dial in load precisely, useful for building toward a pull-up or for volume once bodyweight pull-ups become too easy or too hard.'),
  ('Bent-Over Barbell Row', 'compound', 'Back', ARRAY['Biceps','Shoulders'], 'Barbell', 4, 8, 120,
    'A horizontal pulling movement that loads the mid-back heavily and, done with a hip hinge, also reinforces the same spinal-bracing pattern used in squats and deadlifts.'),
  ('Seated Cable Row', 'compound', 'Back', ARRAY['Biceps'], 'Cable', 3, 10, 90,
    'Keeps continuous tension on the back through a controlled horizontal pull, and the seated, supported position makes it easier to isolate the back from lower-body momentum.'),
  ('Barbell Back Squat', 'compound', 'Quadriceps', ARRAY['Glutes','Hamstrings','Core'], 'Barbell', 4, 6, 180,
    'A foundational lower-body compound lift that trains the quads, glutes, and core together under load, and is one of the most heavily researched strength exercises.'),
  ('Front Squat', 'compound', 'Quadriceps', ARRAY['Glutes','Core'], 'Barbell', 3, 6, 150,
    'The front-loaded bar position shifts more emphasis onto the quads and demands a more upright torso, which can be easier on the lower back than a back squat for some lifters.'),
  ('Romanian Deadlift', 'compound', 'Hamstrings', ARRAY['Glutes','Lower back'], 'Barbell', 3, 8, 120,
    'A hip-hinge movement that keeps the legs nearly straight, putting a stretch-focused load on the hamstrings and glutes that a conventional deadlift or squat doesn''t emphasize as directly.'),
  ('Leg Press', 'compound', 'Quadriceps', ARRAY['Glutes','Hamstrings'], 'Machine', 3, 10, 90,
    'Lets you load the quads and glutes heavily without the balance and lower-back demands of a free-weight squat, useful for accumulating volume with less fatigue elsewhere.'),
  ('Walking Lunge', 'compound', 'Quadriceps', ARRAY['Glutes','Hamstrings'], 'Dumbbell', 3, 12, 90,
    'A single-leg movement that trains each side independently, which helps address strength imbalances that bilateral lifts like squats can mask.'),
  ('Leg Curl', 'isolation', 'Hamstrings', ARRAY[]::text[], 'Machine', 3, 12, 60,
    'Isolates knee flexion, letting you target the hamstrings directly with a controlled range of motion that''s hard to achieve as precisely with hip-hinge movements alone.'),
  ('Leg Extension', 'isolation', 'Quadriceps', ARRAY[]::text[], 'Machine', 3, 12, 60,
    'Isolates knee extension, letting you fatigue the quads directly without involving the hips or lower back, useful as an accessory to compound leg work.'),
  ('Hip Thrust', 'compound', 'Glutes', ARRAY['Hamstrings'], 'Barbell', 3, 10, 120,
    'Loads the glutes through their most active range at the top of a hip extension, more directly than squats or deadlifts where the glutes work hardest lower in the range.'),
  ('Standing Calf Raise', 'isolation', 'Calves', ARRAY[]::text[], 'Machine', 4, 15, 60,
    'Isolates the calf muscles through a full range of ankle plantarflexion, which is otherwise a small, often-neglected part of most lower-body programs.'),
  ('Overhead Barbell Press', 'compound', 'Shoulders', ARRAY['Triceps','Core'], 'Barbell', 4, 6, 120,
    'A vertical press that builds shoulder and triceps strength while also demanding trunk stability to keep the bar path straight overhead.'),
  ('Dumbbell Lateral Raise', 'isolation', 'Shoulders', ARRAY[]::text[], 'Dumbbell', 3, 15, 45,
    'Isolates the side delts through shoulder abduction, a movement pattern that pressing exercises alone don''t train directly, and one that shapes shoulder width.'),
  ('Face Pull', 'isolation', 'Shoulders', ARRAY['Upper back'], 'Cable', 3, 15, 45,
    'Targets the rear delts and upper back rotators, which get comparatively little direct work from pressing-dominant programs and matter for shoulder joint health.'),
  ('Barbell Bicep Curl', 'isolation', 'Biceps', ARRAY[]::text[], 'Barbell', 3, 10, 60,
    'A straightforward elbow-flexion isolation movement for building biceps size and strength beyond what pulling compounds provide as a side effect.'),
  ('Dumbbell Hammer Curl', 'isolation', 'Biceps', ARRAY['Forearms'], 'Dumbbell', 3, 12, 60,
    'The neutral grip shifts some emphasis onto the brachialis and forearms alongside the biceps, complementing a standard curl.'),
  ('Triceps Rope Pushdown', 'isolation', 'Triceps', ARRAY[]::text[], 'Cable', 3, 12, 60,
    'Isolates elbow extension under continuous cable tension, a simple, low-fatigue way to add direct triceps volume.'),
  ('Close-Grip Bench Press', 'compound', 'Triceps', ARRAY['Chest','Shoulders'], 'Barbell', 3, 8, 90,
    'A narrower grip on the bench press shifts more of the load onto the triceps while still training chest and shoulders, letting you press heavier than most isolation triceps work allows.'),
  ('Skull Crusher', 'isolation', 'Triceps', ARRAY[]::text[], 'Barbell', 3, 10, 60,
    'Isolates the triceps through a long stretch-to-contraction range from an overhead position, complementing pushdown-style movements that emphasize a shorter range.'),
  ('Plank', 'isolation', 'Core', ARRAY['Shoulders'], 'Bodyweight', 3, 30, 60,
    'A static hold that trains the core to resist movement rather than produce it, which is closer to the core''s real job of stabilizing the spine during other lifts. (default_reps here represents seconds held.)'),
  ('Hanging Leg Raise', 'isolation', 'Core', ARRAY['Hip flexors'], 'Bodyweight', 3, 12, 60,
    'Trains the lower abs and hip flexors through active hip flexion under load from a dead hang, a harder progression than a floor-based leg raise.'),
  ('Cable Woodchopper', 'isolation', 'Core', ARRAY['Shoulders'], 'Cable', 3, 12, 45,
    'Trains rotational core strength through a diagonal chopping pattern, which flexion/extension-only core exercises like planks and crunches don''t address.'),
  ('Kettlebell Swing', 'compound', 'Glutes', ARRAY['Hamstrings','Core','Shoulders'], 'Kettlebell', 3, 15, 90,
    'A ballistic hip-hinge movement that builds explosive hip extension power and conditions the posterior chain at higher rep ranges than typical strength work.');
