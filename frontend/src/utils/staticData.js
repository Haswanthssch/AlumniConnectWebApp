/**
 * ---------------------------------------------------------------------------
 * STATIC / DEMO DATA
 * ---------------------------------------------------------------------------
 * The backend (see /backend) currently exposes APIs ONLY for:
 *   - Authentication (register / login / me / logout)
 *   - Users (profile, follow / unfollow)
 *   - Posts (create, read, update, delete, like, comment, save)
 *
 * There is NO backend for Jobs, Messages, Events, Trending topics or the
 * Job-recommendation widget. Everything in this file is hard-coded demo
 * content used to fill those UI sections. Each section that renders this data
 * is visually marked with a "Demo" badge in the UI so it is obvious that the
 * numbers/items are not live yet.
 *
 * When the matching backend endpoints are built, replace the imports of this
 * data with real service calls.
 * ---------------------------------------------------------------------------
 */

// Sidebar → "Job Recommendations" (no /jobs backend yet)
export const JOB_RECOMMENDATIONS = [
  {
    id: 'jr1',
    title: 'Software Engineer',
    company: 'Google',
    location: 'Bangalore, IN',
    type: 'Full-time',
    logoColor: 'from-red-400 to-red-500',
    initial: 'G',
  },
  {
    id: 'jr2',
    title: 'Product Manager',
    company: 'Flipkart',
    location: 'Remote',
    type: 'Full-time',
    logoColor: 'from-amber-400 to-orange-500',
    initial: 'F',
  },
  {
    id: 'jr3',
    title: 'Data Analyst',
    company: 'Razorpay',
    location: 'Mumbai, IN',
    type: 'Full-time',
    logoColor: 'from-blue-400 to-blue-600',
    initial: 'R',
  },
];

// Sidebar → "Upcoming Events" (no /events backend yet)
export const UPCOMING_EVENTS = [
  {
    id: 'ev1',
    title: 'Alumni Networking Night',
    location: 'Hyderabad Campus',
    mode: 'In-person',
    month: 'Nov',
    day: '18',
    modeColor: 'text-blue-600 bg-blue-50',
  },
  {
    id: 'ev2',
    title: 'Tech Career Fair 2024',
    location: 'Virtual',
    mode: 'Online',
    month: 'Dec',
    day: '02',
    modeColor: 'text-green-600 bg-green-50',
  },
];

// Sidebar → "Trending" (no analytics backend yet)
export const TRENDING_TAGS = [
  '#PlacementSeason2024',
  '#TechJobs',
  '#AlumniConnect',
  '#StartupLife',
];

// Home stat cards that have no backend source yet.
// "Connections" is derived from the logged-in user's real follower list.
export const DEMO_STATS = {
  jobOpportunities: 23,
  messages: 8,
};
