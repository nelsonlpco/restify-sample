import { hash } from 'bcrypt';
import { Document, model, Schema } from 'mongoose';

export interface IUser {
  name: String;
  email: String;
  password: String;
  age: Number;
}

export interface IUserSchema extends Document, IUser {}

// export interface IUserModel extends model<IUserSchema>{}

const emailValidateRegex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const salts = 10;

const userSchema = new Schema<IUserSchema>({
  name: {
    type: String,
    required: true,
    maxlength: 80,
    minlength: 3,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: emailValidateRegex,
  },
  password: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: false,
    enum: ['Male', 'Female'],
  },
  age: {
    type: Number,
    required: false,
    validate: {
      validator: (age: number): boolean => age >= 18,
      message: '{PATH}: Invalid age ({VALUE}) use is young',
    },
  },
});

userSchema.statics.findByEmail = async function (email: string) {
  return await this.findOne({ email });
};

userSchema.pre('save', async function (next) {
  const user = <IUserSchema>this;

  if (!user.isModified('password')) return next();
  else {
    user.password = await hash(user.password, salts);
    next;
  }
});

userSchema.pre('updateOne', async function (next) {
  let update = this.getUpdate();

  if (!update.password) {
    console.log('já atualizou');
    next();
  } else {
    try {
      console.log('deveria gerar o hash', update);
      update.password = await hash(update.password, salts);

      console.log(update);
      next();
    } catch (error) {
      next(error);
    }
  }
});

export default model<IUserSchema>('User', userSchema);
