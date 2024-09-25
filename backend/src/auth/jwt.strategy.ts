import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from './constants';

console.log("jwtConstants.secret", jwtConstants.secret)

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor() {
        console.log("process.env.SESSION_SECRET", process.env.SESSION_SECRET);
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.SESSION_SECRET,
        });
    }

    async validate(payload: any) {
        return { userId: payload.sub, email: payload.email };
    }
}
