import axios, { AxiosInstance } from 'axios';
import { HttpAdapter } from '../interfaces/http-adaptaer.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AxiosAdapter implements HttpAdapter {
  private axios: AxiosInstance = axios;
  async get<T>(url: string): Promise<T> {
    try {
      const { data } = await this.axios.get<T>(url);
      return data;
    } catch (err) {
      throw new Error('Error While fetching the data - Check Logs');
    }
  }
}
