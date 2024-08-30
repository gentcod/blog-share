import { ClientSession } from "mongoose";
import { dbConnection } from "../db";

/**
 * startTransaction helps ensure data remains atomic, in a case of of running concurrent transactions... 
 * @param cb is function representing the session and transactions initiated.
 */
export async function startTransaction(cb: (session: ClientSession) => Promise<void | any>) {
  const session = await dbConnection.startSession();
  session.startTransaction();
  try {
    await cb(session);
    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
}
