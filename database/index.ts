import mongoose from "mongoose";


if(!process.env.DATABASE_URI) {
  throw new Error("DATABASE_URI not set as environment")
}

const globalVar = globalThis as unknown as {
  mongoose: {
    isConnected: boolean;
  };
};
if (!globalVar.mongoose) {
  globalVar.mongoose = { isConnected: false };
}
const connect = async () => {
  if (globalVar.mongoose.isConnected) {
    return;
  }
  const databaseURI = process.env.DATABASE_URI!
  const db = await mongoose.connect(databaseURI, {
    maxPoolSize: 30,
    minPoolSize: 1,
    autoIndex: false,
    socketTimeoutMS: 10000,
    serverSelectionTimeoutMS: 10000,
    maxIdleTimeMS: 10000,
  });
  globalVar.mongoose.isConnected = db.connection.readyState === 1;
};

const Database = {
  connect: connect,
};
export default Database;
