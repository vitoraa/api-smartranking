import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { Player } from './interfaces/player.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PlayersService {
  private readonly logger = new Logger(PlayersService.name);
  private players: Player[] = [];

  async createUpdatePlayer (createPlayerDto: CreatePlayerDto): Promise<void> {
    const { email } = createPlayerDto;
    const playerFound = this._getPlayerByEmail(email);
    if (playerFound) {
      this._update(createPlayerDto, playerFound);
    } else {
      this._create(createPlayerDto);
    }
  }

  async getAllPlayers (): Promise<Player[]> {
    return await this.players;
  }

  async getPlayerByEmail (email: string): Promise<Player> {
    const playerFound = this._getPlayerByEmail(email);
    if (!playerFound) {
      throw new NotFoundException(`Player with email ${email} not found`);
    }
    return playerFound;
  }

  private _getPlayerByEmail (email: string): Player {
    return this.players.find((player) => player.email === email);
  }

  private _create (createPlayerDto: CreatePlayerDto): void {
    this.logger.log(`createPlayerDto: ${createPlayerDto}`);
    const { name, email, phone } = createPlayerDto;
    const player: Player = {
      _id: uuidv4(),
      email,
      name,
      phone,
      positionRanking: '1',
      ranking: 'A',
      urlPhoto: 'www.foto.com.br',
    };
    this.players.push(player);
  }

  private _update (player: CreatePlayerDto, playerFound: Player): void {
    this.logger.log(`updatePlayerDto: ${player}`);
    const { name } = player;
    playerFound.name = name;
  }
}
