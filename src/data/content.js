/* Event catalogue from the AXIS'27 official brochure. Two events are kept
   beyond the brochure because they have run for years and removing them was
   decided against: Capture The Flag (Software & Electronics) and Manual
   Robotics (Automation & Robotics). "Crepido" keeps its historical spelling
   even though the brochure writes "Crepito". */

export const eventCategories = [
  {
    id: 'management',
    title: 'Management & Analytics',
    subtitle: 'Strategize. Analyze. Dominate.',
    description: 'Whether you\'re a market guru, a financial expert, or a data wizard, showcase your skills and master the art of business intelligence.',
    events: [
      { name: 'Model United Nations', desc: 'Delegates from various countries engage in structured debates to tackle global challenges and find collaborative solutions.', tagline: 'DEBATE. DIPLOMACY. RESOLVE.', theme: { grid: 'none' } },
      { name: 'Wallstreet', desc: 'A stock exchange event that tests analytical skills and deepens your understanding of the stock market.', tagline: 'TRADE. ANALYZE. DOMINATE.', theme: { grid: 'dots' } },
      { name: 'Analytico', desc: 'Find innovative marketing strategies to extend the reach of technology.', tagline: 'POSITION. PITCH. WIN.', theme: { grid: 'default' } },
      { name: 'Who\'s The Boss', desc: 'Prove your analytical and management skills — calculating powers and smart prediction included.', tagline: 'LEAD. DECIDE. COMMAND.', theme: { grid: 'default' } },
      { name: 'Laser Litt', desc: 'Guide a laser through multiple surfaces to reach the final target in a reflection puzzle.', tagline: 'AIM. STEER. STRIKE.', theme: { grid: 'diagonal' } },
      { name: 'Freak-O-Matrix', desc: 'A puzzle event that pushes participants to use their fullest thinking.', tagline: 'THINK. SOLVE. ESCAPE.', theme: { grid: 'dots' } },
      { name: '221B Baker Street', desc: 'Test your detective skills with mind-bending mysteries on your screen.', tagline: 'DEDUCT. DECODE. DISCOVER.', theme: { grid: 'none' } },
    ],
  },
  {
    id: 'software',
    title: 'Software & Electronics',
    subtitle: 'Innovate. Code. Electrify.',
    description: 'From blockchain to AI, this is your playground to experiment and revolutionize technology.',
    events: [
      { name: 'Wintercoding Challenge', desc: 'A premier competition testing problem-solving, algorithmic thinking, and coding proficiency across all skill levels.', tagline: 'OPTIMIZE. DEBUG. OUTLAST.', theme: { grid: 'default' } },
      { name: 'Cryptocrux', desc: 'Decrypt and solve puzzles using given information. Ready to crack?', tagline: 'CRACK. DECODE. INFILTRATE.', theme: { grid: 'dots' } },
      { name: 'Web Reshape', desc: 'Modify a website to a given problem statement — front-end redesign or bug fixes as required.', tagline: 'BUILD. BEND. BREAK.', theme: { grid: 'default' } },
      { name: 'Insomnia', desc: 'An 8-hour programming paradise of mind-boggling coding and algorithmic challenges.', tagline: 'CODE. THINK. SURVIVE.', theme: { grid: 'none' } },
      { name: 'Electroblitz', desc: 'Debug an existing circuit and design an innovative new one.', tagline: 'SPARK. CIRCUIT. SURGE.', theme: { grid: 'rings' } },
      { name: 'AI Ideathon', desc: 'Use artificial intelligence to solve real-life problems in a limited time.', tagline: 'THINK. TRAIN. TRANSFORM.', theme: { grid: 'dots' } },
      { name: 'Capture The Flag', desc: 'A thrilling cybersecurity challenge.', tagline: 'EXPLOIT. ESCALATE. EXFILTRATE.', theme: { grid: 'dots' } },
    ],
  },
  {
    id: 'robotics',
    title: 'Automation & Robotics',
    subtitle: 'Build. Automate. Dominate.',
    description: 'Where machines aren\'t just built—they\'re unleashed!',
    events: [
      { name: 'Robowars', desc: 'Custom-designed robots clash in a one-on-one knockout battle of strategy, speed, and precision.', tagline: 'BUILD. FIGHT. SURVIVE.', theme: { grid: 'diagonal' } },
      { name: 'Aquahunt', desc: 'Build a floating robot to master a challenging obstacle course with precision and agility.', tagline: 'DIVE. NAVIGATE. CONQUER.', theme: { grid: 'dots' } },
      { name: 'Mechatryst', desc: 'Race a nitro-powered wireless RC car through an obstacle-filled track for the fastest time.', tagline: 'ROAR. RACE. WIN.', theme: { grid: 'diagonal' } },
      { name: 'Robocup', desc: 'Construct a manual robot to compete in a one-on-one football match.', tagline: 'PASS. DRIBBLE. SCORE.', theme: { grid: 'default' } },
      { name: 'Drone at Work', desc: 'Guide your drone through a series of obstacles with precision and control.', tagline: 'LIFT. GUIDE. LAND.', theme: { grid: 'rings' } },
      { name: 'Autobot', desc: 'Develop an autonomous bot that follows lines and navigates a maze to victory.', tagline: 'MAP. MOVE. MASTER.', theme: { grid: 'default' } },
      { name: 'Manual Robotics', desc: 'Build bots that push engineering boundaries.', tagline: 'BUILD. TEST. UNLEASH.', theme: { grid: 'default' } },
    ],
  },
  {
    id: 'construction',
    title: 'Construction & Design',
    subtitle: 'Build. Innovate. Transform.',
    description: 'Where creativity meets engineering! Foster your passion for sustainable architecture and advanced construction.',
    events: [
      { name: 'Turbo Flux', desc: 'Give water flow a boost — build turbines, generate electricity, and prototype dam designs.', tagline: 'FLOW. TURBINE. POWER.', theme: { grid: 'default' } },
      { name: 'Aquaskylark', desc: 'Design a flying water rocket propelled by a high-pressure pump.', tagline: 'PRESSURIZE. LAUNCH. FLY.', theme: { grid: 'diagonal' } },
      { name: 'Paradeigma', desc: 'Craft on-the-spot models from scrap material and showcase your talent.', tagline: 'SCAVENGE. ASSEMBLE. SHOWCASE.', theme: { grid: 'default' } },
      { name: 'Crepido', desc: 'Design and build an efficient bridge from sticks that can withstand a specified load.', tagline: 'SPAN. SUPPORT. WITHSTAND.', theme: { grid: 'default' } },
    ],
  },
  {
    id: 'devise',
    title: 'Devise',
    subtitle: 'Draft. Design. Dominate.',
    /* A creative series hosted by the Department of Architecture & Planning,
       VNIT, running as its own banner under AXIS (DEVISE'25 and earlier, in
       collaboration with the IIA Nagpur Chapter). Runs as its own domain so
       the three design competitions get their own stage. */
    description: 'A creative series hosted by the Department of Architecture & Planning, VNIT, in collaboration with AXIS — where design problems meet inspired solutions.',
    events: [
      { name: 'Clickscape', desc: 'Capture architecture the way it was meant to be seen — a landscape through the lens.', tagline: 'FRAME. FOCUS. REVEAL.', theme: { grid: 'none' } },
      { name: 'Mindmash', desc: 'A design-and-architecture knowledge mashup that tests your eye for detail.', tagline: 'THINK. MATCH. MASTER.', theme: { grid: 'default' } },
      { name: 'Cre8mark', desc: 'Reimagine an iconic landmark and turn your vision into a model.', tagline: 'REIMAGINE. RECREATE. ICONIZE.', theme: { grid: 'default' } },
    ],
  },
  {
    id: 'igniting-minds',
    title: 'School Events & Igniting Minds',
    subtitle: 'Think. Create. Transform.',
    description: 'Curiosity fuels innovation! Redefine the future through creative problem-solving.',
    events: [
      { name: 'Dexter', desc: 'The nationwide aptitude test for school students, held every year under AXIS.', tagline: 'REASON. RANK. RISE.', theme: { grid: 'default' } },
      { name: 'Space Innovation Challenge', desc: 'Solve a space-related problem, submit an abstract, and demonstrate innovation in space tech.', tagline: 'DREAM. DESIGN. DELIVER.', theme: { grid: 'dots' } },
      { name: 'Brainstorm', desc: 'Put your general knowledge to the test by solving mind-bending mysteries against the clock.', tagline: 'PUZZLE. PONDER. PIERCE.', theme: { grid: 'dots' } },
      { name: 'Kartavya', desc: 'Use technology to revolutionize society by solving real-world problem statements.', tagline: 'INNOVATE. IMPACT. INSPIRE.', theme: { grid: 'default' } },
      { name: 'Toycathon', desc: 'Prepare toys from a given set of topics, where imagination meets model making.', tagline: 'IMAGINE. BUILD. PLAY.', theme: { grid: 'default' } },
      { name: 'Techno.docx', desc: 'A research paper presentation event for exploring and showcasing your topic of expertise.', tagline: 'RESEARCH. WRITE. PRESENT.', theme: { grid: 'default' } },
    ],
  },
  {
    id: 'esports',
    title: 'Esports & Informals',
    subtitle: 'Play. Compete. Unwind.',
    description: 'High-octane gaming tournaments alongside low-stakes offbeat fun between events.',
    events: [
      { name: 'Gamesutra', desc: 'The AXIS gaming tournament — high-octane competition across Valorant, Free Fire, BGMI and Clash Royale.', tagline: 'QUEUE. CLUTCH. CARRY.', theme: { grid: 'dots' } },
      { name: 'Informals', desc: 'Offbeat, low-stakes games to unwind between events — details announced closer to the fest.', tagline: 'PLAY. LAUGH. REPEAT.', theme: { grid: 'none' } },
    ],
  },
];

