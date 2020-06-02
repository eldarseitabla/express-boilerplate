import {inject, injectable} from 'inversify';
import { v4 as uuid } from 'uuid';
import { RefreshTokenMongo as RefreshToken, RefreshTokenDocument } from '../models';
import {DITypes} from "../keys";
import {AuthService} from "./auth.service";




@injectable()
export class RefreshTokenService {

  constructor (@inject(DITypes.TYPES.AuthService) private authService: AuthService) {}



}
