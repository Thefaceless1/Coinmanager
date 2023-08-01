import 'dotenv/config'

export const jwtTokenConfig = {
    privateKey: process.env.JWT_KEY,
    expireTime: "1d"
}