import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { ErrorHandlerService } from 'src/common/error-handler.service';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto, LoginUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

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
}
