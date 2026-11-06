// Copy and fixtures for the scripted demo video (/film).
// Everything here is synthetic. Edit freely and re-render.

export interface StormNotification {
  app: string
  color: string
  title: string
  body: string
  stage: string // shown on the lock screen while this notification is newest
}

// Cold open: pregnancy -> birth -> postpartum, accelerating.
export const STORM: StormNotification[] = [
  { app: 'Clinic', color: '#bc6240', title: 'Prenatal visit', body: 'Tomorrow, 9:30 AM', stage: 'Week 30' },
  { app: 'Clinic', color: '#bc6240', title: 'Glucose test tomorrow, 8 AM', body: 'Remember: fasting from midnight', stage: 'Week 30' },
  { app: 'Health', color: '#e0565b', title: 'Blood pressure check', body: 'Please log a reading today', stage: 'Week 31' },
  { app: 'Baby Tracker', color: '#778f64', title: 'Kick count reminder', body: 'Count 10 movements', stage: 'Week 32' },
  { app: 'Insurance', color: '#4a6fa5', title: 'Prior authorization required', body: 'Action needed for upcoming ultrasound', stage: 'Week 33' },
  { app: 'Clinic', color: '#bc6240', title: 'Lab results available', body: 'Log in to view', stage: 'Week 34' },
  { app: 'Search', color: '#6f6a62', title: 'swollen feet pregnancy is this normal', body: 'Recent search', stage: 'Week 35' },
  { app: 'Baby Tracker', color: '#778f64', title: 'Kick count reminder', body: 'Count 10 movements', stage: 'Week 35' },
  { app: 'Reminders', color: '#d9a13b', title: 'Hospital bag', body: '6 items left on your checklist', stage: 'Week 36' },
  { app: 'Clinic', color: '#bc6240', title: 'Group B strep test', body: 'Scheduled Thursday', stage: 'Week 37' },
  { app: 'Contractions', color: '#a14e30', title: 'Contractions: 7 min apart', body: 'Lasting 50 seconds', stage: 'Week 39' },
  { app: 'Contractions', color: '#a14e30', title: 'Contractions: 5 min apart', body: 'Time to call your provider', stage: 'Week 39' },
  { app: 'Maps', color: '#4a6fa5', title: 'Leave now for the hospital', body: '24 min with current traffic', stage: 'Week 39' },
  { app: 'Messages', color: '#5fae5b', title: 'Mom', body: "Baby girl, 7 lb 2 oz 💛 how are you feeling??", stage: 'Day 1' },
  { app: 'Baby Tracker', color: '#778f64', title: 'Feeding logged', body: '2:14 AM · left side', stage: 'Day 2' },
  { app: 'Pediatrics', color: '#4a6fa5', title: '48-hour newborn check', body: 'Tomorrow, 10:00 AM', stage: 'Day 2' },
  { app: 'Baby Tracker', color: '#778f64', title: 'Feeding logged', body: '3:40 AM · right side', stage: 'Day 3' },
  { app: 'Lactation', color: '#bc6240', title: 'Lactation consultant', body: 'Current waitlist: 3 weeks', stage: 'Day 4' },
  { app: 'Baby Tracker', color: '#778f64', title: 'Feeding logged', body: '4:55 AM · left side', stage: 'Day 5' },
  { app: 'Search', color: '#6f6a62', title: 'how much bleeding after birth is normal', body: 'Recent search', stage: 'Week 1' },
  { app: 'Baby Tracker', color: '#778f64', title: 'Log diapers', body: '3 missing today', stage: 'Week 1' },
  { app: 'Clinic', color: '#bc6240', title: 'Stitches', body: 'Watch for signs of infection', stage: 'Week 1' },
  { app: 'Baby Tracker', color: '#778f64', title: 'Feeding logged', body: '5:20 AM · right side', stage: 'Week 2' },
  { app: 'Billing', color: '#4a6fa5', title: 'Labor & delivery statement', body: 'Balance due: $3,240', stage: 'Week 2' },
  { app: 'Baby Tracker', color: '#778f64', title: 'Feeding logged', body: '6:05 AM · left side', stage: 'Week 3' },
  { app: 'HR Portal', color: '#6f6a62', title: 'Return-to-work forms due', body: 'Complete by Friday', stage: 'Week 3' },
  { app: 'Search', color: '#6f6a62', title: "headache that won't go away postpartum", body: 'Recent search', stage: 'Week 4' },
  { app: 'Pediatrics', color: '#4a6fa5', title: '1-month visit', body: 'Monday, 8:45 AM', stage: 'Week 4' },
  { app: 'Baby Tracker', color: '#778f64', title: 'Feeding logged', body: '1:10 AM · right side', stage: 'Week 5' },
  { app: 'Baby Tracker', color: '#778f64', title: 'Feeding logged', body: '2:30 AM · left side', stage: 'Week 5' },
  { app: 'Search', color: '#6f6a62', title: 'is it normal to cry every day after baby', body: 'Recent search', stage: 'Week 5' },
  { app: 'Baby Tracker', color: '#778f64', title: 'Feeding logged', body: '3:50 AM · right side', stage: 'Week 6' },
]

// VERIFY BEFORE PUBLISHING: check these against the CDC Maternal Mortality
// Review Committee data and update the wording/figures if needed.
export const STATS = {
  big: '1 in 3',
  line: 'pregnancy-related deaths happen between one week and one year after birth.',
  follow: 'Most are preventable.',
  source: 'Source: CDC, Maternal Mortality Review Committees',
}

// Prewritten demo referral used ONLY inside the film so the recording is
// deterministic and needs no API key. With a real key, the app generates
// this live with Claude from the same data.
export const FILM_REFERRAL = `Summary

Jenny is 20 weeks postpartum. Sleep has recovered to 6.8 hours and her mood is improving since starting virtual therapy. However, her blood pressure has stayed elevated since her 6-week visit and has not been reviewed by a clinician since.

Key flags

1. Blood pressure still elevated: trending up since postpartum week 6 (131/85), peaking at 139/91 in week 14, currently 133/86.
2. Low mood, improving: flagged from postpartum week 12, trending better after starting virtual therapy.

Referral recommendation

Referral to cardiology (or a hypertension clinic) is warranted for evaluation of persistent postpartum blood pressure elevation. The specialist should know this pattern began at 6 weeks postpartum, after a normotensive pregnancy. Recommend continued mood follow-up with her therapist in parallel.`
