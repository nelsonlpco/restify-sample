import mongoose from 'mongoose';

export interface MenuItem extends mongoose.Document {
  name: string;
  price: number;
}

export interface Restaurant extends mongoose.Document {
  name: string;
  menu: MenuItem[];
}

const menuSchema = new mongoose.Schema<MenuItem>({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const restaurantSchema = new mongoose.Schema<Restaurant>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  menu: {
    type: [menuSchema],
    required: false,
    select: false,
    default: [],
  },
});

export const RestaurantModel = mongoose.model<Restaurant>('Restaurant', restaurantSchema);
