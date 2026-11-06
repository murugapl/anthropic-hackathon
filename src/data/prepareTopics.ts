export interface PrepareTopic {
  id: string
  title: string
  summary: string
  body: string
}

export const prepareTopics: PrepareTopic[] = [
  {
    id: 'giving-birth',
    title: 'Giving birth',
    summary: 'What to pack, what to expect, who to bring.',
    body: "Pack a hospital bag by week 36: ID and insurance info, comfortable going-home clothes, toiletries, phone charger, and something for the baby to wear home. Ask your care team ahead of time about their policy on birth partners, pain management options, and what a typical timeline looks like for a first birth. It's normal for labor to not go exactly as planned — having a flexible birth preference list, not a rigid plan, tends to feel better afterward.",
  },
  {
    id: 'first-days-home',
    title: 'The first few days home',
    summary: 'Sleep, visitors, and lowering the bar.',
    body: "The first days home are about survival, not routine. Sleep when you can, even in short stretches. Consider asking visitors to help instead of just holding the baby — a load of laundry or a meal is worth more than company right now. It's normal to feel a mix of overwhelm and love in the same hour. If anything feels physically wrong (heavy bleeding, fever, severe pain), call your clinician — don't wait for the next scheduled visit.",
  },
  {
    id: 'postpartum-risks',
    title: 'Postpartum risks to know',
    summary: 'Blood pressure, clots, and mood — what to watch for.',
    body: 'The weeks after birth carry real medical risk that often goes unmonitored once formal follow-up ends: blood pressure can climb even if it was normal during pregnancy, blood clots are more likely for several weeks, and mood changes can range from normal adjustment to something that needs treatment. Severe headache, vision changes, swelling, chest pain, or shortness of breath are all reasons to seek care immediately, not wait it out.',
  },
  {
    id: 'breastfeeding-basics',
    title: 'Breastfeeding basics',
    summary: "Latch, soreness, and when it's more than normal discomfort.",
    body: "Some soreness in the first couple of weeks is common as you and your baby learn together; it should ease, not worsen, over time. A good latch shouldn't be sharply painful. Cracked or bleeding nipples, or a fever, can be signs of an infection worth getting checked. A lactation consultant can make a bigger difference than most people expect — it's worth asking your care team for a referral early rather than struggling alone for weeks.",
  },
]