/* Per-event identity: one motif glyph per event (see lib/motifs.js), plus the
   events that break their category's default layout (lib/eventBg.js exports
   the category→layout defaults). Motifs are assigned from the event's own
   description — RACE for Mechatryst, PITCH for Drone of it being a drone race
   — rather than by category, so two events in the same category can carry
   different backgrounds. */
export const eventMotifs = {
  'Model United Nations': 'globe',
  'Wallstreet': 'trade',
  'Analytico': 'trade',
  'Who\'s The Boss': 'scale',
  'Laser Litt': 'beam',
  'Freak-O-Matrix': 'matrix',
  '221B Baker Street': 'mystery',

  'Wintercoding Challenge': 'code',
  'Cryptocrux': 'cipher',
  'Web Reshape': 'code',
  'Insomnia': 'moon',
  'Electroblitz': 'spark',
  'AI Ideathon': 'ai',
  'Capture The Flag': 'flag',

  'Robowars': 'combat',
  'Aquahunt': 'water',
  'Mechatryst': 'speed',
  'Robocup': 'court',
  'Drone at Work': 'air',
  'Autobot': 'gear',
  'Manual Robotics': 'gear',

  'Turbo Flux': 'water',
  'Aquaskylark': 'rocket',
  'Paradeigma': 'fabricate',
  'Crepido': 'bridge',

  'Clickscape': 'focus',
  'Mindmash': 'matrix',
  'Cre8mark': 'fabricate',

  'Dexter': 'scale',
  'Space Innovation Challenge': 'rocket',
  'Brainstorm': 'mystery',
  'Kartavya': 'spark',
  'Toycathon': 'party',
  'Techno.docx': 'doc',

  'Gamesutra': 'game',
  'Informals': 'party',
};

