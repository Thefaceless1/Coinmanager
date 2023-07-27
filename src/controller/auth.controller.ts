import {Body, Controller, Post, UsePipes, ValidationPipe} from "@nestjs/common";
import {CreateUserDto} from "../dto/user/createUser.dto";
import {LoginUserInterface} from "../types/loginUser.interface";
import {LoginUserDto} from "../dto/user/loginUser.dto";
import {AuthService} from "../service/auth.service";
import {ApiTags} from "@nestjs/swagger";

@Controller("api")
@ApiTags("Authorization controller")
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @Post("/register")
    @UsePipes(new ValidationPipe())
    create(@Body() createUserDto: CreateUserDto): Promise<LoginUserInterface> {
        return this.authService.register(createUserDto)
    }

    @Post("/login")
    @UsePipes(new ValidationPipe())
    login(@Body() loginUserDto: LoginUserDto): Promise<LoginUserInterface> {
        return this.authService.login(loginUserDto);
    }
}