import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const colleges = [
    // ENGINEERING (Top IITs & NITs + Bits)
    {
        name: "Indian Institute of Technology Madras (IIT Madras)",
        location: "Chennai",
        state: "Tamil Nadu",
        type: "Government",
        stream: "Engineering",
        nirf_rank: 1,
        fee_approx: 850000,
        exam_accepted: "JEE Advanced",
        website_url: "https://www.iitm.ac.in/"
    },
    {
        name: "Indian Institute of Technology Delhi (IIT Delhi)",
        location: "New Delhi",
        state: "Delhi",
        type: "Government",
        stream: "Engineering",
        nirf_rank: 2,
        fee_approx: 850000,
        exam_accepted: "JEE Advanced",
        website_url: "https://home.iitd.ac.in/"
    },
    {
        name: "Indian Institute of Technology Bombay (IIT Bombay)",
        location: "Mumbai",
        state: "Maharashtra",
        type: "Government",
        stream: "Engineering",
        nirf_rank: 3,
        fee_approx: 900000,
        exam_accepted: "JEE Advanced",
        website_url: "https://www.iitb.ac.in/"
    },
    {
        name: "Indian Institute of Technology Kanpur (IIT Kanpur)",
        location: "Kanpur",
        state: "Uttar Pradesh",
        type: "Government",
        stream: "Engineering",
        nirf_rank: 4,
        fee_approx: 840000,
        exam_accepted: "JEE Advanced",
        website_url: "https://www.iitk.ac.in/"
    },
    {
        name: "Birla Institute of Technology and Science (BITS Pilani)",
        location: "Pilani",
        state: "Rajasthan",
        type: "Private",
        stream: "Engineering",
        nirf_rank: 25,
        fee_approx: 2200000,
        exam_accepted: "BITSAT",
        website_url: "https://www.bits-pilani.ac.in/"
    },
    {
        name: "National Institute of Technology Tiruchirappalli (NIT Trichy)",
        location: "Tiruchirappalli",
        state: "Tamil Nadu",
        type: "Government",
        stream: "Engineering",
        nirf_rank: 9,
        fee_approx: 560000,
        exam_accepted: "JEE Main",
        website_url: "https://www.nitt.edu/"
    },
    {
        name: "Vellore Institute of Technology (VIT Vellore)",
        location: "Vellore",
        state: "Tamil Nadu",
        type: "Private",
        stream: "Engineering",
        nirf_rank: 11,
        fee_approx: 1500000,
        exam_accepted: "VITEEE",
        website_url: "https://vit.ac.in/"
    },

    // MEDICAL (Top AIIMS & Private)
    {
        name: "All India Institute of Medical Sciences (AIIMS Delhi)",
        location: "New Delhi",
        state: "Delhi",
        type: "Government",
        stream: "Medical",
        nirf_rank: 1,
        fee_approx: 5856,
        exam_accepted: "NEET UG",
        website_url: "https://www.aiims.edu/"
    },
    {
        name: "Post Graduate Institute of Medical Education and Research (PGIMER)",
        location: "Chandigarh",
        state: "Chandigarh",
        type: "Government",
        stream: "Medical",
        nirf_rank: 2,
        fee_approx: 8000,
        exam_accepted: "NEET PG",
        website_url: "https://pgimer.edu.in/"
    },
    {
        name: "Christian Medical College (CMC Vellore)",
        location: "Vellore",
        state: "Tamil Nadu",
        type: "Private",
        stream: "Medical",
        nirf_rank: 3,
        fee_approx: 150000,
        exam_accepted: "NEET UG",
        website_url: "https://www.cmch-vellore.edu/"
    },
    {
        name: "Jawaharlal Institute of Postgraduate Medical Education & Research (JIPMER)",
        location: "Puducherry",
        state: "Puducherry",
        type: "Government",
        stream: "Medical",
        nirf_rank: 5,
        fee_approx: 30000,
        exam_accepted: "NEET UG",
        website_url: "https://jipmer.edu.in/"
    },
    {
        name: "Kasturba Medical College (KMC Manipal)",
        location: "Manipal",
        state: "Karnataka",
        type: "Private",
        stream: "Medical",
        nirf_rank: 9,
        fee_approx: 7000000,
        exam_accepted: "NEET UG",
        website_url: "https://manipal.edu/kmc-manipal.html"
    }
];

async function main() {
    console.log('Seeding the Saarathii real college database...');

    for (const college of colleges) {
        const created = await prisma.colleges_master.create({
            data: college
        });
        console.log(`Created: ${created.name}`);
    }

    console.log('Seed check complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
