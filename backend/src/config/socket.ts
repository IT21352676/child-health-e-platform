import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import jwt from 'jsonwebtoken';

export interface SocketUser {
  userId: string;
  userType: 'user' | 'official';
  socketId: string;
}

export class SocketManager {
  private io: Server;
  private connectedUsers: Map<string, SocketUser> = new Map();

  constructor(httpServer: HttpServer) {
    this.io = new Server(httpServer, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
      }
    });

    this.setupSocketHandlers();
  }

  private setupSocketHandlers() {
    this.io.on('connection', (socket) => {
      console.log('User connected:', socket.id);

      // Authentication middleware
      socket.on('authenticate', (token: string) => {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
          const user: SocketUser = {
            userId: decoded.userId || decoded.officialId,
            userType: decoded.officialId ? 'official' : 'user',
            socketId: socket.id
          };

          this.connectedUsers.set(socket.id, user);
          socket.join(`user_${user.userId}`);
          
          socket.emit('authenticated', { 
            success: true, 
            userId: user.userId,
            userType: user.userType 
          });
          
          console.log(`User authenticated: ${user.userId} (${user.userType})`);
        } catch (error) {
          socket.emit('authentication_error', { message: 'Invalid token' });
        }
      });

      // Join appointment room
      socket.on('join_appointment', (appointmentId: string) => {
        const user = this.connectedUsers.get(socket.id);
        if (user) {
          socket.join(`appointment_${appointmentId}`);
          console.log(`User ${user.userId} joined appointment ${appointmentId}`);
        }
      });

      // Leave appointment room
      socket.on('leave_appointment', (appointmentId: string) => {
        socket.leave(`appointment_${appointmentId}`);
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        this.connectedUsers.delete(socket.id);
        console.log('User disconnected:', socket.id);
      });
    });
  }

  // Send notification to specific user
  public sendToUser(userId: string, event: string, data: any) {
    this.io.to(`user_${userId}`).emit(event, data);
  }

  // Send notification to appointment participants
  public sendToAppointment(appointmentId: string, event: string, data: any) {
    this.io.to(`appointment_${appointmentId}`).emit(event, data);
  }

  // Broadcast to all connected users
  public broadcast(event: string, data: any) {
    this.io.emit(event, data);
  }

  // Get connected users count
  public getConnectedUsersCount(): number {
    return this.connectedUsers.size;
  }

  // Check if user is online
  public isUserOnline(userId: string): boolean {
    for (const user of this.connectedUsers.values()) {
      if (user.userId === userId) {
        return true;
      }
    }
    return false;
  }

  public getIO(): Server {
    return this.io;
  }
}

let socketManager: SocketManager;

export const initializeSocket = (httpServer: HttpServer): SocketManager => {
  socketManager = new SocketManager(httpServer);
  return socketManager;
};

export const getSocketManager = (): SocketManager => {
  if (!socketManager) {
    throw new Error('Socket manager not initialized');
  }
  return socketManager;
};
