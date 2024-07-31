import axios from 'axios';
import { GameResult } from '../types';

export const sendGameResult = async (gameResult: GameResult) =>
    await axios.post('http://localhost:8080/game/result', gameResult);