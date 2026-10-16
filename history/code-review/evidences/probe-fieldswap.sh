#!/bin/bash
# Mutation probes for the field-swap finding, run on the scratch copy only.
# Each probe: apply one edit, run every Jest test of screen 24 and the shell, record pass/fail, restore.
set -u
APP=/private/tmp/claude-501/-Users-mrpo-Documents-projects-metis/af94d834-5777-463c-9909-ae4f10d16bb4/scratchpad/probe/apps/metis
cd "$APP" || exit 1
M=src/screens/24-project-overview/model.ts
L=src/screens/24-project-overview/model.lists.ts
cp "$M" /tmp/.probe-model.bak.$$ && cp "$L" /tmp/.probe-lists.bak.$$

run() {
  local name=$1
  local out
  out=$(nice -n 19 ./node_modules/.bin/jest src/screens src/shell --maxWorkers=3 --coverage=false --silent 2>&1)
  echo "== $name"
  echo "$out" | grep -E "^(Tests|Test Suites):"
  echo "$out" | grep -E "✕" | head -8
}

restore() { cp /tmp/.probe-model.bak.$$ "$M"; cp /tmp/.probe-lists.bak.$$ "$L"; }

run "P0 baseline (no edit)"

# P1: Delayed tile alert reads the change since baseline instead of the delayed count.
sed -i '' 's/alert: delayed.value > 0 }/alert: change > 0 }/' "$M"
grep -c "alert: change > 0 }" "$M" | sed 's/^/P1 edit applied lines: /'
run "P1 alert from change"
restore

# P1b: Delayed tile value reads the change since baseline instead of the delayed count.
sed -i '' 's/value: num(c, delayed.value), figure: true/value: num(c, change), figure: true/' "$M"
grep -c "value: num(c, change), figure: true" "$M" | sed 's/^/P1b edit applied lines: /'
run "P1b value from change"
restore

# P2: risk card count reads the high-risk metric instead of the attention list total.
sed -i '' 's/count: num(c, risks.total),/count: num(c, data.metrics.highRisk.value),/' "$L"
grep -c "count: num(c, data.metrics.highRisk.value)," "$L" | sed 's/^/P2 edit applied lines: /'
run "P2 risk count from highRisk"
restore

cmp "$M" /tmp/.probe-model.bak.$$ && cmp "$L" /tmp/.probe-lists.bak.$$ && echo "restored OK"
rm -f /tmp/.probe-model.bak.$$ /tmp/.probe-lists.bak.$$
