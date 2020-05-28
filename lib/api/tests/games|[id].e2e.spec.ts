import { createMocks } from 'node-mocks-http';

import TestDBManager from './database-utils';
import handler from '../../../pages/api/games/[id]';

const testDatabase = new TestDBManager();

describe('/api/games/[id]', () => {
  beforeAll(() => testDatabase.start());
  afterEach(() => testDatabase.cleanup());
  afterAll(() => testDatabase.stop());

  describe('GET', () => {
    describe('when player is not registered', () => {
      describe('when game phase is "waiting for players"', () => {
        it('responds with error message: "you must first set your name"', async () => {
          await testDatabase.gamesCollection.insertOne({
            id: 'game-id',
            players: [{ id: 'owner-player-id', isOwner: true }],
            _sessions: [
              {
                id: 'owner-session-id',
                playerId: 'owner-player-id',
              },
            ],
            phase: 'WAITING_FOR_PLAYERS',
          });

          const { req, res } = createMocks({
            method: 'GET',
            query: {
              id: 'game-id',
            },
            cookies: {
              sessionId: 'my-session-id',
            },
          });

          await handler(req, res);
          expect(res._getStatusCode()).toBe(403);
          expect(res._getJSONData()).toEqual({
            message: 'You must first set your name',
          });
        });
      });
      describe('when game phase is "writing phrase to guess"', () => {
        it('responds with error message: "you have missed game start"', () => {});
      });
    });
    describe('when player is registered', () => {
      it('responds with game data for player', () => {});
    });
  });
});
