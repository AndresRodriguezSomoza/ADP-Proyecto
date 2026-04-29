import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';

export interface DemoUser {
  email: string;
  password: string;
  name: string;
  role: string;
}

export interface SessionUser {
  email: string;
  name: string;
  role: string;
}

const STORAGE_KEY = 'adp-proyecto-session';
const USERS: DemoUser[] = [
  {
    email: 'admin@demo.com',
    password: 'Admin123!',
    name: 'Admin Demo',
    role: 'Administrador',
  },
  {
    email: 'usuario@demo.com',
    password: 'User123!',
    name: 'Usuario Demo',
    role: 'Usuario',
  },
  {
    email: 'editor@demo.com',
    password: 'Edit123!',
    name: 'Editor Demo',
    role: 'Editor',
  },
];

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly userSignal = signal<SessionUser | null>(null);
  private readonly storageAvailable = isPlatformBrowser(this.platformId);

  readonly user = computed(() => this.userSignal());
  readonly isAuthenticated = computed(() => this.userSignal() !== null);

  constructor() {
    this.restoreSession();
  }

  login(email: string, password: string): SessionUser | null {
    const normalizedEmail = email.trim().toLowerCase();
    const matchedUser = USERS.find(
      (user) =>
        user.email.toLowerCase() === normalizedEmail && user.password === password,
    );

    if (!matchedUser) {
      return null;
    }

    const sessionUser: SessionUser = {
      email: matchedUser.email,
      name: matchedUser.name,
      role: matchedUser.role,
    };

    this.userSignal.set(sessionUser);
    this.persistSession(sessionUser);

    return sessionUser;
  }

  logout(): void {
    this.userSignal.set(null);

    if (this.storageAvailable) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  getDemoUsers(): DemoUser[] {
    return USERS;
  }

  private restoreSession(): void {
    if (!this.storageAvailable) {
      return;
    }

    const rawSession = localStorage.getItem(STORAGE_KEY);
    if (!rawSession) {
      return;
    }

    try {
      const parsedSession = JSON.parse(rawSession) as SessionUser;
      if (parsedSession?.email && parsedSession?.name && parsedSession?.role) {
        this.userSignal.set(parsedSession);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  private persistSession(sessionUser: SessionUser): void {
    if (!this.storageAvailable) {
      return;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionUser));
  }
}
