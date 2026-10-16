#!/bin/bash
# Probes for the lint-bypass and trace-gate findings, run on the scratch copy only.
# Every negative probe has a positive control that must be caught, so a "no error" result means something.
set -u
APP=/private/tmp/claude-501/-Users-mrpo-Documents-projects-metis/af94d834-5777-463c-9909-ae4f10d16bb4/scratchpad/probe/apps/metis
cd "$APP" || exit 1
S=src/screens/24-project-overview

# Canary files (all removed at the end).
printf "import { router } from 'expo-router'\n\nexport const back = () => router.back()\n" > src/core/zzcanary-expo.ts
printf "import { View } from 'react-native'\n\nexport const box = View\n" > src/core/zzcanary-rn.ts
printf "import { HealthCard } from './blocks/HealthCard'\n\nexport const card = HealthCard\n" > $S/model.zzcanary1.ts
printf "import { Tile } from '../../design-system/Tile'\n\nexport const tile = Tile\n" > $S/model.zzcanary2.ts
printf "import { View } from 'react-native'\n\nexport const box = View\n" > $S/model.zzcanary3.ts
printf "import { Text } from 'react-native'\n\nexport function ZzCanary() {\n  return <Text>No items</Text>\n}\n" > src/shell/ZzCanary.tsx
printf "import { Text } from 'react-native'\n\nexport function ZzCanary() {\n  return <Text>No items</Text>\n}\n" > src/design-system/ZzCanary.tsx

for f in src/core/zzcanary-expo.ts src/core/zzcanary-rn.ts $S/model.zzcanary1.ts $S/model.zzcanary2.ts $S/model.zzcanary3.ts src/shell/ZzCanary.tsx src/design-system/ZzCanary.tsx; do
  out=$(nice -n 19 ./node_modules/.bin/eslint --no-cache "$f" 2>&1)
  code=$?
  echo "== $f exit=$code"
  echo "$out" | grep -E "error|warning" | grep -vE "^\s*$|problems?" | sed 's/^ */   /' | cut -c1-170 | head -4
done
rm -f src/core/zzcanary-expo.ts src/core/zzcanary-rn.ts $S/model.zzcanary1.ts $S/model.zzcanary2.ts $S/model.zzcanary3.ts src/shell/ZzCanary.tsx src/design-system/ZzCanary.tsx

# Trace gate. BR-24 is named by exactly one test title (Screen.test.native.tsx:172).
T=$S/Screen.test.native.tsx
cp "$T" /tmp/.probe-trace.bak.$$
echo "== T0 trace baseline"; node scripts/check-trace.mjs >/dev/null 2>&1; echo "exit=$?"
sed -i '' "s/  test('OVW-01 BR-24 BR-39 Meridian/  test.skip('OVW-01 BR-24 BR-39 Meridian/" "$T"
grep -c "test.skip('OVW-01 BR-24" "$T" | sed 's/^/T1 edit applied lines: /'
echo "== T1 the only BR-24 test is skipped"; node scripts/check-trace.mjs 2>&1 | tail -2; echo "exit=${PIPESTATUS[0]}"
cp /tmp/.probe-trace.bak.$$ "$T"
sed -i '' "s/  test('OVW-01 BR-24 BR-39 Meridian/  test('OVW-01 BR-2X BR-39 Meridian/" "$T"
grep -c "test('OVW-01 BR-2X" "$T" | sed 's/^/T2 edit applied lines: /'
echo "== T2 positive control: BR-24 removed from the title"; node scripts/check-trace.mjs 2>&1 | tail -2; echo "exit=${PIPESTATUS[0]}"
cp /tmp/.probe-trace.bak.$$ "$T"
cmp "$T" /tmp/.probe-trace.bak.$$ && echo "restored OK"
rm -f /tmp/.probe-trace.bak.$$
