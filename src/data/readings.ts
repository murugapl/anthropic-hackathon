export interface Reading {
  id: string
  title: string
  blurb: string
  body: string
}

export const readings: Reading[] = [
  {
    id: 'baby-blues-vs-ppd',
    title: 'Baby blues vs. postpartum depression',
    blurb: 'Both are common. Here is how to tell the difference.',
    body: "The 'baby blues' affect up to 80% of new parents — mood swings, tearfulness, and anxiety in the first two weeks that fade on their own. Postpartum depression is different: it lasts longer than two weeks, feels heavier, and can include persistent sadness, loss of interest in things you used to enjoy, or trouble bonding with your baby. If it's been more than two weeks and it's not lifting, that's worth bringing to someone.",
  },
  {
    id: 'signs-to-reach-out',
    title: 'Signs it might be time to reach out',
    blurb: "You don't have to wait until it feels unbearable.",
    body: "Persistent sadness or anxiety, trouble sleeping even when the baby sleeps, feeling disconnected from your baby or loved ones, intrusive worries you can't shake, or any thoughts of harming yourself. None of these mean you're failing — they mean your body and brain are asking for support, same as a fever means something needs attention.",
  },
  {
    id: 'postpartum-anxiety',
    title: 'Postpartum anxiety is more common than people think',
    blurb: "It doesn't always look like sadness.",
    body: "Postpartum anxiety can look like racing thoughts, constant worry about the baby's safety, or a sense of dread that is hard to explain. It's often talked about less than postpartum depression, but it's just as real and just as treatable. If your mind feels like it won't stop, that's a reasonable thing to mention at your next check-in — or sooner.",
  },
  {
    id: 'urgent-signs',
    title: 'When to get help right now, not later',
    blurb: 'A short, direct list — just in case.',
    body: 'Thoughts of harming yourself or your baby, feeling unable to care for yourself or your baby, or feeling disconnected from reality all warrant contacting a clinician or emergency services immediately. This is never something to wait out alone.',
  },
]
