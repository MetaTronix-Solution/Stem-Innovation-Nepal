import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getRoot() {
    return {
      message: 'Stem Innovation Nepal Backend is running',
      status: 'success',
    };
  }
}