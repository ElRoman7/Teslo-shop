import { Controller, Post, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';
import { Auth, GetUser } from './decorators';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({ status: 201, description: 'User created', type: User })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Authentication Succesful',
    type: User,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized Exception (Invalid credentials)',
  })
  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @ApiResponse({ status: 200, description: 'User Auth Status (reload token)' })
  @Get('check-status')
  @Auth()
  checkAuthStatus(@GetUser() user: User) {
    // Algo
    return this.authService.checkAuthStatus(user);
  }

  // @Get('private')
  // @UseGuards(AuthGuard())
  // testingPrivateRoute(
  //   @Req() request: Express.Request,
  //   @GetUser() user: User,
  //   @GetUser('email') userEmail: string,
  //   @RawHeaders() rawHeaders: string[],
  // ) {
  //   // console.log({ request });
  //   return {
  //     user,
  //     userEmail,
  //     rawHeaders,
  //   };
  // }

  // // @SetMetadata('roles', ['admin', 'super-user'])
  // @Get('private2')
  // @RoleProtected(ValidRoles.superUser, ValidRoles.admin)
  // @UseGuards(AuthGuard(), UserRoleGuard)
  // privateRoute2(@GetUser() user: User) {
  //   return user;
  // }

  // @Get('private3')
  // @Auth(ValidRoles.admin)
  // privateRoute3(@GetUser() user: User) {
  //   return user;
  // }
}
