import { Document, model, Schema } from 'mongoose';
import { Restaurant } from '../restaurants/RestaurantModel';
import { IUser } from '../users/UserModel';

export interface ReviewSchema extends Document {
  date: Date;
  rating: number;
  comments: string;
  restaurant: Schema.Types.ObjectId | Restaurant;
  user: Schema.Types.ObjectId | IUser;
}

const reviewSchema = new Schema<ReviewSchema>({
  date: {
    type: Date,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  comments: {
    type: String,
    required: true,
    maxlength: 500,
  },
  restaurant: {
    type: Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

export const reviewModel = model<ReviewSchema>('Review', reviewSchema);
