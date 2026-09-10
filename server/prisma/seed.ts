import { PrismaClient, Role, SeatType, SeatStatus, DiscountType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting CinePulse database seed...');

  const existingMovieCount = await prisma.movie.count();
  if (existingMovieCount > 0) {
    console.log(`ℹ️ Database already contains ${existingMovieCount} movies. Skipping destructive seed.`);
    return;
  }

  // Clear existing data cleanly in reverse dependency order
  await prisma.payment.deleteMany();
  await prisma.bookingSeat.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.showSeat.deleteMany();
  await prisma.show.deleteMany();
  await prisma.seat.deleteMany();
  await prisma.screen.deleteMany();
  await prisma.theatre.deleteMany();
  await prisma.city.deleteMany();
  await prisma.movieGenre.deleteMany();
  await prisma.review.deleteMany();
  await prisma.movie.deleteMany();
  await prisma.genre.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Cleaned existing tables.');

  // 1. Create Users
  const adminPasswordHash = await bcrypt.hash('Admin@123', 10);
  const userPasswordHash = await bcrypt.hash('User@123', 10);

  const adminUser = await prisma.user.create({
    data: {
      name: 'System Admin',
      email: 'admin@example.com',
      phone: '+91 98765 43210',
      passwordHash: adminPasswordHash,
      role: Role.ADMIN,
    },
  });

  const demoUser = await prisma.user.create({
    data: {
      name: 'Rahul Sharma',
      email: 'rahul.sharma@example.com',
      phone: '+91 98123 45678',
      passwordHash: userPasswordHash,
      role: Role.USER,
    },
  });

  const demoUser2 = await prisma.user.create({
    data: {
      name: 'Priya Patel',
      email: 'priya.patel@example.com',
      phone: '+91 97234 56789',
      passwordHash: userPasswordHash,
      role: Role.USER,
    },
  });

  console.log('✅ Created users (Admin: admin@example.com / Admin@123).');

  // 2. Create Cities
  const citiesData = [
    { name: 'Bhubaneswar', state: 'Odisha', slug: 'bhubaneswar', isPopular: true },
    { name: 'Mumbai', state: 'Maharashtra', slug: 'mumbai', isPopular: true },
    { name: 'Delhi-NCR', state: 'Delhi', slug: 'delhi-ncr', isPopular: true },
    { name: 'Bengaluru', state: 'Karnataka', slug: 'bengaluru', isPopular: true },
    { name: 'Hyderabad', state: 'Telangana', slug: 'hyderabad', isPopular: true },
    { name: 'Chennai', state: 'Tamil Nadu', slug: 'chennai', isPopular: true },
    { name: 'Kolkata', state: 'West Bengal', slug: 'kolkata', isPopular: true },
    { name: 'Pune', state: 'Maharashtra', slug: 'pune', isPopular: true },
  ];

  const cities = await Promise.all(
    citiesData.map((c) => prisma.city.create({ data: c }))
  );
  const cityMap = new Map(cities.map((c) => [c.slug, c.id]));
  console.log(`✅ Created ${cities.length} cities.`);

  // 3. Create Genres
  const genresData = [
    { name: 'Action', slug: 'action' },
    { name: 'Sci-Fi', slug: 'sci-fi' },
    { name: 'Thriller', slug: 'thriller' },
    { name: 'Drama', slug: 'drama' },
    { name: 'Comedy', slug: 'comedy' },
    { name: 'Romance', slug: 'romance' },
    { name: 'Adventure', slug: 'adventure' },
    { name: 'Horror', slug: 'horror' },
    { name: 'Animation', slug: 'animation' },
    { name: 'Fantasy', slug: 'fantasy' },
  ];

  const genres = await Promise.all(
    genresData.map((g) => prisma.genre.create({ data: g }))
  );
  const genreMap = new Map(genres.map((g) => [g.slug, g.id]));
  console.log(`✅ Created ${genres.length} genres.`);

  // 4. Create Movies (16 Movies)
  const moviesData = [
    {
      title: 'Dune: Part Two - Prophecy',
      slug: 'dune-part-two-prophecy',
      description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family, facing a choice between love and the fate of the universe.',
      posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
      backdropUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1600&auto=format&fit=crop',
      trailerUrl: 'https://www.youtube.com/watch?v=Way9Dexny3w',
      duration: 166,
      releaseDate: new Date('2026-03-01'),
      rating: 4.9,
      voteCount: 18450,
      language: 'English',
      formats: ['2D', 'IMAX 3D', '4DX'],
      director: 'Denis Villeneuve',
      cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson', 'Austin Butler'],
      isFeatured: true,
      isNowShowing: true,
      isComingSoon: false,
      genres: ['sci-fi', 'adventure', 'action'],
    },
    {
      title: 'Neon Odyssey: Cyberpunk 2099',
      slug: 'neon-odyssey-cyberpunk-2099',
      description: 'In a rain-drenched megacity running on quantum AI, a rogue synthetics detective unravels a corporate conspiracy that threatens to wipe human consciousness.',
      posterUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800&auto=format&fit=crop',
      backdropUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1600&auto=format&fit=crop',
      trailerUrl: 'https://www.youtube.com/watch?v=qIgmnK_jK-A',
      duration: 142,
      releaseDate: new Date('2026-02-15'),
      rating: 4.7,
      voteCount: 9230,
      language: 'English',
      formats: ['2D', '3D', 'IMAX 3D'],
      director: 'Alex Garland',
      cast: ['Karl Urban', 'Ana de Armas', 'Hiroyuki Sanada'],
      isFeatured: true,
      isNowShowing: true,
      isComingSoon: false,
      genres: ['sci-fi', 'action', 'thriller'],
    },
    {
      title: 'The Royal Heist of Jaipur',
      slug: 'royal-heist-jaipur',
      description: 'A master illusionist and his eclectic crew plot the audacious theft of the Koh-i-Noor sister jewel from an impenetrable fortress during the Diwali royal gala.',
      posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
      backdropUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1600&auto=format&fit=crop',
      trailerUrl: 'https://www.youtube.com/watch?v=8Qn_spdM5Zg',
      duration: 155,
      releaseDate: new Date('2026-02-28'),
      rating: 4.8,
      voteCount: 14200,
      language: 'Hindi',
      formats: ['2D', '4DX'],
      director: 'Kabir Khan',
      cast: ['Ranveer Singh', 'Deepika Padukone', 'Vicky Kaushal'],
      isFeatured: true,
      isNowShowing: true,
      isComingSoon: false,
      genres: ['action', 'thriller', 'drama'],
    },
    {
      title: 'Kalinga: Legend of the Konark',
      slug: 'kalinga-legend-of-konark',
      description: 'An archaeological explorer discovers an ancient celestial blueprint hidden beneath the Sun Temple of Konark, unleashing mystical guardian forces.',
      posterUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=800&auto=format&fit=crop',
      backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop',
      trailerUrl: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
      duration: 150,
      releaseDate: new Date('2026-03-05'),
      rating: 4.8,
      voteCount: 11200,
      language: 'Odia',
      formats: ['2D', '3D'],
      director: 'Sabyasachi Mohapatra',
      cast: ['Babushaan Mohanty', 'Archita Sahu', 'Mihir Das'],
      isFeatured: true,
      isNowShowing: true,
      isComingSoon: false,
      genres: ['fantasy', 'adventure', 'drama'],
    },
    {
      title: 'Quantum Velocity',
      slug: 'quantum-velocity',
      description: 'An elite Formula Zero pilot discovers his hypersonic prototype can briefly slip through localized time loops, putting him in the crosshairs of military intelligence.',
      posterUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=800&auto=format&fit=crop',
      backdropUrl: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=1600&auto=format&fit=crop',
      trailerUrl: 'https://www.youtube.com/watch?v=jBDM18B66U4',
      duration: 128,
      releaseDate: new Date('2026-02-10'),
      rating: 4.5,
      voteCount: 7800,
      language: 'English',
      formats: ['2D', 'IMAX 3D', '4DX'],
      director: 'Joseph Kosinski',
      cast: ['Brad Pitt', 'Damson Idris', 'Kerry Condon'],
      isFeatured: false,
      isNowShowing: true,
      isComingSoon: false,
      genres: ['action', 'thriller'],
    },
    {
      title: 'Midnight in Montmartre',
      slug: 'midnight-in-montmartre',
      description: 'Two estranged artists meet by chance under the lantern-lit cobblestones of Paris and spend a life-altering night rediscovering their passion and forgotten vows.',
      posterUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800&auto=format&fit=crop',
      backdropUrl: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=1600&auto=format&fit=crop',
      trailerUrl: 'https://www.youtube.com/watch?v=FAfR8omt-CY',
      duration: 114,
      releaseDate: new Date('2026-02-14'),
      rating: 4.6,
      voteCount: 6500,
      language: 'English',
      formats: ['2D'],
      director: 'Céline Sciamma',
      cast: ['Florence Pugh', 'Paul Mescal', 'Marion Cotillard'],
      isFeatured: false,
      isNowShowing: true,
      isComingSoon: false,
      genres: ['romance', 'drama'],
    },
    {
      title: 'The Laugh Riot: Delhi 6 Express',
      slug: 'laugh-riot-delhi-6-express',
      description: 'A chaotic wedding party takes the wrong midnight chartered bus from Chandni Chowk, sparking an outrageous series of misunderstandings across Northern highways.',
      posterUrl: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?q=80&w=800&auto=format&fit=crop',
      backdropUrl: 'https://images.unsplash.com/photo-1526478806334-5fd488fcaabc?q=80&w=1600&auto=format&fit=crop',
      trailerUrl: 'https://www.youtube.com/watch?v=TcMBFSGVi1c',
      duration: 130,
      releaseDate: new Date('2026-01-20'),
      rating: 4.4,
      voteCount: 15300,
      language: 'Hindi',
      formats: ['2D'],
      director: 'Raj & DK',
      cast: ['Rajkummar Rao', 'Shraddha Kapoor', 'Pankaj Tripathi'],
      isFeatured: false,
      isNowShowing: true,
      isComingSoon: false,
      genres: ['comedy', 'drama'],
    },
    {
      title: 'Shadows of Blackwood Manor',
      slug: 'shadows-of-blackwood-manor',
      description: 'When an inheritance lawyer arrives at a remote cliffside estate to execute a Victorian aristocrat’s will, the house’s dark history begins to trap him.',
      posterUrl: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=800&auto=format&fit=crop',
      backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop',
      trailerUrl: 'https://www.youtube.com/watch?v=1Vnghdsjmd0',
      duration: 108,
      releaseDate: new Date('2026-02-06'),
      rating: 4.3,
      voteCount: 4200,
      language: 'English',
      formats: ['2D'],
      director: 'James Wan',
      cast: ['Patrick Wilson', 'Vera Farmiga', 'David Tennant'],
      isFeatured: false,
      isNowShowing: true,
      isComingSoon: false,
      genres: ['horror', 'thriller'],
    },
    {
      title: 'Astra: Celestial Guardians',
      slug: 'astra-celestial-guardians',
      description: 'Ancient celestial elemental weapons awaken in modern-day Varanasi, calling upon three ordinary youth to prevent an eclipse that would shatter reality.',
      posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
      backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop',
      trailerUrl: 'https://www.youtube.com/watch?v=V5w1OGCnhLC',
      duration: 168,
      releaseDate: new Date('2026-03-02'),
      rating: 4.8,
      voteCount: 22000,
      language: 'Telugu',
      formats: ['2D', '3D', 'IMAX 3D'],
      director: 'S. S. Rajamouli',
      cast: ['Ram Charan', 'Jr NTR', 'Alia Bhatt'],
      isFeatured: true,
      isNowShowing: true,
      isComingSoon: false,
      genres: ['action', 'fantasy', 'adventure'],
    },
    {
      title: 'The Forest Whisperer',
      slug: 'the-forest-whisperer',
      description: 'An animated fable celebrating the biodiversity of the Western Ghats, where an orphaned leopard cub and a gentle tribal child unite to heal a sacred river.',
      posterUrl: 'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?q=80&w=800&auto=format&fit=crop',
      backdropUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1600&auto=format&fit=crop',
      trailerUrl: 'https://www.youtube.com/watch?v=8Qn_spdM5Zg',
      duration: 98,
      releaseDate: new Date('2026-01-15'),
      rating: 4.9,
      voteCount: 8900,
      language: 'English',
      formats: ['2D', '3D'],
      director: 'Hayao Miyazaki',
      cast: ['Dev Patel', 'Maitreyi Ramakrishnan', 'Sir Ben Kingsley'],
      isFeatured: false,
      isNowShowing: true,
      isComingSoon: false,
      genres: ['animation', 'fantasy', 'adventure'],
    },
    {
      title: 'Silicon Valley Gambit',
      slug: 'silicon-valley-gambit',
      description: 'A high-stakes techno-drama following the founder of an autonomous intelligence startup as venture capitalists and sovereign funds battle for the soul of the tech.',
      posterUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop',
      backdropUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop',
      trailerUrl: 'https://www.youtube.com/watch?v=Way9Dexny3w',
      duration: 135,
      releaseDate: new Date('2026-02-20'),
      rating: 4.6,
      voteCount: 11400,
      language: 'English',
      formats: ['2D'],
      director: 'David Fincher',
      cast: ['Jesse Eisenberg', 'Rooney Mara', 'Jeremy Strong'],
      isFeatured: false,
      isNowShowing: true,
      isComingSoon: false,
      genres: ['drama', 'thriller'],
    },
    {
      title: 'Devara: Wrath of the Seas',
      slug: 'devara-wrath-of-the-seas',
      description: 'A coastal chieftain leads his people against ruthless seafaring syndicates, safeguarding their waters and honoring an unyielding blood vow.',
      posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
      backdropUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop',
      trailerUrl: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
      duration: 172,
      releaseDate: new Date('2026-02-18'),
      rating: 4.7,
      voteCount: 31000,
      language: 'Telugu',
      formats: ['2D', 'IMAX 3D', '4DX'],
      director: 'Koratala Siva',
      cast: ['N. T. Rama Rao Jr.', 'Janhvi Kapoor', 'Saif Ali Khan'],
      isFeatured: true,
      isNowShowing: true,
      isComingSoon: false,
      genres: ['action', 'drama'],
    },
    {
      title: 'Spider-Man: Beyond the Web',
      slug: 'spiderman-beyond-the-web',
      description: 'Miles Morales traverses uncharted dimensional realms, partnering with alternate heroes to repair a shattered multiverse nexus before all realities collapse.',
      posterUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=800&auto=format&fit=crop',
      backdropUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1600&auto=format&fit=crop',
      trailerUrl: 'https://www.youtube.com/watch?v=cqGjhVJWtEg',
      duration: 140,
      releaseDate: new Date('2026-05-15'),
      rating: 0.0,
      voteCount: 0,
      language: 'English',
      formats: ['2D', '3D', 'IMAX 3D'],
      director: 'Joaquim Dos Santos',
      cast: ['Shameik Moore', 'Hailee Steinfeld', 'Oscar Isaac'],
      isFeatured: true,
      isNowShowing: false,
      isComingSoon: true,
      genres: ['animation', 'action', 'adventure'],
    },
    {
      title: 'Avatar: Fire and Ash',
      slug: 'avatar-fire-and-ash',
      description: 'Jake Sully and Neytiri encounter a fierce, volcanic clan of Na’vi known as the Ash People, testing their loyalties and the fragile balance of Pandora.',
      posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
      backdropUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1600&auto=format&fit=crop',
      trailerUrl: 'https://www.youtube.com/watch?v=d9MyW72ELq0',
      duration: 185,
      releaseDate: new Date('2026-12-18'),
      rating: 0.0,
      voteCount: 0,
      language: 'English',
      formats: ['2D', '3D', 'IMAX 3D', '4DX'],
      director: 'James Cameron',
      cast: ['Sam Worthington', 'Zoe Saldana', 'Sigourney Weaver'],
      isFeatured: true,
      isNowShowing: false,
      isComingSoon: true,
      genres: ['sci-fi', 'action', 'adventure'],
    },
    {
      title: 'The Great Indian Kitchen 2',
      slug: 'the-great-indian-kitchen-2',
      description: 'A poignant and deeply resonant continuation exploring evolving gender roles, modern aspirations, and societal traditions in a rapidly changing subcontinent.',
      posterUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=800&auto=format&fit=crop',
      backdropUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=1600&auto=format&fit=crop',
      trailerUrl: 'https://www.youtube.com/watch?v=TcMBFSGVi1c',
      duration: 125,
      releaseDate: new Date('2026-04-10'),
      rating: 0.0,
      voteCount: 0,
      language: 'Hindi',
      formats: ['2D'],
      director: 'Jeo Baby',
      cast: ['Nimisha Sajayan', 'Suraj Venjaramoodu'],
      isFeatured: false,
      isNowShowing: false,
      isComingSoon: true,
      genres: ['drama'],
    },
    {
      title: 'Echoes of Chilika',
      slug: 'echoes-of-chilika',
      description: 'A poetic mystery set against the migratory bird sanctuaries and tranquil brackish waters of Asia’s largest coastal lagoon.',
      posterUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
      backdropUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop',
      trailerUrl: 'https://www.youtube.com/watch?v=jBDM18B66U4',
      duration: 118,
      releaseDate: new Date('2026-03-25'),
      rating: 0.0,
      voteCount: 0,
      language: 'Odia',
      formats: ['2D'],
      director: 'Himansu Khatua',
      cast: ['Anubhav Mohanty', 'Barsha Priyadarshini'],
      isFeatured: false,
      isNowShowing: false,
      isComingSoon: true,
      genres: ['drama', 'romance'],
    },
  ];

  const createdMovies = [];
  for (const m of moviesData) {
    const { genres: movieGenres, ...movieData } = m;
    const movie = await prisma.movie.create({
      data: {
        ...movieData,
        genres: {
          create: movieGenres.map((gSlug) => ({
            genre: { connect: { id: genreMap.get(gSlug)! } },
          })),
        },
      },
    });
    createdMovies.push(movie);
  }
  console.log(`✅ Created ${createdMovies.length} movies.`);

  // 5. Create Theatres & Screens
  const theatresData = [
    {
      name: 'CinePulse Grand IMAX & Luxe',
      citySlug: 'bhubaneswar',
      location: 'Patia, Infocity Road',
      address: 'Plot 42, DLF CyberCity Square, Patia, Bhubaneswar, Odisha 751024',
      facilities: ['Dolby Atmos', 'IMAX Laser', 'Food Lounge', 'Valet Parking', 'Wheelchair Access'],
    },
    {
      name: 'CinePulse Multiplex Saheed Nagar',
      citySlug: 'bhubaneswar',
      location: 'Saheed Nagar, Janpath',
      address: 'Forum Mart Complex, Janpath Road, Saheed Nagar, Bhubaneswar, Odisha 751007',
      facilities: ['Dolby 7.1', '4K Projection', 'Cafeteria', 'Parking'],
    },
    {
      name: 'CinePulse Gold Cinema DN Regalia',
      citySlug: 'bhubaneswar',
      location: 'South City, Tamando',
      address: 'DN Regalia Mall, NH-16, Tamando, Bhubaneswar, Odisha 751019',
      facilities: ['Recliner Seats', 'Gourmet Dining', 'Dolby Atmos'],
    },
    {
      name: 'CinePulse PVR Phoenix Palladium',
      citySlug: 'mumbai',
      location: 'Lower Parel',
      address: 'High Street Phoenix, 462 Senapati Bapat Marg, Lower Parel, Mumbai, Maharashtra 400013',
      facilities: ['IMAX Laser', '4DX', 'Dolby Atmos', 'VIP Butler Service'],
    },
    {
      name: 'CinePulse INOX Forum South',
      citySlug: 'bengaluru',
      location: 'Koramangala',
      address: 'The Forum Mall, 21 Hosur Road, Koramangala, Bengaluru, Karnataka 560095',
      facilities: ['Dolby Atmos', '4K Laser', 'Food Court', 'Metro Connectivity'],
    },
    {
      name: 'CinePulse Cinepolis Select Citywalk',
      citySlug: 'delhi-ncr',
      location: 'Saket',
      address: 'Select CITYWALK Mall, A-3 District Centre, Saket, New Delhi 110017',
      facilities: ['4DX', 'VIP Recliners', 'Dolby Atmos', 'Valet Parking'],
    },
    {
      name: 'CinePulse Prasads Large Screen',
      citySlug: 'hyderabad',
      location: 'Necklace Road',
      address: 'NTR Gardens, Necklace Road, Hyderabad, Telangana 500004',
      facilities: ['Giant Screen', 'Dolby Atmos', 'Arcade Gaming', 'Food Court'],
    },
    {
      name: 'CinePulse Palazzo Express Avenue',
      citySlug: 'chennai',
      location: 'Royapettah',
      address: 'Express Avenue Mall, Whites Road, Royapettah, Chennai, Tamil Nadu 600014',
      facilities: ['IMAX', 'Italian Marble Lounge', 'Dolby Atmos'],
    },
    {
      name: 'CinePulse South City Cineplex',
      citySlug: 'kolkata',
      location: 'Prince Anwar Shah Road',
      address: 'South City Mall, 375 Prince Anwar Shah Rd, Kolkata, West Bengal 700068',
      facilities: ['Dolby Atmos', '4K Barco', 'Food Court'],
    },
    {
      name: 'CinePulse Seasons CineLuxe',
      citySlug: 'pune',
      location: 'Magarpatta City',
      address: 'Seasons Mall, Magarpatta, Hadapsar, Pune, Maharashtra 411028',
      facilities: ['Recliners', 'Dolby Atmos', 'Free WiFi', 'Ample Parking'],
    },
  ];

  const createdTheatres = [];
  for (const t of theatresData) {
    const theatre = await prisma.theatre.create({
      data: {
        name: t.name,
        cityId: cityMap.get(t.citySlug)!,
        location: t.location,
        address: t.address,
        facilities: t.facilities,
      },
    });
    createdTheatres.push(theatre);

    // Create 2 Screens for each theatre
    const screen1 = await prisma.screen.create({
      data: {
        theatreId: theatre.id,
        name: 'Screen 1 - IMAX Experience',
        screenType: 'IMAX 3D',
        rows: 7,
        cols: 10,
        totalSeats: 70,
      },
    });

    const screen2 = await prisma.screen.create({
      data: {
        theatreId: theatre.id,
        name: 'Screen 2 - Dolby Atmos Gold',
        screenType: 'Dolby Cinema',
        rows: 6,
        cols: 8,
        totalSeats: 48,
      },
    });

    // Populate seats for Screen 1 (70 seats)
    // Rows: A (Recliner), B,C (Premium), D,E (Executive), F,G (Normal)
    const rowTypes: { row: string; type: SeatType; price: number }[] = [
      { row: 'A', type: SeatType.RECLINER, price: 450 },
      { row: 'B', type: SeatType.PREMIUM, price: 320 },
      { row: 'C', type: SeatType.PREMIUM, price: 320 },
      { row: 'D', type: SeatType.EXECUTIVE, price: 250 },
      { row: 'E', type: SeatType.EXECUTIVE, price: 250 },
      { row: 'F', type: SeatType.NORMAL, price: 180 },
      { row: 'G', type: SeatType.NORMAL, price: 180 },
    ];

    for (const rt of rowTypes) {
      for (let num = 1; num <= 10; num++) {
        await prisma.seat.create({
          data: {
            screenId: screen1.id,
            row: rt.row,
            number: num,
            seatType: rt.type,
            basePrice: rt.price,
          },
        });
      }
    }

    // Populate seats for Screen 2 (48 seats)
    const rowTypes2: { row: string; type: SeatType; price: number }[] = [
      { row: 'A', type: SeatType.RECLINER, price: 400 },
      { row: 'B', type: SeatType.PREMIUM, price: 300 },
      { row: 'C', type: SeatType.PREMIUM, price: 300 },
      { row: 'D', type: SeatType.EXECUTIVE, price: 220 },
      { row: 'E', type: SeatType.NORMAL, price: 160 },
      { row: 'F', type: SeatType.NORMAL, price: 160 },
    ];

    for (const rt of rowTypes2) {
      for (let num = 1; num <= 8; num++) {
        await prisma.seat.create({
          data: {
            screenId: screen2.id,
            row: rt.row,
            number: num,
            seatType: rt.type,
            basePrice: rt.price,
          },
        });
      }
    }
  }
  console.log(`✅ Created ${createdTheatres.length} theatres with screens and hundreds of seats.`);

  // 6. Create Shows for Now-Showing Movies
  const nowShowingMovies = createdMovies.filter((m) => m.isNowShowing);
  const showTimes = [
    { start: '10:00 AM', end: '12:45 PM', mult: 0.9 },
    { start: '01:30 PM', end: '04:15 PM', mult: 1.0 },
    { start: '04:45 PM', end: '07:30 PM', mult: 1.1 },
    { start: '08:00 PM', end: '10:45 PM', mult: 1.2 },
    { start: '10:45 PM', end: '01:30 AM', mult: 1.0 },
  ];

  // Schedule shows for today and tomorrow
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const datesToSchedule = [
    today,
    new Date(today.getTime() + 24 * 60 * 60 * 1000),
    new Date(today.getTime() + 48 * 60 * 60 * 1000),
  ];

  let showCount = 0;
  for (const theatre of createdTheatres) {
    const screens = await prisma.screen.findMany({
      where: { theatreId: theatre.id },
      include: { seats: true },
    });

    for (const date of datesToSchedule) {
      // Pick 2-3 movies per theatre
      const chosenMovies = nowShowingMovies; // schedule all now‑showing movies for richer variety

      for (let i = 0; i < chosenMovies.length; i++) {
        const movie = chosenMovies[i];
        const screen = screens[i % screens.length];
        const timeSlot = showTimes[i % showTimes.length];

        const show = await prisma.show.create({
          data: {
            movieId: movie.id,
            theatreId: theatre.id,
            screenId: screen.id,
            date: date,
            startTime: timeSlot.start,
            endTime: timeSlot.end,
            basePriceMultiplier: timeSlot.mult,
            status: 'ACTIVE',
          },
        });
        showCount++;

        // Generate ShowSeat inventory
        const showSeatData = screen.seats.map((seat, seatIdx) => {
          // Pre-book 2-3 seats in some shows for realism
          const isPreBooked = (seatIdx % 17 === 0 || seatIdx % 23 === 0) && seat.row !== 'A';
          return {
            showId: show.id,
            seatId: seat.id,
            status: isPreBooked ? SeatStatus.BOOKED : SeatStatus.AVAILABLE,
            price: Math.round(seat.basePrice * timeSlot.mult),
          };
        });

        await prisma.showSeat.createMany({
          data: showSeatData,
        });
      }
    }
  }
  console.log(`✅ Created ${showCount} scheduled shows with instant seat availability.`);

  // 7. Create Coupons
  const couponsData = [
    {
      code: 'WELCOME50',
      description: 'Get 50% discount up to ₹150 on your first booking with CinePulse!',
      discountType: DiscountType.PERCENTAGE,
      discountValue: 50,
      minAmount: 300,
      maxDiscount: 150,
      validTill: new Date('2027-12-31'),
    },
    {
      code: 'MOVIE100',
      description: 'Flat ₹100 OFF on transactions of ₹400 or more.',
      discountType: DiscountType.FLAT,
      discountValue: 100,
      minAmount: 400,
      maxDiscount: 100,
      validTill: new Date('2027-12-31'),
    },
    {
      code: 'WEEKEND20',
      description: 'Enjoy 20% discount up to ₹200 on all weekend blockbuster shows!',
      discountType: DiscountType.PERCENTAGE,
      discountValue: 20,
      minAmount: 500,
      maxDiscount: 200,
      validTill: new Date('2027-12-31'),
    },
    {
      code: 'CINEPULSE50',
      description: 'Instant ₹50 discount for all entertainment lovers.',
      discountType: DiscountType.FLAT,
      discountValue: 50,
      minAmount: 250,
      maxDiscount: 50,
      validTill: new Date('2027-12-31'),
    },
    {
      code: 'VIPRECLINER',
      description: 'Flat ₹150 OFF on 2 or more Recliner lounge tickets.',
      discountType: DiscountType.FLAT,
      discountValue: 150,
      minAmount: 800,
      maxDiscount: 150,
      validTill: new Date('2027-12-31'),
    },
  ];

  await prisma.coupon.createMany({
    data: couponsData,
  });
  console.log(`✅ Created ${couponsData.length} active coupons.`);

  // 8. Create Sample Reviews
  const firstMovie = createdMovies[0];
  const secondMovie = createdMovies[1];

  await prisma.review.createMany({
    data: [
      {
        userId: demoUser.id,
        movieId: firstMovie.id,
        rating: 5.0,
        comment: 'An absolute visual and sonic masterpiece! Denis Villeneuve has outdone himself. The IMAX experience is mandatory!',
      },
      {
        userId: demoUser2.id,
        movieId: firstMovie.id,
        rating: 4.8,
        comment: 'The world-building and sound design are out of this world. Austin Butler gave an unforgettable performance.',
      },
      {
        userId: demoUser.id,
        movieId: secondMovie.id,
        rating: 4.6,
        comment: 'High-octane cyberpunk action with gorgeous synthwave score and stellar cinematography.',
      },
    ],
  });
  console.log('✅ Created sample user reviews.');

  console.log('🎉 CinePulse seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
