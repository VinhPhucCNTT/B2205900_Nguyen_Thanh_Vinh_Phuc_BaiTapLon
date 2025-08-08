
const bcrypt = require("bcryptjs");
const BBMService = require("./app/services/bbm.service");
const MongoDB = require("./app/utils/mongodb.util");
const config = require("./app/config");

async function createAdmin() {
  // Get arguments from command line
  const args = process.argv.slice(2);
  const [phone, password, fullName, position, address] = args;

  if (!phone || !password || !fullName) {
    console.log("Usage: node add_admin.js <phone> <password> <fullName> [position] [address]");
    console.log("Please provide at least phone, password, and full name.");
    return;
  }

  try {
    // Connect to the database
    const client = await MongoDB.connect(config.db.uri);
    console.log("Connected to the database.");

    const bbmService = new BBMService(client);

    // Check if admin already exists
    const existingAdmin = await bbmService.getAdminByPhone(phone);
    if (existingAdmin) {
      console.log("An admin with this phone number already exists.");
      return;
    }

    // Prepare admin info
    const info = {
      Password: bcrypt.hashSync(password),
      SoDienThoai: phone,
      HoTenNV: fullName,
      ChucVu: position, // Can be undefined
      DiaChi: address,   // Can be undefined
    };

    // Create admin
    const result = await bbmService.createAdmin(info);
    console.log("Admin created successfully:", result);

  } catch (error) {
    console.error("An error occurred while creating the admin:", error);
  } finally {
    // Close the database connection
    if (MongoDB.client) {
      await MongoDB.client.close();
      console.log("Database connection closed.");
    }
  }
}

createAdmin();
