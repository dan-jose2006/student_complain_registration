// Import bcryptjs library for cryptographic password hashing and verification
import bcrypt from 'bcryptjs';
// Import Prisma client instance for database queries
import prisma from '../config/prisma';
// Import JWT signing helper utility
import { signToken } from '../utils/jwt';
// Import user role enum/type definition
import { UserRole } from '../types';

/**
 * AuthService
 * Handles business logic for user account registration, password hashing,
 * credential validation, JWT token issuance, and profile fetching.
 */
export class AuthService {
  /**
   * Registers a new student user.
   * Checks for duplicate emails, salts and hashes the password, and creates the user record.
   */
  static async register(data: {
    name: string;
    email: string;
    password: string;
  }) {
    // Check if an existing account is registered with this email (case-insensitive)
    const existing = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    // Throw 409 Conflict if email is already taken
    if (existing) {
      const error: any = new Error('An account with this email already exists');
      error.statusCode = 409;
      throw error;
    }

    // Generate cryptographic salt with cost factor 10
    const salt = await bcrypt.genSalt(10);
    // Hash password with salt
    const passwordHash = await bcrypt.hash(data.password, salt);

    // Insert user record into the database with default role STUDENT
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        passwordHash,
        role: 'STUDENT',
      },
      // Exclude passwordHash from returned fields for security
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    // Generate signed JSON Web Token carrying user claims
    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role as UserRole,
      name: user.name,
    });

    // Return created user profile and bearer token
    return { user, token };
  }

  /**
   * Authenticates user and returns session JWT.
   * Verifies password against stored bcrypt hash.
   */
  static async login(data: { email: string; password: string }) {
    // Find user record by email
    const user = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    // Throw 401 Unauthorized if user doesn't exist
    if (!user) {
      const error: any = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    // Verify plaintext password against stored hash using constant-time comparison
    const isMatch = await bcrypt.compare(data.password, user.passwordHash);
    // Throw 401 Unauthorized if password mismatch
    if (!isMatch) {
      const error: any = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    // Issue signed JWT token
    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role as UserRole,
      name: user.name,
    });

    // Return sanitized user object and bearer token
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      token,
    };
  }

  /**
   * Retrieves profile of current user.
   */
  static async getProfile(userId: string) {
    // Query database for user by unique ID
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    // Throw 404 if user no longer exists
    if (!user) {
      const error: any = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    // Return user profile
    return user;
  }
}

