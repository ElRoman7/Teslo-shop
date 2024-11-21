import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { ErrorHandlerService } from 'src/common/error-handler.service';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto, LoginUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { SeedUser } from 'src/seed/data/seed-data';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly JwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;
      console.log(createUserDto.fullname);
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });
      await this.userRepository.save(user);

      return {
        ...user,
        token: this.getJwt({ id: user.id }),
      };
    } catch (error) {
      this.errorHandlerService.handleDBException(error);
      // console.log(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['email', 'password', 'id'],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials (email)');
    }
    if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Invalid credentials (password)');
    }

    return {
      ...user,
      token: this.getJwt({ id: user.id }),
    };
    // TODO: Implement JWT token generation
  }

  private getJwt(payload: JwtPayload) {
    const token = this.JwtService.sign(payload);
    return token;
  }

  checkAuthStatus(user: User) {
    const token = this.getJwt({ id: user.id });
    return {
      ...user,
      token,
    };
  }

  //! Funciones para el Seed

  async deleteAllUsers(confirm: boolean = false) {
    if (!confirm) {
      console.log('You need to confirm the elimination of all users');
      throw new BadRequestException(
        'You need to confirm the elimination of all users',
      );
    }
    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder.delete().where({}).execute();
  }

  async insertManyUsers(seedUsers: SeedUser[]) {
    const users: User[] = await Promise.all(
      seedUsers.map(async (user) => {
        user.password = bcrypt.hashSync(user.password, 10);
        return this.userRepository.create(user);
      }),
    );

    const dbUsers: User[] = await this.userRepository.save(users);
    return dbUsers;
  }
}