export const eventLayoutOverrides = {
  Robowars: 'stage',
  Aquahunt: 'stage',
  'Mechatryst': 'stage',
  'Insomnia': 'stage',
  'Aquaskylark': 'stage',
  'Space Innovation Challenge': 'blueprint',
  'Toycathon': 'stage',
};

export const stats = [
  { label: 'Events', value: 35, suffix: '+' },
  { label: 'Colleges', value: 200, suffix: '+' },
  { label: 'Footfall', value: 35000, suffix: '+' },
];

export const navLinks = [
  { label: 'Events', href: '/events' },
  { label: 'Workshops', href: '/workshops' },
  { label: 'Sponsors', href: '/sponsors' },
  { label: 'Accommodation', href: '/accommodation' },
  { label: 'Team', href: '/team' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export const socialLinks = {
  instagram: 'https://www.instagram.com/axis_vnit',
  linkedin: 'https://www.linkedin.com/company/axis-vnit-nagpur/',
  facebook: 'https://www.facebook.com/axisvnit',
  twitter: 'https://x.com/AXIS_VNIT',
  youtube: 'https://www.youtube.com/@AXISVNIT',
};

export const aboutText = `AXIS is the annual technical festival of the Visvesvaraya National Institute of Technology, Nagpur. Started in 2001 as Odyssey, AXIS has grown to become one of the largest technical festivals in India and the largest in Central India. Organising 35+ events, exhibitions and workshops encompassing multiple engineering disciplines, AXIS annually attracts over 35,000 students from across the country.`;

export const galleryItems = [
  { id: 'robowars', src: '/images/gallery/image-1.jpg', alt: 'Battle bots colliding in the Robowars arena', tag: 'ROBOWARS', span: 'large' },
  { id: 'drone-show', src: '/images/gallery/image-2.jpg', alt: 'The 16-drone night show over the open sky', tag: 'DRONE SHOW', span: '' },
  { id: 'ctf', src: '/images/gallery/image-3.jpg', alt: 'Teams locked in a Capture The Flag terminal war', tag: 'CAPTURE THE FLAG', span: '' },
  { id: 'concert', src: '/images/gallery/image-4.jpg', alt: 'The closing concert stage lit under a crimson glow', tag: 'CONCERT NIGHT', span: 'tall' },
  { id: 'workshop', src: '/images/gallery/image-5.jpg', alt: 'Students building circuits at a hardware workshop', tag: 'WORKSHOPS', span: 'wide' },
  { id: 'expo', src: '/images/gallery/image-6.jpg', alt: 'Defence and ISRO exhibition stalls drawing a crowd', tag: 'EXPO', span: '' },
  { id: 'drone-flight', src: '/images/gallery/image-7.jpg', alt: 'A pilot drone climbing into the desert sky', tag: 'DRONE AT WORK', span: '' },
  { id: 'robocup', src: '/images/gallery/image-8.jpg', alt: 'Autonomous bots on the RoboCup field', tag: 'ROBOCUP', span: 'wide' },
  { id: 'mechatryst', src: '/images/gallery/image-9.jpg', alt: 'An RC car screaming down the Mechatryst track', tag: 'MECHATRYST', span: '' },
];

/* Live workshops. The registration link is the workshop's own Google Form —
   the fbzx cache-buster is stripped so the copied link is the clean canonical
   one. Workshop #2 later is just another entry here. */
export const workshops = [
  {
    id: 'makersnext',
    title: 'MakersNext — Robotics & Embedded Systems Workshop',
    tagline: 'Learn • Build • Code • Innovate',
    description:
      'A two-day, hands-on workshop designed for school students from Classes 6 to 12 — an exciting introduction to Robotics, Electronics, Coding and Embedded Systems through interactive sessions and practical activities. Participants learn the fundamentals of robotics, explore electronic components and sensors, understand coding and hardware interaction, and gain hands-on experience through practical projects.',
    teaser:
      'A two-day, hands-on introduction to Robotics, Electronics, Coding and Embedded Systems for school students in Classes 6 to 12.',
    date: '17th–18th October 2026',
    venue: 'VNIT Nagpur',
    eligibility: 'School Students — Classes 6 to 12',
    fee: '₹500 per participant',
    registerUrl:
      'https://docs.google.com/forms/d/e/1FAIpQLSdnOaILJw2hgBzq-Zt-lWE5k_GJqfsefmnUsxQwxIONl28hNg/viewform',
  },
];

export const notableGuests = [
  {
    id: 'kalam',
    name: 'Dr. APJ Abdul Kalam',
    role: 'Former President of India · Aerospace scientist · Missile Man of India',
    year: 2014,
    img: '/images/guests/kalam.jpg',
    span: 'featured',
  },
  {
    id: 'sunita-williams',
    name: 'Sunita L. Williams',
    role: 'NASA astronaut · Most time in spacewalk by a woman',
    year: 2019,
    img: '/images/guests/sunita-williams.jpg',
  },
  {
    id: 'amish-tripathi',
    name: 'Amish Tripathi',
    role: 'Author of the Shiva Trilogy',
    year: 2016,
    img: '/images/guests/amish-tripathi.jpg',
  },
  {
    id: 'vijender-chauhan',
    name: 'Dr. Vijender Singh Chauhan',
    role: 'Founder, Drishti IAS · The Vision Foundation',
    year: 2023,
    img: '/images/guests/vijender-chauhan.jpg',
  },
  {
    id: 'hc-verma',
    name: 'Prof. H.C. Verma',
    role: 'Physicist · Padma Shri · Author of Concepts of Physics',
    year: 2024,
    img: '/images/guests/hc-verma.jpg',
  },
  {
    id: 'acharya-prashant',
    name: 'Acharya Prashant',
    role: 'Spiritual teacher · Vedanta philosopher',
    year: 2026,
    img: '/images/guests/acharya-prashant.jpg',
  },
  {
    id: 'sudhanshu-trivedi',
    name: 'Dr. Sudhanshu Trivedi',
    role: 'Member of Parliament, Rajya Sabha',
    year: 2026,
    img: '/images/guests/sudhanshu-trivedi.jpg',
  },
];

export const notablePerformers = [
  {
    id: 'suhani-shah',
    name: 'Suhani Shah',
    role: 'Mentalist · Magician · Performing since age seven',
    year: '2020',
    img: '/images/performers/suhani-shah.jpg',
  },
  {
    id: 'dj-shaan',
    name: 'DJ Shaan',
    role: 'DJ · Sunburn Campus headliner',
    year: '2020',
    img: '/images/performers/dj-shaan.jpg',
  },
  {
    id: 'afishal',
    name: 'Afishal',
    role: 'Visual DJ · LED suit performer',
    year: '2016',
    img: '/images/performers/afishal.jpg',
  },
  {
    id: 'illuminati',
    name: 'Illuminati',
    role: 'Dance crew · Pro-night headliners',
    year: '2025 & 2026',
    img: '/images/performers/illuminati.jpg',
  },
];

export const contactInfo = {
  title: 'Contact Us',
  description: 'We\'d love to hear from you. Reach out to us for inquiries, collaborations, or any questions about AXIS\'27.',
  address: 'Visvesvaraya National Institute of Technology, South Ambazari Road, Nagpur, Maharashtra 440010',
  email: 'info@axisvnit.in',
};
