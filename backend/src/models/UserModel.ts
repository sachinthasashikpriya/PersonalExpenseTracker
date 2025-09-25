// backend/src/models/UserModel.ts
import bcrypt from 'bcryptjs';
import mongoose, { Document, Model, Schema } from 'mongoose';

// Interface for the User document properties
interface IUserDocument extends Document {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

// Interface for the User document methods
interface IUserMethods {
  matchPassword(enteredPassword: string): Promise<boolean>;
}

// Interface that combines document properties and methods
interface IUser extends IUserDocument, IUserMethods {}

// Interface for the User model (static methods can be added here if needed)
interface IUserModel extends Model<IUser> {}

const userSchema = new Schema<IUser>({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { timestamps: true });

// Hash password before saving
userSchema.pre<IUser>('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method to check password - properly typed
userSchema.methods.matchPassword = async function(this: IUser, enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Create and export the model with proper typing
const User = mongoose.model<IUser, IUserModel>('User', userSchema);
export default User;