import { Injectable } from '@nestjs/common';
import { ProductsService } from './../products/products.service';
import { initialData } from './data/seed-data';
import { User } from '../auth/entities/user.entity';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class SeedService {
  constructor(
    private readonly productsService: ProductsService,
    private readonly authService: AuthService,
  ) {}

  async runSeed() {
    await this.deleteTables();
    const adminUser = await this.insertUsers();
    await this.insertProducts(adminUser);
    return 'Seed Executed';
  }

  private async deleteTables() {
    await this.productsService.deleteAllProducts();
    await this.authService.deleteAllUsers(true);
  }

  private async insertUsers() {
    const seedUsers = initialData.users;
    const usersDb = await this.authService.insertManyUsers(seedUsers);
    return usersDb[0];
  }

  private async insertProducts(user: User) {
    // Delete data
    await this.productsService.deleteAllProducts();

    const products = initialData.products;

    const insertPromises = [];

    products.forEach((product) => {
      insertPromises.push(this.productsService.create(product, user));
    });

    await Promise.all(insertPromises);

    return true;
  }
}
