import { Injectable, Logger } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { Player } from './interfaces/player.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PlayersService {
  private readonly logger = new Logger(PlayersService.name);
  private players: Player[] = [];

  async createUpdatePlayer (createPlayerDto: CreatePlayerDto): Promise<void> {
    this.logger.log(`createPlayerDto: ${createPlayerDto}`);
    this.create(createPlayerDto);
  }

  async getAllPlayers (): Promise<Player[]> {
    return this.players;
  }

  private create (createPlayerDto: CreatePlayerDto): void {
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
}
