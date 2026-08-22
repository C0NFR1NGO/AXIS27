export const eventCategories = [
  {
    id: 'management',
    title: 'Management & Analytics',
    subtitle: 'Strategize. Analyze. Dominate.',
    description: 'Whether you\'re a market guru, a financial expert, or a data wizard, showcase your skills and master the art of business intelligence.',
    events: [
      { name: '221B Baker Street', desc: 'A Sherlock Holmes-style mystery-solving competition.' },
      { name: 'Laser Litt', desc: 'Test your precision and agility in a laser maze challenge.' },
      { name: 'Freak-O-Matix', desc: 'A quirky blend of logic, mathematics, and fun puzzles.' },
      { name: 'Who\'s the Boss', desc: 'Showcase leadership and management skills.' },
      { name: 'Wallstreet', desc: 'Simulate stock trading and financial decision-making.' },
      { name: 'MUN', desc: 'Debate global issues and develop diplomatic strategies.' },
    ],
  },
  {
    id: 'software',
    title: 'Software & Electronics',
    subtitle: 'Innovate. Code. Electrify.',
    description: 'From blockchain to AI, this is your playground to experiment and revolutionize technology.',
    events: [
      { name: 'Capture The Flag', desc: 'A thrilling cybersecurity challenge.' },
      { name: 'Electroblitz', desc: 'Push the limits of electronics and embedded systems.' },
      { name: 'AI Ideathon', desc: 'Compete to create groundbreaking AI-powered solutions.' },
      { name: 'Insomnia', desc: 'An overnight coding marathon for the ultimate problem-solvers.' },
      { name: 'Web Reshape', desc: 'Redefine the future of web development and design.' },
    ],
  },
  {
    id: 'robotics',
    title: 'Robotics & Automation',
    subtitle: 'Build. Automate. Dominate.',
    description: 'Where machines aren\'t just built—they\'re unleashed!',
    events: [
      { name: 'Robowars', desc: 'Metal meets mayhem as battle bots fight for survival.' },
      { name: 'Drone At Work', desc: 'Take to the skies and show off your aerial skills.' },
      { name: 'Autobot', desc: 'AI-powered bots racing through mind-bending tracks.' },
      { name: 'Manual Robotics', desc: 'Build bots that push engineering boundaries.' },
      { name: 'RoboCup', desc: 'Design autonomous soccer bots.' },
      { name: 'AquaHunt', desc: 'Dive into underwater robotics engineering.' },
      { name: 'Mechatryst', desc: 'The ultimate RC car showdown!' },
    ],
  },
  {
    id: 'construction',
    title: 'Construction & Design',
    subtitle: 'Build. Innovate. Transform.',
    description: 'Where creativity meets engineering! Foster your passion for sustainable architecture and advanced construction.',
    events: [
      { name: 'Crepido', desc: 'Design and construct the most efficient structures.' },
      { name: 'Aquasklark', desc: 'Innovate in water management and sustainable design.' },
    ],
  },
  {
    id: 'igniting-minds',
    title: 'Igniting Minds',
    subtitle: 'Think. Create. Transform.',
    description: 'Curiosity fuels innovation! Redefine the future through creative problem-solving.',
    events: [
      { name: 'Kartavya', desc: 'Innovate for social good through technology.' },
      { name: 'Toycathon', desc: 'Where imagination meets model making.' },
    ],
  },
];

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
  { id: 'robowars', src: 'https://picsum.photos/seed/axis27-robowars/1200/1200', alt: 'Battle bots colliding in the Robowars arena', tag: 'ROBOWARS', span: 'large' },
  { id: 'drone-show', src: 'https://picsum.photos/seed/axis27-drone-show/800/800', alt: 'The 16-drone night show over the open sky', tag: 'DRONE SHOW', span: '' },
  { id: 'ctf', src: 'https://picsum.photos/seed/axis27-ctf/800/800', alt: 'Teams locked in a Capture The Flag terminal war', tag: 'CAPTURE THE FLAG', span: '' },
  { id: 'concert', src: 'https://picsum.photos/seed/axis27-concert/800/1200', alt: 'The closing concert stage lit under a crimson glow', tag: 'CONCERT NIGHT', span: 'tall' },
  { id: 'workshop', src: 'https://picsum.photos/seed/axis27-workshop/1200/800', alt: 'Students building circuits at a hardware workshop', tag: 'WORKSHOPS', span: 'wide' },
  { id: 'expo', src: 'https://picsum.photos/seed/axis27-expo/800/800', alt: 'Defence and ISRO exhibition stalls drawing a crowd', tag: 'EXPO', span: '' },
  { id: 'drone-flight', src: 'https://picsum.photos/seed/axis27-drone-flight/800/800', alt: 'A pilot drone climbing into the desert sky', tag: 'DRONE AT WORK', span: '' },
  { id: 'robocup', src: 'https://picsum.photos/seed/axis27-robocup/1200/800', alt: 'Autonomous bots on the RoboCup field', tag: 'ROBOCUP', span: 'wide' },
  { id: 'mechatryst', src: 'https://picsum.photos/seed/axis27-mechatryst/800/800', alt: 'An RC car screaming down the Mechatryst track', tag: 'MECHATRYST', span: '' },
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
