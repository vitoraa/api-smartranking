import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { Player } from './interfaces/player.interface';
import { PlayersValidationParamsPipe } from './pipes/players-validation-params.pipe';
import { PlayersService } from './players.service';

@Controller('api/v1/players')
export class PlayersController {
  constructor (private readonly playersService: PlayersService) { }

  @Post()
  @UsePipes(ValidationPipe)
  async createPlayer (@Body() createPlayerDto: CreatePlayerDto) {
    await this.playersService.createPlayer(createPlayerDto);
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  async updatePlayer (
    @Body() createPlayerDto: CreatePlayerDto,
    @Param('_id', PlayersValidationParamsPipe) _id: string,
  ): Promise<void> {
    await this.playersService.updatePlayer(_id, createPlayerDto);
  }

  @Get()
  async getAllPlayers (): Promise<Player[]> {
    return await this.playersService.getAllPlayers();
  }

  @Get('/:_id')
  async getPlayerbyId (
    @Param('id', PlayersValidationParamsPipe) _id: string,
  ): Promise<Player> {
    return await this.playersService.getPlayerById(_id);
  }

  @Delete('/:_id')
  async deletePlayer (@Param('_id', PlayersValidationParamsPipe) _id: string) {
    return await this.playersService.deletePlayerById(_id);
  }
}
