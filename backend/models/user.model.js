import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: [true, 'Username is unique']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: [true, 'Email is unique']
    },
    customerName: {
        type: String,
        required: [true, 'Name is required']
    },
    points: {
        type:Number,
        default: 0
    },
    coupons: [
        {
            coupon: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Coupon'
            }
        }
    ],
    orderHistory: [
        {
            orderNumber: {
                type: Number
            }
        }
    ], //orderNumber as value
    role:{
        type: String,
        required: true,
        enum: [ 'ROLE_USER','ROLE_ADMIN','ROLE_SUPERADMIN'],
        default: 'ROLE_USER'
    },
    userId: {
        type: Number,
        unique: true,
    }
}, {
    timestamps: true
});

// Pre-save hook to hash the user's password using bcrypt.
userSchema.pre('save', async function (next) {
    if(!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    }catch(err) {
        next(err);
    }
})

// Method to compare password.
userSchema.methods.comparePassword = async function (typePassword) {
    return bcrypt.compare(typePassword, this.password);
}

const User = mongoose.model('User', userSchema);

export default User;

