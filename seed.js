const { faker } = require('@faker-js/faker');
const fs = require('fs');

const generateData = () => {
  const servers = [];
  const metrics = [];
  const regions = ['us-east-1', 'us-west-2', 'eu-central-1', 'ap-southeast-1'];
  const types = ['t3.micro', 't3.medium', 'm5.large', 'c5.xlarge', 'r5.2xlarge'];

  for (let i = 0; i < 500; i++) {
    const serverId = faker.string.uuid();
    servers.push({
      id: serverId,
      hostname: `server-${faker.string.alphanumeric(6).toLowerCase()}`,
      region: faker.helpers.arrayElement(regions),
      type: faker.helpers.arrayElement(types)
    });

    // Generate exactly one metric per day for the last 30 consecutive days
    const now = new Date();
    for (let j = 0; j < 30; j++) {
      const date = new Date(now);
      date.setDate(date.getDate() - (29 - j)); // From 29 days ago up to today
      
      const cpu = faker.number.int({ min: 5, max: 99 });
      const ram = faker.number.int({ min: 10, max: 95 });
      let status = 'Healthy';
      if (cpu > 85 || ram > 85) status = 'Critical';
      else if (cpu > 70 || ram > 70) status = 'Warning';

      metrics.push({
        id: faker.string.uuid(),
        serverId: serverId,
        timestamp: date.toISOString(),
        cpuUsage: cpu,
        ramUsage: ram,
        status: status
      });
    }
  }

  return { servers, metrics };
};

const data = generateData();
fs.writeFileSync('db.json', JSON.stringify(data, null, 2));
console.log('Generated db.json with 300 servers and 3000 metrics.');
