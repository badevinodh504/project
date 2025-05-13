
import { ObjectId } from 'mongodb';

export interface UserModel {
  _id?: ObjectId;
  id?: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  name?: string;
  status?: 'active' | 'inactive';
  uploads?: number;
  joinDate?: string;
}

export interface UploadModel {
  _id?: ObjectId;
  id?: string;
  userId: string;
  originalImage: string;
  modelGenerated: boolean;
  date: string;
  name: string;
  modelUrl?: string;
}
