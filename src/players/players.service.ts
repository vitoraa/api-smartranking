import { Injectable, Logger, NotFoundException } from '@nestjs/common';
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

  async createUpdatePlayer (createPlayerDto: CreatePlayerDto): Promise<void> {
    const { email } = createPlayerDto;

    const playerFound = await this.playerModel.findOne({ email }).exec();

    if (playerFound) {
      this.update(createPlayerDto);
    } else {
      this.create(createPlayerDto);
    }
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

  async deletePlayerByEmail (email: string): Promise<any> {
    return await this.playerModel.deleteOne({ email }).exec();
  }

  private async findPlayerByEmail (email: string): Promise<Player> {
    return await this.playerModel.findOne({ email }).exec();
  }

  private async create (createPlayerDto: CreatePlayerDto): Promise<Player> {
    const playerFound = new this.playerModel(createPlayerDto);
    return playerFound.save();
  }

  private async update (player: CreatePlayerDto): Promise<Player> {
    return await this.playerModel
      .findOneAndUpdate({ email: player.email }, { $set: player })
      .exec();
  }
}
