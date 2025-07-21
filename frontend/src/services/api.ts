// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

class ApiService {
  private static getHeaders(): HeadersInit {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  private static getMultipartHeaders(): HeadersInit {
    const token = localStorage.getItem('auth_token');
    return {
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  static async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return { error: data.error || 'Request failed' };
      }
      
      return { data };
    } catch (error) {
      console.error('Network error:', error);
      return { error: 'Network error' };
    }
  }

  static async post<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(body)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return { error: data.error || data.errors?.join(', ') || 'Request failed' };
      }
      
      return { data };
    } catch (error) {
      console.error('Network error:', error);
      return { error: 'Network error' };
    }
  }

  static async postFormData<T>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: this.getMultipartHeaders(),
        body: formData
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return { error: data.error || data.errors?.join(', ') || 'Request failed' };
      }

      return { data };
    } catch (error) {
      console.error('Network error:', error);
      return { error: 'Network error' };
    }
  }

  static async put<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(body)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return { error: data.error || data.errors?.join(', ') || 'Request failed' };
      }
      
      return { data };
    } catch (error) {
      console.error('Network error:', error);
      return { error: 'Network error' };
    }
  }

  static async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return { error: data.error || 'Request failed' };
      }
      
      return { data };
    } catch (error) {
      console.error('Network error:', error);
      return { error: 'Network error' };
    }
  }
}

export default ApiService;