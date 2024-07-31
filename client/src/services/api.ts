import axios from 'axios';
import { GameResultRequest } from '../types/api/game';

export const sendGameResult = async (gameResult: GameResultRequest) =>
    await axios.post('http://localhost:8080/game/result', gameResult);