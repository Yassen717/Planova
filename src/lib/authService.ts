// Mock authentication service for demonstration purposes
// In a real application, this would integrate with NextAuth.js or a similar authentication solution

type User = {
  id: string;
  email: string;
  name: string | null;
  role: 'USER' | 'ADMIN';
};

class AuthService {
  private currentUser: User | null = null;

  // Simulate user login
  async login(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    // In a real app, this would validate credentials against a database
    // For demo purposes, we'll simulate a successful login for any non-empty credentials
    if (!email || !password) {
      return { success: false, error: 'Email and password are required' };
    }

    // Mock user data
    this.currentUser = {
      id: '1',
      email,
      name: email.split('@')[0],
      role: 'USER',
    };

    return { success: true, user: this.currentUser };
  }

  // Simulate user logout
  async logout(): Promise<void> {
    this.currentUser = null;
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.currentUser;
  }

  // Check if user has admin role
  isAdmin(): boolean {
    return this.currentUser?.role === 'ADMIN';
  }
}

export const authService = new AuthService();