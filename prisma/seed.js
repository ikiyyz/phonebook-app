const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {

  const contacts = [
    { name: 'Bima Satriya', phone: '0812 3000 0021', avatar: null },
    { name: 'Clara Maharani', phone: '+62 813-3000-0022', avatar: null },
    { name: 'Yoga Pratama', phone: '(+62) 822-3000-0023', avatar: null },
    { name: 'Mira Oktaviani', phone: '0821-3000-0024', avatar: null },
    { name: 'Farhan Zulfikar', phone: '0852 3000 0025', avatar: null },
    { name: 'Dewi Anggraini', phone: '+62 811-3000-0026', avatar: null },
    { name: 'Rama Aditya', phone: '0819-3000-0027', avatar: null },
    { name: 'Salsabila Putri', phone: '0823 3000 0028', avatar: null },
    { name: 'Hafiz Nurjaman', phone: '0851-3000-0029', avatar: null },
    { name: 'Laras Ayuningtyas', phone: '+62 821 3000 0030', avatar: null },
  ];

  const result = await prisma.phonebook.createMany({ data: contacts });
  console.log(`Seed selesai. ${result.count} kontak ditambahkan.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    prisma.$disconnect();
  });
