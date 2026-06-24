const { MongoClient, ServerApiVersion } = require('mongodb');

// User Provided MongoDB URI
const uri = "mongodb+srv://new2020jeonil_db_user:efuRQC7FVU5Npe22@cluster0.kzkepri.mongodb.net/?appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Native MongoDB JSON Schema Validation definitions
const profilesSchema = {
  $jsonSchema: {
    bsonType: "object",
    required: ["email"],
    properties: {
      _id: {
        bsonType: "string",
        description: "Must be a string and is the primary key (corresponds to user ID)"
      },
      email: {
        bsonType: "string",
        pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
        description: "Must be a valid email string and is required"
      },
      display_name: {
        bsonType: "string",
        description: "User's nickname or display name"
      },
      tier: {
        bsonType: "string",
        enum: ["Basic", "Silver", "Gold", "Platinum", "Legend Tier"],
        description: "Must be one of the specified card tiers"
      },
      role: {
        bsonType: "string",
        enum: ["User", "Admin", "Partner"],
        description: "Must be one of the specified roles"
      },
      phone_number: {
        bsonType: "string",
        description: "Contact phone number"
      },
      referred_by_email: {
        bsonType: "string",
        description: "Email of the referrer"
      },
      ancestors: {
        bsonType: "array",
        items: {
          bsonType: "string"
        },
        description: "List of ancestor referral emails for network marketing hierarchy"
      },
      selected_fan_id: {
        bsonType: "string",
        description: "ID of the selected artist/fandom"
      },
      selected_fan_name: {
        bsonType: "string",
        description: "Name of the selected artist/fandom"
      },
      selected_fan_photo_url: {
        bsonType: "string",
        description: "Photo URL of the selected artist/fandom"
      },
      fandom_interests: {
        bsonType: "array",
        items: {
          bsonType: "string"
        },
        description: "List of fandom interest names"
      },
      created_at: {
        bsonType: "date",
        description: "Timestamp of record creation"
      },
      updated_at: {
        bsonType: "date",
        description: "Timestamp of last record update"
      }
    }
  }
};

const cardApplicationsSchema = {
  $jsonSchema: {
    bsonType: "object",
    required: ["full_name", "email", "phone", "address", "tier"],
    properties: {
      user_id: {
        bsonType: "string",
        description: "Must be a string referencing profiles._id"
      },
      full_name: {
        bsonType: "string",
        description: "Applicant's full name"
      },
      email: {
        bsonType: "string",
        pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
        description: "Must be a valid email string and is required"
      },
      phone: {
        bsonType: "string",
        description: "Applicant's phone number"
      },
      address: {
        bsonType: "string",
        description: "Shipping address for the card"
      },
      tier: {
        bsonType: "string",
        description: "Fandom Aurora Card tier applied for"
      },
      card_design_id: {
        bsonType: "string",
        description: "ID of the selected card design"
      },
      status: {
        bsonType: "string",
        enum: ["pending", "approved", "rejected"],
        description: "Must be pending, approved, or rejected"
      },
      created_at: {
        bsonType: "date",
        description: "Timestamp of application creation"
      },
      updated_at: {
        bsonType: "date",
        description: "Timestamp of last application update"
      }
    }
  }
};

const cardDesignsSchema = {
  $jsonSchema: {
    bsonType: "object",
    required: ["name", "tier", "image_url"],
    properties: {
      _id: {
        bsonType: "string",
        description: "Unique design identifier (primary key)"
      },
      name: {
        bsonType: "string",
        description: "Design name"
      },
      tier: {
        bsonType: "string",
        description: "Card tier corresponding to this design"
      },
      image_url: {
        bsonType: "string",
        description: "Direct URL to card design visual asset"
      },
      features: {
        bsonType: "array",
        items: {
          bsonType: "string"
        },
        description: "Array of premium features unlocked by this card"
      },
      created_at: {
        bsonType: "date",
        description: "Timestamp of design registration"
      }
    }
  }
};

const appSettingsSchema = {
  $jsonSchema: {
    bsonType: "object",
    required: ["value"],
    properties: {
      _id: {
        bsonType: "string",
        description: "The settings key (primary key)"
      },
      value: {
        bsonType: "object",
        description: "Arbitrary JSON payload or structured settings configuration"
      },
      created_at: {
        bsonType: "date",
        description: "Timestamp of setting creation"
      },
      updated_at: {
        bsonType: "date",
        description: "Timestamp of last setting update"
      }
    }
  }
};

async function run() {
  try {
    // 1. Connect to MongoDB Cluster
    console.log("Connecting to MongoDB Atlas...");
    await client.connect();
    
    // Ping to verify connection
    await client.db("admin").command({ ping: 1 });
    console.log("Successfully connected to MongoDB Cluster!");

    // Target Database
    const dbName = "fandom_aurora";
    const db = client.db(dbName);
    console.log(`Using database: ${dbName}`);

    // Helper to drop and create collections with schemas
    async function setupCollection(name, schemaDef) {
      const collections = await db.listCollections({ name }).toArray();
      if (collections.length > 0) {
        console.log(`Collection '${name}' already exists. Re-configuring validator...`);
        await db.command({
          collMod: name,
          validator: schemaDef,
          validationLevel: "strict",
          validationAction: "error"
        });
      } else {
        console.log(`Creating collection '${name}' with schema validator...`);
        await db.createCollection(name, {
          validator: schemaDef,
          validationLevel: "strict",
          validationAction: "error"
        });
      }
    }

    // 2. Set up Collections and apply JSON Schema Validators
    await setupCollection("profiles", profilesSchema);
    await setupCollection("card_applications", cardApplicationsSchema);
    await setupCollection("card_designs", cardDesignsSchema);
    await setupCollection("app_settings", appSettingsSchema);

    // 3. Create Indexes for maximum query performance and unique constraints
    console.log("Setting up collection indexes...");
    
    // Profiles unique index on email
    await db.collection("profiles").createIndex({ email: 1 }, { unique: true });
    
    // Card Applications indexes
    await db.collection("card_applications").createIndex({ user_id: 1 });
    await db.collection("card_applications").createIndex({ email: 1 });

    console.log("\n=======================================================");
    console.log("🎉 Fandom Aurora MongoDB Schema creation complete!");
    console.log("Created Collections with strict Native Validation Rules:");
    console.log(" - profiles");
    console.log(" - card_applications");
    console.log(" - card_designs");
    console.log(" - app_settings");
    console.log("=======================================================");

  } catch (error) {
    console.error("❌ Schema configuration failed:", error);
  } finally {
    // Close connection
    await client.close();
    console.log("Database connection closed.");
  }
}

// Run the setup script if executed directly
if (require.main === module) {
  run().catch(console.dir);
}

module.exports = {
  profilesSchema,
  cardApplicationsSchema,
  cardDesignsSchema,
  appSettingsSchema,
  run
};
