import { Document, model, models, Schema } from "mongoose";
export interface IImage extends Document {
  title: string;
  transformationType: string;
  publicId: string;
  secureURL: string; // URL is not a valid TypeScript type, using string instead
  width?: number;
  height?: number;
  config?: Record<string, string | number | boolean | null>; // More specific type for configuration
  transformationUrl?: string; // URL replaced with string
  aspectRatio?: string;
  color?: string;
  prompt?: string;
  author:{
    _id: string;
    firstName: string;
    lastName: string;
  }
  createdAt?: Date;
  updatedAt?: Date;
}


const ImageSchema = new Schema({
   title: { type: String, required: true },
   transformationType:{ type: String, required: true },
   publicId: { type: String, required: true }, 
  secureURL: { type: URL, required: true },
  width: { type: Number },
  height: { type: Number },
  config: { type: Object },
  transformationUrl: { type: URL },
  aspectRatio: { type: String },
  color: { type: String },
  prompt: { type: String }, 
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Image = models?.Image || model('Image', ImageSchema);
export default Image;