import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting CampusCare database seed...');

  // 1. Clean existing records
  await prisma.feedback.deleteMany();
  await prisma.complaint.deleteMany();
  await prisma.user.deleteMany();

  // 2. Hash default password
  const salt = await bcrypt.genSalt(10);
  const adminPasswordHash = await bcrypt.hash('Admin@123', salt);
  const studentPasswordHash = await bcrypt.hash('Student@123', salt);

  // 3. Create Demo Users
  const admin = await prisma.user.create({
    data: {
      name: 'Campus Administrator',
      email: 'admin@campuscare.com',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
    },
  });

  const student1 = await prisma.user.create({
    data: {
      name: 'Alex Turner',
      email: 'student@campuscare.com',
      passwordHash: studentPasswordHash,
      role: 'STUDENT',
    },
  });

  const student2 = await prisma.user.create({
    data: {
      name: 'Jane Doe',
      email: 'jane.doe@campuscare.com',
      passwordHash: studentPasswordHash,
      role: 'STUDENT',
    },
  });

  const student3 = await prisma.user.create({
    data: {
      name: 'Rahul Sharma',
      email: 'rahul.sharma@campuscare.com',
      passwordHash: studentPasswordHash,
      role: 'STUDENT',
    },
  });

  const student4 = await prisma.user.create({
    data: {
      name: 'Priya Patel',
      email: 'priya.patel@campuscare.com',
      passwordHash: studentPasswordHash,
      role: 'STUDENT',
    },
  });

  console.log(`✅ Created 1 Admin and 4 Student users.`);

  // 4. Create 20 Realistic Complaints
  const now = new Date();
  const daysAgo = (days: number, hours = 0) => {
    const d = new Date(now);
    d.setDate(d.getDate() - days);
    d.setHours(d.getHours() - hours);
    return d;
  };

  const complaintsData = [
    // 1. Alex Turner - Wi-Fi
    {
      userId: student1.id,
      title: 'Frequent Wi-Fi disconnections on Central Library 3rd floor',
      description: 'The campus Wi-Fi access point AP-LIB-03 drops signal every 5 to 10 minutes during peak study hours. Laptops are unable to sustain connection to online research portals.',
      category: 'WIFI_IT' as const,
      location: 'Central Library – 3rd Floor East Wing',
      priority: 'HIGH' as const,
      status: 'IN_PROGRESS' as const,
      createdAt: daysAgo(2, 4),
      updatedAt: daysAgo(0, 5),
      aiCategory: 'WIFI_IT',
      aiPriority: 'HIGH',
      aiSummary: 'Library 3rd floor access point AP-LIB-03 unstable during study hours.',
      aiReason: 'High concurrent user load affecting academic research access.',
      aiDepartment: 'Information Technology Services',
      aiConfidence: 0.95,
      feedback: null,
    },
    // 2. Alex Turner - Plumbing (Resolved + Feedback)
    {
      userId: student1.id,
      title: 'Water pipe dripping in Ground Floor Men\'s Washroom',
      description: 'The drainage pipe beneath the second washbasin is continuously leaking, causing water puddles near the washroom entryway.',
      category: 'PLUMBING' as const,
      location: 'Academic Block A – Ground Floor',
      priority: 'HIGH' as const,
      status: 'RESOLVED' as const,
      createdAt: daysAgo(6),
      updatedAt: daysAgo(3),
      aiCategory: 'PLUMBING',
      aiPriority: 'HIGH',
      aiSummary: 'Washroom pipe leakage causing floor puddling.',
      aiReason: 'Slip and hygiene hazard requiring rapid estate maintenance.',
      aiDepartment: 'Estate & Plumbing Services',
      aiConfidence: 0.94,
      feedback: {
        userId: student1.id,
        rating: 5,
        comment: 'Plumbing technician arrived within 3 hours, replaced the pipe gasket, and cleaned up the puddles. Outstanding service!',
      },
    },
    // 3. Alex Turner - Electrical
    {
      userId: student1.id,
      title: 'AC unit blowing ambient air in Seminar Hall B',
      description: 'The split AC unit on the left wall produces a loud buzzing noise and does not provide cool air. Afternoon guest lectures become very stuffy.',
      category: 'ELECTRICAL' as const,
      location: 'Admin Building – Seminar Hall B',
      priority: 'MEDIUM' as const,
      status: 'PENDING' as const,
      createdAt: daysAgo(0, 8),
      updatedAt: daysAgo(0, 8),
      aiCategory: 'ELECTRICAL',
      aiPriority: 'MEDIUM',
      aiSummary: 'Seminar Hall B air conditioner cooling failure with compressor noise.',
      aiReason: 'Ventilation issue causing thermal discomfort for scheduled lectures.',
      aiDepartment: 'Electrical Maintenance Wing',
      aiConfidence: 0.91,
      feedback: null,
    },
    // 4. Alex Turner - Hostel Maintenance (Resolved + Feedback)
    {
      userId: student1.id,
      title: 'Loose window latch in Hostel Block 1 Room 204',
      description: 'The sliding window latch is detached from the frame. Window rattles violently during monsoon winds.',
      category: 'HOSTEL_MAINTENANCE' as const,
      location: 'Boys Hostel 1 – Room 204',
      priority: 'LOW' as const,
      status: 'RESOLVED' as const,
      createdAt: daysAgo(9),
      updatedAt: daysAgo(7),
      aiCategory: 'HOSTEL_MAINTENANCE',
      aiPriority: 'LOW',
      aiSummary: 'Window latch mechanical fault in room 204.',
      aiReason: 'Minor residential repair request.',
      aiDepartment: 'Student Residence Administration',
      aiConfidence: 0.89,
      feedback: {
        userId: student1.id,
        rating: 4,
        comment: 'Carpenter fixed the latch with new screws. Secure now.',
      },
    },
    // 5. Jane Doe - Classroom Equipment (Resolved + Feedback)
    {
      userId: student2.id,
      title: 'Projector HDMI port damaged in Classroom 102',
      description: 'The HDMI cable socket on the instructor podium is physically bent. Faculty and students cannot project lecture slides.',
      category: 'CLASSROOM_EQUIPMENT' as const,
      location: 'Science Block – Classroom 102',
      priority: 'HIGH' as const,
      status: 'RESOLVED' as const,
      createdAt: daysAgo(4),
      updatedAt: daysAgo(2),
      aiCategory: 'CLASSROOM_EQUIPMENT',
      aiPriority: 'HIGH',
      aiSummary: 'Damaged podium HDMI port hindering class presentations.',
      aiReason: 'Classroom multimedia outage halts instructional activities.',
      aiDepartment: 'Academic Media & AV Support',
      aiConfidence: 0.96,
      feedback: {
        userId: student2.id,
        rating: 5,
        comment: 'AV support team installed a brand-new multi-port switcher. Presentations working flawlessly now.',
      },
    },
    // 6. Jane Doe - Cleanliness
    {
      userId: student2.id,
      title: 'Cafeteria outdoor dining tables not cleared regularly',
      description: 'Lunch trays and food waste remain on patio tables for over 3 hours during peak afternoon, attracting birds and flies.',
      category: 'CLEANLINESS' as const,
      location: 'Student Activity Center – Cafeteria Patio',
      priority: 'MEDIUM' as const,
      status: 'IN_PROGRESS' as const,
      createdAt: daysAgo(1, 10),
      updatedAt: daysAgo(0, 4),
      aiCategory: 'CLEANLINESS',
      aiPriority: 'MEDIUM',
      aiSummary: 'Delayed food tray clearance on cafeteria outdoor patio.',
      aiReason: 'Sanitation standard compliance needed for dining areas.',
      aiDepartment: 'Sanitation & Housekeeping',
      aiConfidence: 0.93,
      feedback: null,
    },
    // 7. Jane Doe - Transport
    {
      userId: student2.id,
      title: 'Campus shuttle Route 3 consistently 25 mins late',
      description: 'The morning 8:15 AM bus from Metro Station Gate 2 arrives past 8:40 AM every Tuesday and Thursday, causing first-period lecture attendance penalties.',
      category: 'TRANSPORT' as const,
      location: 'Metro Station – Shuttle Pick-up Bay',
      priority: 'MEDIUM' as const,
      status: 'PENDING' as const,
      createdAt: daysAgo(1, 14),
      updatedAt: daysAgo(1, 14),
      aiCategory: 'TRANSPORT',
      aiPriority: 'MEDIUM',
      aiSummary: 'Route 3 morning campus shuttle timing delay.',
      aiReason: 'Transit schedule variance impacting student class punctuality.',
      aiDepartment: 'Campus Logistics & Transport',
      aiConfidence: 0.92,
      feedback: null,
    },
    // 8. Jane Doe - Infrastructure
    {
      userId: student2.id,
      title: 'Broken paver block on North Botanical Walkway',
      description: 'Several stone pavers have shifted and cracked, creating a sharp raised edge where pedestrians could trip after sunset.',
      category: 'INFRASTRUCTURE' as const,
      location: 'Campus North Zone – Botanical Garden Path',
      priority: 'LOW' as const,
      status: 'PENDING' as const,
      createdAt: daysAgo(3),
      updatedAt: daysAgo(3),
      aiCategory: 'INFRASTRUCTURE',
      aiPriority: 'LOW',
      aiSummary: 'Displaced paver stones on pedestrian botanical walkway.',
      aiReason: 'Minor trip hazard along illuminated outdoor pathway.',
      aiDepartment: 'Civil Infrastructure & Grounds',
      aiConfidence: 0.88,
      feedback: null,
    },
    // 9. Rahul Sharma - Electrical
    {
      userId: student3.id,
      title: 'Streetlight #14 flickering continuously near Gate 2',
      description: 'The tall LED lamppost right before the parking entrance strobes violently at night, causing high glare and low visibility for cyclists.',
      category: 'ELECTRICAL' as const,
      location: 'Gate 2 – Perimeter Ring Road',
      priority: 'MEDIUM' as const,
      status: 'IN_PROGRESS' as const,
      createdAt: daysAgo(2, 6),
      updatedAt: daysAgo(0, 6),
      aiCategory: 'ELECTRICAL',
      aiPriority: 'MEDIUM',
      aiSummary: 'Perimeter lamppost #14 strobe flickering at night.',
      aiReason: 'Night road illumination safety concern for vehicle drivers and cyclists.',
      aiDepartment: 'Electrical Maintenance Wing',
      aiConfidence: 0.94,
      feedback: null,
    },
    // 10. Rahul Sharma - Security (Resolved + Feedback)
    {
      userId: student3.id,
      title: 'Motorbikes parking in reserved bicycle bays',
      description: 'Fuel motorcycles have crowded the pedal bicycle stand near the gymnasium, blocking bicycle chain locking racks.',
      category: 'SECURITY' as const,
      location: 'Sports Complex – Cycle Stand',
      priority: 'MEDIUM' as const,
      status: 'RESOLVED' as const,
      createdAt: daysAgo(5),
      updatedAt: daysAgo(2),
      aiCategory: 'SECURITY',
      aiPriority: 'MEDIUM',
      aiSummary: 'Unauthorized motorcycle encroachment in bicycle stand.',
      aiReason: 'Parking policy enforcement required by campus security personnel.',
      aiDepartment: 'Campus Security Division',
      aiConfidence: 0.91,
      feedback: {
        userId: student3.id,
        rating: 4,
        comment: 'Security placed dedicated bollards and warning signboards. Stand is clear now.',
      },
    },
    // 11. Rahul Sharma - Wi-Fi (Resolved + Feedback)
    {
      userId: student3.id,
      title: 'IT Lab 4 Network printer out of toner cartridge',
      description: 'Students are unable to print programming assignment lab records as the central networked LaserJet displays \'Cartridge Exhausted\'.',
      category: 'WIFI_IT' as const,
      location: 'Computing Center – Lab 4',
      priority: 'HIGH' as const,
      status: 'RESOLVED' as const,
      createdAt: daysAgo(7),
      updatedAt: daysAgo(5),
      aiCategory: 'WIFI_IT',
      aiPriority: 'HIGH',
      aiSummary: 'Lab 4 network printer toner depletion during assignment deadlines.',
      aiReason: 'Essential academic printing service interrupted.',
      aiDepartment: 'Information Technology Services',
      aiConfidence: 0.97,
      feedback: {
        userId: student3.id,
        rating: 5,
        comment: 'New high-yield toner cartridge installed the next morning. Thank you!',
      },
    },
    // 12. Rahul Sharma - Other
    {
      userId: student3.id,
      title: 'Echo and feedback noise in Main Auditorium Mic 2',
      description: 'During student club rehearsals, handheld wireless microphone #2 generates severe acoustic feedback squeal whenever pointed near stage monitors.',
      category: 'OTHER' as const,
      location: 'Main University Auditorium',
      priority: 'LOW' as const,
      status: 'PENDING' as const,
      createdAt: daysAgo(2),
      updatedAt: daysAgo(2),
      aiCategory: 'OTHER',
      aiPriority: 'LOW',
      aiSummary: 'Auditorium wireless microphone gain and acoustic feedback calibration needed.',
      aiReason: 'Audio setup tuning for extracurricular auditorium functions.',
      aiDepartment: 'Audio-Visual Facilities',
      aiConfidence: 0.85,
      feedback: null,
    },
    // 13. Priya Patel - Cleanliness (Resolved + Feedback)
    {
      userId: student4.id,
      title: 'Water dispenser drip tray overflow in Engineering Block C',
      description: 'The cold water dispenser on 2nd floor has an overflowing drip tray spilling onto floor tiles.',
      category: 'CLEANLINESS' as const,
      location: 'Engineering Block C – 2nd Floor Corridor',
      priority: 'LOW' as const,
      status: 'RESOLVED' as const,
      createdAt: daysAgo(8),
      updatedAt: daysAgo(6),
      aiCategory: 'CLEANLINESS',
      aiPriority: 'LOW',
      aiSummary: 'Water dispenser drip tray overflow.',
      aiReason: 'Housekeeping maintenance to prevent puddle accumulation.',
      aiDepartment: 'Sanitation & Housekeeping',
      aiConfidence: 0.90,
      feedback: {
        userId: student4.id,
        rating: 5,
        comment: 'Tray emptied and wiped down promptly.',
      },
    },
    // 14. Priya Patel - Infrastructure
    {
      userId: student4.id,
      title: 'Treadmill #2 belt slipping in Gymnasium Cardio Zone',
      description: 'The running belt on treadmill #2 slips erratically at speeds exceeding 7.5 km/h, posing an ankle sprain risk for student runners.',
      category: 'INFRASTRUCTURE' as const,
      location: 'Student Activity Center – Fitness Gym',
      priority: 'HIGH' as const,
      status: 'IN_PROGRESS' as const,
      createdAt: daysAgo(3, 8),
      updatedAt: daysAgo(1, 2),
      aiCategory: 'INFRASTRUCTURE',
      aiPriority: 'HIGH',
      aiSummary: 'Gym treadmill belt tension malfunction posing safety risk.',
      aiReason: 'Fitness equipment safety hazard requires certified technician inspection.',
      aiDepartment: 'Sports & Fitness Infrastructure',
      aiConfidence: 0.95,
      feedback: null,
    },
    // 15. Priya Patel - Plumbing
    {
      userId: student4.id,
      title: 'Low water pressure in Girls Hostel 2 Fourth Floor',
      description: 'Showers on the 4th floor have negligible water pressure between 7:00 AM and 9:00 AM before classes.',
      category: 'PLUMBING' as const,
      location: 'Girls Hostel 2 – 4th Floor Wing B',
      priority: 'HIGH' as const,
      status: 'IN_PROGRESS' as const,
      createdAt: daysAgo(2, 12),
      updatedAt: daysAgo(0, 10),
      aiCategory: 'PLUMBING',
      aiPriority: 'HIGH',
      aiSummary: 'Morning peak water pressure deficit on residential top floor.',
      aiReason: 'Overhead booster pump configuration requires calibration.',
      aiDepartment: 'Estate & Plumbing Services',
      aiConfidence: 0.96,
      feedback: null,
    },
    // 16. Priya Patel - Electrical
    {
      userId: student4.id,
      title: 'Exhaust fan stopped working in Chemistry Wet Lab 3',
      description: 'The fume ventilation exhaust fan is dead. Chemical vapors from titration experiments linger in the lab.',
      category: 'ELECTRICAL' as const,
      location: 'Science Complex – Chemistry Lab 304',
      priority: 'HIGH' as const,
      status: 'PENDING' as const,
      createdAt: daysAgo(0, 3),
      updatedAt: daysAgo(0, 3),
      aiCategory: 'ELECTRICAL',
      aiPriority: 'HIGH',
      aiSummary: 'Chemistry lab fume exhaust fan motor failure.',
      aiReason: 'Laboratory ventilation critical for student respiratory safety during experiments.',
      aiDepartment: 'Electrical Maintenance Wing',
      aiConfidence: 0.98,
      feedback: null,
    },
    // 17. Alex Turner - Hostel Maintenance
    {
      userId: student1.id,
      title: 'Hostel common room study chair backrest snapped',
      description: 'An ergonomic chair in the study hall has a broken plastic support and should be replaced.',
      category: 'HOSTEL_MAINTENANCE' as const,
      location: 'Boys Hostel 1 – Common Study Room',
      priority: 'LOW' as const,
      status: 'PENDING' as const,
      createdAt: daysAgo(1, 2),
      updatedAt: daysAgo(1, 2),
      aiCategory: 'HOSTEL_MAINTENANCE',
      aiPriority: 'LOW',
      aiSummary: 'Damaged study chair in hostel common room.',
      aiReason: 'Furniture replacement request.',
      aiDepartment: 'Student Residence Administration',
      aiConfidence: 0.87,
      feedback: null,
    },
    // 18. Jane Doe - Security
    {
      userId: student2.id,
      title: 'Broken lock on East Fire Exit door',
      description: 'The push-bar mechanism on the 1st floor fire exit is jammed half-open, compromising building security and fire egress.',
      category: 'SECURITY' as const,
      location: 'Management Studies Block – East Wing Exit',
      priority: 'HIGH' as const,
      status: 'IN_PROGRESS' as const,
      createdAt: daysAgo(1, 16),
      updatedAt: daysAgo(0, 2),
      aiCategory: 'SECURITY',
      aiPriority: 'HIGH',
      aiSummary: 'Fire exit door lock jammed in half-open state.',
      aiReason: 'Emergency egress code violation and unauthorized perimeter access risk.',
      aiDepartment: 'Campus Security Division',
      aiConfidence: 0.97,
      feedback: null,
    },
    // 19. Rahul Sharma - Classroom Equipment
    {
      userId: student3.id,
      title: 'Interactive Smart Board touch calibration offset in Room 310',
      description: 'Stylus input on the digital blackboard is displaced by 4 inches to the right of cursor point.',
      category: 'CLASSROOM_EQUIPMENT' as const,
      location: 'Academic Block B – Room 310',
      priority: 'MEDIUM' as const,
      status: 'PENDING' as const,
      createdAt: daysAgo(2, 1),
      updatedAt: daysAgo(2, 1),
      aiCategory: 'CLASSROOM_EQUIPMENT',
      aiPriority: 'MEDIUM',
      aiSummary: 'Digital smart board touch coordinate calibration offset.',
      aiReason: 'Software touch recalibration needed for lecture delivery.',
      aiDepartment: 'Academic Media & AV Support',
      aiConfidence: 0.93,
      feedback: null,
    },
    // 20. Priya Patel - Cleanliness
    {
      userId: student4.id,
      title: 'Dry leaf litter accumulation blocking stormwater drain',
      description: 'Autumn foliage has clogged the curb inlet near the library bicycle stand before the forecasted rains.',
      category: 'CLEANLINESS' as const,
      location: 'Central Library – South Entrance Drain',
      priority: 'LOW' as const,
      status: 'RESOLVED' as const,
      createdAt: daysAgo(10),
      updatedAt: daysAgo(8),
      aiCategory: 'CLEANLINESS',
      aiPriority: 'LOW',
      aiSummary: 'Stormwater drain curb inlet blocked by leaf debris.',
      aiReason: 'Preventive drainage clearance to avoid monsoon waterlogging.',
      aiDepartment: 'Sanitation & Housekeeping',
      aiConfidence: 0.91,
      feedback: {
        userId: student4.id,
        rating: 5,
        comment: 'Drain cleared and grated within 24 hours. Excellent preventive work.',
      },
    },
  ];

  for (const item of complaintsData) {
    const { feedback, ...complaintFields } = item;
    const complaint = await prisma.complaint.create({
      data: complaintFields,
    });

    if (feedback) {
      await prisma.feedback.create({
        data: {
          complaintId: complaint.id,
          userId: feedback.userId,
          rating: feedback.rating,
          comment: feedback.comment,
          createdAt: new Date(complaint.updatedAt.getTime() + 1000 * 60 * 60 * 2),
        },
      });
    }
  }

  console.log(`✅ Seeded 20 comprehensive demo complaints across 10 categories.`);
  console.log(`✨ Seed complete! Demo accounts ready:`);
  console.log(`   Admin:   admin@campuscare.com / Admin@123`);
  console.log(`   Student: student@campuscare.com / Student@123`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
