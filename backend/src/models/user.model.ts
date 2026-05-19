import { Schema, model, type InferSchemaType, type HydratedDocument } from 'mongoose';

const usersSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 80,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        passwordHash: {
            type: String,
            required: false,
        },
        provider: {
            type: String,
            enum: ['local', 'google'],
            default: 'local',
            required: true,
        },
        googleId: {
            type: String,
            required: false,
        },
        picture: {
            type: String,
            required: false,
        },
        lastLoginAt: {
            type: Date,
            required: false,
        },
        // 'admin' gets full access; 'user' is subject to tier limits
        role: {
            type: String,
            enum: ['admin', 'user'],
            default: 'user',
            required: true,
        },
        // Controls how many tool outputs the user can generate
        tier: {
            type: String,
            enum: ['free', 'pro', 'ultra'],
            default: 'free',
            required: true,
        },
        // Total tool outputs used in the current monthly cycle
        usageCount: {
            type: Number,
            default: 0,
            required: true,
        },
        // When the monthly cycle resets (set to 1 month from first use)
        usageResetAt: {
            type: Date,
            required: false,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

usersSchema.index({ createdAt: -1 });
usersSchema.index({ provider: 1, email: 1 });
usersSchema.index({ googleId: 1 }, { unique: true, sparse: true });

export type User = InferSchemaType<typeof usersSchema>;
export type UserDocument = HydratedDocument<User>;

export const UserModel = model<User>('Users', usersSchema);
