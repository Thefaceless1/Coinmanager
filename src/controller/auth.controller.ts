import {Body, Controller, Post, UsePipes, ValidationPipe} from "@nestjs/common";
import {CreateUserDto} from "../dto/user/createUser.dto";
import {LoginUserInterface} from "../types/loginUser.interface";
import {LoginUserDto} from "../dto/user/loginUser.dto";
import {AuthService} from "../service/auth.service";
import {ApiOperation, ApiTags} from "@nestjs/swagger";
import {RestorePasswordDto} from "../dto/auth/restorePassword.dto";
import {ResponseStatusInterface} from "../types/responseStatus.interface";

@Controller("api")
@ApiTags("Authorization controller")
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @Post("/register")
    @UsePipes(new ValidationPipe())
    @ApiOperation({summary: "Create a new user"})
    create(@Body() createUserDto: CreateUserDto): Promise<LoginUserInterface> {
        return this.authService.register(createUserDto)
    }

    @Post("/login")
    @UsePipes(new ValidationPipe())
    @ApiOperation({summary: "Login in the system"})
    async login(@Body() loginUserDto: LoginUserDto): Promise<LoginUserInterface> {
        return this.authService.login(loginUserDto);
    }

    @Post("/restorePassword")
    @UsePipes(new ValidationPipe())
    @ApiOperation({summary: "Send a link to reset your password by email"})
    async getPassword(@Body() restorePasswordDto: RestorePasswordDto): Promise<ResponseStatusInterface> {
        return this.authService.restorePassword(restorePasswordDto);
    }
}