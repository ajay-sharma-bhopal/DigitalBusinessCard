export const cardData = {
  // Personal Info
  name: 'Alexandra Chen',
  title: 'Chief Executive Officer',
  company: 'Nexus Innovations Corp.',
  department: 'Executive Leadership',
  tagline: 'Transforming ideas into global impact',

  // Avatar — use a URL or set to null for initials avatar
  avatar: null,

  // Contact Details
  email: 'alexandra.chen@nexusinnovations.com',
  phone: '+1 (415) 555-0192',
  mobile: '+1 (415) 555-0193',
  website: 'https://nexusinnovations.com',
  address: {
    street: '1 Market Street, Suite 3200',
    city: 'San Francisco',
    state: 'CA',
    zip: '94105',
    country: 'United States',
  },

  // Social Profiles
  social: {
    linkedin: 'https://linkedin.com/in/alexandra-chen',
    twitter: 'https://twitter.com/alexchen_ceo',
    github: '',
    instagram: '',
    youtube: '',
    calendly: 'https://calendly.com/alexandra-chen',
  },

  // Appearance
  theme: 'dark', // 'dark' | 'light'
  accentColor: '#3b5bdb',

  // Card URL — auto-detected from browser, falls back to GitHub Pages URL
  cardUrl: typeof window !== 'undefined'
    ? window.location.origin + window.location.pathname
    : 'https://ajay-sharma-bhopal.github.io/digitalbusinesscard/',
}
