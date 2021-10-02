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
    //const playerFound = this._findPlayerByEmail(email);

    const playerFound = await this.playerModel.findOne({ email }).exec();

    if (playerFound) {
      this.update(createPlayerDto, playerFound);
    } else {
      this.create(createPlayerDto);
    }
  }

  async getAllPlayers (): Promise<Player[]> {
    return await this.players;
  }

  async getPlayerByEmail (email: string): Promise<Player> {
    const playerFound = this._findPlayerByEmail(email);
    if (!playerFound) {
      throw new NotFoundException(`Player with email ${email} not found`);
    }
    return playerFound;
  }

  async deletePlayerByEmail (email: string): Promise<void> {
    const playerFound = this._findPlayerByEmail(email);
    if (!playerFound) {
      throw new NotFoundException(`Player with email ${email} not found`);
    }
    this.players = this.players.filter(
      (player) => player.email !== playerFound.email,
    );
  }

  private _findPlayerByEmail (email: string): Player {
    return this.players.find((player) => player.email === email);
  }

  private async create (createPlayerDto: CreatePlayerDto): Promise<Player> {
    const playerFound = new this.playerModel(createPlayerDto);
    return playerFound.save();
  }

  private update (player: CreatePlayerDto, playerFound: Player): void {
    this.logger.log(`updatePlayerDto: ${player}`);
    const { name } = player;
    playerFound.name = name;
  }
}
