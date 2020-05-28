import { createMocks } from 'node-mocks-http';

import TestDBManager from './database-utils';
import handler from '../../../pages/api/games/[id]';
import { PATCH_GAME_ACTION } from '../../pages/api/games';

jest.mock('../client-subscriptions/games');

const testDatabase = new TestDBManager();

describe('/api/games/[id]', () => {
  beforeAll(() => testDatabase.start());
  afterEach(() => testDatabase.cleanup());
  afterAll(() => testDatabase.stop());

  describe('GET', () => {
    let req;
    let res;

    beforeEach(() => {
      const mocks = createMocks({
        method: 'GET',
        query: {
          id: 'game-id',
        },
        cookies: {
          sessionId: 'my-session-id',
        },
      });
      req = mocks.req;
      res = mocks.res;
    });

    describe('when player is not registered', () => {
      describe('when game phase is "waiting for players"', () => {
        it('responds with error message: "you must first set your name"', async () => {
          await testDatabase.gamesCollection.insertOne({
            id: 'game-id',
            players: [{ id: 'owner-player-id', isOwner: true }],
            _sessions: [
              {
                id: 'my-session-id',
                playerId: 'owner-player-id',
              },
            ],
            phase: 'WAITING_FOR_PLAYERS',
          });

          await handler(req, res);

          expect(res._getStatusCode()).toBe(403);
          expect(res._getJSONData()).toEqual({
            message: 'You must first set your name',
          });
        });
      });
      describe('when game phase is "writing phrase to guess"', () => {
        it('responds with error message: "you have missed game start"', async () => {
          await testDatabase.gamesCollection.insertOne({
            id: 'game-id',
            players: [{ id: 'owner-player-id', isOwner: true }],
            _sessions: [
              {
                id: 'my-session-id',
                playerId: 'owner-player-id',
              },
            ],
            phase: 'WRITING_PHRASE_TO_GUESS',
          });

          await handler(req, res);

          expect(res._getStatusCode()).toBe(403);
          expect(res._getJSONData()).toEqual({
            message: 'Trop tard, la partie a commencé sans vous.',
          });
        });
      });
    });

    describe('when player is registered', () => {
      it('responds with game data for player', async () => {
        await testDatabase.gamesCollection.insertOne({
          id: 'game-id',
          players: [
            { id: 'owner-player-id', name: 'owner-player-name', isOwner: true },
          ],
          _sessions: [
            {
              id: 'my-session-id',
              playerId: 'owner-player-id',
            },
          ],
          phase: 'WAITING_FOR_PLAYERS',
        });

        await handler(req, res);

        expect(res._getStatusCode()).toBe(200);
        expect(res._getJSONData()).toEqual({
          id: 'game-id',
          phase: 'WAITING_FOR_PLAYERS',
          players: [
            {
              id: 'owner-player-id',
              isMe: true,
              isOwner: true,
              name: 'owner-player-name',
            },
          ],
        });
      });
    });
  });

  describe('PATCH', () => {
    let req;
    let res;

    beforeEach(() => {
      const mocks = createMocks({
        method: 'PATCH',
        query: {
          id: 'game-id',
          action: PATCH_GAME_ACTION.PASS_TURN_TO_GUESS,
        },
        cookies: {
          sessionId: 'my-session-id',
        },
      });
      req = mocks.req;
      res = mocks.res;
    });

    describe('when action is "pass turn to guess"', () => {
      it('responds with updated game data for player', async () => {
        await testDatabase.gamesCollection.insertOne({
          id: 'game-id',
          players: [
            {
              id: 'owner-player-id',
              name: 'owner-player-name',
              isOwner: true,
              phraseToGuess: "Reine d'Angleterre",
              isTheirTurnToGuess: true,
            },
            {
              id: 'other-player-id',
              name: 'other-player-name',
              phraseToGuess: 'Maman',
              isTheirTurnToGuess: false,
            },
          ],
          _sessions: [
            {
              id: 'my-session-id',
              playerId: 'owner-player-id',
            },
          ],
          phase: 'WAITING_FOR_PLAYERS',
        });

        await handler(req, res);

        expect(res._getStatusCode()).toBe(200);
        expect(res._getJSONData()).toEqual({
          id: 'game-id',
          phase: 'WAITING_FOR_PLAYERS',
          players: [
            {
              id: 'owner-player-id',
              name: 'owner-player-name',
              isOwner: true,
              isMe: true,
              isTheirTurnToGuess: false,
            },
            {
              id: 'other-player-id',
              name: 'other-player-name',
              isMe: false,
              isTheirTurnToGuess: true,
              phraseToGuess: 'Maman',
            },
          ],
        });
      });
    });
  });
});
