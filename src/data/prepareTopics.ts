import type { WeekEntry } from './patient'

export type PrepareStage = 'pregnancy' | 'early-postpartum' | 'later-postpartum'

export const STAGE_LABELS: Record<PrepareStage, string> = {
  pregnancy: 'Before birth',
  'early-postpartum': 'Weeks 1-6',
  'later-postpartum': 'Weeks 6-20+',
}

export function getStageForWeek(week: WeekEntry): PrepareStage {
  if (week.postpartumWeek === null) return 'pregnancy'
  if (week.postpartumWeek <= 6) return 'early-postpartum'
  return 'later-postpartum'
}

export interface PrepareTopic {
  id: string
  title: string
  summary: string
  body: string
  stages: PrepareStage[]
}

export const prepareTopics: PrepareTopic[] = [
  {
    id: 'giving-birth',
    title: 'Giving birth',
    summary: 'What to pack, what to expect, who to bring.',
    stages: ['pregnancy'],
    body: "Pack a hospital bag by week 36: ID and insurance info, comfortable going-home clothes, toiletries, phone charger, and something for the baby to wear home. Ask your care team ahead of time about their policy on birth partners, pain management options, and what a typical timeline looks like for a first birth. It's normal for labor to not go exactly as planned — having a flexible birth preference list, not a rigid plan, tends to feel better afterward.",
  },
  {
    id: 'hospital-bag',
    title: 'Packing your hospital bag',
    summary: 'A real checklist, not just "comfy clothes."',
    stages: ['pregnancy'],
    body: "For you: ID, insurance card, phone charger (a long cord — outlets are never close to the bed), your own pillow in a dark pillowcase so it doesn't get lost, loose going-home clothes (you'll still look pregnant, and that's normal), and toiletries. For the baby: an outfit and a car seat installed and inspected before you go into labor, not after. A lot of this can sit packed and ready from week 36 on, so it's one less thing to think about later.",
  },
  {
    id: 'newborn-basics',
    title: 'Newborn care basics',
    summary: 'Feeding cues, diapering, and safe sleep.',
    stages: ['pregnancy', 'early-postpartum'],
    body: "Newborns feed often — 8-12 times a day is normal, and hunger cues (rooting, hands to mouth) come before crying. Expect a lot of diapers; output is actually one of the best signs feeding is going well. For sleep, the safest setup is alone, on their back, on a firm flat surface with nothing loose in it — no blankets, pillows, or stuffed animals, even though the nursery aisle sells plenty of them. None of this has to be memorized perfectly; it comes back to you fast once the baby is actually here.",
  },
  {
    id: 'postpartum-recovery',
    title: 'Healing after birth',
    summary: "What's normal, what's not, for your body.",
    stages: ['pregnancy', 'early-postpartum'],
    body: "Bleeding (lochia) for several weeks is normal and should gradually lighten, not suddenly get heavier. Afterpains (cramping as your uterus shrinks back down) are common, especially while breastfeeding. If you had a C-section, keep the incision clean and dry and watch for increasing redness, warmth, or discharge. Soaking a pad in under an hour, a fever, or pain that's getting worse instead of better are all reasons to call, not wait for the next visit.",
  },
  {
    id: 'support-system',
    title: 'Building your support system',
    summary: 'Meal trains, visitor boundaries, asking for help.',
    stages: ['pregnancy'],
    body: "Set this up before you need it. A simple meal train or grocery drop-off schedule with friends or family takes real pressure off the first few weeks. Decide ahead of time what you're comfortable with for visitors — it's okay to ask people to help with a task instead of just holding the baby, and okay to say not yet. If a postpartum doula or night nurse is financially possible even for a few nights, many parents say it was worth more than they expected.",
  },
  {
    id: 'breastfeeding-basics',
    title: 'Breastfeeding basics',
    summary: "Latch, soreness, and when it's more than normal discomfort.",
    stages: ['pregnancy', 'early-postpartum'],
    body: "Some soreness in the first couple of weeks is common as you and your baby learn together; it should ease, not worsen, over time. A good latch shouldn't be sharply painful. Cracked or bleeding nipples, or a fever, can be signs of an infection worth getting checked. A lactation consultant can make a bigger difference than most people expect — it's worth asking your care team for a referral early rather than struggling alone for weeks.",
  },
  {
    id: 'postpartum-risks',
    title: 'Postpartum risks to know',
    summary: 'Blood pressure, clots, and mood — what to watch for.',
    stages: ['pregnancy', 'early-postpartum'],
    body: 'The weeks after birth carry real medical risk that often goes unmonitored once formal follow-up ends: blood pressure can climb even if it was normal during pregnancy, blood clots are more likely for several weeks, and mood changes can range from normal adjustment to something that needs treatment. Severe headache, vision changes, swelling, chest pain, or shortness of breath are all reasons to seek care immediately, not wait it out.',
  },
  {
    id: 'first-days-home',
    title: 'The first few days home',
    summary: 'Sleep, visitors, and lowering the bar.',
    stages: ['early-postpartum'],
    body: "The first days home are about survival, not routine. Sleep when you can, even in short stretches. Consider asking visitors to help instead of just holding the baby — a load of laundry or a meal is worth more than company right now. It's normal to feel a mix of overwhelm and love in the same hour. If anything feels physically wrong (heavy bleeding, fever, severe pain), call your clinician — don't wait for the next scheduled visit.",
  },
  {
    id: 'return-to-work',
    title: 'Planning your return to work',
    summary: 'Pumping, childcare, and timing it out.',
    stages: ['later-postpartum'],
    body: "If you're pumping at work, your employer is required to provide reasonable break time and a private space that isn't a bathroom. Start building a small milk stash a couple of weeks before you go back, not the night before. Lining up childcare takes longer than most people expect — waitlists for daycare are common, so it's worth starting those conversations early even if your return date feels far off.",
  },
  {
    id: 'body-and-intimacy',
    title: 'Your body, your cycle, and intimacy after birth',
    summary: 'What tends to come back, and when.',
    stages: ['later-postpartum'],
    body: "Most people get clearance from their care team around 6 weeks before resuming sex, but \"cleared\" doesn't always mean it'll feel the same right away — lower libido, dryness (especially while breastfeeding), and some discomfort are common and usually improve with time. Your period can return anywhere from 6 weeks to several months postpartum, often later if you're exclusively breastfeeding. You can ovulate before your first period comes back, so it's worth talking to your doctor about contraception even if your cycle hasn't resumed.",
  },
  {
    id: 'baby-development-later',
    title: "What's changing for your baby now",
    summary: 'Growth spurts, sleep shifts, and new skills.',
    stages: ['later-postpartum'],
    body: "Around 2-4 months, a lot of babies go through a stretch of more frequent night waking even after sleeping better before — this is a common, temporary regression tied to normal brain development, not something you did wrong. Growth spurts can show up as sudden extra hunger for a few days. This is also when personality really starts to show: more eye contact, more sounds, more opinions about what they want.",
  },
]

export function prepareTopicsForStage(stage: PrepareStage): PrepareTopic[] {
  return prepareTopics.filter((t) => t.stages.includes(stage))
}
