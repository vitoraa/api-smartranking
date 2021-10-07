import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { Player } from './interfaces/player.interface';
import { v4 as uuidv4 } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PlayersService {
  private readonly logger = new Logger(PlayersService.name);
  private players: Player[] = [];

  constructor (
    @InjectModel('Player') private readonly playerModel: Model<Player>,
  ) { }

  async createPlayer (createPlayerDto: CreatePlayerDto): Promise<void> {
    const { email } = createPlayerDto;
    const playerFound = await this.playerModel.findOne({ email }).exec();
    if (playerFound) {
      throw new BadRequestException(
        `Player with email ${email} is already registered`,
      );
    }
    await this.create(createPlayerDto);
  }

  async updatePlayer (
    _id: string,
    createPlayerDto: CreatePlayerDto,
  ): Promise<void> {
    const playerFound = await this.playerModel.findOne({ _id }).exec();

    if (!playerFound) {
      throw new NotFoundException(`Player with id ${_id} not found`);
    }

    await this.update(_id, createPlayerDto);
  }

  async getAllPlayers (): Promise<Player[]> {
    return await this.playerModel.find().exec();
  }

  async getPlayerByEmail (email: string): Promise<Player> {
    const playerFound = this.findPlayerByEmail(email);
    if (!playerFound) {
      throw new NotFoundException(`Player with email ${email} not found`);
    }
    return playerFound;
  }

  async getPlayerById (_id: string): Promise<Player> {
    const playerFound = this.findPlayerById(_id);
    if (!playerFound) {
      throw new NotFoundException(`Player with id ${_id} not found`);
    }
    return playerFound;
  }

  async deletePlayerByEmail (email: string): Promise<any> {
    return await this.playerModel.deleteOne({ email }).exec();
  }

  async deletePlayerById (_id: string): Promise<any> {
    return await this.playerModel.deleteOne({ _id }).exec();
  }

  private async findPlayerByEmail (email: string): Promise<Player> {
    return await this.playerModel.findOne({ email }).exec();
  }

  private async findPlayerById (_id: string): Promise<Player> {
    return await this.playerModel.findOne({ _id }).exec();
  }

  private async create (createPlayerDto: CreatePlayerDto): Promise<Player> {
    const playerFound = new this.playerModel(createPlayerDto);
    return playerFound.save();
  }

  private async update (_id: string, player: CreatePlayerDto): Promise<Player> {
    return await this.playerModel
      .findOneAndUpdate({ _id }, { $set: player })
      .exec();
  }
}
