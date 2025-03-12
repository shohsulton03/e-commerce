import { JwtService } from "@nestjs/jwt";
import { User } from "../../user/entities/user.entity"
import { Tokens } from "../types/tokens.type";

export async function generateTokens (user: User, jwtService: JwtService) : Promise<Tokens> {
    const payload = {
        id : user.id,
        email : user.email,
        role : user.role,
        is_active : user.is_active
    }

    const [access_token, refresh_token] = await Promise.all([
        jwtService.sign(payload, {
            secret : process.env.ACCESS_TOKEN_KEY,
            expiresIn : process.env.ACCESS_TOKEN_TIME
        }),
        jwtService.sign(payload, {
            secret : process.env.REFRESH_TOKEN_KEY,
            expiresIn : process.env.REFRESH_TOKEN_TIME
        })
    ])

    return { access_token, refresh_token };
}