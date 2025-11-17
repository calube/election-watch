import type { FastifyInstance } from 'fastify';
import { getGoogleCivicService } from '../services/google-civic';

export async function electionsRoutes(fastify: FastifyInstance) {
  // Get all available elections
  fastify.get('/elections', async (request, reply) => {
    try {
      const civicService = getGoogleCivicService();
      const elections = await civicService.getElections();

      return {
        success: true,
        data: elections,
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch elections',
      });
    }
  });

  // Get voter information by address
  fastify.get<{
    Querystring: {
      address: string;
      electionId?: string;
    };
  }>('/elections/voter-info', async (request, reply) => {
    const { address, electionId } = request.query;

    if (!address) {
      return reply.status(400).send({
        success: false,
        error: 'Address parameter is required',
      });
    }

    try {
      const civicService = getGoogleCivicService();
      const voterInfo = await civicService.getVoterInfo(address, electionId);

      return {
        success: true,
        data: voterInfo,
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch voter information',
      });
    }
  });

  // Get representatives by address
  fastify.get<{
    Querystring: {
      address: string;
      levels?: string;
      roles?: string;
    };
  }>('/elections/representatives', async (request, reply) => {
    const { address, levels, roles } = request.query;

    if (!address) {
      return reply.status(400).send({
        success: false,
        error: 'Address parameter is required',
      });
    }

    try {
      const civicService = getGoogleCivicService();
      const levelsArray = levels ? levels.split(',') : undefined;
      const rolesArray = roles ? roles.split(',') : undefined;

      const representatives = await civicService.getRepresentatives(
        address,
        levelsArray,
        rolesArray
      );

      return {
        success: true,
        data: representatives,
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch representatives',
      });
    }
  });
}
